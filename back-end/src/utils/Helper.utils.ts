export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const ACTIVATE_ACCOUNT = 'ACTIVATE_ACCOUNT';

const { Email } = require("../utils/Mail.utils");

export const generateSixDigitCode = () => {
  const number = Math.floor(100000 + Math.random() * 900000);
  return number.toString();
}

export const sendCodeToMail = async (email: string, token: string, type: string) => {
  const emailAgent = new Email();
  emailAgent.sendEmail(email, token, type);
};
