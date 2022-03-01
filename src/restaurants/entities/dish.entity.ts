import {Column, Entity, ManyToOne, RelationId} from 'typeorm';
import {Field, InputType, Int, ObjectType} from '@nestjs/graphql';
import {IsNumber, IsString, Length} from 'class-validator';

import {CoreEntity} from 'src/common/entities/core.entity';
import {Restaurant} from './restaurant.entity';

@InputType('DishInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
  @Field(type => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(type => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field(type => String, {nullable: true})
  @Column({nullable: true})
  @IsString()
  photo?: string;

  @Field(type => String)
  @Column()
  @IsString()
  @Length(5, 256)
  description: string;

  @Field(type => Restaurant)
  @ManyToOne(type => Restaurant, restaurant => restaurant.menu, {onDelete: 'CASCADE'})
  restaurant: Restaurant;

  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: number;

  @Field(type => [DishOption], {nullable: true})
  @Column({type: 'json', nullable: true})
  options?: DishOption[];
}

@InputType('DishOptionInputType', {isAbstract: true})
@ObjectType()
class DishOption {
  @Field(type => String)
  name: string;

  @Field(type => [String], {nullable: true})
  choices?: string[];

  @Field(type => Int, {nullable: true})
  extra?: number;
}
