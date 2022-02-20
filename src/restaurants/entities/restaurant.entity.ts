import {Field, ObjectType} from '@nestjs/graphql';
import {Column, Entity, ManyToOne} from 'typeorm';
import {IsString} from 'class-validator';
import {CoreEntity} from 'src/common/entities/core.entity';
import {Category} from './category.entity';

@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(type => String)
  @Column()
  @IsString()
  name: string;

  @Field(type => String)
  @Column()
  @IsString()
  coverImage: string;

  @Field(type => String)
  @Column()
  @IsString()
  address: string;

  @ManyToOne(type => Category, category => category.restaurants)
  @Field(type => Category)
  category: Category;
}
