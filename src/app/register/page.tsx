'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { Button, Divider, IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form, FormikHelpers } from 'formik';
import {
  RegisterSchema,
  RegisterDefaultValues,
} from '@/utils/schemas/RegisterSchema';
import Link from 'next/link';
import { CircularProgress } from '@mui/material';
import { withSnackbar } from '@/utils/snackbarProvider';
import CustomInput from '@/components/CustomInput';
import api, { handleAxiosError } from '@/utils/axiosInstance';
import type { RegisterForm } from '@/types/forms/RegisterForm';
import type { WithAppMessage, WithCsrfToken } from '@/types/general';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  marginBottom: theme.spacing(4),
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const Register = ({
  csrfToken = null,
  showAppMessage,
}: WithAppMessage & WithCsrfToken) => {
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

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const handleRegister = async (
    formData: RegisterForm,
    form: FormikHelpers<RegisterForm>
  ) => {
    try {
      setLoading(true);
      await api.post<RegisterForm>('/api/register', {
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      router.replace('/auth/verification?account=welcome');
    } catch (err) {
      const message = handleAxiosError(err);
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
        <Formik<RegisterForm>
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
                  <Grid size={12}>
                    <CustomInput
                      label="First name"
                      name="name"
                      value={values.name}
                      errorStr={errors.name}
                      touched={!!touched.name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      tabIndex={1}
                    />
                  </Grid>
                  <Grid size={12}>
                    <CustomInput
                      label="Last name"
                      name="surname"
                      value={values.surname}
                      errorStr={errors.surname}
                      touched={!!touched.surname}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      tabIndex={2}
                    />
                  </Grid>
                  <Grid size={12}>
                    <CustomInput
                      label="Username"
                      name="username"
                      value={values.username}
                      errorStr={errors.username}
                      touched={!!touched.username}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      tabIndex={3}
                    />
                  </Grid>
                  <Grid size={12}>
                    <CustomInput
                      label="E-mail address"
                      name="email"
                      type="email"
                      value={values.email}
                      errorStr={errors.email}
                      touched={!!touched.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      tabIndex={4}
                    />
                  </Grid>
                  <Grid size={12}>
                    <CustomInput
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      errorStr={errors.password}
                      touched={!!touched.password}
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
                  <Grid size={12}>
                    <CustomInput
                      label="Confirm password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirmPassword}
                      errorStr={errors.confirmPassword}
                      touched={!!touched.confirmPassword}
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
                  <Grid size={12}>
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
