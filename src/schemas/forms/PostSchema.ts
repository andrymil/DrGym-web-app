import * as yup from 'yup';
import type { PostFormValues } from '@/types/forms/PostForm';

const PostSchema = () => {
  return yup.object().shape({
    title: yup
      .string()
      .max(30, 'Title - maximum 30 characters')
      .required('Title is required'),
    description: yup
      .string()
      .max(500, 'Description - maximum 500 characters')
      .required('Description is required'),
  });
};

const PostDefaultValues = (): PostFormValues => {
  return {
    title: '',
    description: '',
  };
};

export { PostSchema, PostDefaultValues };
