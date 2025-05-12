import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EastIcon from '@mui/icons-material/East';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ActivityInfo from '@/components/ActivityInfo';
import { formatDate, getDiffInHoursAndMinutes } from '@/utils/dateUtils';
import style from './WorkoutInfo.module.css';
import Grid from '@mui/material/Grid2';
import { getUsername } from '@/utils/localStorage';
import api from '@/utils/axiosInstance';
import type { Workout } from '@/types/api/workout';
import type { Post } from '@/types/api/post';
import type { ShowAppMessage } from '@/types/general';
import type { IconButtonProps } from '@mui/material/IconButton';

type ExpandMoreProps = IconButtonProps & {
  expand: boolean;
};

const ExpandMore = styled(({ expand, ...other }: ExpandMoreProps) => (
  <IconButton {...other} />
))(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: { expand: false },
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: { expand: true },
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

type WorkoutInfoProps = {
  workout: Workout;
  isPost?: boolean;
  post?: Post;
  showAppMessage?: ShowAppMessage;
};

export default function WorkoutInfo({
  workout,
  isPost,
  post,
  showAppMessage,
}: WorkoutInfoProps) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(post?.userReaction || false);
  const [likeCount, setLikeCount] = useState(post?.reactionCount || 0);
  const username = getUsername();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleAddLike = async () => {
    try {
      await api.post(`/api/posts/${post.id}/reactions?username=${username}`);
      setLikeCount((prev) => prev + 1);
    } catch (error) {
      setLiked(false);
      showAppMessage({
        status: true,
        text: 'Error adding like',
        type: 'error',
      });
    }
  };

  const handleRemoveLike = async () => {
    try {
      await api.delete(`/api/posts/${post.id}/reactions?username=${username}`);
      setLikeCount((prev) => {
        if (prev > 0) {
          return prev - 1;
        }
        return prev;
      });
    } catch (error) {
      setLiked(true);
      showAppMessage({
        status: true,
        text: 'Error removing like',
        type: 'error',
      });
    }
  };

  const handleLikeClick = () => {
    if (liked) {
      handleRemoveLike();
    } else {
      handleAddLike();
    }
    setLiked(!liked);
  };

  return (
    <>
      <CardContent>
        <Box className={style.workoutDateTime} sx={{ marginBottom: 4 }}>
          <Tooltip title="Start time">
            <CalendarMonthIcon sx={{ pb: '1px' }} />
          </Tooltip>
          {formatDate(workout.startDate, 'd MMM H:mm')}
          <Box
            sx={{
              display: 'flex',
              gap: '12px',
            }}
          >
            <Tooltip title="End time">
              <EastIcon />
            </Tooltip>
            {formatDate(workout.endDate, 'd MMM H:mm')}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '12px',
              ml: { xs: 0, sm: 5 },
              width: { xs: '100%', sm: '100px' },
            }}
          >
            <Tooltip title="Duration">
              <AccessTimeIcon />
            </Tooltip>
            {getDiffInHoursAndMinutes(workout.startDate, workout.endDate)}
          </Box>
        </Box>
        {workout.description && !isPost && (
          <Typography sx={{ mt: 3 }}>{workout.description}</Typography>
        )}
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <FormatListBulletedIcon sx={{ mr: '4px' }} />
        <Typography>Exercises</Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
        {isPost && (
          <Grid
            container
            alignItems="center"
            gap={2}
            sx={{ pl: 4 }}
            flexWrap="nowrap"
          >
            <IconButton
              onClick={handleLikeClick}
              sx={{
                color: liked ? 'red' : 'gray',
                '&.Mui-disabled': {
                  color: 'red',
                },
                ml: 'auto',
              }}
            >
              <FavoriteIcon />
            </IconButton>
            <Typography sx={{ ml: '-8px' }}>{likeCount}</Typography>
          </Grid>
        )}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {workout.activities.map((activity) => (
            <Box key={activity.id}>
              <Divider sx={{ mb: 3 }} />
              <ActivityInfo activity={activity} />
            </Box>
          ))}
        </CardContent>
      </Collapse>
    </>
  );
}
