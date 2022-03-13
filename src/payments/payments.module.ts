import {Module} from '@nestjs/common';
import {Payment} from './entities/payment.entity';
import {PaymentResolver} from './payments.resolver';
import {PaymentService} from './payments.service';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentsModule {}
