import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private buildEmail() {
    return {
      to: 'David Barcenas <davidbarcenasmx@gmail.com>', // list of receivers
      from: 'Dev Company <devcompany@gmail.com>', // sender address
      subject: 'Sender Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      html: '<b>Hello Sr. Barcenas! how are you?</b>', // HTML body content
    };
  }

  sendMail() {
    this.mailerService
      .sendMail({ ...this.buildEmail() })
      .then(() => console.log('EMAIL SENT'))
      .catch(error => console.log('EMAIL ERROR', error));
  }
}
