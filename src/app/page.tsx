'use client';

import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import YouTubePlayer from '@/components/YouTubePlayer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import api from '@/utils/axiosInstance';
import { useMediaQuery } from '@mui/material';
import type { Exercises, ExerciseType } from '@/types/api/exercise';

const HomePage = () => {
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('strength');
  const [exerciseData, setExerciseData] = useState<Exercises>({
    cardio: [],
    strength: [],
    crossfit: [],
  });
  const isSmallScreen = useMediaQuery('(max-width: 400px)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<Exercises>('/api/exercises/by-type');
        setExerciseData(res.data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to fetch exercises');
      }
    };
    void fetchData();
  }, []);

  const handleTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: ExerciseType
  ) => {
    setExpanded(null);
    setExerciseType(newType);
  };

  const handleAccordionChange =
    (panel: number) =>
    (_event: React.SyntheticEvent<Element, Event>, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : null);
    };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome to DrGym
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ my: 2 }}>
        Explore our exercises to improve your workouts and achieve your goals.
      </Typography>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <ToggleButtonGroup
            color="info"
            value={exerciseType}
            exclusive
            onChange={handleTypeChange}
            orientation={isSmallScreen ? 'vertical' : 'horizontal'}
            aria-label="Exercise Type Selector"
          >
            <ToggleButton value="strength">
              <FitnessCenterIcon sx={{ mr: 1 }} />
              Strength
            </ToggleButton>
            <ToggleButton value="cardio">
              <MonitorHeartOutlinedIcon sx={{ mr: 1 }} />
              Cardio
            </ToggleButton>
            <ToggleButton value="crossfit">
              <SportsGymnasticsIcon sx={{ mr: 1 }} />
              CrossFit
            </ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ width: '100%', margin: '0 auto', my: 4 }}>
            {exerciseData[exerciseType].map((exercise, index) => (
              <Accordion
                key={index}
                expanded={expanded === index}
                onChange={handleAccordionChange(index)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index + 1}-content`}
                  id={`panel${index + 1}-header`}
                >
                  <Typography component="span">{exercise.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {expanded === index && exercise.videoId && (
                    <YouTubePlayer videoId={exercise.videoId} />
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </>
      )}
    </>
  );
};

export default HomePage;
