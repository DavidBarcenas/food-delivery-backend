import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RestaurantResolver} from './restaurants.resolver';
import {Restaurant} from './entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  providers: [RestaurantResolver],
})
export class RestaurantsModule {}
