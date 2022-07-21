export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const ACTIVATE_ACCOUNT = 'ACTIVATE_ACCOUNT';

import { Email } from './Mail.utils';

export const generateSixDigitCode = (): string => {
  const number = Math.floor(100000 + Math.random() * 900000);
  return number.toString();
};

export const sendCodeToMail = (email: string, token: string, type: string) => {
  const emailAgent = new Email();
  emailAgent.sendEmail(email, token, type);
};
