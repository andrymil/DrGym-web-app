import { InferType } from 'yup';
import { RegisterSchema as RegisterFormSchema } from '@/schemas/forms/RegisterSchema';

export const RegisterApiSchema = RegisterFormSchema().omit(['confirmPassword']);

export type RegisterRequest = InferType<typeof RegisterApiSchema>;
