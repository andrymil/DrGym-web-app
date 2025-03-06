import React, { useState, useEffect, use } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  CircularProgress,
  Typography,
  Divider,
  Checkbox,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import axiosInstance from '@/utils/axiosInstance';
import WorkoutCard from '@/components/WorkoutCard';
import { getUsername } from '@/utils/localStorage';
import CustomInput from '@/components/CustomInput';
import { PostSchema, PostDefaultValues } from '@/utils/schemas/PostSchema';
import { useMediaQuery } from '@mui/material';

export default function PostDialog({
  title,
  type,
  post,
  open,
  onClose,
  onChange,
  showAppMessage,
}) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const fullScreen = useMediaQuery('(max-width: 900px)');

  const username = getUsername();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/workouts/private`);
        const fetchedWorkouts = response.data;

        if (type === 'edit' && post?.training) {
          setSelectedWorkout(post.training);
          setWorkouts(fetchedWorkouts.filter((w) => w.id !== post.training.id));
        } else {
          setWorkouts(fetchedWorkouts);
          setSelectedWorkout(null);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
        showAppMessage({
          status: true,
          text: 'Error fetching workouts',
          type: 'error',
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchWorkouts();
    }
  }, [open, username, type, post?.training, showAppMessage, onClose]);

  const handleAddPost = async (values, actions) => {
    try {
      actions.setSubmitting(true);
      const response = await axiosInstance.post('/api/posts/create', {
        username: username,
        title: values.title,
        content: values.description,
        workoutId: selectedWorkout.id,
      });
      showAppMessage({
        status: true,
        text: 'Post added successfully',
        type: 'success',
      });
      onChange();
      onClose();
    } catch (error) {
      console.error('Error adding post:', error);
      showAppMessage({
        status: true,
        text: 'Error adding post',
        type: 'error',
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleEditPost = async (values, actions) => {
    try {
      actions.setSubmitting(true);
      const response = await axiosInstance.put(`/api/posts/update`, {
        id: post.id,
        title: values.title,
        content: values.description,
        workoutId: selectedWorkout.id,
      });
      showAppMessage({
        status: true,
        text: 'Post edited successfully',
        type: 'success',
      });
      onChange();
      onClose();
    } catch (error) {
      console.error('Error editing post:', error);
      showAppMessage({
        status: true,
        text: 'Error editing post',
        type: 'error',
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleWorkoutSelection = (workout) => {
    if (selectedWorkout) {
      setWorkouts((prev) => [selectedWorkout, ...prev]);
    }
    if (selectedWorkout?.id === workout.id) {
      setSelectedWorkout(null);
    } else {
      setSelectedWorkout(workout);
      setWorkouts((prev) => prev.filter((w) => w.id !== workout.id));
    }
  };

  const getWorkoutMessage = () => {
    if (loading) return 'Loading workouts...';
    if (!selectedWorkout && workouts.length === 0)
      return "You don't have any private workouts. Please create one to include it in your post.";
    if (selectedWorkout && workouts.length === 0)
      return 'There are no other workouts available.';
    if (selectedWorkout)
      return 'Change your workout by selecting a different one from the list below.';
    return 'Select a workout to include in your post.';
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="new-post-dialog"
    >
      <Formik
        validationSchema={PostSchema()}
        initialValues={
          type === 'edit'
            ? {
                title: post.title,
                description: post.content,
              }
            : PostDefaultValues()
        }
        onSubmit={(values, actions) =>
          type === 'add'
            ? handleAddPost(values, actions)
            : handleEditPost(values, actions)
        }
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            <DialogTitle>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">{title}</Typography>
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container direction="column" spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !selectedWorkout}
                    endIcon={
                      isSubmitting && (
                        <CircularProgress color="secondary" size={18} />
                      )
                    }
                    sx={{ mb: 1 }}
                  >
                    {type === 'add' ? 'Add Post' : 'Edit Post'}
                  </Button>
                </Box>
                <CustomInput
                  label="Title"
                  name="title"
                  value={values.title}
                  error={errors.title}
                  touched={touched.title}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <CustomInput
                  label="Description"
                  name="description"
                  value={values.description}
                  error={errors.description}
                  touched={touched.description}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>
              {selectedWorkout && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                    Selected Workout
                  </Typography>
                  <Checkbox
                    checked
                    onChange={() => handleWorkoutSelection(selectedWorkout)}
                    sx={{ pb: 0 }}
                  />
                  <WorkoutCard workout={selectedWorkout} disableActions />
                </Box>
              )}
              <Divider sx={{ mt: 2 }} />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  {getWorkoutMessage()}
                </Typography>
                {!loading &&
                  workouts.map((workout) => (
                    <Box key={workout.id} sx={{ mb: 2 }}>
                      <Checkbox
                        checked={selectedWorkout?.id === workout.id}
                        onChange={() => handleWorkoutSelection(workout)}
                        sx={{ pb: 0 }}
                      />
                      <WorkoutCard workout={workout} disableActions />
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  ))}
              </Box>
            </DialogContent>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
