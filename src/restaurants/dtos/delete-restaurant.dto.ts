import {Field, InputType, ObjectType} from '@nestjs/graphql';

import {CoreOutput} from 'src/common/dtos/output.dto';

@InputType()
export class DeleteRestaurentInput {
  @Field(type => Number)
  restaurantId: number;
}

@ObjectType()
export class DeleteRestaurentOutput extends CoreOutput {}
