import * as yup from 'yup';
import type { PostFormValues } from '@/types/forms/PostForm';

const PostSchema = () => {
  return yup.object().shape({
    title: yup
      .string()
      .max(30, 'maximum 30 characters')
      .required("it's required"),
    description: yup
      .string()
      .max(500, 'maximum 500 characters')
      .required("it's required"),
  });
};

const PostDefaultValues = (): PostFormValues => {
  return {
    title: '',
    description: '',
  };
};

export { PostSchema, PostDefaultValues };
