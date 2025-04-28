import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { NextResponse } from 'next/server';
import prisma from '@prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const username = session.user.username;
    if (!username) {
      return NextResponse.json(
        { error: 'Username not found in session' },
        { status: 400 }
      );
    }

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
    console.error('Workouts GET error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
