'use client';

import React, { useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, FormikHelpers } from 'formik';
import { Button, InputAdornment, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  ForogtPasswordSchema,
  ForogtPasswordDefaultValues,
} from '../../../../schemas/ForgotPasswordSchema';
import { withSnackbar } from '@/utils/snackbarProvider';
import CustomInput from '@/components/CustomInput';
import api, { handleAxiosError } from '@/utils/axiosInstance';
import type { ForgotPasswordRequest } from '@/types/api/requests/forgotPassword';
import type { ForgotPasswordValues } from '@/types/forms/ForgotPasswordForm';
import type { WithAppMessage, WithCsrfToken } from '@/types/general';

const ForgotPassword = ({
  csrfToken,
  showAppMessage,
}: WithCsrfToken & WithAppMessage) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>(null);

  const formikRef = useRef(null);

  const handleForgotPassword = async (
    formData: ForgotPasswordValues,
    form: FormikHelpers<ForgotPasswordValues>
  ) => {
    try {
      setLoading(true);
      const payload: ForgotPasswordRequest = {
        email: formData.email,
      };
      await api.post('/api/forgot-password', payload);
      showAppMessage({
        status: true,
        text: 'Request successfully sent.',
        type: 'success',
      });
      setMessage(
        'We have sent you a link. Please check your inbox and follow the instructions.'
      );
    } catch (err) {
      const { message: errMessage, status } = handleAxiosError(err);
      if (status === 404) {
        form.setFieldError('email', 'no account found');
        showAppMessage({
          status: true,
          text: 'There is no account associated with this e-mail.',
          type: 'error',
        });
      } else if (status === 403) {
        form.setFieldError('email', 'not verified');
        showAppMessage({
          status: true,
          text: errMessage,
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
            <Formik<ForgotPasswordValues>
              innerRef={formikRef}
              initialValues={ForogtPasswordDefaultValues()}
              validationSchema={ForogtPasswordSchema()}
              onSubmit={handleForgotPassword}
            >
              {({
                errors,
                handleBlur,
                handleChange,
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
                          errorStr={errors.email}
                          touched={!!touched.email}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          tabIndex={1}
                          endAdornment={
                            values.email && (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    void setFieldValue('email', '', false);
                                    setFieldError('email', null);
                                  }}
                                >
                                  <CloseIcon color="primary" />
                                </IconButton>
                              </InputAdornment>
                            )
                          }
                        />
                      </Grid>
                      <Grid size={12}>
                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2, lineHeight: '40px' }}
                          size="large"
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
