import { useState, useEffect } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Button,
  Dialog,
  Divider,
  DialogActions,
  DialogContent,
  useMediaQuery,
  IconButton,
  Tooltip,
  Typography,
  Switch,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DateTimePicker, TimeField } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import api from '@/utils/axiosInstance';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkoutFormTitle from './WorkoutFormTitle';
import ActivityInfo from '@/components/ActivityInfo';
import NumberField from '@/components/NumberField';
import {
  schema,
  strengthActivitySchema,
  cardioActivitySchema,
} from '@/utils/schemas/WorkoutSchema';
import { formatDate } from '@/utils/dateUtils';
import { getUsername } from '@/utils/localStorage';
import CustomInput from '@/components/CustomInput';
import type { Workout } from '@/types/api/workout';
import type { ShowAppMessage } from '@/types/general';
import type { Exercise } from '@/types/api/exercise';

type WorkoutFormProps = {
  dialogTitle: string;
  popupType: string;
  popupStatus: boolean;
  togglePopup: () => void;
  workout?: Workout;
  onAddWorkout?: () => Promise<void>;
  onEditWorkout?: () => Promise<void>;
  showAppMessage: ShowAppMessage;
};

type WorkoutFormValues = {
  startDate: Date | null;
  endDate: Date | null;
  description: string;
  interval: number;
  exerciseType: string;
  exercise: Exercise;
  reps: number;
  weight: number;
  duration: Date;
};

type Exercises = {
  strength: Exercise[];
  cardio: Exercise[];
  crossfit: Exercise[];
};

