import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { 
  FORGOT_PASSWORD,
  ACTIVATE_ACCOUNT
} from './Helper.utils';
import dotenv from 'dotenv';
dotenv.config();
/* eslint-disable no-debugger, no-console */

export class Email {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS
    },
  });

  public sendEmail = (emailAddress: string, token: string, type: string) => {
    const mailOptions = {
      from: 'bozuman2022@gmail.com',
      to: emailAddress,
      subject: '',
      html: ``,
    };

    switch(type) {
      case ACTIVATE_ACCOUNT:
        mailOptions.subject = 'Activation cod';
        mailOptions.html = `<p>Click <a href="${process.env.PROJECT_DOMAIN || ''}/api/auth/activate_account/${token}>here</a> to activate your account</p>`;
        break;

      case FORGOT_PASSWORD:
        mailOptions.subject = 'Reset password';
        mailOptions.html = `<h2>Your code is <strong>${token}</strong></h2>`;
        break;

      default:
        break;
    }

    this.transporter.sendMail(mailOptions, function (error: Error | null, info: SMTPTransport.SentMessageInfo) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };
}
