import { MailerService } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';
import { MailService } from './mail.service';

const USER_EMAIL = 'bs.foo@mail.com';

const MOCK_MAIL_OPTIONS = {
  to: USER_EMAIL,
  from: 'Delivery <devcompany@gmail.com>',
  subject: 'Welcome to Delivery App! Confirm your email',
  text: 'Welcome to Delivery App! Confirm your email',
  template: 'confirmation',
  context: {
    verificationUrl: 'http://127.0.0.1:3000/confirm?code=code',
  },
};

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a confirmation email', async () => {
    await service.sendUserConfirmation('code', USER_EMAIL);
    expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    expect(mailerService.sendMail).toHaveBeenCalledWith(MOCK_MAIL_OPTIONS);
  });

  it('should fail on exception', async () => {
    jest.spyOn(mailerService, 'sendMail').mockRejectedValue(new Error('Fail'));
    console.error = jest.fn();
    await service.sendUserConfirmation('code', USER_EMAIL);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith('Email Error');
  });
});
