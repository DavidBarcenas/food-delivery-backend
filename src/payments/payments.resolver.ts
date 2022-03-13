import {Mutation, Resolver} from '@nestjs/graphql';

import {CreatePaymentOutput} from './dtos/create-payment.dto';
import {Payment} from './entities/payment.entity';
import {PaymentService} from './payments.service';

@Resolver(of => Payment)
export class PaymentResolver {
  constructor(private readonly payments: PaymentService) {}

  @Mutation(returns => CreatePaymentOutput)
  createPayment() {
    return {ok: true};
  }
}
