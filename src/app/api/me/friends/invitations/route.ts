import prisma from '@prisma';
import {
  getSessionUsername,
  handleApiError,
  ApiError,
  validateBody,
} from '@/utils/apiHelpers';
import { NextResponse } from 'next/server';
import type {
  ReceivedInvitation,
  SentInvitation,
  GetInvitationsResponse,
} from '@/types/api/friends';
import {
  SendInvitationSchema,
  type SendInvitationRequest,
} from '@/schemas/api/FriendsSchema';

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

export async function POST(request: Request): Promise<Response> {
  try {
    const sender = await getSessionUsername();

    const body: SendInvitationRequest = await validateBody(
      SendInvitationSchema,
      await request.json()
    );

    const receiver = body.receiver;

    if (receiver === sender) {
      throw new ApiError('You cannot invite yourself', 400);
    }

    const receiverExists = await prisma.user.findUnique({
      where: { username: receiver },
      select: { username: true },
    });
    if (!receiverExists) {
      throw new ApiError('User not found', 404);
    }

    const [friend1, friend2] = [sender, receiver].sort();

    const friendship = await prisma.friendship.findUnique({
      where: { friend1_friend2: { friend1, friend2 } },
      select: { id: true },
    });
    if (friendship) {
      throw new ApiError('You are already friends', 409);
    }

    const existingOutgoing = await prisma.friendshipInvitation.findUnique({
      where: { sender_receiver: { sender, receiver } },
      select: { id: true },
    });
    if (existingOutgoing) {
      throw new ApiError('Invitation already sent', 409);
    }

    const existingIncoming = await prisma.friendshipInvitation.findUnique({
      where: { sender_receiver: { sender: receiver, receiver: sender } },
      select: { id: true },
    });
    if (existingIncoming) {
      throw new ApiError('This user has already invited you', 409);
    }

    const invitation = await prisma.friendshipInvitation.create({
      data: { sender, receiver },
      select: {
        id: true,
        sender: true,
        receiver: true,
        sendTime: true,
      },
    });

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error('Send invitation error:', error);
    return handleApiError(error);
  }
}
