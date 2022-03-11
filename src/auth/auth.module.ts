import {APP_GUARD} from '@nestjs/core';
import {AuthGuard} from './auth.guard';
import {Module} from '@nestjs/common';
import {UsersModule} from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
