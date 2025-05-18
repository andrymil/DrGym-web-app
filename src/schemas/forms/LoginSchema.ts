import * as yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(yup);

const LoginSchema = (loginType: string) => {
  const emailSchema = yup.object().shape({
    email: yup
      .string()
      .email("it's not an email")
      .max(50, 'maximum 50 characters')
      .min(5, 'minimum 5 characters')
      .required("it's required"),
    username: yup
      .string()
      .max(20, 'maximum 20 characters')
      .min(2, 'minimum 2 characters'),
    password: yup
      .string()
      .max(30, 'too long')
      .min(10, 'too short')
      .minLowercase(2, 'minimum 2 lowercases')
      .minUppercase(1, 'minimum 1 uppercase')
      .minNumbers(1, 'minimum 1 number')
      .minSymbols(1, 'minimum 1 symbol')
      .required("it's required"),
  });
  const usernameSchema = yup.object().shape({
    email: yup
      .string()
      .email("it's not an email")
      .max(50, 'maximum 50 characters')
      .min(5, 'minimum 5 characters'),
    username: yup
      .string()
      .max(20, 'maximum 20 characters')
      .min(2, 'minimum 2 characters')
      .required("it's required"),
    password: yup
      .string()
      .max(30, 'too long')
      .min(10, 'too short')
      .minLowercase(2, 'minimum 2 lowercases')
      .minUppercase(1, 'minimum 1 uppercase')
      .minNumbers(1, 'minimum 1 number')
      .minSymbols(1, 'minimum 1 symbol')
      .required("it's required"),
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
