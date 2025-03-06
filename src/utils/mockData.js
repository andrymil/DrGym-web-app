import { requestToBodyStream } from 'next/dist/server/body-streams';

const videos = {
  cardio: [
    {
      name: 'Sprinting',
      videoId: '_JoblP7fggo',
    },
    {
      name: 'Jogging',
      videoId: 'NH4bYCenMxQ',
    },
    {
      name: 'Cycling',
      videoId: 'okNiCOOAHLE',
    },
  ],
  strength: [
    {
      name: 'Pull up',
      videoId: 'okNiCOOAHLE',
    },
    {
      name: 'Machine tricep extension',
      videoId: '_JoblP7fggo',
    },
    {
      name: 'Barbell squat',
      videoId: 'NH4bYCenMxQ',
    },
  ],
  crossfit: [
    {
      name: 'Burpees',
      videoId: 'NH4bYCenMxQ',
    },
    {
      name: 'Kettlebell swings',
      videoId: '_JoblP7fggo',
    },
    {
      name: 'Wall balls',
      videoId: 'okNiCOOAHLE',
    },
  ],
};

const cardioExercises = [
  {
    exerciseId: 71,
    exerciseName: 'sprinting',
  },
  {
    exerciseId: 69,
    exerciseName: 'jogging',
  },
  {
    exerciseId: 73,
    exerciseName: 'cycling',
  },
];
const strengthExercises = [
  {
    exerciseId: 29,
    exerciseName: 'pull up',
  },
  {
    exerciseId: 57,
    exerciseName: 'sit ups',
  },
  {
    exerciseId: 39,
    exerciseName: 'barbell squat',
  },
];

const friends = {
  requests: [{ username: 'szolim', avatar: null }],
  friends: [
    { username: 'skuter', avatar: null },
    { username: 'pedziwiatr', avatar: null },
  ],
};

