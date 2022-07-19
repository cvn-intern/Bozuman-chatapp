/* eslint-disable */
const nodemailer = require('nodemailer');

export class Email {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bozuman2022@gmail.com',
      pass: 'qafiidxzwzimdcku' //Real password is bozuman123
    }
  });

  public sendEmail = (emailAddress: string | undefined, activate_token: string | undefined) => {
    const mailOptions = {
      from: 'bozuman2022@gmail.com',
      to: emailAddress,
      subject: 'Activatetion code',
      html: '<p>Click <a href="http://localhost:3000/api/auth/activate_account/' + activate_token + '">here</a> to activate your account</p>'

    };

    this.transporter.sendMail(mailOptions, function(error: any, info: any){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
