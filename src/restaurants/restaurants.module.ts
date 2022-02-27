import {CategoryResolver, RestaurantResolver} from './restaurants.resolver';

import {CategoryRepository} from './repositories/category.repository';
import {Module} from '@nestjs/common';
import {Restaurant} from './entities/restaurant.entity';
import {RestaurantService} from './restaurants.service';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository])],
  providers: [RestaurantResolver, CategoryResolver, RestaurantService],
})
export class RestaurantsModule {}
