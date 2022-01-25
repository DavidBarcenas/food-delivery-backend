import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '../jwt/jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';

const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  create: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  emailVerification: jest.fn(),
};

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(EmailVerification),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('shuld be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should fail if user exists', () => null);
});
