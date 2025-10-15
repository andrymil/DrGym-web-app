import prisma from '@prisma';
import { getSessionUsername, handleApiError } from '@/utils/apiHelpers';
import { NextResponse } from 'next/server';
import type { Friend, GetFriendsResponse } from '@/types/api/friends';

export async function GET(): Promise<Response> {
  try {
    const username = await getSessionUsername();

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ friend1: username }, { friend2: username }],
      },
      include: {
        friend1User: { select: { username: true, avatar: true } },
        friend2User: { select: { username: true, avatar: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    const friends: Friend[] = friendships.map((friendship) => {
      const isFriend1Me = friendship.friend1 === username;

      return isFriend1Me ? friendship.friend2User : friendship.friend1User;
    });

    return NextResponse.json<GetFriendsResponse>({ friends }, { status: 200 });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return handleApiError(error);
  }
}
