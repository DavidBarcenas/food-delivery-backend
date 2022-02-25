import {User, UserRole} from './entities/user.entity';

import {EmailVerification} from './entities/email-verification.entity';
import {JwtService} from '../jwt/jwt.service';
import {MailService} from 'src/mail/mail.service';
import {Repository} from 'typeorm';
import {Test} from '@nestjs/testing';
import {UsersService} from './users.service';
import {getRepositoryToken} from '@nestjs/typeorm';

const mockRepository = () => ({
  findOneOrFail: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  create: jest.fn(() => 'signed-bearer-token'),
  verify: jest.fn(),
});

const mockMailService = () => ({
  emailVerification: jest.fn(),
  sendUserConfirmation: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UsersService;
  let jwtService: JwtService;
  let mailService: MailService;
  let usersRepository: MockRepository<User>;
  let emailVerificationRepository: MockRepository<EmailVerification>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(EmailVerification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
    usersRepository = module.get(getRepositoryToken(User));
    emailVerificationRepository = module.get(getRepositoryToken(EmailVerification));
  });

  it('shuld be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: 'foo@bar.com',
      password: 'secret123',
      role: UserRole.Owner,
    };
    it('should fail if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'foo@bar.com',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'There is a user with that email already.',
      });
    });

    it('should create a new user', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      usersRepository.create.mockReturnValue(createAccountArgs);
      usersRepository.save.mockResolvedValue(createAccountArgs);
      emailVerificationRepository.create.mockReturnValue({
        user: createAccountArgs,
      });
      emailVerificationRepository.save.mockResolvedValue({code: 'code'});

      const result = await service.createAccount(createAccountArgs);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

      expect(emailVerificationRepository.create).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      expect(emailVerificationRepository.save).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      expect(mailService.sendUserConfirmation).toHaveBeenCalledTimes(1);
      expect(mailService.sendUserConfirmation).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );

      expect(result).toEqual({ok: true});
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error('Has ocurred an error'));
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual({ok: false, error: "Couldn't create account"});
    });
  });

  describe('login', () => {
    const loginArgs = {
      email: 'test@mail.com|',
      password: 'secret123',
    };

    it('should fail if user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      const result = await service.login(loginArgs);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
      expect(result).toEqual({ok: false, error: 'User Not Found.'});
    });

    it('should fail if the password is wrong', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: 'The email or password is incorrect.',
      });
    });

    it('should return token if password correct', async () => {
      const mockedUser = {
        id: 1,
        email: 'test@mail.com',
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(jwtService.create).toHaveBeenCalledTimes(1);
      expect(jwtService.create).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({ok: true, token: 'signed-bearer-token'});
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Sorry. An error has occurred.',
      });
    });
  });

  describe('findById', () => {
    const findByArgs = {email: 'test@mail.com'};
    it('should find an existing user', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(findByArgs);
      const result = await service.findByEmail('test@mail.com');
      expect(result).toEqual({ok: true, user: findByArgs});
    });

    it('should fail if not user is found', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findByEmail('test@mail.com');
      expect(result).toEqual({ok: false, error: 'User Not Found'});
    });
  });

  describe('editProfile', () => {
    it('should change email', async () => {
      const oldUser = {
        email: 'test@mail.com',
        emailVerified: true,
      };
      const editProfileArgs = {
        userId: 1,
        input: {email: 'test@mail.com'},
      };
      const newVerification = {
        code: 'code',
      };
      const newUser = {
        email: editProfileArgs.input.email,
        emailVerified: false,
      };
      usersRepository.findOne.mockResolvedValue(oldUser);
      emailVerificationRepository.create.mockReturnValue(newVerification);
      emailVerificationRepository.save.mockReturnValue(newVerification);

      await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(editProfileArgs.userId);

      expect(emailVerificationRepository.create).toHaveBeenCalledWith({
        user: newUser,
      });
      expect(emailVerificationRepository.save).toHaveBeenCalledWith(newVerification);

      expect(mailService.sendUserConfirmation).toHaveBeenCalledWith(
        newVerification.code,
        newUser.email,
      );
    });

    it('should change password', async () => {
      const editProfileArgs = {
        userId: 1,
        input: {password: 'new-password'},
      };
      usersRepository.findOne.mockResolvedValue({
        password: 'old',
      });
      const result = await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input);
      expect(result).toEqual({ok: true});
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.editProfile(1, {email: '12'});
      expect(result).toEqual({ok: false, error: 'Could not update profile.'});
    });
  });

  describe('verifyEmail', () => {
    it('should verify email', async () => {
      const mockedVerification = {
        user: {
          emailVerified: false,
        },
        id: 1,
      };
      emailVerificationRepository.findOne.mockResolvedValue(mockedVerification);

      const result = await service.verifyEmail('');

      expect(emailVerificationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith({
        emailVerified: true,
      });

      expect(emailVerificationRepository.delete).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.delete).toHaveBeenCalledWith(mockedVerification.id);

      expect(result).toEqual({ok: true});
    });

    it('should fail on verification not found', async () => {
      emailVerificationRepository.findOne.mockResolvedValue(undefined);
      const result = await service.verifyEmail('');
      expect(result).toEqual({ok: false, error: 'Verification not found.'});
    });

    it('should fail on exception', async () => {
      emailVerificationRepository.findOne.mockRejectedValue(new Error());
      const result = await service.verifyEmail('');
      expect(result).toEqual({ok: false, error: 'Could not verify email.'});
    });
  });
});
