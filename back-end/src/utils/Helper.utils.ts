export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const ACTIVATE_ACCOUNT = 'ACTIVATE_ACCOUNT';

export const generateSixDigitCode = () => {
  const number = Math.floor(100000 + Math.random() * 900000);
  return number;
}