import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WorkoutForm from '@/components/WorkoutForm';
import WorkoutInfo from '@/components/WorkoutInfo';
import api from '@/utils/axiosInstance';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { formatDate, formatRelativeTime } from '@/utils/dateUtils';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import { useMediaQuery } from '@mui/material';

export default function WorkoutCard({
  workout,
  onDelete,
  onEditWorkout,
  disableActions,
  showAppMessage,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [loading, setLoading] = useState(false);

  const isSmallScreen = useMediaQuery('(max-width: 550px)');

  const menuOpen = Boolean(anchorEl);
  const realitveStartDate = formatRelativeTime(workout.startDate);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const deleteWorkout = async () => {
    try {
      setLoading(true);
      await api.delete(`/api/workouts/${workout.id}`);
      showAppMessage({
        status: true,
        text: 'Workout deleted successfully',
        type: 'success',
      });
      onDelete(workout.id);
    } catch (error) {
      console.error('Error deleting workout:', error);
      showAppMessage({
        status: true,
        text: 'Error deleting workout',
        type: 'error',
      });
    } finally {
      setLoading(false);
      setOpenDeleteConfirmation(false);
    }
  };

  const getIntervalDescription = (interval) => {
    switch (interval) {
      case 1:
        return 'Everyday';
      case 7:
        return 'Weekly';
      case 30:
        return 'Monthly';
      default:
        return `Every ${interval} days`;
    }
  };

  const chips = (
    <>
      <Chip
        label={workout.posted ? 'Public' : 'Private'}
        color={workout.posted ? 'success' : 'warning'}
        variant="outlined"
      />
      {workout.schedule !== 0 && (
        <Chip
          label={getIntervalDescription(workout.schedule)}
          color="info"
          variant="outlined"
          sx={{ ml: 1 }}
        />
      )}
    </>
  );

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: '1000px', margin: '0 auto', py: 2 }}>
        <Card sx={{ maxWidth: '100%' }}>
          <CardHeader
            action={
              !disableActions && (
                <IconButton aria-label="settings" onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
              )
            }
            title={
              <Grid container alignItems="center">
                <Typography variant="h5" sx={{ mr: 8 }}>
                  {formatDate(workout.startDate, 'd MMMM yyyy')}
                </Typography>
                <Box>{!isSmallScreen && chips}</Box>
              </Grid>
            }
            subheader={
              realitveStartDate.charAt(0).toUpperCase() +
              realitveStartDate.slice(1)
            }
          />
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem
              onClick={() => {
                setPopupType('edit');
                setOpenDialog(true);
              }}
            >
              <EditIcon sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                setPopupType('copy');
                setOpenDialog(true);
              }}
            >
              <ContentCopyIcon sx={{ mr: 1 }} />
              Copy
            </MenuItem>
            <MenuItem onClick={() => setOpenDeleteConfirmation(true)}>
              <DeleteForeverIcon sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
          {isSmallScreen && (
            <Box
              sx={{
                width: '100%',
                pl: 2,
                pb: 1,
              }}
            >
              {chips}
            </Box>
          )}
          <WorkoutInfo workout={workout} />
        </Card>
        <WorkoutForm
          dialogTitle={popupType === 'edit' ? 'Edit workout' : 'Copy workout'}
          popupType={popupType}
          popupStatus={openDialog}
          togglePopup={setOpenDialog}
          workout={workout}
          onEditWorkout={onEditWorkout}
          showAppMessage={showAppMessage}
        />
        <DeleteConfirmation
          message="Are you sure you want to delete this workout?"
          open={openDeleteConfirmation}
          loading={loading}
          onConfirm={deleteWorkout}
          onClose={() => setOpenDeleteConfirmation(false)}
        />
      </Box>
    </>
  );
}
