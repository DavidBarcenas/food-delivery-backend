import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login-dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerification: Repository<EmailVerification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const accountExists = await this.usersRepository.findOne({ email });

      if (accountExists) {
        return {
          ok: false,
          error: 'There is a user with that email already.',
        };
      }

      const newUser = this.usersRepository.create({ email, password, role });
      const user = await this.usersRepository.save(newUser);

      const verifiedUser = this.emailVerification.create({ user });
      const verification = await this.emailVerification.save(verifiedUser);
      await this.mailService.sendUserConfirmation(
        verification.code,
        user.email,
      );
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: "Couldn't create account",
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.usersRepository.findOne(
        { email },
        { select: ['email', 'password'] },
      );
      if (!user) {
        return { ok: false, error: 'User Not Found.' };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'The email or password is incorrect.',
        };
      }

      const token = this.jwtService.create({ email: user.email });
      return { ok: true, token };
    } catch (error) {
      return {
        ok: false,
        error: 'Sorry. An error has occurred.',
      };
    }
  }

  async findByEmail(email: string): Promise<UserProfileOutput> {
    try {
      const user = await this.usersRepository.findOne({ email });

      if (user) {
        return { ok: true, user };
      }
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.usersRepository.findOne(userId);

      if (email) {
        user.email = email;
        user.emailVerified = false;

        const verifiedUser = this.emailVerification.create({ user });
        const verification = await this.emailVerification.save(verifiedUser);
        await this.mailService.sendUserConfirmation(
          verification.code,
          user.email,
        );
      }

      if (password) {
        user.password = password;
      }

      await this.usersRepository.save(user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not update profile.' };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.emailVerification.findOne(
        { code },
        { relations: ['user'] },
      );

      if (verification) {
        verification.user.emailVerified = true;
        await this.usersRepository.save(verification.user);
        await this.emailVerification.delete(verification.id);
        return { ok: true };
      }
      return { ok: false, error: 'Verification not found.' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
