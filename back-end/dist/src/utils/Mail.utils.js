"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const nodemailer = require('nodemailer');
const Helper_utils_1 = require("./Helper.utils");
class Email {
    constructor() {
        this.transporter = nodemailer.createTransport({
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
        this.sendEmail = (emailAddress, token, type) => {
            const mailOptions = {
                from: 'bozuman2022@gmail.com',
                to: emailAddress,
                subject: 'Activatetion code',
                html: '<p>Click <a href="http://localhost:3000/api/auth/activate_account/' + token + '">here</a> to activate your account</p>'
            };
            if (type === Helper_utils_1.FORGOT_PASSWORD) {
                mailOptions.subject = 'Reset password';
                mailOptions.html = `<h1>Your code is <strong>${token}</strong></h1>`;
            }
            this.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
        };
    }
}
module.exports = { Email };
