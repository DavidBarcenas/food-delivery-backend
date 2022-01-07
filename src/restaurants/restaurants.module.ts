import { Module } from '@nestjs/common';
import { restaurantsProviders } from './restaurants.providers';
import { RestaurantResolver } from './restaurants.resolver';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [],
  providers: [...restaurantsProviders, RestaurantResolver, RestaurantsService],
})
export class RestaurantsModule {}
