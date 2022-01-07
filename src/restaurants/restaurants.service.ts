import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantsRepository.find();
  }
}
