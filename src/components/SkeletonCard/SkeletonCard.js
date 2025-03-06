import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default function SkeletonCard({ type }) {
  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: '0 auto', py: 2 }}>
      <Card sx={{ maxWidth: '100%' }}>
        <CardHeader
          avatar={
            type === 'post' && (
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            )
          }
          title={
            <Skeleton
              animation="wave"
              height={10}
              width="20%"
              style={{ marginBottom: 6 }}
            />
          }
          subheader={<Skeleton animation="wave" height={10} width="10%" />}
        />
        <Skeleton sx={{ height: 100 }} animation="wave" variant="rectangular" />
        <CardContent>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </CardContent>
      </Card>
    </Box>
  );
}