const bodyData = [
  { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { name: 'Machine chest press', muscles: ['chest'] },
  { name: 'Push Up', muscles: ['chest', 'triceps'] },
  {
    name: 'Back',
    muscles: ['triceps', 'upper-back', 'upper-back', 'lower-back'],
  },
  {
    name: 'Legs',
    muscles: ['gluteal', 'quadriceps', 'quadriceps', 'calves'],
  },
  {
    name: 'Legs',
    muscles: ['gluteal', 'quadriceps', 'quadriceps', 'calves'],
  },
];

const calendarData = [
  { date: '2024-01-01', count: 2, level: 1 },
  { date: '2024-06-05', count: 3, level: 2 },
  { date: '2024-01-06', count: 2, level: 2 },
  { date: '2024-04-07', count: 3, level: 2 },
  { date: '2024-01-08', count: 5, level: 1 },
  { date: '2024-10-02', count: 8, level: 2 },
  { date: '2024-07-10', count: 10, level: 3 },
  { date: '2024-01-11', count: 1, level: 1 },
  { date: '2024-09-12', count: 4, level: 1 },
  { date: '2024-10-13', count: 5, level: 2 },
  { date: '2024-11-14', count: 5, level: 2 },
  { date: '2024-01-15', count: 10, level: 3 },
  { date: '2024-09-16', count: 1, level: 3 },
  { date: '2024-04-17', count: 8, level: 2 },
  { date: '2024-12-19', count: 9, level: 2 },
  { date: '2024-06-15', count: 2, level: 3 },
  { date: '2024-11-21', count: 10, level: 3 },
  { date: '2024-12-23', count: 7, level: 2 },
  { date: '2024-07-24', count: 10, level: 1 },
  { date: '2024-01-25', count: 4, level: 1 },
  { date: '2024-03-26', count: 6, level: 3 },
  { date: '2024-07-27', count: 7, level: 3 },
  { date: '2024-08-28', count: 1, level: 1 },
  { date: '2024-01-31', count: 8, level: 3 },
  { date: '2024-05-25', count: 9, level: 2 },
  { date: '2024-06-17', count: 10, level: 3 },
  { date: '2024-05-03', count: 1, level: 1 },
  { date: '2024-02-05', count: 4, level: 3 },
  { date: '2024-08-06', count: 5, level: 2 },
  { date: '2024-02-10', count: 9, level: 2 },
  { date: '2024-02-11', count: 5, level: 2 },
  { date: '2024-03-15', count: 8, level: 2 },
  { date: '2024-02-17', count: 6, level: 2 },
  { date: '2024-09-19', count: 1, level: 1 },
  { date: '2024-02-22', count: 9, level: 3 },
  { date: '2024-03-01', count: 7, level: 3 },
  { date: '2024-03-05', count: 7, level: 2 },
  { date: '2024-03-07', count: 6, level: 1 },
  { date: '2024-03-12', count: 3, level: 2 },
  { date: '2024-03-15', count: 4, level: 2 },
  { date: '2024-03-23', count: 1, level: 3 },
  { date: '2024-04-01', count: 8, level: 3 },
  { date: '2024-04-07', count: 2, level: 1 },
  { date: '2024-04-13', count: 6, level: 1 },
  { date: '2024-04-17', count: 1, level: 2 },
  { date: '2024-04-23', count: 8, level: 3 },
  { date: '2024-04-25', count: 8, level: 1 },
  { date: '2024-05-05', count: 6, level: 1 },
  { date: '2024-05-08', count: 9, level: 1 },
  { date: '2024-05-15', count: 10, level: 1 },
  { date: '2024-06-03', count: 8, level: 1 },
  { date: '2024-06-10', count: 10, level: 1 },
  { date: '2024-07-03', count: 6, level: 1 },
  { date: '2024-08-01', count: 8, level: 3 },
  { date: '2024-08-14', count: 5, level: 1 },
  { date: '2024-09-13', count: 10, level: 2 },
  { date: '2024-09-20', count: 7, level: 2 },
  { date: '2024-10-23', count: 10, level: 3 },
  { date: '2024-10-30', count: 8, level: 3 },
  { date: '2024-11-12', count: 4, level: 2 },
  { date: '2024-11-25', count: 6, level: 2 },
  { date: '2024-12-05', count: 3, level: 1 },
  { date: '2024-12-20', count: 9, level: 3 },
  { date: '2024-12-31', count: 10, level: 3 },
];

export {
  videos,
  bodyData,
  cardioExercises,
  strengthExercises,
  calendarData,
  friends,
};

// const calendarData = [
//   { date: '2024-01-01', count: 2, level: 1 },
//   { date: '2024-01-05', count: 3, level: 2 },
//   { date: '2024-01-06', count: 2, level: 2 },
//   { date: '2024-01-07', count: 3, level: 2 },
//   { date: '2024-01-08', count: 5, level: 1 },
//   { date: '2024-01-09', count: 8, level: 2 },
//   { date: '2024-01-10', count: 10, level: 3 },
//   { date: '2024-01-11', count: 1, level: 1 },
//   { date: '2024-01-12', count: 4, level: 1 },
//   { date: '2024-01-13', count: 5, level: 2 },
//   { date: '2024-01-14', count: 5, level: 2 },
//   { date: '2024-01-15', count: 10, level: 3 },
//   { date: '2024-01-16', count: 1, level: 3 },
//   { date: '2024-01-17', count: 8, level: 2 },
//   { date: '2024-01-19', count: 9, level: 2 },
//   { date: '2024-01-20', count: 2, level: 3 },
//   { date: '2024-01-21', count: 10, level: 3 },
//   { date: '2024-01-23', count: 7, level: 2 },
//   { date: '2024-01-24', count: 10, level: 1 },
//   { date: '2024-01-25', count: 4, level: 1 },
//   { date: '2024-01-26', count: 6, level: 3 },
//   { date: '2024-01-27', count: 7, level: 3 },
//   { date: '2024-01-28', count: 1, level: 1 },
//   { date: '2024-01-31', count: 8, level: 3 },
//   { date: '2024-02-01', count: 9, level: 2 },
//   { date: '2024-02-02', count: 10, level: 3 },
//   { date: '2024-02-03', count: 1, level: 1 },
//   { date: '2024-02-05', count: 4, level: 3 },
//   { date: '2024-02-06', count: 5, level: 2 },
//   { date: '2024-02-10', count: 9, level: 2 },
//   { date: '2024-02-11', count: 5, level: 2 },
//   { date: '2024-02-15', count: 8, level: 2 },
//   { date: '2024-02-17', count: 6, level: 2 },
//   { date: '2024-02-19', count: 1, level: 1 },
//   { date: '2024-02-22', count: 9, level: 3 },
//   { date: '2024-03-01', count: 7, level: 3 },
//   { date: '2024-03-05', count: 7, level: 2 },
//   { date: '2024-03-07', count: 6, level: 1 },
//   { date: '2024-03-12', count: 3, level: 2 },
//   { date: '2024-03-15', count: 4, level: 2 },
//   { date: '2024-03-23', count: 1, level: 3 },
//   { date: '2024-04-01', count: 8, level: 3 },
//   { date: '2024-04-07', count: 2, level: 1 },
//   { date: '2024-04-13', count: 6, level: 1 },
//   { date: '2024-04-17', count: 1, level: 2 },
//   { date: '2024-04-23', count: 8, level: 3 },
//   { date: '2024-04-25', count: 8, level: 1 },
//   { date: '2024-05-05', count: 6, level: 1 },
//   { date: '2024-05-08', count: 9, level: 1 },
//   { date: '2024-05-15', count: 10, level: 1 },
//   { date: '2024-06-03', count: 8, level: 1 },
//   { date: '2024-06-10', count: 10, level: 1 },
//   { date: '2024-07-03', count: 6, level: 1 },
//   { date: '2024-08-01', count: 8, level: 3 },
//   { date: '2024-09-13', count: 10, level: 2 },
//   { date: '2024-10-23', count: 10, level: 3 },
//   { date: '2024-11-12', count: 4, level: 2 },
// ];

// let workoutsData = [
//   {
//     workoutId: 12345,
//     startDate: '2024-11-01T17:41',
//     endDate: '2024-11-02T20:41',
//     description: 'This is a workout description.',
//     activities: [
//       {
//         activityId: 1,
//         exerciseName: 'Lat Pulldown',
//         weight: 100,
//         reps: 4,
//       },
//       {
//         activityId: 2,
//         exerciseName: 'Treadmill',
//         duration: '1:00:00',
//       },
//     ],
//   },
//   {
//     workoutId: 67890,
//     startDate: '2024-12-02T20:35',
//     endDate: '2024-12-02T20:41',
//     description: 'Leg day workout!',
//     activities: [
//       {
//         activityId: 4,
//         exerciseName: 'Lunges',
//         weight: 50,
//         reps: 3,
//       },
//     ],
//   },
//   {
//     workoutId: 67891,
//     startDate: '2024-12-02T17:41',
//     endDate: '2024-12-02T20:41',
//     activities: [
//       {
//         activityId: 3,
//         exerciseName: 'Squats',
//         duration: '0:20:15',
//       },
//     ],
//   },
// ];
