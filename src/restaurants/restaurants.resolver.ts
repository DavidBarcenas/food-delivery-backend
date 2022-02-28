import {Args, Int, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {AuthUser} from 'src/auth/auth-user.decorator';
import {Role} from 'src/auth/role.decorator';
import {User} from 'src/users/entities/user.entity';
import {AllCategoryOutput} from './dtos/all-categories.dto';
import {AllRestaurantsInput, AllRestaurantsOutput} from './dtos/all-restaurants.dto';
import {CategoryInput, CategoryOutput} from './dtos/category.dto';
import {CreateRestaurantInput, CreateRestaurantOutput} from './dtos/create-restaurant.dto';
import {DeleteRestaurentInput, DeleteRestaurentOutput} from './dtos/delete-restaurant.dto';
import {EditRestaurentInput, EditRestaurentOutput} from './dtos/edit-restaurant.dto';
import {Category} from './entities/category.entity';
import {Restaurant} from './entities/restaurant.entity';
import {RestaurantService} from './restaurants.service';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(returns => CreateRestaurantOutput)
  @Role(['Owner'])
  createRestaurant(
    @AuthUser() owner: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(owner, createRestaurantInput);
  }

  @Mutation(returns => EditRestaurentOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() owner: User,
    @Args('input') editRestaurantInput: EditRestaurentInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput);
  }

  @Mutation(returns => CreateRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurentInput,
  ): Promise<DeleteRestaurentOutput> {
    return this.restaurantService.deleteRestaurant(owner, deleteRestaurantInput);
  }

  @Query(type => AllRestaurantsOutput)
  restaurants(
    @Args('input') allRestaurantsInput: AllRestaurantsInput,
  ): Promise<AllRestaurantsOutput> {
    return this.restaurantService.allRestaurants(allRestaurantsInput);
  }
}

@Resolver(of => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField(type => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurants(category);
  }

  @Query(type => AllCategoryOutput)
  allCategories(): Promise<AllCategoryOutput> {
    return this.restaurantService.allCategories();
  }

  @Query(type => CategoryOutput)
  category(@Args('input') categoryInput: CategoryInput) {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}
