import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtService } from 'src/jwt/jwt.service';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login-dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
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

      const newAccount = this.usersRepository.create({ email, password, role });
      await this.usersRepository.save(newAccount);
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
}
