import * as yup from 'yup';
import YupPassword from 'yup-password';
import { EmailSchema } from './EmailSchema';
import { PasswordSchema } from './PasswordSchema';

YupPassword(yup);

const LoginSchema = (loginType: string) => {
  const emailSchema = yup.object().shape({
    email: EmailSchema.required('E-mail address is required'),
    username: yup
      .string()
      .max(20, 'Username - maximum 20 characters')
      .min(2, 'Username - minimum 2 characters'),
    password: PasswordSchema,
  });
  const usernameSchema = yup.object().shape({
    email: EmailSchema,
    username: yup
      .string()
      .max(20, 'Username - maximum 20 characters')
      .min(2, 'Username - minimum 2 characters')
      .required("it's required"),
    password: PasswordSchema,
  });
  return loginType === 'username' ? usernameSchema : emailSchema;
};

const LoginDefaultValues = () => {
  return {
    email: '',
    username: '',
    password: '',
  };
};

export { LoginSchema, LoginDefaultValues };
