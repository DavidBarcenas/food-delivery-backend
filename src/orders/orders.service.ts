import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Dish} from 'src/restaurants/entities/dish.entity';
import {Restaurant} from 'src/restaurants/entities/restaurant.entity';
import {User} from 'src/users/entities/user.entity';
import {Repository} from 'typeorm';
import {CreateOrderInput, CreateOrderOutput} from './dto/create-order.dto';
import {OrderItem} from './entities/order-item.entity';
import {Order} from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Dish) private readonly dishes: Repository<Dish>,
    @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
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

      items.forEach(async item => {
        const dish = await this.dishes.findOne(item.dishId);
        if (!dish) {
          return;
        }
        await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options,
          }),
        );
      });

      const order = await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
        }),
      );

      return {ok: true};
    } catch (error) {
      return {ok: false, error: 'Could not create order'};
    }
  }
}
