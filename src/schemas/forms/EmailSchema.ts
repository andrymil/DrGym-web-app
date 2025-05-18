import * as yup from 'yup';

export const EmailSchema = yup
  .string()
  .email('E-mail address is invalid')
  .max(50, 'E-mail address - maximum 50 characters')
  .min(5, 'E-mail address - minimum 5 characters');
