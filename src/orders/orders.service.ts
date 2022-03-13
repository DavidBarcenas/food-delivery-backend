import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {PubSub} from 'graphql-subscriptions';
import {
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATES,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from 'src/common/common.constants';
import {Dish} from 'src/restaurants/entities/dish.entity';
import {Restaurant} from 'src/restaurants/entities/restaurant.entity';
import {User, UserRole} from 'src/users/entities/user.entity';
import {Repository} from 'typeorm';
import {CreateOrderInput, CreateOrderOutput} from './dto/create-order.dto';
import {EditOrderInput, EditOrderOutput} from './dto/edit-order.dto';
import {GetOrderInput, GetOrderOutput} from './dto/get-order.dto';
import {GetOrdersInput, GetOrdersOutput} from './dto/get-orders.dto';
import {TakeOrderInput, TakeOrderOutput} from './dto/take-order.dto';
import {OrderItem} from './entities/order-item.entity';
import {Order, OrderStatus} from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Dish) private readonly dishes: Repository<Dish>,
    @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}

  async createOrder(
    customer: User,
    {restaurantId, items}: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      let orderFinalPrice = 0;
      const orderItems: OrderItem[] = [];
      for (const item of items) {
        const dish = await this.dishes.findOne(item.dishId);
        if (!dish) {
          return {
            ok: false,
            error: 'Dish not found',
          };
        }
        let dishFinalPrice = dish.price;
        for (const itemOption of item.options) {
          const dishOption = dish.options.find(dishOption => dishOption.name === itemOption.name);
          if (dishOption) {
            if (dishOption.extra) {
              dishFinalPrice += dishOption.extra;
            } else {
              const dishOptionChoice = dishOption.choices.find(
                optionChoice => optionChoice.name === itemOption.choice,
              );
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  dishFinalPrice += dishOptionChoice.extra;
                }
              }
            }
          }
        }
        orderFinalPrice += dishFinalPrice;
        const orderItem = await this.orderItems.save(
          this.orderItems.create({dish, options: item.options}),
        );
        orderItems.push(orderItem);
      }

      const order = await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems,
        }),
      );
      await this.pubsub.publish(NEW_PENDING_ORDER, {
        pendingOrders: {order, ownerId: restaurant.ownerId},
      });
      return {ok: true};
    } catch (error) {
      return {ok: false, error: 'Could not create order'};
    }
  }

  async getOrders(user: User, {status}: GetOrdersInput): Promise<GetOrdersOutput> {
    try {
      let orders: Order[];
      if (user.role === UserRole.Client) {
        orders = await this.orders.find({
          where: {
            customer: user,
            ...(status && {status}),
          },
        });
      } else if (user.role === UserRole.Delivery) {
        orders = await this.orders.find({
          where: {
            driver: user,
            ...(status && {status}),
          },
        });
      } else if (user.role === UserRole.Owner) {
        const restaurants = await this.restaurants.find({
          where: {owner: user},
          relations: ['orders'],
        });
        orders = restaurants.map(restaurant => restaurant.orders).flat(1);
        if (status) {
          orders = orders.filter(order => order.status === status);
        }
      }

      return {ok: true, orders};
    } catch {
      return {ok: false, error: 'Could not get orders'};
    }
  }

  async getOrder(user: User, getOrderInput: GetOrderInput): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne(getOrderInput.id, {relations: ['restaurant']});
      if (!order) {
        return {
          ok: false,
          error: 'Order not found',
        };
      }

      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: "You can't see that.",
        };
      }

      return {
        ok: true,
        order,
      };
    } catch {
      return {ok: false, error: 'Could not load order.'};
    }
  }

  async editOrder(user: User, editOrderInput: EditOrderInput): Promise<EditOrderOutput> {
    try {
      const order = await this.orders.findOne(editOrderInput.id);
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: "You can't edit that.",
        };
      }
      let canEdit = true;
      if (user.role === UserRole.Client) {
        canEdit = false;
      }
      if (user.role === UserRole.Owner) {
        if (
          editOrderInput.status !== OrderStatus.Coocking &&
          editOrderInput.status !== OrderStatus.Cooked
        ) {
          canEdit = false;
        }
      }
      if (user.role === UserRole.Delivery) {
        if (
          editOrderInput.status !== OrderStatus.PickedUp &&
          editOrderInput.status !== OrderStatus.Delivered
        ) {
          canEdit = false;
        }
      }
      if (!canEdit) {
        return {ok: false, error: "You can't do that'"};
      }
      await this.orders.save([{id: editOrderInput.id, status: editOrderInput.status}]);
      const newOrder = {...order, status: editOrderInput.status};
      if (user.role === UserRole.Owner) {
        if (editOrderInput.status === OrderStatus.Cooked) {
          await this.pubsub.publish(NEW_COOKED_ORDER, {
            cookedOrders: newOrder,
          });
        }
      }
      await this.pubsub.publish(NEW_ORDER_UPDATES, {orderUpdates: newOrder});
      return {ok: true};
    } catch {
      return {ok: false, error: 'Could not edit order.'};
    }
  }

  async takeOrder(driver: User, {id}: TakeOrderInput): Promise<TakeOrderOutput> {
    try {
      const order = await this.orders.findOne(id);
      if (!order) {
        return {ok: false, error: 'Could not find order'};
      }
      if (order.driver) {
        return {ok: false, error: 'This order already has a driver'};
      }
      await this.orders.save([{id, driver}]);
      await this.pubsub.publish(NEW_ORDER_UPDATES, {orderUpdates: {...order, driver}});
      return {ok: true};
    } catch {
      return {ok: false, error: 'Could not take order'};
    }
  }

  canSeeOrder(user: User, order: Order): boolean {
    let canSee = true;
    if (user.role === UserRole.Client && order.customerId !== user.id) {
      canSee = false;
    }
    if (user.role === UserRole.Delivery && order.driverId !== user.id) {
      canSee = false;
    }
    if (user.role === UserRole.Owner && order.restaurant.ownerId !== user.id) {
      canSee = false;
    }
    return canSee;
  }
}
