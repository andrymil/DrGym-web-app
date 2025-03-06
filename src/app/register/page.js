'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { Button, Divider, IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import {
  RegisterSchema,
  RegisterDefaultValues,
} from '@/utils/schemas/RegisterSchema';
import Link from 'next/link';
import { CircularProgress } from '@mui/material';
import { withSnackbar } from '@/utils/snackbarProvider';
import CustomInput from '@/components/CustomInput';
import axios from 'axios';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  marginBottom: theme.spacing(4),
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const Register = ({ csrfToken = null, showAppMessage }) => {
  const router = useRouter();
  const [showPassword, toggleShowPassword] = useState(false);
  const [showConfirmPassword, toggleShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTogglePassword = () => {
    toggleShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    toggleShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = async (formData, form) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          name: formData.firstName,
          surname: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );
      router.replace('/auth/verification?account=welcome');
    } catch (error) {
      const message = error.response?.data;
      if (message === 'E-mail is already taken') {
        form.setFieldError('email', 'already taken');
      } else if (message === 'Username is already taken') {
        form.setFieldError('username', 'already taken');
      } else {
        showAppMessage({
          status: true,
          text: 'Something went wrong. Please try again later.',
          type: 'error',
        });
        return;
      }
      showAppMessage({
        status: true,
        text: message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      direction="column"
      sx={{
        width: {
          xs: '100%',
          sm: '80%',
          md: '60%',
        },
        maxWidth: '500px',
        alignItems: 'center',
        margin: '0 auto',
      }}
    >
      <Grid sx={{ width: '100%' }}>
        <Formik
          initialValues={RegisterDefaultValues()}
          validationSchema={RegisterSchema()}
          onSubmit={handleRegister}
        >
          {({ values, touched, errors, handleBlur, handleChange }) => {
            return (
              <Form>
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <Grid container direction="column" gap={2}>
                  <Grid xs={12}>
                    <CustomInput
                      label="First name"
                      name="firstName"
                      value={values.firstName}
                      error={errors.firstName}
                      touched={touched.firstName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      tabIndex={1}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <CustomInput
                      label="Last name"
                      name="lastName"
                      value={values.lastName}
                      error={errors.lastName}
                      touched={touched.lastName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      tabIndex={2}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <CustomInput
                      label="Username"
                      name="username"
                      value={values.username}
                      error={errors.username}
                      touched={touched.username}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      tabIndex={3}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <CustomInput
                      label="E-mail address"
                      name="email"
                      type="email"
                      value={values.email}
                      error={errors.email}
                      touched={touched.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      tabIndex={4}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <CustomInput
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      error={errors.password}
                      touched={touched.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      tabIndex={5}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            edge="end"
                            color="primary"
                            onClick={handleTogglePassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </Grid>
                  <Grid xs={12}>
                    <CustomInput
                      label="Confirm password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirmPassword}
                      error={errors.confirmPassword}
                      touched={touched.confirmPassword}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      tabIndex={6}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            edge="end"
                            color="primary"
                            onClick={handleToggleConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      sx={{ mt: 2, mb: 4, lineHeight: '40px' }}
                      color="primary"
                      disabled={loading}
                      endIcon={
                        loading && <CircularProgress color="info" size={18} />
                      }
                      size="large"
                      tabIndex={7}
                    >
                      {loading ? 'Please wait...' : 'CREATE ACCOUNT'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Grid>
      <Grid sx={{ width: '100%' }}>
        <Root>
          <Divider>OR</Divider>
        </Root>
        <Link href="/login">
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 4, lineHeight: '40px' }}
            color="primary"
            size="large"
            tabIndex={8}
          >
            LOGIN
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
};

export default withSnackbar(Register);
