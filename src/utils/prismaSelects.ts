export const activitiesSelect = {
  activities: {
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
  },
};
