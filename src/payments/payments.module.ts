import {Module} from '@nestjs/common';
import {Payment} from './entities/payment.entity';
import {PaymentResolver} from './payments.resolver';
import {PaymentService} from './payments.service';
import {Restaurant} from 'src/restaurants/entities/restaurant.entity';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Restaurant])],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentsModule {}
