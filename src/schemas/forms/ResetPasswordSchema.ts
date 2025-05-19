import * as yup from 'yup';
import YupPassword from 'yup-password';
import { PasswordSchema } from './PasswordSchema';

YupPassword(yup);

const ResetPasswordSchema = () => {
  return yup.object().shape({
    password: PasswordSchema,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], "Passwords don't match")
      .required("Confirm Password - it's required"),
  });
};

const ResetPasswordDefaultValues = () => {
  return {
    password: '',
    confirmPassword: '',
  };
};

export { ResetPasswordSchema, ResetPasswordDefaultValues };
