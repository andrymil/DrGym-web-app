import * as yup from 'yup';
import { PasswordSchema } from '@/schemas/forms/PasswordSchema';
import { EmailSchema } from '@/schemas/forms/EmailSchema';
import type { RegisterForm } from '@/types/forms/RegisterForm';

const RegisterSchema = () => {
  return yup.object().shape({
    username: yup
      .string()
      .max(20, 'Username - maximum 20 characters')
      .min(2, 'Username - minimum 2 characters')
      .required('Username is required'),
    name: yup
      .string()
      .max(20, 'First Name - maximum 20 characters')
      .min(2, 'First Name - minimum 2 characters')
      .required('First Name is required'),
    surname: yup
      .string()
      .max(30, 'Surname - maximum 30 characters')
      .min(2, 'Surname - minimum 2 characters')
      .required('Surname is required'),
    email: EmailSchema.required('E-mail address is required'),
    password: PasswordSchema,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], "Passwords don't match")
      .required("Confirm password - it's required"),
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
