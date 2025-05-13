import * as yup from 'yup';
import YupPassword from 'yup-password';
import type { RegisterForm } from '@/types/forms/RegisterForm';

YupPassword(yup);

const RegisterSchema = () => {
  return yup.object().shape({
    username: yup
      .string()
      .max(20, 'maximum 20 characters')
      .min(2, 'minimum 2 characters')
      .required("it's required"),
    firstName: yup
      .string()
      .max(20, 'maximum 20 characters')
      .min(2, 'minimum 2 characters')
      .required("it's required"),
    lastName: yup
      .string()
      .max(30, 'maximum 30 characters')
      .min(2, 'minimum 2 characters')
      .required("it's required"),
    email: yup
      .string()
      .email("it's not an email")
      .max(50, 'maximum 50 characters')
      .min(5, 'minimum 5 characters')
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
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], "doesn't match")
      .required("it's required"),
  });
};

const RegisterDefaultValues = (): RegisterForm => {
  return {
    username: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
};

export { RegisterSchema, RegisterDefaultValues };
