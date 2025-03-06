'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { withSnackbar } from '@/utils/snackbarProvider';
import { Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const VerificationPageContent = ({ showAppMessage }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const account = searchParams.get('account');
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const handleVerification = async () => {
      try {
        setLoading(true);
        setMessage('Verifying your account...');
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/verification?email=${email}&token=${token}`
        );
        setTimeout(() => {
          router.replace(
            '/login?message=Account has been verified&type=success'
          );
        }, 5000);
      } catch (error) {
        const errMessage = error.response?.data;
        if (errMessage === 'User does not exist') {
          router.replace(`/login?message=${errMessage}&type=error`);
        } else if (errMessage === 'User is already verified') {
          router.replace(
            `/login?message=Your account has been already verified&type=info`
          );
        } else {
          setMessage(
            'Oops! There seems to be a problem. Please try using the verification link again.'
          );
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

    if (account === 'welcome') {
      setLoading(false);
      setMessage(
        'Thank you for creating an account. We have sent a verification link to your e-mail. Usually, the email will arrive in your inbox immediately, but sometimes it can take a while. Please be patient and, in the meantime, check your spam folder.'
      );
      showAppMessage({
        status: true,
        text: 'Account has been created.',
        type: 'success',
      });
    } else if (!email || !token) {
      setLoading(false);
      setMessage(
        'We are sorry but the verification link seems to be broken. Please try again.'
      );
      showAppMessage({
        status: true,
        text: 'Wrong verification URL.',
        type: 'error',
      });
    } else {
      handleVerification();
    }
  }, [router, searchParams, showAppMessage]);

  return (
    <Typography style={{ textAlign: 'center' }}>
      {loading && (
        <CircularProgress color="primary" sx={{ mr: 2 }} size="20px" />
      )}
      {message}
    </Typography>
  );
};

const VerificationPage = ({ showAppMessage }) => {
  return (
    <Suspense fallback={<CircularProgress size={40} color="primary" />}>
      <VerificationPageContent showAppMessage={showAppMessage} />
    </Suspense>
  );
};

export default withSnackbar(VerificationPage);
