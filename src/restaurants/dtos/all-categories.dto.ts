import {Field, ObjectType} from '@nestjs/graphql';

import {Category} from '../entities/category.entity';
import {CoreOutput} from 'src/common/dtos/output.dto';

@ObjectType()
export class AllCategoryOutput extends CoreOutput {
  @Field(type => [Category], {nullable: true})
  categories?: Category[];
}
