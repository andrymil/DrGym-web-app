import { NextResponse } from 'next/server';
import prisma from '@prisma';
import {
  ApiError,
  getSessionUsername,
  handleApiError,
  validateBody,
  getParamId,
} from '@/utils/apiHelpers';
import type { Workout } from '@/types/api/workout';
import { EditWorkoutSchema } from '@/schemas/api/WorkoutSchema';
import { activitiesSelect } from '@/utils/prismaSelects';
import type { EditWorkoutRequest } from '@/schemas/api/WorkoutSchema';
import type { ParamsProp } from '@/utils/apiHelpers';

export async function PATCH(
  request: Request,
  { params }: ParamsProp
): Promise<Response> {
  try {
    const username = await getSessionUsername();

    const body: EditWorkoutRequest = await validateBody(
      EditWorkoutSchema,
      await request.json()
    );

    const id = await getParamId(params);

    const {
      startDate,
      endDate,
      description,
      schedule,
      activitiesToAdd,
      activitiesToDelete,
    } = body;

    const transactionResults = await prisma.$transaction([
      prisma.workout.update({
        where: { id, username },
        data: {
          startDate,
          endDate,
          description,
          schedule,
        },
      }),

      ...(activitiesToDelete?.length
        ? [
            prisma.activity.deleteMany({
              where: {
                id: { in: activitiesToDelete },
                workoutId: id,
              },
            }),
          ]
        : []),

      ...(activitiesToAdd?.length
        ? [
            prisma.activity.createMany({
              data: activitiesToAdd.map((activity) => ({
                workoutId: id,
                exerciseId: activity.exercise.id,
                reps: activity.reps,
                weight: activity.weight,
                duration: activity.duration,
              })),
            }),
          ]
        : []),

      prisma.workout.findFirst({
        where: { id, username },
        include: activitiesSelect,
      }),
    ]);

    const updatedWorkout = transactionResults[
      transactionResults.length - 1
    ] as Workout;

    if (!updatedWorkout) {
      throw new ApiError('Workout not found', 404);
    }

    return NextResponse.json<Workout>(updatedWorkout, { status: 200 });
  } catch (err) {
    console.error('Editing Workout error:', err);
    return handleApiError(err);
  }
}

export async function DELETE(
  _request: Request,
  { params }: ParamsProp
): Promise<Response> {
  try {
    const username = await getSessionUsername();
    const id = await getParamId(params);

    const workout = await prisma.workout.findFirst({
      where: { id, username },
      select: { id: true },
    });

    if (!workout) {
      throw new ApiError('Workout not found', 404);
    }

    await prisma.workout.delete({
      where: { id, username },
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Deleting Workout error:', err);
    return handleApiError(err);
  }
}
