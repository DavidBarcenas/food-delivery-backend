import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @Field(type => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field(type => Boolean)
  @IsBoolean()
  isVegan: string;

  @Field(type => String)
  @IsString()
  address: string;

  @Field(type => String)
  @IsString()
  @Length(5, 10)
  ownersName: string;
}
