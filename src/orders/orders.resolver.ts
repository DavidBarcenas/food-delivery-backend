import {Order} from './entities/order.entity';
import {OrderService} from './orders.service';
import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {AuthUser} from 'src/auth/auth-user.decorator';
import {User} from 'src/users/entities/user.entity';
import {CreateOrderInput, CreateOrderOutput} from './dto/create-order.dto';

@Resolver(of => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(returns => CreateOrderOutput)
  createOrder(
    @AuthUser() customer: User,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.orderService.createOrder();
  }
}
