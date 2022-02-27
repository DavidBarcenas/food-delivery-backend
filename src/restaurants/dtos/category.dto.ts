import {ArgsType, Field, ObjectType} from '@nestjs/graphql';

import {Category} from '../entities/category.entity';
import {CoreOutput} from 'src/common/dtos/output.dto';

@ArgsType()
export class CategoryInput {
  @Field(type => String)
  slug: string;
}

@ObjectType()
export class CategoryOutput extends CoreOutput {
  @Field(type => Category, {nullable: true})
  category?: Category;
}
