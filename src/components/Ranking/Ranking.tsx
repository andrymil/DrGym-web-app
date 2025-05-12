'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/axiosInstance';
import {
  Autocomplete,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';
import { ShowAppMessage } from '@/types/general';

type RankingProps = {
  username: string;
  showAppMessage: ShowAppMessage;
};

export default function Ranking({ username, showAppMessage }: RankingProps) {
  const [loading, setLoading] = useState(true);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [error, setError] = useState(null);
  const [exerciseType, setExerciseType] = useState('strength');
  const [exercise, setExercise] = useState('');
  const [exercisesNames, setExercisesNames] = useState({});
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/exercises/with-ranking`);
        setExercisesNames(response.data);
      } catch (err) {
        console.error('Error fetching exercises', err);
        setError('Failed to fetch exercises');
        showAppMessage({
          status: true,
          text: 'Something went wrong',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [showAppMessage]);

  useEffect(() => {
    const fetchRanking = async (exercise) => {
      try {
        setLoadingRanking(true);
        const response = await api.get(
          `/api/users/${username}/ranking?exerciseId=${exercise.id}`
        );
        setRanking(response.data);
      } catch (err) {
        console.error('Error fetching ranking', err);
        setError('Failed to fetch ranking');
        showAppMessage({
          status: true,
          text: 'Something went wrong',
          type: 'error',
        });
      } finally {
        setLoadingRanking(false);
      }
    };
    if (exercise) {
      fetchRanking(exercise);
    } else if (exercisesNames[exerciseType]?.length > 0) {
      fetchRanking(exercisesNames[exerciseType][0]);
    }
  }, [exercise, exerciseType, exercisesNames, username, showAppMessage]);

  if (loading) {
    return <Typography textAlign="center">Loading rankings...</Typography>;
  }
  if (error) {
    return (
      <Typography textAlign="center" color="error">
        {error}
      </Typography>
    );
  }

  const renderRanking = () => {
    if (!ranking || ranking.length === 0) {
      return (
        <Typography textAlign="center" color="textSecondary">
          No rankings available for this exercise.
        </Typography>
      );
    }

    return (
      <List>
        {ranking.map((user, index) => {
          let icon = null;
          let avatarStyle = {};

          if (index === 0) {
            icon = <EmojiEventsIcon sx={{ color: 'white' }} />;
            avatarStyle = { bgcolor: 'gold' };
          } else if (index === 1) {
            icon = <MilitaryTechIcon sx={{ color: 'black' }} />;
            avatarStyle = { bgcolor: 'silver' };
          } else if (index === 2) {
            icon = <StarIcon sx={{ color: 'white' }} />;
            avatarStyle = { bgcolor: '#CD7F32' };
          }

          return (
            <ListItem key={user.username}>
              <ListItemAvatar>
                <Avatar sx={avatarStyle}>{icon || index + 1}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link href={`/user/${user.username}`} passHref>
                    <Typography
                      sx={{
                        color: 'inherit',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {user.username}
                    </Typography>
                  </Link>
                }
                secondary={`Max Weight: ${user.max_weight} kg`}
              />
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Box
      sx={{
        minWidth: {
          xs: '100%',
          md: '308px',
        },
        pt: {
          xs: 2,
          md: 0,
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        Rankings
      </Typography>
      <ToggleButtonGroup
        color="info"
        value={exerciseType}
        exclusive
        onChange={(event, newType) => {
          setExerciseType(newType);
          setExercise('');
        }}
        aria-label="Exercise Type Selector"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="strength">
          <FitnessCenterIcon sx={{ mr: 1 }} />
          Strength
        </ToggleButton>
        <ToggleButton value="crossfit">
          <SportsGymnasticsIcon sx={{ mr: 1 }} />
          CrossFit
        </ToggleButton>
      </ToggleButtonGroup>
      {exercisesNames[exerciseType].length ? (
        <Autocomplete
          options={exercisesNames[exerciseType]}
          getOptionLabel={(option) => option.name || ''}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          value={exercise || exercisesNames[exerciseType][0]}
          onChange={(event, newValue) => {
            setExercise(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label={'Exercise'} name="exercise" />
          )}
          sx={{ mt: 1 }}
        />
      ) : (
        <Typography color="textSecondary">
          There are no rankings yet for this type of exercise
        </Typography>
      )}
      {loadingRanking ? (
        <Typography textAlign="center">Loading ranking...</Typography>
      ) : (
        renderRanking()
      )}
    </Box>
  );
}
