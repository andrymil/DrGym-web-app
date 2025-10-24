import prisma from '@prisma';
import {
  PatchInvitationSchema,
  type PatchInvitationRequest,
} from '@/schemas/api/FriendsSchema';
import {
  ApiError,
  getParamId,
  getSessionUsername,
  handleApiError,
  ParamsProp,
  validateBody,
} from '@/utils/apiHelpers';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: ParamsProp
): Promise<Response> {
  try {
    const username = await getSessionUsername();

    const body: PatchInvitationRequest = await validateBody(
      PatchInvitationSchema,
      await request.json()
    );

    const invitationId = await getParamId(params);
    const { decision } = body;

    await prisma.$transaction(async (tx) => {
      const invitation = await tx.friendshipInvitation.findUnique({
        where: { id: invitationId },
        select: { id: true, sender: true, receiver: true },
      });

      if (!invitation) {
        throw new ApiError('Invitation not found', 404);
      }

      if (invitation.receiver !== username) {
        throw new ApiError('This invitation was not sent to you', 403);
      }

      if (decision === 'accepted') {
        const [friend1, friend2] = [
          invitation.sender,
          invitation.receiver,
        ].sort();
        await tx.friendship.upsert({
          where: { friend1_friend2: { friend1, friend2 } },
          update: {},
          create: { friend1, friend2 },
        });
      }

      await tx.friendshipInvitation.delete({
        where: { id: invitationId },
      });
    });

    return NextResponse.json({ decision }, { status: 200 });
  } catch (error) {
    console.error('Patch invitation error:', error);
    return handleApiError(error);
  }
}
