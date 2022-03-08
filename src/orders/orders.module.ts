import {Dish} from 'src/restaurants/entities/dish.entity';
import {Module} from '@nestjs/common';
import {Order} from './entities/order.entity';
import {OrderItem} from './entities/order-item.entity';
import {OrderResolver} from './orders.resolver';
import {OrderService} from './orders.service';
import {Restaurant} from 'src/restaurants/entities/restaurant.entity';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, Order, OrderItem, Restaurant])],
  providers: [OrderResolver, OrderService],
})
export class OrdersModule {}
