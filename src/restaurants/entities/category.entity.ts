import {Column, Entity, OneToMany} from 'typeorm';
import {Field, InputType, ObjectType} from '@nestjs/graphql';

import {CoreEntity} from 'src/common/entities/core.entity';
import {IsString} from 'class-validator';
import {Restaurant} from './restaurant.entity';

@InputType('CategoryInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field(type => String)
  @Column({unique: true})
  @IsString()
  name: string;

  @Field(type => String, {nullable: true})
  @Column({nullable: true})
  @IsString()
  coverImage: string;

  @Field(type => String)
  @Column({unique: true})
  @IsString()
  slug: string;

  @OneToMany(type => Restaurant, restaurant => restaurant.category)
  @Field(type => [Restaurant], {nullable: true})
  restaurants: Restaurant[];
}
