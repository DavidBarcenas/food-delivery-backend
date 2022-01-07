import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurants: Repository<Restaurant>,
  ) {}

  findAll(): Promise<Restaurant[]> {
    return this.restaurants.find();
  }

  create(restaurant: CreateRestaurantDto): Promise<Restaurant> {
    const newRestaurant = this.restaurants.create(restaurant);
    return this.restaurants.save(newRestaurant);
  }
}
