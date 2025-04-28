import { NextResponse } from 'next/server';
import prisma from '@prisma';
import { getSessionUsername, handleApiError } from '@/utils/apiHelpers';

export async function GET() {
  try {
    const username = await getSessionUsername();

    const now = new Date();
    const workoutActivities = {
      activities: {
        include: {
          exercise: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    };

    const [pastWorkouts, futureWorkouts] = await prisma.$transaction([
      prisma.workout.findMany({
        where: { username, startDate: { lt: now } },
        include: workoutActivities,
        orderBy: {
          startDate: 'desc',
        },
      }),
      prisma.workout.findMany({
        where: { username, startDate: { gte: now } },
        include: workoutActivities,
        orderBy: {
          startDate: 'asc',
        },
      }),
    ]);

    return NextResponse.json({ pastWorkouts, futureWorkouts });
  } catch (err) {
    console.error('Workouts fetch error:', err);
    return handleApiError(err);
  }
}
