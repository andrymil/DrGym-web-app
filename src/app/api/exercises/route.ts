import prisma from '@prisma';

export async function GET() {
  try {
    const exercises = await prisma.exercise.findMany();
    return Response.json(exercises, { status: 200 });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return Response.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}
