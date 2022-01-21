import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private buildEmail(code: string) {
    return {
      to: 'David Barcenas <davidbarcenasmx@gmail.com>', // list of receivers
      from: 'Delivery <devcompany@gmail.com>', // sender address
      subject: 'Confirm Delivery Account', // Subject line
      text: 'Email Verification', // plaintext body
      template: join(__dirname, '/mail/templates/verify'),
      context: {
        code: 'cf1a3f828287',
        username: 'john doe',
      },
    };
  }

  sendMail(code: string) {
    // console.log(process.cwd() + '/templates/verify.html');
    this.mailerService
      .sendMail({ ...this.buildEmail(code) })
      .then(() => console.log('EMAIL SENT'))
      .catch(error => console.log('EMAIL ERROR', error));
  }
}
