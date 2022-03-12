import {Column, Entity, JoinTable, ManyToMany, ManyToOne, RelationId} from 'typeorm';
import {Field, Float, InputType, ObjectType, registerEnumType} from '@nestjs/graphql';
import {IsEnum, IsNumber} from 'class-validator';

import {CoreEntity} from 'src/common/entities/core.entity';
import {OrderItem} from './order-item.entity';
import {Restaurant} from 'src/restaurants/entities/restaurant.entity';
import {User} from 'src/users/entities/user.entity';

export enum OrderStatus {
  Pending = 'Pending',
  Coocking = 'Coocking',
  Cooked = 'Cooked',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, {name: 'OrderStatus'});

@InputType('OrderInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field(type => User, {nullable: true})
  @ManyToOne(type => User, user => user.orders, {onDelete: 'SET NULL', nullable: true, eager: true})
  customer?: User;

  @RelationId((order: Order) => order.customer)
  customerId: number;

  @Field(type => User, {nullable: true})
  @ManyToOne(type => User, user => user.rides, {onDelete: 'SET NULL', nullable: true, eager: true})
  driver?: User;

  @RelationId((order: Order) => order.driver)
  driverId: number;

  @Field(type => Restaurant, {nullable: true})
  @ManyToOne(type => Restaurant, restaurant => restaurant.orders, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  restaurant?: Restaurant;

  @Field(type => [OrderItem])
  @ManyToMany(type => OrderItem, {eager: true})
  @JoinTable()
  items: OrderItem[];

  @Column({nullable: true})
  @Field(type => Float, {nullable: true})
  @IsNumber()
  total?: number;

  @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.Pending})
  @Field(type => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
