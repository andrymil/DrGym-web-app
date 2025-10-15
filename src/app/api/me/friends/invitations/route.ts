import prisma from '@prisma';
import { getSessionUsername, handleApiError } from '@/utils/apiHelpers';
import { NextResponse } from 'next/server';
import type {
  ReceivedInvitation,
  SentInvitation,
  GetInvitationsResponse,
} from '@/types/api/friends';

export async function GET(): Promise<Response> {
  try {
    const username = await getSessionUsername();

    const sentInvitations = await prisma.friendshipInvitation.findMany({
      where: { sender: username },
      include: {
        receiverUser: { select: { username: true, avatar: true } },
      },
      orderBy: { sendTime: 'desc' },
    });

    const receivedInvitations = await prisma.friendshipInvitation.findMany({
      where: { receiver: username },
      include: {
        senderUser: { select: { username: true, avatar: true } },
      },
      orderBy: { sendTime: 'desc' },
    });

    const sent: SentInvitation[] = sentInvitations.map((invitation) => ({
      id: invitation.id,
      receiver: {
        username: invitation.receiverUser.username,
        avatar: invitation.receiverUser.avatar,
      },
    }));

    const received: ReceivedInvitation[] = receivedInvitations.map(
      (invitation) => ({
        id: invitation.id,
        sender: {
          username: invitation.senderUser.username,
          avatar: invitation.senderUser.avatar,
        },
      })
    );

    return NextResponse.json<GetInvitationsResponse>(
      { sent, received },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return handleApiError(error);
  }
}
