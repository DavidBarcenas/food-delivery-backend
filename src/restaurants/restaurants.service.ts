import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/users/entities/user.entity';
import {Repository} from 'typeorm';
import {CreateRestaurantInput, CreateRestaurantOutput} from './dtos/create-restaurant.dto';
import {EditRestaurentInput, EditRestaurentOutput} from './dtos/edit-restaurant.dto';
import {Category} from './entities/category.entity';
import {Restaurant} from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category) private readonly categories: Repository<Category>,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.getCategory(createRestaurantInput.categoryName);
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return {ok: true};
    } catch (error) {
      console.log(error);
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
      return {ok: true};
    } catch (error) {
      return {ok: true, error: 'Could not edit restaurant'};
    }
  }

  async getCategory(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/ /g, '-');
    let category = await this.categories.findOne({slug: categorySlug});
    if (!category) {
      category = await this.createCategory(categoryName, categorySlug);
    }
    return category;
  }

  async createCategory(name: string, slug: string): Promise<Category> {
    return await this.categories.save(this.categories.create({name, slug}));
  }
}
