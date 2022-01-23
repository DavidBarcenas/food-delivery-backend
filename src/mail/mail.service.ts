import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private buildEmail(code: string) {
    const url = `http://127.0.0.1:3000/confirm?code=${code}`;
    return {
      to: 'David Barcenas <davidbarcenasmx@gmail.com>',
      from: 'Delivery <devcompany@gmail.com>',
      subject: 'Confirm Delivery Account',
      text: 'Email Verification',
      template: 'confirmation',
      context: {
        verificationUrl: url,
      },
    };
  }

  sendMail(code: string) {
    this.mailerService
      .sendMail({ ...this.buildEmail(code) })
      .then(() => console.log('EMAIL SENT'))
      .catch(error => console.log('EMAIL ERROR', error));
  }
}
