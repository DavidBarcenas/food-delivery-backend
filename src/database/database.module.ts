import {Category} from 'src/restaurants/entities/category.entity';
import {ConfigService} from '@nestjs/config';
import {Dish} from 'src/restaurants/entities/dish.entity';
import {EmailVerification} from '../users/entities/email-verification.entity';
import {Module} from '@nestjs/common';
import {Order} from 'src/orders/entities/order.entity';
import {OrderItem} from 'src/orders/entities/order-item.entity';
import {Payment} from 'src/payments/entities/payment.entity';
import {Restaurant} from 'src/restaurants/entities/restaurant.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          entities: [
            Category,
            Dish,
            EmailVerification,
            Order,
            OrderItem,
            Payment,
            Restaurant,
            User,
          ],
          synchronize: config.get('NODE_ENV') !== 'production',
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
