'use client';

import React from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Calendar from '@/components/Calendar';
import { withSnackbar } from '@/utils/snackbarProvider';
import BodyHighlighter from '@/components/BodyHighlighter';
import Ranking from '@/components/Ranking';

const Stats = ({ params, showAppMessage }) => {
  const { user } = React.use(params);

  return (
    <Grid
      container
      justifyContent="center"
      direction="column"
      sx={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        py: 2,
      }}
    >
      <Typography sx={{ mb: 3 }} variant="h6" gutterBottom>
        Your workout calendar
      </Typography>
      <Calendar username={user} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
          mt: 6,
        }}
      >
        <Box sx={{ mr: { xs: 0, md: 2 } }}>
          <BodyHighlighter username={user} />
        </Box>
        <Ranking username={user} showAppMessage={showAppMessage} />
      </Box>
    </Grid>
  );
};

export default withSnackbar(Stats);
