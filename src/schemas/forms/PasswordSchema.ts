import * as yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(yup);

export const PasswordSchema = yup
  .string()
  .max(30, 'Password is too long')
  .min(10, 'Password is too short')
  .minLowercase(2, 'Password must contain at least 2 lowercase letters')
  .minUppercase(1, 'Password must contain at least 1 uppercase letter')
  .minNumbers(1, 'Password must contain at least 1 number')
  .minSymbols(1, 'Password must contain at least 1 symbol')
  .required('Password is required');
