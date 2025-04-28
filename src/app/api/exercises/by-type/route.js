import prisma from '@prisma';

export async function GET() {
  try {
    const allExercises = await prisma.exercise.findMany({
      select: {
        name: true,
        videoId: true,
        type: true,
      },
    });

    const grouped = {
      strength: [],
      cardio: [],
      crossfit: [],
    };

    allExercises.forEach((exercise) => {
      if (grouped[exercise.type]) {
        grouped[exercise.type].push({
          name: exercise.name,
          videoId: exercise.videoId,
        });
      }
    });

    return new Response(JSON.stringify(grouped), { status: 200 });
  } catch (err) {
    console.error('Error fetching exercises:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch exercises' }),
      { status: 500 }
    );
  }
}
