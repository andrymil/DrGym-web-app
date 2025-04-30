'use client';

import React, { useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import { Button, InputAdornment, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  ForogtPasswordSchema,
  ForogtPasswordDefaultValues,
} from '@/utils/schemas/ForgotPasswordSchema';
import { withSnackbar } from '@/utils/snackbarProvider';
import CustomInput from '@/components/CustomInput';
import api from '@/utils/axiosInstance';

const ForgotPassword = ({ csrfToken, showAppMessage }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const formikRef = useRef();

  const handleForgotPassword = async (formData, form) => {
    try {
      setLoading(true);
      const respone = await api.post('/api/forgot-password', {
        email: formData.email,
      });
      showAppMessage({
        status: true,
        text: 'Request successfully sent.',
        type: 'success',
      });
      setMessage(
        'We have sent you a link. Please check your inbox and follow the instructions.'
      );
    } catch (error) {
      if (error.response?.status === 404) {
        form.setFieldError('email', 'no account found');
        showAppMessage({
          status: true,
          text: 'There is no account associated with this e-mail.',
          type: 'error',
        });
      } else if (error.response?.status === 403) {
        form.setFieldError('email', 'not verified');
        showAppMessage({
          status: true,
          text: error.response?.data?.error,
          type: 'info',
        });
      } else {
        showAppMessage({
          status: true,
          text: 'Something went wrong.',
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
        {message && (
          <Typography sx={{ mb: 2, textAlign: 'center' }} variant="body1">
            {message}
          </Typography>
        )}
        {!message && (
          <>
            <Typography sx={{ mb: 3 }} variant="body1">
              Please enter your e-mail
            </Typography>
            <Formik
              innerRef={formikRef}
              initialValues={ForogtPasswordDefaultValues()}
              validationSchema={ForogtPasswordSchema()}
              onSubmit={handleForgotPassword}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isValid,
                setFieldError,
                setFieldValue,
                touched,
                values,
              }) => {
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
                          label="E-mail address"
                          name="email"
                          type="email"
                          value={values.email}
                          error={errors.email}
                          touched={touched.email}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          tabIndex={1}
                          endAdornment={
                            values.email && (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    setFieldValue('email', '', false);
                                    setFieldError('email', null);
                                  }}
                                >
                                  <CloseIcon color="accent" />
                                </IconButton>
                              </InputAdornment>
                            )
                          }
                        />
                      </Grid>
                      <Grid size={12}>
                        <Button
                          fullWidth
                          onClick={handleSubmit}
                          variant="contained"
                          color="primary"
                          disabled={loading}
                          endIcon={
                            loading && (
                              <CircularProgress color="primary" size={18} />
                            )
                          }
                        >
                          Reset Password
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default withSnackbar(ForgotPassword);
