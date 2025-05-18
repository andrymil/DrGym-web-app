import prisma from '@prisma';
import { NextResponse } from 'next/server';
import type { Exercise } from '@/types/api/exercise';

export async function GET(): Promise<Response> {
  try {
    const exercises: Exercise[] = await prisma.exercise.findMany({
      select: {
        id: true,
        name: true,
        videoId: true,
        type: true,
      },
    });

    return NextResponse.json<Exercise[]>(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}
