import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {AuthUser} from 'src/auth/auth-user.decorator';
import {Role} from 'src/auth/role.decorator';
import {User} from 'src/users/entities/user.entity';
import {CreateRestaurantInput, CreateRestaurantOutput} from './dtos/create-restaurant.dto';
import {EditRestaurentInput, EditRestaurentOutput} from './dtos/edit-restaurant.dto';
import {Restaurant} from './entities/restaurant.entity';
import {RestaurantService} from './restaurants.service';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(returns => CreateRestaurantOutput)
  @Role(['Owner'])
  createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(authUser, createRestaurantInput);
  }

  @Mutation(returns => EditRestaurentOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() authUser: User,
    @Args('input') editRestaurantInput: EditRestaurentInput,
  ): EditRestaurentOutput {
    return {ok: true};
  }
}
