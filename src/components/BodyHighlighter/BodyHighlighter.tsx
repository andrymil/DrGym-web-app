import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import api from '@/utils/axiosInstance';
import Model, { IExerciseData, IMuscleStats } from 'react-body-highlighter';
// import { bodyData as mockData } from '@/utils/mockData';

type BodyHighlighterProps = {
  username: string;
};

const BodyHighlighter = ({ username }: BodyHighlighterProps) => {
  const [bodyData, setBodyData] = useState<IExerciseData[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<IMuscleStats | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBodyData = async () => {
      try {
        const response = await api.get<IExerciseData[]>(
          `/api/users/${username}/exercises?startDate=2024-01-16&endDate=2025-01-16`
        );
        setBodyData(response.data);
        // setTimeout(() => {
        //   setBodyData(mockData);
        //   setLoading(false);
        // }, 1500);
      } catch (err) {
        console.error('Error fetching BodyHighligter data', err);
        setError('Failed to load the data');
      }
    };

    void fetchBodyData();
  }, [username]);

  const handleClick = useCallback((muscleStats: IMuscleStats) => {
    setSelectedMuscle(muscleStats);
  }, []);

  const handleClose = () => {
    setSelectedMuscle(null);
  };

  return (
    <>
      {error && (
        <Typography sx={{ mb: 2 }} textAlign="center" color="error">
          {error}
        </Typography>
      )}
      <Grid container justifyContent="center">
        <Model
          data={bodyData}
          highlightedColors={['#bbdefb', '#3a88d5', '#0d47a1', '#08295e']}
          style={{ width: '15rem', padding: '1rem' }}
          onClick={handleClick}
        />
        <Model
          type="posterior"
          data={bodyData}
          highlightedColors={['#bbdefb', '#3a88d5', '#0d47a1', '#08295e']}
          style={{ width: '15rem', padding: '1rem' }}
          onClick={handleClick}
        />
      </Grid>

      <Dialog
        open={Boolean(selectedMuscle)}
        onClose={handleClose}
        aria-labelledby="muscle-dialog-title"
      >
        {selectedMuscle && (
          <>
            <DialogTitle id="muscle-dialog-title" sx={{ m: 0, p: 2 }}>
              {selectedMuscle.muscle}
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {selectedMuscle.data.frequency > 0 ? (
                <>
                  <Typography gutterBottom>
                    You&apos;ve worked out this muscle{' '}
                    <strong>{selectedMuscle.data.frequency}</strong> times.
                  </Typography>
                  <Typography variant="subtitle1">Exercises:</Typography>
                  <ul>
                    {selectedMuscle.data.exercises.map((exercise, index) => (
                      <li key={index}>{exercise}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <Typography gutterBottom>
                  You haven&apos;t worked out this muscle yet. Let&apos;s get
                  moving!
                </Typography>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default BodyHighlighter;
