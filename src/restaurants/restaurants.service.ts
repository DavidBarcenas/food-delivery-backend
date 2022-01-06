import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @Inject('RESTAURANTS_REPOSITORY')
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantsRepository.find();
  }
}
