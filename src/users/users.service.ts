import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtService } from 'src/jwt/jwt.service';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login-dto';
import { User } from './entities/user.entity';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { EmailVerification } from './entities/email-verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerification: Repository<EmailVerification>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const accountExists = await this.usersRepository.findOne({ email });

      if (accountExists) {
        return {
          ok: false,
          error: 'There is a user with that email already',
        };
      }

      const newUser = this.usersRepository.create({ email, password, role });
      const user = await this.usersRepository.save(newUser);

      const verifiedUser = this.emailVerification.create({ user });
      await this.emailVerification.save(verifiedUser);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Couldn't create account",
      };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.usersRepository.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'The email or password is incorrect',
        };
      }

      const token = this.jwtService.create({ email: user.email });

      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Sorry. An error has occurred',
      };
    }
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.usersRepository.findOne(userId);

    if (email) {
      user.email = email;
      user.emailVerified = false;

      const verifiedUser = this.emailVerification.create({ user });
      await this.emailVerification.save(verifiedUser);
    }

    if (password) {
      user.password = password;
    }

    return this.usersRepository.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    const verification = await this.emailVerification.findOne(
      { code },
      { relations: ['user'] },
    );

    if (verification) {
      verification.user.emailVerified = true;
      this.usersRepository.save(verification.user);
      return true;
    }

    return false;
  }
}
