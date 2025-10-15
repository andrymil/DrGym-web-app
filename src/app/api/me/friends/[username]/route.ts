import { NextResponse } from 'next/server';
import prisma from '@prisma';
import {
  ApiError,
  getParamString,
  getSessionUsername,
  handleApiError,
  type ParamsProp,
} from '@/utils/apiHelpers';
import type { PlainUserData } from '@/types/api/user';

export async function GET(
  _req: Request,
  { params }: ParamsProp<'username'>
): Promise<Response> {
  try {
    const myUsername = await getSessionUsername();
    const username = await getParamString(params, 'username');

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { friend1: myUsername, friend2: username },
          { friend1: username, friend2: myUsername },
        ],
      },
      select: { id: true },
    });

    if (!friendship) {
      throw new ApiError('Friend not found', 404);
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        name: true,
        surname: true,
        weight: true,
        height: true,
        avatar: true,
        favoriteExercise: true,
      },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    let exerciseName: string | null = null;

    if (user.favoriteExercise !== null) {
      const exercise = await prisma.exercise.findUnique({
        where: { id: user.favoriteExercise },
        select: { name: true },
      });

      exerciseName = exercise?.name ?? null;
    }

    const payload: PlainUserData = {
      name: user.name,
      surname: user.surname,
      weight: user.weight !== null ? Number(user.weight) : null,
      height: user.height !== null ? Number(user.height) : null,
      exercise: exerciseName,
      avatar: user.avatar,
    };

    return NextResponse.json<PlainUserData>(payload, { status: 200 });
  } catch (error) {
    console.error('Error fetching friend data:', error);
    return handleApiError(error);
  }
}
