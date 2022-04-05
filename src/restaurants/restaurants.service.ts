import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/users/entities/user.entity';
import {ILike, Repository} from 'typeorm';
import {AllRestaurantsInput, AllRestaurantsOutput} from './dtos/all-restaurants.dto';
import {CategoryInput, CategoryOutput} from './dtos/category.dto';
import {CreateDishInput, CreateDishOutput} from './dtos/create-dish.dto';
import {CreateRestaurantInput, CreateRestaurantOutput} from './dtos/create-restaurant.dto';
import {DeleteDishInput, DeleteDishOutput} from './dtos/delete-dish.dto';
import {DeleteRestaurentInput, DeleteRestaurentOutput} from './dtos/delete-restaurant.dto';
import {EditDishInput, EditDishOutput} from './dtos/edit-dish.dto';
import {EditRestaurentInput, EditRestaurentOutput} from './dtos/edit-restaurant.dto';
import {MyRestaurantsOutput} from './dtos/my-restaurants.dto';
import {RestaurantInput, RestaurantOutput} from './dtos/restaurant.dto';
import {SearchRestaurantInput, SearchRestaurantOutput} from './dtos/search-restaurant.dto';
import {Category} from './entities/category.entity';
import {Dish} from './entities/dish.entity';
import {Restaurant} from './entities/restaurant.entity';
import {CategoryRepository} from './repositories/category.repository';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category) private readonly categories: CategoryRepository,
    @InjectRepository(Dish) private readonly dishes: Repository<Dish>,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.categories.getOrCreate(createRestaurantInput.categoryName);
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return {ok: true, restaurantId: newRestaurant.id};
    } catch (error) {
      return {ok: false, error: 'Could not create restaurant'};
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurentInput,
  ): Promise<EditRestaurentOutput> {
    try {
      const restaurant = await this.restaurants.findOne(editRestaurantInput.restaurantId);
      if (!restaurant) {
        return {ok: false, error: 'Restaurant not found'};
      }
      if (owner.id !== restaurant.ownerId) {
        return {ok: false, error: "You cant't edit a restaurant that you don't own"};
      }
      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreate(editRestaurantInput.categoryName);
      }
      await this.restaurants.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && {category}),
        },
      ]);
      return {ok: true};
    } catch (error) {
      return {ok: true, error: 'Could not edit restaurant'};
    }
  }

  async deleteRestaurant(
    owner: User,
    deleteRestaurantInput: DeleteRestaurentInput,
  ): Promise<DeleteRestaurentOutput> {
    try {
      const restaurant = await this.restaurants.findOne(deleteRestaurantInput.restaurantId);
      if (!restaurant) {
        return {ok: false, error: 'Restaurant not found'};
      }
      if (owner.id !== restaurant.ownerId) {
        return {ok: false, error: "You cant't delete a restaurant that you don't own"};
      }
      await this.restaurants.delete(deleteRestaurantInput.restaurantId);
      return {ok: true};
    } catch (error) {
      return {ok: true, error: 'Could not delete restaurant'};
    }
  }

  async allRestaurants({page}: AllRestaurantsInput): Promise<AllRestaurantsOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        take: 25,
        skip: (page - 1) * 25,
        order: {isPromoted: 'DESC'},
        relations: ['category'],
      });
      return {
        ok: true,
        results: restaurants,
        totalPages: Math.ceil(totalResults / 25),
        totalResults,
      };
    } catch (error) {
      return {ok: false, error: 'Not found restaurants'};
    }
  }

  async findRestaurantById({restaurantId}: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId, {
        relations: ['menu', 'category'],
      });
      if (!restaurant) {
        return {ok: false, error: 'Restaurant not found'};
      }
      return {ok: true, restaurant};
    } catch (error) {
      return {ok: false, error: 'Restaurant not load'};
    }
  }

  async searchRestaurant({query, page}: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        where: {name: ILike(`%${query}%`)},
        take: 25,
        skip: (page - 1) * 25,
        relations: ['category'],
      });
      return {
        ok: true,
        restaurants,
        totalResults,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch (error) {
      return {ok: false, error: 'Restaurants not search for restaurants'};
    }
  }

  async myRestaurants(owner: User): Promise<MyRestaurantsOutput> {
    try {
      const restaurants = await this.restaurants.find({
        where: {owner},
        relations: ['category'],
      });
      return {ok: true, restaurants};
    } catch {
      return {ok: false, error: 'Could not find restaurants'};
    }
  }

  async allCategories() {
    try {
      const categories = await this.categories.find();
      return {ok: true, categories};
    } catch (error) {
      return {ok: false, error: 'Not found categories'};
    }
  }

  async findCategoryBySlug({slug, page}: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({slug});
      if (!category) {
        return {ok: false, error: 'Category not found'};
      }
      const restaurants = await this.restaurants.find({
        where: {category},
        take: 25,
        skip: (page - 1) * 25,
        order: {isPromoted: 'DESC'},
        relations: ['category'],
      });
      category.restaurants = restaurants;
      const totalResults = await this.countRestaurants(category);
      return {ok: true, category, totalPages: Math.ceil(totalResults / 25), totalResults};
    } catch (error) {
      return {ok: false, error: 'Category not load'};
    }
  }

  countRestaurants(category: Category): Promise<number> {
    return this.restaurants.count({category});
  }

  async createDish(owner: User, createDishInput: CreateDishInput): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurants.findOne(createDishInput.restaurantId);
      if (!restaurant) {
        return {ok: false, error: 'Restaurant not found'};
      }
      if (owner.id !== restaurant.ownerId) {
        return {ok: false, error: "Couldn't add dish"};
      }
      await this.dishes.save(this.dishes.create({...createDishInput, restaurant}));
      return {ok: true};
    } catch (error) {
      console.log(error);
      return {ok: false, error: "Couldn't create dish"};
    }
  }

  async editDish(owner: User, editDishInput: EditDishInput): Promise<EditDishOutput> {
    try {
      const dish = await this.dishes.findOne(editDishInput.dishId, {relations: ['restaurant']});
      if (!dish) {
        return {ok: false, error: 'Dish not found'};
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return {ok: false, error: 'Could not update this dish'};
      }
      await this.dishes.save([
        {
          id: editDishInput.dishId,
          ...editDishInput,
        },
      ]);
      return {ok: true};
    } catch (error) {
      return {ok: false, error: 'Could not update dish'};
    }
  }

  async deleteDish(owner: User, {dishId}: DeleteDishInput): Promise<DeleteDishOutput> {
    try {
      const dish = await this.dishes.findOne(dishId, {relations: ['restaurant']});
      if (!dish) {
        return {ok: false, error: 'Dish not found'};
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return {ok: false, error: 'Could not delete this dish'};
      }
      await this.dishes.delete(dishId);
      return {ok: true};
    } catch (error) {
      return {ok: false, error: 'Could not delete dish'};
    }
  }
}
