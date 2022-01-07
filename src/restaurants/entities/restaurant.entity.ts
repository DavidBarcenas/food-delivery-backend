import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@ObjectType()
@Entity()
export class Restaurant {
  @Field(type => Number)
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Field(type => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(type => Boolean, { defaultValue: true })
  @Column({ default: true })
  @IsBoolean()
  @IsOptional()
  isVegan: string;

  @Field(type => String)
  @Column()
  @IsString()
  @Length(5)
  address: string;
}
