import * as yup from 'yup';
import { EmailSchema } from '@/schemas/forms/EmailSchema';

const ForogtPasswordSchema = () => {
  return yup.object().shape({
    email: EmailSchema.required('E-mail address is required'),
  });
};

const ForogtPasswordDefaultValues = () => {
  return {
    email: '',
  };
};

export { ForogtPasswordSchema, ForogtPasswordDefaultValues };
