import {Module} from '@nestjs/common';
import {Order} from './entities/order.entity';
import {OrderResolver} from './orders.resolver';
import {OrderService} from './orders.service';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderResolver, OrderService],
})
export class OrdersModule {}
