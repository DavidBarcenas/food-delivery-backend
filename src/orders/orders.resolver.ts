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
import {PubSub} from 'graphql-subscriptions';

export const pubsub = new PubSub();

@Resolver(of => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(returns => CreateOrderOutput)
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

  @Subscription(returns => String)
  hotPotatos() {
    return pubsub.asyncIterator('hotPotatos');
  }
}
