export const generateSixDigitCode = () => {
  const number = Math.floor(100000 + Math.random() * 900000);
  return number;
}