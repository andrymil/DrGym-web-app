'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import { LoginSchema, LoginDefaultValues } from '@/utils/schemas/LoginSchema';
import Link from 'next/link';
import { withSnackbar } from '@/utils/snackbarProvider';
import CustomInput from '@/components/CustomInput';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import { string } from 'yup';
import { stringToColor } from '@/utils/avatar';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  marginBottom: theme.spacing(4),
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const LoginContent = ({ csrfToken = null, showAppMessage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginType, setLoginType] = useState('username');
  const [showPassword, toggleShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const message = searchParams.get('message');
    const type = searchParams.get('type');
    if (message) {
      router.replace('/login', undefined, { shallow: true });
      showAppMessage({
        status: true,
        text: message,
        type: type || 'info',
      });
    }
  }, [router, searchParams, showAppMessage]);

  const handleTogglePassword = () => {
    toggleShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (formData, form) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
        {
          identifier:
            loginType === 'username' ? formData.username : formData.email,
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      const { username, avatar } = await res.data;
      if (!username) {
        throw new Error('Missing username');
      }

      localStorage.setItem('username', username);
      localStorage.setItem('avatar', avatar ? avatar : stringToColor(username));

      await signIn('credentials', {
        username: username,
        avatar: avatar || null,
        callbackUrl: `/user/${username}/posts?message=Logged in successfully&type=success`,
        redirect: true,
      });
    } catch (err) {
      form.setValues({ ...formData, password: '' });
      form.setTouched({});
      if (err.response?.status === 401) {
        showAppMessage({
          status: true,
          text: `${err.response.data}`,
          type: 'error',
        });
      } else {
        showAppMessage({
          status: true,
          text: 'Something went wrong. Please try again later.',
          type: 'error',
        });
      }
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
          initialValues={LoginDefaultValues()}
          validationSchema={LoginSchema(loginType)}
          onSubmit={handleLogin}
        >
          {({
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            setValues,
            setErrors,
          }) => {
            return (
              <Form>
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <Grid container direction="column" gap={2}>
                  <Grid xs={12}>
                    <FormControl fullWidth>
                      <FormLabel focused component="legend">
                        Login with
                      </FormLabel>
                      <RadioGroup
                        row
                        name="loginType"
                        value={loginType}
                        onChange={(e) => {
                          setLoginType(e.target.value);
                          setValues({ ...values, username: '', email: '' });
                          setErrors({});
                        }}
                      >
                        <FormControlLabel
                          value="username"
                          control={<Radio />}
                          label="username"
                        />
                        <FormControlLabel
                          value="email"
                          control={<Radio />}
                          label="e-mail"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid xs={12}>
                    {loginType === 'username' ? (
                      <CustomInput
                        label="Username"
                        name="username"
                        type="text"
                        value={values.username}
                        error={errors.username}
                        touched={touched.username}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        tabIndex={1}
                      />
                    ) : (
                      <CustomInput
                        label="E-mail address"
                        name="email"
                        type="email"
                        value={values.email}
                        error={errors.email}
                        touched={touched.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        tabIndex={1}
                      />
                    )}
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
                      tabIndex={2}
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
                      tabIndex={3}
                    >
                      {loading ? 'Please wait...' : 'LOGIN'}
                    </Button>
                    <Link href="/auth/forgot-password">
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 4, lineHeight: '40px' }}
                        color="primary"
                        size="large"
                        tabIndex={4}
                      >
                        Forgot password?
                      </Button>
                    </Link>
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
        <Link href="/register">
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 4, lineHeight: '40px' }}
            color="primary"
            size="large"
            tabIndex={5}
          >
            CREATE ACCOUNT
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
};

const Login = ({ csrfToken = null, showAppMessage }) => {
  return (
    <Suspense fallback={<CircularProgress size={40} color="primary" />}>
      <LoginContent csrfToken={csrfToken} showAppMessage={showAppMessage} />
    </Suspense>
  );
};

export default withSnackbar(Login);
