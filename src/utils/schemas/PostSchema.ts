import * as yup from 'yup';

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

const PostDefaultValues = () => {
  return {
    title: '',
    description: '',
  };
};

export { PostSchema, PostDefaultValues };
