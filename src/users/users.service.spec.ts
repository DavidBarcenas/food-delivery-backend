import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UserService', () => {
  let service: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('shuld be defined', () => {
    expect(service).toBeDefined();
  });
});
