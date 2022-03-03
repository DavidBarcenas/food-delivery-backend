import {Module} from '@nestjs/common';
import {Order} from './entities/order.entity';
import {OrderResolver} from './orders.resolver';
import {OrderService} from './orders.service';
import {Restaurant} from 'src/restaurants/entities/restaurant.entity';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant])],
  providers: [OrderResolver, OrderService],
})
export class OrdersModule {}
