import * as yup from 'yup';
import { EmailSchema } from '@/schemas/forms/EmailSchema';

const ForgotPasswordSchema = () => {
  return yup.object().shape({
    email: EmailSchema.required('E-mail address is required'),
  });
};

const ForgotPasswordDefaultValues = () => {
  return {
    email: '',
  };
};

export { ForgotPasswordSchema, ForgotPasswordDefaultValues };
