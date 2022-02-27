import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/users/entities/user.entity';
import {Repository} from 'typeorm';
import {CreateRestaurantInput, CreateRestaurantOutput} from './dtos/create-restaurant.dto';
import {DeleteRestaurentInput, DeleteRestaurentOutput} from './dtos/delete-restaurant.dto';
import {EditRestaurentInput, EditRestaurentOutput} from './dtos/edit-restaurant.dto';
import {Category} from './entities/category.entity';
import {Restaurant} from './entities/restaurant.entity';
import {CategoryRepository} from './repositories/category.repository';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category) private readonly categories: CategoryRepository,
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
      return {ok: true};
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

  async allCategories() {
    try {
      const categories = await this.categories.find();
      return {ok: true, categories};
    } catch (error) {
      return {ok: false, error: 'Not found categories'};
    }
  }
}
