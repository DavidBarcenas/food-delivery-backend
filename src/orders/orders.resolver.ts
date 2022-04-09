import {Order} from './entities/order.entity';
import {OrderService} from './orders.service';
import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {AuthUser} from 'src/auth/auth-user.decorator';
import {User} from 'src/users/entities/user.entity';
import {CreateOrderInput, CreateOrderOutput} from './dto/create-order.dto';
import {GetOrdersInput, GetOrdersOutput} from './dto/get-orders.dto';
import {GetOrderInput, GetOrderOutput} from './dto/get-order.dto';
import {Role} from 'src/auth/role.decorator';
import {EditOrderInput, EditOrderOutput} from './dto/edit-order.dto';
import {Inject} from '@nestjs/common';
import {
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATES,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from 'src/common/common.constants';
import {PubSub} from 'graphql-subscriptions';
import {OrderUpdatesInput} from './dto/order-updates.dto';
import {TakeOrderInput, TakeOrderOutput} from './dto/take-order.dto';

@Resolver(of => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}

  @Mutation(returns => CreateOrderOutput)
  @Role(['Any'])
  createOrder(
    @AuthUser() customer: User,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.orderService.createOrder(customer, createOrderInput);
  }

  @Query(returns => GetOrdersOutput)
  getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.orderService.getOrders(user, getOrdersInput);
  }

  @Query(returns => GetOrderOutput)
  @Role(['Any'])
  getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.orderService.getOrder(user, getOrderInput);
  }

  @Mutation(returns => EditOrderOutput)
  @Role(['Any'])
  editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.orderService.editOrder(user, editOrderInput);
  }

  @Subscription(returns => Order, {
    filter: (payload, _, context) => {
      return payload.pendingOrders.ownerId == context.user.id;
    },
    resolve: ({pendingOrders}) => pendingOrders.order,
  })
  @Role(['Owner'])
  pendingOrders() {
    return this.pubsub.asyncIterator(NEW_PENDING_ORDER);
  }

  @Subscription(returns => Order)
  @Role(['Delivery'])
  cookedOrders() {
    return this.pubsub.asyncIterator(NEW_COOKED_ORDER);
  }

  @Subscription(returns => Order, {
    filter: (payload, variables, context) => {
      const order: Order = payload.orderUpdates;
      if (
        order.driverId !== context.user.id &&
        order.customerId !== context.user.id &&
        order.restaurant.ownerId !== context.user.id
      ) {
        return false;
      }
      return order.id === variables.input.id;
    },
  })
  @Role(['Any'])
  orderUpdates(@Args('input') orderUpdatesInput: OrderUpdatesInput) {
    return this.pubsub.asyncIterator(NEW_ORDER_UPDATES);
  }

  @Mutation(returns => TakeOrderOutput)
  @Role(['Delivery'])
  takeOrder(
    @AuthUser() driver: User,
    @Args('input') takeOrderInput: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    return this.orderService.takeOrder(driver, takeOrderInput);
  }
}
