import {Column, Entity, JoinTable, ManyToMany, ManyToOne} from 'typeorm';
import {Field, Float, InputType, ObjectType, registerEnumType} from '@nestjs/graphql';

import {CoreEntity} from 'src/common/entities/core.entity';
import {Dish} from 'src/restaurants/entities/dish.entity';
import {Restaurant} from 'src/restaurants/entities/restaurant.entity';
import {User} from 'src/users/entities/user.entity';

export enum OrderStatus {
  Pending = 'Pending',
  Coocking = 'Coocking',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, {name: 'OrderStatus'});

@InputType('OrderInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field(type => User, {nullable: true})
  @ManyToOne(type => User, user => user.orders, {onDelete: 'SET NULL', nullable: true})
  customer?: User;

  @Field(type => User, {nullable: true})
  @ManyToOne(type => User, user => user.rides, {onDelete: 'SET NULL', nullable: true})
  driver: User;

  @Field(type => Restaurant, {nullable: true})
  @ManyToOne(type => Restaurant, restaurant => restaurant.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  restaurant: Restaurant;

  @Field(type => [Dish])
  @ManyToMany(type => Dish)
  @JoinTable()
  dishes: Dish[];

  @Column()
  @Field(type => Float)
  total: number;

  @Column({type: 'enum', enum: OrderStatus})
  @Field(type => OrderStatus)
  status: OrderStatus;
}
