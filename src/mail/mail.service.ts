import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private buildEmail(code: string) {
    const url = `http://127.0.0.1:3000/confirm?code=${code}`;
    return {
      to: 'David Barcenas <davidbarcenasmx@gmail.com>', // list of receivers
      from: 'Delivery <devcompany@gmail.com>', // sender address
      subject: 'Confirm Delivery Account', // Subject line
      text: 'Email Verification', // plaintext body
      template: 'confirmation',
      context: {
        verificationUrl: url,
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
