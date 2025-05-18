import * as yup from 'yup';
import type { UserData } from '@/types/api/user';

const AccountSchema = () => {
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
    weight: yup
      .number()
      .typeError('Weight must be a number')
      .min(0, 'Weight cannot be negative'),
    height: yup
      .number()
      .typeError('Height must be a number')
      .min(0, 'Height cannot be negative'),
  });
};

const AccountDefaultValues = (userData: UserData): UserData => {
  return {
    username: userData.username || '',
    name: userData.name || '',
    surname: userData.surname || '',
    weight: userData.weight || null,
    height: userData.height || null,
    exercise: userData.exercise || null,
    avatar: userData.avatar || '',
  };
};

export { AccountSchema, AccountDefaultValues };
