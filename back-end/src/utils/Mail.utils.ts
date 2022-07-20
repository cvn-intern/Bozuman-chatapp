/* eslint-disable */
const nodemailer = require('nodemailer');
import { 
  FORGOT_PASSWORD
} from './Helper.utils';


export class Email {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bozuman2022@gmail.com',
      pass: 'qafiidxzwzimdcku' //Real password is bozuman123
    }
  });

  //SIL: change this function for active account and sendcode
  /**
   * @param emailAddress: email 
   * @param token: activate_token or code (forgot password)
   * @param type: active | reset_password
   */
  public sendEmail = (emailAddress: any, token: any, type: string) => {
    
    const mailOptions = {
      from: 'bozuman2022@gmail.com',
      to: emailAddress,
      subject: 'Activatetion code',
      html: `<p>Click <a href="${process.env.PROJECT_DOMAIN}/api/auth/activate_account/${token}>here</a> to activate your account</p>`
    };
    
    if (type === FORGOT_PASSWORD){
      mailOptions.subject = 'Reset password';
      mailOptions.html = `<h2>Your code is <strong>${token}</strong></h2>`;
    }

    this.transporter.sendMail(mailOptions, function(error: any, info: any){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
