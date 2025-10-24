import { NextResponse } from 'next/server';
import prisma from '@prisma';
import {
  getSessionUsername,
  handleApiError,
  validateBody,
} from '@/utils/apiHelpers';
import type { Workout, FuturePastWorkouts } from '@/types/api/workout';
import { CreateWorkoutSchema } from '@/schemas/api/WorkoutSchema';
import { activitiesSelect } from '@/utils/prismaSelects';
import type { CreateWorkoutRequest } from '@/schemas/api/WorkoutSchema';

export async function GET(): Promise<Response> {
  try {
    const username = await getSessionUsername();

    const now = new Date();

    const [pastWorkouts, futureWorkouts]: [Workout[], Workout[]] =
      await prisma.$transaction([
        prisma.workout.findMany({
          where: { username, startDate: { lt: now } },
          include: activitiesSelect,
          orderBy: {
            startDate: 'desc',
          },
        }),
        prisma.workout.findMany({
          where: { username, startDate: { gte: now } },
          include: activitiesSelect,
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

export async function POST(request: Request): Promise<Response> {
  try {
    const username = await getSessionUsername();

    const body: CreateWorkoutRequest = await validateBody(
      CreateWorkoutSchema,
      await request.json()
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
      include: activitiesSelect,
    });

    return NextResponse.json<Workout>(newWorkout, { status: 201 });
  } catch (err) {
    console.error('Adding Workout error:', err);
    return handleApiError(err);
  }
}
