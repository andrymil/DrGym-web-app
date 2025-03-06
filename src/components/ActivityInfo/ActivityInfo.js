import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BalanceIcon from '@mui/icons-material/Balance';
import LoopIcon from '@mui/icons-material/Loop';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import Grid from '@mui/material/Grid2';
import style from './ActivityInfo.module.css';

export default function ActivityInfo({ activity }) {
  const type = activity.exerciseType;

  const typeMapping = {
    C: {
      title: 'Cardio exercise',
      icon: <MonitorHeartOutlinedIcon />,
    },
    S: {
      title: 'Strength exercise',
      icon: <FitnessCenterIcon />,
    },
    F: {
      title: 'Crossfit exercise',
      icon: <SportsGymnasticsIcon />,
    },
  };

  const firstBox =
    type === 'S' ? (
      <>
        <Tooltip title="Number of reps">
          <LoopIcon />
        </Tooltip>
        {activity.reps}
      </>
    ) : (
      <>
        <Tooltip title="Duration">
          <TimerOutlinedIcon />
        </Tooltip>
        {activity.duration}
      </>
    );

  const secondBox =
    type === 'C' ? (
      <></>
    ) : (
      <>
        <Tooltip title="Weight [kg]">
          <BalanceIcon />
        </Tooltip>
        {activity.weight}
      </>
    );

  const { title, icon } = typeMapping[type];

  return (
    <Grid
      container
      flexWrap="wrap"
      sx={{
        justifyContent: { xs: 'flex-start', sm: 'space-between' },
        maxWidth: '600px',
        mb: 3,
        mr: 3,
      }}
    >
      <Box
        sx={{ width: { xs: '100%', sm: '200px' } }}
        className={style.activityElement}
      >
        <Tooltip title={title}>{icon}</Tooltip>
        {activity.exerciseName}
      </Box>

      <Box
        sx={{ width: '100px', mr: 4, pt: { xs: 2, sm: 0 } }}
        className={style.activityElement}
      >
        {firstBox}
      </Box>
      <Box
        sx={{ width: '100px', pt: { xs: 2, sm: 0 } }}
        className={style.activityElement}
      >
        {secondBox}
      </Box>
    </Grid>
  );
}
