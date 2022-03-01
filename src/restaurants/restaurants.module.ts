import {CategoryResolver, DishResolver, RestaurantResolver} from './restaurants.resolver';

import {CategoryRepository} from './repositories/category.repository';
import {Dish} from './entities/dish.entity';
import {Module} from '@nestjs/common';
import {Restaurant} from './entities/restaurant.entity';
import {RestaurantService} from './restaurants.service';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository, Dish])],
  providers: [RestaurantResolver, CategoryResolver, DishResolver, RestaurantService],
})
export class RestaurantsModule {}
