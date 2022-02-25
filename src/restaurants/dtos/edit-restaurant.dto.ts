import {Field, InputType, ObjectType, PartialType} from '@nestjs/graphql';

import {CoreOutput} from 'src/common/dtos/output.dto';
import {CreateRestaurantInput} from './create-restaurant.dto';

@InputType()
export class EditRestaurentInput extends PartialType(CreateRestaurantInput) {
  @Field(type => Number)
  restaurantId: number;
}

@ObjectType()
export class EditRestaurentOutput extends CoreOutput {}
