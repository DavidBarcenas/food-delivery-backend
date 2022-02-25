import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {LoginInput, LoginOutput} from './dtos/login-dto';
import {AuthUser} from 'src/auth/auth-user.decorator';
import {EditProfileInput, EditProfileOutput} from './dtos/edit-profile.dto';
import {UserProfileInput, UserProfileOutput} from './dtos/user-profile.dto';
import {VerifyEmailInput, VerifyEmailOutput} from './dtos/verify-email.dto';
import {UsersService} from './users.service';
import {User} from './entities/user.entity';
import {CreateAccountInput, CreateAccountOutput} from './dtos/create-account.dto';
import {Role} from 'src/auth/role.decorator';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(returns => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation(returns => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query(returns => User, {nullable: true})
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query(returns => UserProfileOutput)
  @Role(['Any'])
  userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
    return this.usersService.findByEmail(userProfileInput.email);
  }

  @Mutation(returns => EditProfileOutput)
  @Role(['Any'])
  editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation(returns => VerifyEmailOutput)
  verifyEmail(@Args('input') verifyEmailInput: VerifyEmailInput): Promise<VerifyEmailOutput> {
    return this.usersService.verifyEmail(verifyEmailInput.code);
  }
}
