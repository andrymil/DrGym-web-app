'use client';

import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import api from '@/utils/axiosInstance';
import WorkoutCard from '@/components/WorkoutCard';
import AddIcon from '@mui/icons-material/Add';
import WorkoutForm from '@/components/WorkoutForm';
import { withSnackbar } from '@/utils/snackbarProvider';
import SkeletonCard from '@/components/SkeletonCard';
import Grid from '@mui/material/Grid2';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { getUsername } from '@/utils/localStorage';

const Workouts = ({ showAppMessage }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workoutsData, setWorkoutsData] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromFuture, setFromFuture] = useState(true);
  const username = getUsername();

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/me/workouts');
      setAllWorkouts(response.data);
      setFromFuture(true);
      setWorkoutsData([...response.data.futureWorkouts].reverse());
    } catch (err) {
      setError('fetch workouts', err.message);
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
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDeleteWorkout = (id) => {
    setWorkoutsData((prev) => prev.filter((workout) => workout.id !== id));
  };

  const handleTypeChange = (event, newType) => {
    if (newType === 'future') {
      setWorkoutsData([...allWorkouts.futureWorkouts].reverse());
      setFromFuture(true);
    } else {
      setWorkoutsData(allWorkouts.pastWorkouts);
      setFromFuture(false);
    }
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
        togglePopup={setDialogOpen}
        onAddWorkout={fetchWorkouts}
        showAppMessage={showAppMessage}
      />
    </>
  );
};

export default withSnackbar(Workouts);
