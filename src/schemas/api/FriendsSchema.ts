import * as yup from 'yup';

export const SendInvitationSchema = yup.object({
  receiver: yup
    .string()
    .required('Receiver is required')
    .max(50, 'Invalid username')
    .trim(),
});

export const PatchInvitationSchema = yup.object({
  decision: yup
    .string<'accepted' | 'rejected'>()
    .required('Decision is required')
    .oneOf(
      ['accepted', 'rejected'] as const,
      'Decision must be either accepted or rejected'
    ),
});

export type SendInvitationRequest = { receiver: string };

export type PatchInvitationRequest = yup.InferType<
  typeof PatchInvitationSchema
>;
