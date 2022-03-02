import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateOrderOutput} from './dto/create-order.dto';
import {Order} from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private readonly orders: Repository<Order>) {}

  async createOrder(): Promise<CreateOrderOutput> {
    try {
      return {ok: true};
    } catch (error) {
      return {ok: false, error: 'Could not create order'};
    }
  }
}
