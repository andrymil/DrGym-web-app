'use client';

import { Session } from 'next-auth';
import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, Container } from '@mui/material';
import Head from 'next/head';
import CustomAppBar from '@/components/CustomAppBar';
import theme from '@/styles/theme';
import '@/app/globals.css';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { SessionProvider } from 'next-auth/react';

type RootLayoutProps = {
  children: ReactNode;
  session: Session | null;
};

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <html lang="en">
      <Head>
        <title>DrGym</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <SessionProvider session={session}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ProgressBar
              height="4px"
              color="#457b9d"
              options={{ showSpinner: false }}
              shallowRouting
            />
            <CustomAppBar />
            <Container
              maxWidth="lg"
              component="main"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                my: 14,
                gap: 4,
              }}
            >
              <Box
                sx={{
                  p: {
                    xs: 0,
                    sm: 2,
                  },
                }}
              >
                {children}
              </Box>
            </Container>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
