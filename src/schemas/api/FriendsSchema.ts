import * as yup from 'yup';

export const SendInvitationSchema = yup.object({
  receiver: yup
    .string()
    .required('Receiver is required')
    .max(50, 'Invalid username')
    .trim(),
});

export type SendInvitationRequest = { receiver: string };
