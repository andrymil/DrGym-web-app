'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Typography, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { withSnackbar } from '@/utils/snackbarProvider';
import CustomInput from '@/components/CustomInput';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import NumberField from '@/components/NumberField';
import {
  AccountSchema,
  AccountDefaultValues,
} from '@/utils/schemas/AccountSchema';
import api from '@/utils/axiosInstance';
import { getUsername, getAvatar } from '@/utils/localStorage';
import { signOut } from 'next-auth/react';
import { removeUserData } from '@/utils/localStorage';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import { HexColorPicker } from 'react-colorful';
import CustomAvatar from '@/components/CustomAvatar';
import { stringToColor } from '@/utils/avatar';
import { useRouter } from 'next/navigation';

const AccountPage = ({ showAppMessage }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState(getAvatar() || '#b01919');
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const username = getUsername();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const userResponse = await api.get(`/api/users/${username}`);
        setUserData({
          ...userResponse.data,
          firstName: userResponse.data.name,
        });
        const userAvatar = userResponse.data.avatar || stringToColor(username);
        setColor(userAvatar);
        localStorage.setItem('avatar', userAvatar);
        const exercisesResponse = await api.get('/api/exercises/by-type');
        const exerciseData = [
          ...exercisesResponse.data.strength,
          ...exercisesResponse.data.cardio,
          ...exercisesResponse.data.crossfit,
        ];
        userResponse.data.favoriteExercise = exerciseData.find(
          (exercise) => exercise.id === userResponse.data.favoriteExercise
        );
        setExercises(exerciseData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Could not fetch user data');
        showAppMessage({
          status: true,
          text: 'Something went wrong',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, showAppMessage]);

  const handleResetFields = (resetForm) => {
    resetForm();
    setColor(getAvatar() || '#b01919');
    setHasChanges(false);
  };

  const handleUpdateAccount = async (formData) => {
    try {
      setSubmitting(true);
      await api.put(`/api/users/update`, {
        ...formData,
        name: formData.firstName,
        favoriteExercise: formData.exercise?.id,
        avatar: color,
      });
      localStorage.setItem('avatar', color);
      showAppMessage({
        status: true,
        text: 'Account updated successfully',
        type: 'success',
      });
      setHasChanges(false);
      router.refresh();
    } catch (err) {
      console.error('Error updating account:', err);
      showAppMessage({
        status: true,
        text: 'Failed to update account',
        type: 'error',
      });
    } finally {
      setSubmitting(true);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await api.delete(`/api/users/${username}`);
      removeUserData();
      signOut();
    } catch (err) {
      console.error('Error deleting account:', err);
      setDeleting(false);
      showAppMessage({
        status: true,
        text: 'Failed to delete account',
        type: 'error',
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;
  return (
    <>
      <Grid container direction="column">
        <Typography variant="h5" sx={{ my: 2 }}>
          Account Settings
        </Typography>
        <Formik
          validationSchema={AccountSchema}
          initialValues={AccountDefaultValues(userData)}
          onSubmit={handleUpdateAccount}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            resetForm,
          }) => (
            <Form>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                gap={4}
                sx={{ mt: 2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    width: {
                      xs: '100%',
                      md: '50%',
                    },
                  }}
                  textAlign="center"
                >
                  <Box
                    sx={{
                      marginRight: {
                        xs: 0,
                        sm: 4,
                      },
                      width: {
                        xs: '100%',
                        sm: '150px',
                      },
                    }}
                  >
                    <CustomAvatar
                      username={username}
                      color={color}
                      sx={{
                        width: 100,
                        height: 100,
                        fontSize: 40,
                        margin: '0 auto',
                      }}
                    />
                    <Typography variant="h5" sx={{ my: 2 }}>
                      <strong>{username}</strong>
                    </Typography>
                  </Box>
                  <HexColorPicker
                    color={color}
                    onChange={(color) => {
                      setHasChanges(true);
                      setColor(color);
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    flexGrow: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    maxWidth: {
                      xs: '100%',
                      sm: '80%',
                      md: '50%',
                    },
                  }}
                >
                  <CustomInput
                    label="First Name"
                    name="firstName"
                    value={values.firstName}
                    errorStr={errors.firstName}
                    touched={!!touched.firstName}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setHasChanges(true);
                    }}
                    tabIndex={3}
                  />
                  <CustomInput
                    label="Surname"
                    name="surname"
                    value={values.surname}
                    errorStr={errors.surname}
                    touched={!!touched.surname}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setHasChanges(true);
                    }}
                    tabIndex={4}
                  />
                  <NumberField
                    label={
                      errors.weight ? 'Weight - ' + errors.weight : 'Weight'
                    }
                    name="weight"
                    type="number"
                    value={values.weight}
                    onBlur={handleBlur}
                    error={!!errors.weight}
                    sx={{ width: '100%' }}
                    handleChange={handleChange}
                    setHasChanges={setHasChanges}
                  />
                  <NumberField
                    label={
                      errors.height ? 'Height - ' + errors.height : 'Height'
                    }
                    name="height"
                    type="number"
                    value={values.height}
                    onBlur={handleBlur}
                    error={!!errors.height}
                    sx={{ width: '100%' }}
                    handleChange={handleChange}
                    setHasChanges={setHasChanges}
                  />
                  <FormControl fullWidth>
                    <Autocomplete
                      options={exercises}
                      getOptionLabel={(option) => option.name || ''}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      value={values.exercise || null}
                      onChange={(event, newValue) => {
                        setHasChanges(true);
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
                          label={'Favourite Exercise'}
                          name="exercise"
                          onBlur={handleBlur}
                        />
                      )}
                    />
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 2,
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleResetFields(resetForm)}
                      disabled={!hasChanges || submitting}
                    >
                      Reset Changes
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!hasChanges || submitting}
                      endIcon={
                        submitting && (
                          <CircularProgress color="secondary" size={18} />
                        )
                      }
                    >
                      Save Changes
                    </Button>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{
                      mt: 1,
                    }}
                  >
                    Delete Account
                  </Button>
                </Box>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
      <DeleteConfirmation
        title="Delete Account"
        message={`Are you sure you want to delete your account? This action cannot be undone.`}
        open={deleteDialogOpen}
        loading={deleting}
        onConfirm={handleDeleteAccount}
        onClose={handleCancelDelete}
      />
    </>
  );
};

export default withSnackbar(AccountPage);
