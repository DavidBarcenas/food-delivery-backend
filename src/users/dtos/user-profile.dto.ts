import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { User } from '../user.entity';

@ArgsType()
export class UserProfileInput {
  @Field(type => String)
  email: string;
}

@ObjectType()
export class UserProfileOutput extends MutationOutput {
  @Field(type => User, { nullable: true })
  user?: User;
}
