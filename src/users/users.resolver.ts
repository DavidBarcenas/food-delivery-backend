import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => Boolean)
  user() {
    return true;
  }

  @Mutation(returns => CreateAccountOutput)
  createAccount(@Args('input') createAccountInput: CreateAccountInput) {
    return true;
  }
}
