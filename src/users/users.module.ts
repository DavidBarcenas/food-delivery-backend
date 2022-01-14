import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { MailService } from 'src/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailVerification])],
  providers: [UsersResolver, UsersService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
