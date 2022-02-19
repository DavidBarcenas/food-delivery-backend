import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersResolver} from './users.resolver';
import {UsersService} from './users.service';
import {User} from './entities/user.entity';
import {EmailVerification} from './entities/email-verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailVerification])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
