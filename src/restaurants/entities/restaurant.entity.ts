import {Column, Entity, ManyToOne, OneToMany, RelationId} from 'typeorm';
import {Field, InputType, ObjectType} from '@nestjs/graphql';

import {Category} from './category.entity';
import {CoreEntity} from 'src/common/entities/core.entity';
import {Dish} from './dish.entity';
import {IsString} from 'class-validator';
import {Order} from 'src/orders/entities/order.entity';
import {User} from 'src/users/entities/user.entity';

@InputType('RestaurantInputType', {isAbstract: true})
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

  @Field(type => Category, {nullable: true})
  @ManyToOne(type => Category, category => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field(type => [Dish])
  @OneToMany(type => Dish, dish => dish.restaurant)
  menu: Dish[];

  @Field(type => [Order])
  @OneToMany(type => Order, order => order.restaurant)
  orders: Order[];

  @Field(type => User, {nullable: true})
  @ManyToOne(type => User, user => user.restaurants, {
    onDelete: 'CASCADE',
  })
  owner?: User;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;
}