export default function WorkoutForm({
  dialogTitle,
  popupType,
  popupStatus,
  togglePopup,
  workout,
  onAddWorkout,
  onEditWorkout,
  showAppMessage,
}: WorkoutFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [activityList, setActivityList] = useState([]);
  const [activitiesToDelete, setActivitiesToDelete] = useState([]);
  const [isRegular, setRegular] = useState(false);
  const [exercises, setExercises] = useState<Exercises>({
    strength: [],
    cardio: [],
    crossfit: [],
  });
  const username = getUsername();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get(`/api/exercises/by-type`);
        setExercises(response.data);
      } catch (error) {
        togglePopup();
        showAppMessage({
          status: true,
          text: 'Error fetching exercises',
          type: 'error',
        });
      }
    };

    if (popupType !== 'new' && workout?.activities) {
      setRegular(workout.schedule > 0);
      setActivityList(workout.activities);
    } else {
      setRegular(false);
      setActivityList([]);
    }
    if (popupStatus) {
      fetchExercises();
    }
  }, [
    popupType,
    workout?.activities,
    workout?.schedule,
    popupStatus,
    togglePopup,
    showAppMessage,
  ]);

  const handleAddActivity = (values, setFieldValue, setErrors) => {
    const activitySchema =
      values.exerciseType === 'strength'
        ? strengthActivitySchema
        : cardioActivitySchema;
    activitySchema
      .validate(
        {
          exerciseType: values.exerciseType,
          exercise: values.exercise?.name,
          reps: String(values.reps) || null,
          weight: String(values.weight) || null,
          duration: values.duration,
        },
        { abortEarly: false }
      )
      .then(() => {
        const newActivity = {
          exerciseId: values.exercise.id,
          exerciseName: values.exercise.name,
          reps: values.reps || 0,
          weight: values.weight || 0,
          duration: values.duration
            ? formatDate(values.duration.toISOString(), 'HH:mm:ss')
            : '00:00:00',
          exerciseType:
            values.exerciseType === 'crossfit'
              ? 'F'
              : values.exerciseType.charAt(0).toUpperCase(),
        };
        setActivityList((prev) => [...prev, newActivity]);
        setFieldValue('exerciseType', '');
        setFieldValue('exercise', '');
        setFieldValue('reps', '');
        setFieldValue('weight', '');
        setFieldValue('duration', null);
        setErrors({});
      })
      .catch((validationErrors) => {
        const errors = validationErrors.inner.reduce(
          (acc, err) => ({
            ...acc,
            [err.path]: err.message,
          }),
          {}
        );
        setErrors(errors);
      });
  };

  const handleDeleteActivity = (activityId, index) => {
    setActivityList((prev) => prev.filter((_, i) => i !== index));
    if (activityId) {
      setActivitiesToDelete((prev) => [...prev, activityId]);
    }
  };

  const handleAddWorkout = async (values, actions) => {
    if (!activityList.length) {
      showAppMessage({
        status: true,
        text: 'Please add at least one exercise',
        type: 'warning',
      });
      actions.setSubmitting(false);
      return;
    }
    try {
      actions.setSubmitting(true);
      let activities;
      if (popupType === 'new') {
        activities = activityList;
      } else {
        activities = activityList.map(({ id, ...activity }) => activity);
      }

      const response = await api.post(`/api/workouts/create`, {
        username: username,
        description: values.description,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        activities: activities,
        schedule: isRegular ? values.interval : 0,
      });

      popupType === 'new' ? onAddWorkout() : onEditWorkout();
      handleClose();
      showAppMessage({
        status: true,
        text: 'Workout added successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      showAppMessage({
        status: true,
        text: 'Error adding workout',
        type: 'error',
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleEditWorkout = async (values, actions) => {
    if (!activityList.length) {
      showAppMessage({
        status: true,
        text: 'Please add at least one exercise',
        type: 'warning',
      });
      actions.setSubmitting(false);
      return;
    }
    try {
      actions.setSubmitting(true);
      const response = await api.put(`/api/workouts/update`, {
        id: workout.id,
        username: username,
        description: values.description,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        schedule: isRegular ? values.interval : 0,
        activitiesToAdd: activityList.filter((activity) => !activity.id),
        activitiesToRemove: activitiesToDelete,
      });

      onEditWorkout();
      handleClose();
      showAppMessage({
        status: true,
        text: 'Workout updated successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      showAppMessage({
        status: true,
        text: 'Error updating workout',
        type: 'error',
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleRegularChange = (values, setFieldValue) => {
    if (
      !isRegular &&
      (values.startDate < new Date() || values.endDate < new Date())
    ) {
      setFieldValue('startDate', null);
      setFieldValue('endDate', null);
      showAppMessage({
        status: true,
        text: 'Please select start and end date from the future',
        type: 'info',
      });
    }
    setFieldValue('interval', '');
    setRegular(!isRegular);
  };

  const handleClose = () => {
    togglePopup();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      open={popupStatus}
      aria-labelledby="new-workout-dialog"
    >
      <WorkoutFormTitle id="new-workout-dialog" onClose={togglePopup}>
        {dialogTitle}
      </WorkoutFormTitle>
      <Formik<WorkoutFormValues>
        initialValues={
          popupType === 'new'
            ? {
                startDate: null,
                endDate: null,
                description: '',
                interval: null,
                exerciseType: '',
                exercise: null,
                reps: null,
                weight: null,
                duration: null,
              }
            : {
                startDate: new Date(workout.startDate),
                endDate: new Date(workout.endDate),
                description: workout.description || '',
                interval: workout.schedule > 0 ? workout.schedule : null,
                exerciseType: '',
                exercise: null,
                reps: null,
                weight: null,
                duration: null,
              }
        }
        onSubmit={(values, actions) =>
          popupType === 'edit'
            ? handleEditWorkout(values, actions)
            : handleAddWorkout(values, actions)
        }
        validationSchema={schema(isRegular)}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          setFieldValue,
          isSubmitting,
          setErrors,
        }: FormikProps<WorkoutFormValues>) => (
          <Form>
            <DialogContent sx={{ p: 3 }}>
              <Box sx={{ mt: -2, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isRegular}
                      onChange={() =>
                        handleRegularChange(values, setFieldValue)
                      }
                      aria-label="Regular"
                      color="secondary"
                    />
                  }
                  label="Repeat this workout"
                />
                {isRegular && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label={errors.interval || 'Interval (days)'}
                      name="interval"
                      type="number"
                      value={values.interval}
                      onBlur={handleBlur}
                      error={!!errors.interval}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        if (!value || parseInt(value, 10) >= 0) {
                          handleChange(e);
                        }
                      }}
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          onKeyDown: (
                            e: React.KeyboardEvent<HTMLInputElement>
                          ) => {
                            if (e.key === '-' || e.key === 'e') {
                              e.preventDefault();
                            }
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
              {isRegular && (
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ mb: 1 }}
                >
                  You can only select start and end date from the future
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    name="startDate"
                    value={values.startDate}
                    maxDateTime={values.endDate || undefined}
                    disablePast={isRegular}
                    onChange={(newValue) => {
                      setFieldValue('startDate', newValue);
                    }}
                    label={
                      typeof errors.startDate === 'string' &&
                      !!errors.startDate &&
                      (!!touched.startDate || !!values.startDate)
                        ? errors.startDate
                        : 'Start Date'
                    }
                    slotProps={{
                      textField: {
                        onBlur: handleBlur,
                        error:
                          !!errors.startDate &&
                          (!!touched.startDate || !!values.startDate),
                      },
                    }}
                  />
                  <DateTimePicker
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    name="endDate"
                    value={values.endDate}
                    minDateTime={values.startDate || undefined}
                    disablePast={isRegular}
                    onChange={(newValue) => {
                      setFieldValue('endDate', newValue);
                    }}
                    label={
                      typeof errors.endDate === 'string' &&
                      !!errors.endDate &&
                      (!!touched.endDate || !!values.endDate)
                        ? errors.endDate
                        : 'End Date'
                    }
                    slotProps={{
                      textField: {
                        onBlur: handleBlur,
                        error:
                          !!errors.endDate &&
                          (!!touched.endDate || !!values.endDate),
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ my: 2 }}>
                <CustomInput
                  label="Description"
                  name="description"
                  type="text"
                  value={values.description}
                  errorStr={errors.description}
                  touched={!!touched.description}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  tabIndex={3}
                  multiline
                />
              </Box>
              {popupType !== 'new' && (
                <>
                  <Divider sx={{ mb: 2, mt: 1 }} />
                  <Typography variant="h6" sx={{ mt: 0 }}>
                    Add another exercise
                  </Typography>
                </>
              )}
              <FormControl sx={{ mt: 2 }} fullWidth>
                <FormLabel error={!!errors.exerciseType}>
                  {errors.exerciseType || 'Exercise Type'}
                </FormLabel>
                <RadioGroup
                  row
                  name="exerciseType"
                  value={values.exerciseType}
                  onChange={(e) => {
                    setFieldValue('exerciseType', e.target.value);
                    setFieldValue('exercise', '');
                    setFieldValue('reps', '');
                    setFieldValue('weight', '');
                    setFieldValue('duration', null);
                  }}
                >
                  <FormControlLabel
                    value="strength"
                    control={<Radio />}
                    label="Strength"
                  />
                  <FormControlLabel
                    value="cardio"
                    control={<Radio />}
                    label="Cardio"
                  />
                  <FormControlLabel
                    value="crossfit"
                    control={<Radio />}
                    label="Crossfit"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.exercise}>
                <Autocomplete
                  options={
                    values.exerciseType === 'strength'
                      ? exercises.strength
                      : values.exerciseType === 'cardio'
                        ? exercises.cardio
                        : exercises.crossfit
                  }
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  disabled={!values.exerciseType}
                  value={values.exercise || null}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: 'exercise',
                        value: newValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        (typeof errors.exercise === 'string' &&
                          errors.exercise) ||
                        'Exercise'
                      }
                      error={!!errors.exercise}
                      name="exercise"
                      onBlur={handleBlur}
                    />
                  )}
                />
              </FormControl>

              {values.exerciseType === 'strength' && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <NumberField
                    label={errors.reps || 'Reps'}
                    name="reps"
                    type="number"
                    value={values.reps}
                    onBlur={handleBlur}
                    error={!!errors.reps}
                    handleChange={handleChange}
                  />
                  <NumberField
                    label={errors.weight || 'Weight (kg)'}
                    name="weight"
                    type="number"
                    value={values.weight}
                    onBlur={handleBlur}
                    error={!!errors.weight}
                    handleChange={handleChange}
                  />
                </Box>
              )}

              {values.exerciseType === 'cardio' && (
                <Box sx={{ mt: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimeField
                      format="HH:mm:ss"
                      value={values.duration}
                      onChange={(newValue) =>
                        setFieldValue('duration', newValue)
                      }
                      label={
                        (typeof errors.duration === 'string' &&
                          errors.duration) ||
                        'Duration'
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.duration,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              )}

              {values.exerciseType === 'crossfit' && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimeField
                      format="HH:mm:ss"
                      value={values.duration}
                      onChange={(newValue) =>
                        setFieldValue('duration', newValue)
                      }
                      label={
                        (typeof errors.duration === 'string' &&
                          errors.duration) ||
                        'Duration'
                      }
                      slotProps={{
                        textField: {
                          error: !!errors.duration,
                        },
                      }}
                    />
                  </LocalizationProvider>
                  <NumberField
                    label={errors.weight || 'Weight (kg)'}
                    name="weight"
                    type="number"
                    value={values.weight}
                    onBlur={handleBlur}
                    error={!!errors.weight}
                    handleChange={handleChange}
                  />
                </Box>
              )}

              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="secondary"
                onClick={() =>
                  handleAddActivity(values, setFieldValue, setErrors)
                }
              >
                Add Exercise
              </Button>
              {activityList.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    List of exercises
                  </Typography>
                </>
              )}
              {activityList.map(({ exerciseId, ...activity }, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      mt: 2,
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <ActivityInfo activity={activity} />
                    </Box>
                    <Tooltip title="Delete exercise">
                      <IconButton
                        edge="end"
                        color="error"
                        sx={{ mr: 1 }}
                        onClick={() => handleDeleteActivity(activity.id, index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                </Box>
              ))}
            </DialogContent>
            <DialogActions sx={{ px: 2, pb: 2, pt: 0 }}>
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={popupType === 'edit' ? <EditIcon /> : <AddIcon />}
                endIcon={
                  isSubmitting && (
                    <CircularProgress color="secondary" size={18} />
                  )
                }
              >
                {dialogTitle}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
