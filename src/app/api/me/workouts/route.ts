import { NextResponse } from 'next/server';
import prisma from '@prisma';
import {
  getSessionUsername,
  handleApiError,
  validateBody,
} from '@/utils/apiHelpers';
import type { Workout, FuturePastWorkouts } from '@/types/api/workout';
import { CreateWorkoutSchema } from '@/schemas/api/WorkoutSchema';
import type { CreateWorkoutRequest } from '@/schemas/api/WorkoutSchema';

const activitiesSelect = {
  select: {
    id: true,
    reps: true,
    weight: true,
    duration: true,
    exercise: {
      select: {
        id: true,
        name: true,
        type: true,
      },
    },
  },
};

export async function GET(): Promise<Response> {
  try {
    const username = await getSessionUsername();

    const now = new Date();
    const workoutActivities = {
      activities: activitiesSelect,
    };

    const [pastWorkouts, futureWorkouts]: [Workout[], Workout[]] =
      await prisma.$transaction([
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

    return NextResponse.json<FuturePastWorkouts>({
      pastWorkouts,
      futureWorkouts,
    });
  } catch (err) {
    console.error('Workouts fetch error:', err);
    return handleApiError(err);
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const username = await getSessionUsername();

    const body: CreateWorkoutRequest = await validateBody(
      CreateWorkoutSchema,
      await req.json()
    );

    const { startDate, endDate, description, schedule, activities } = body;

    const newWorkout: Workout = await prisma.workout.create({
      data: {
        startDate,
        endDate,
        description,
        schedule,
        username,
        activities: {
          create: activities.map((activity) => ({
            reps: activity.reps,
            weight: activity.weight,
            duration: activity.duration,
            exercise: {
              connect: { id: activity.exercise.id },
            },
          })),
        },
      },
      include: {
        activities: activitiesSelect,
      },
    });

    return NextResponse.json<Workout>(newWorkout, { status: 201 });
  } catch (err) {
    console.error('Adding Workout error:', err);
    return handleApiError(err);
  }
}
