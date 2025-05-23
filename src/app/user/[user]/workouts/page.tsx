'use client';

import { Button, Typography } from '@mui/material';
import { MouseEvent, useEffect, useState, useCallback } from 'react';
import api from '@/utils/axiosInstance';
import WorkoutCard from '@/components/WorkoutCard';
import AddIcon from '@mui/icons-material/Add';
import WorkoutForm from '@/components/WorkoutForm';
import { withSnackbar } from '@/utils/snackbarProvider';
import SkeletonCard from '@/components/SkeletonCard';
import Grid from '@mui/material/Grid2';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { Workout, FuturePastWorkouts } from '@/types/api/workout';
import type { WithAppMessage } from '@/types/general';

const Workouts = ({ showAppMessage }: WithAppMessage) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workoutsData, setWorkoutsData] = useState<Workout[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<FuturePastWorkouts>({
    futureWorkouts: [],
    pastWorkouts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromFuture, setFromFuture] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<FuturePastWorkouts>('/api/me/workouts');
      const data = response.data;
      setAllWorkouts(data);
      setFromFuture(true);
      setWorkoutsData([...data.futureWorkouts].reverse());
    } catch (err) {
      console.error('Error fetching workouts', err);
      setError('Failed to fetch workouts. Please try again later.');
      showAppMessage({
        status: true,
        text: 'Error fetching workouts',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [showAppMessage]);

  useEffect(() => {
    void fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDeleteWorkout = (id: number) => {
    setWorkoutsData((prev) => prev.filter((workout) => workout.id !== id));
  };

  const handleTypeChange = (
    _event: MouseEvent<HTMLElement>,
    newType: string
  ) => {
    if (newType === 'future') {
      setWorkoutsData([...allWorkouts.futureWorkouts].reverse());
      setFromFuture(true);
    } else {
      setWorkoutsData(allWorkouts.pastWorkouts);
      setFromFuture(false);
    }
  };

  const togglePopup = () => {
    setDialogOpen((old) => !old);
  };

  if (error) return <Typography>Error: {error}</Typography>;
  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: 1, pb: 2 }}
      >
        <ToggleButtonGroup
          color="info"
          value={fromFuture ? 'future' : 'past'}
          exclusive
          onChange={handleTypeChange}
          aria-label="Which workouts to show"
        >
          <ToggleButton value="future">Future workouts</ToggleButton>
          <ToggleButton value="past">Old workouts</ToggleButton>
        </ToggleButtonGroup>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ width: { xs: '100%', sm: 'auto' }, mt: { xs: 2, sm: 0 } }}
        >
          Add workout
        </Button>
      </Grid>
      <Grid container direction="column" alignItems="center">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : workoutsData.length === 0 ? (
          <Typography variant="h6">
            {fromFuture
              ? "You don't have any workouts planned"
              : "You don't have any past workouts"}
          </Typography>
        ) : (
          workoutsData.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onDelete={handleDeleteWorkout}
              onEditWorkout={fetchWorkouts}
              showAppMessage={showAppMessage}
            />
          ))
        )}
      </Grid>
      <WorkoutForm
        dialogTitle="Add workout"
        popupType="new"
        popupStatus={dialogOpen}
        togglePopup={togglePopup}
        onAddWorkout={fetchWorkouts}
        showAppMessage={showAppMessage}
      />
    </>
  );
};

export default withSnackbar(Workouts);
