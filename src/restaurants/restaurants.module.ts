import {Category} from './entities/category.entity';
import {Module} from '@nestjs/common';
import {Restaurant} from './entities/restaurant.entity';
import {RestaurantResolver} from './restaurants.resolver';
import {RestaurantService} from './restaurants.service';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])],
  providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantsModule {}
