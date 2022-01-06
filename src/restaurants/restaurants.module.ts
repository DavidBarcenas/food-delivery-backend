import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { restaurantsProviders } from './restaurants.providers';
import { RestaurantResolver } from './restaurants.resolver';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [DatabaseModule],
  providers: [...restaurantsProviders, RestaurantResolver, RestaurantsService],
})
export class RestaurantsModule {}
