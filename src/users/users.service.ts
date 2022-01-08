import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createAccount({ email, password, role }: CreateAccountInput) {
    try {
      const accountExists = await this.usersRepository.findOne({ email });
      if (accountExists) {
        return;
      }
      const newAccount = this.usersRepository.create({ email, password, role });
      await this.usersRepository.save(newAccount);
      return true;
    } catch (error) {
      return false;
    }
  }
}
