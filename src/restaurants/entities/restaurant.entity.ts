import {Field, InputType, ObjectType} from '@nestjs/graphql';
import {Column, Entity, ManyToOne} from 'typeorm';
import {IsString} from 'class-validator';
import {CoreEntity} from 'src/common/entities/core.entity';
import {Category} from './category.entity';
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

  @Field(type => User)
  @ManyToOne(type => User, user => user.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  owner: User;
}
