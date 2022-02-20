import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CreateRestaurantDto} from './dtos/create-restaurant.dto';
import {UpdateRestaurantDto} from './dtos/update-restaurant.dto';
import {Restaurant} from './entities/restaurant.entity';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  @Query(returns => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return;
  }

  @Mutation(returns => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    return;
  }

  @Mutation(returns => Boolean)
  async updateRestaurant(@Args('input') updateRestaurantDto: UpdateRestaurantDto) {
    return;
  }
}
