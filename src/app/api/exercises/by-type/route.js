import prisma from '@prisma';

export async function GET() {
  try {
    const allExercises = await prisma.exercises.findMany({
      select: {
        name: true,
        video_id: true,
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
          videoId: exercise.video_id,
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
