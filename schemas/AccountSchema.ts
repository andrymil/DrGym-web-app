import * as yup from 'yup';
import type { UserData } from '@/types/api/user';

const AccountSchema = () => {
  return yup.object().shape({
    username: yup
      .string()
      .max(20, 'maximum 20 characters')
      .min(2, 'minimum 2 characters')
      .required("it's required"),
    name: yup
      .string()
      .max(20, 'maximum 20 characters')
      .min(2, 'minimum 2 characters')
      .required("it's required"),
    surname: yup
      .string()
      .max(30, 'maximum 30 characters')
      .min(2, 'minimum 2 characters')
      .required("it's required"),
    weight: yup
      .number()
      .typeError('must be a number')
      .min(0, 'cannot be negative'),
    height: yup
      .number()
      .typeError('must be a number')
      .min(0, 'cannot be negative'),
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
  };
};

export { AccountSchema, AccountDefaultValues };
