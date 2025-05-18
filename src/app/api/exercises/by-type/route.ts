import prisma from '@prisma';
import { NextResponse } from 'next/server';
import type { Exercise, Exercises } from '@/types/api/exercise';

export async function GET(): Promise<Response> {
  try {
    const allExercises: Exercise[] = await prisma.exercise.findMany({
      select: {
        id: true,
        name: true,
        videoId: true,
        type: true,
      },
    });

    const grouped: Exercises = {
      strength: [],
      cardio: [],
      crossfit: [],
    };

    allExercises.forEach((exercise) => {
      if (grouped[exercise.type]) {
        grouped[exercise.type].push(exercise);
      }
    });

    return NextResponse.json<Exercises>(grouped);
  } catch (err) {
    console.error('Error fetching exercises:', err);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}
