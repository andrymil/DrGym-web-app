'use client';

import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import Calendar from '@/components/Calendar';
import BodyHighlighter from '@/components/BodyHighlighter';
import UserHeader from '@/components/UserHeader';
import Skeleton from '@mui/material/Skeleton';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import api from '@/utils/axiosInstance';
import PostList from '@/components/PostList';
import { getUsername } from '@/utils/localStorage';
import { withSnackbar } from '@/utils/snackbarProvider';
import { Typography } from '@mui/material';
import type { WithAppMessage } from '@/types/general';
import type { PlainUserData } from '@/types/api/user';
import type { Usable } from 'react';
import { AxiosError } from 'axios';

type UserPageProps = WithAppMessage & {
  params: Usable<{ user: string }>;
};

const User = ({ params, showAppMessage }: UserPageProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = React.use(params);
  const [userData, setUserData] = useState<PlainUserData | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const router = useRouter();
  const username = getUsername();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const response = await api.get<PlainUserData>(
          `/api/me/friends/${user}`
        );
        const data = response.data;

        setUserData(data);
        setAvatar(data?.avatar);
      } catch (error) {
        console.error('Error fetching user data', error);

        if (error instanceof AxiosError && error.status === 404) {
          router.replace(
            `/user/${username}/posts?message=User ${user} is not your friend&type=warning`
          );
        } else {
          router.replace(
            `/user/${username}/posts?message=An error occurred. Redirected.&type=error`
          );
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchUserData();
  }, [router, user, username, showAppMessage]);

  const handleDeleteFriend = async (username: string) => {
    try {
      await api.delete(`/api/friends/removeFriend`, {
        data: {
          user1: getUsername(),
          user2: username,
        },
      });
      router.replace(
        `/user/${getUsername()}/posts?message=Removed ${username} from friends&type=success`
      );
    } catch (err) {
      console.error('Error removing friend', err);
      showAppMessage({
        status: true,
        text: 'Failed to delete friend',
        type: 'error',
      });
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      sx={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1000px', margin: '0 auto', py: 2 }}>
        {!loading ? (
          <Card sx={{ maxWidth: '100%', mt: 0, mb: 6 }}>
            <UserHeader
              username={user}
              avatar={avatar}
              actions="friend"
              onDelete={handleDeleteFriend}
            />
          </Card>
        ) : (
          <Card sx={{ maxWidth: '100%', my: 1, mb: 6 }}>
            <CardHeader
              avatar={
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={40}
                  height={40}
                />
              }
              title={
                <Skeleton
                  animation="wave"
                  height={20}
                  width="20%"
                  style={{ marginBottom: 6 }}
                />
              }
            />
          </Card>
        )}
        {!loading && (
          <Box display="flex" flexDirection="column" alignItems="center">
            {userData && (
              <Grid container justifyContent="center" gap={5} sx={{ mb: 5 }}>
                {Object.entries(userData).map(([key, value]) => {
                  if (key === 'avatar') return;
                  const title = key.charAt(0).toUpperCase() + key.slice(1);

                  return (
                    <Grid key={key}>
                      <Typography variant="body1" color="textSecondary">
                        {title === 'Exercise' ? 'Favourtie Exercise' : title}:
                      </Typography>
                      {value ? (
                        <Typography variant="h6">{value}</Typography>
                      ) : (
                        <Typography color="textSecondary" variant="body2">
                          Not specified
                        </Typography>
                      )}
                    </Grid>
                  );
                })}
              </Grid>
            )}

            <Calendar username={user} />
            <Box sx={{ mt: 6, mb: 4 }}>
              <BodyHighlighter username={user} />
            </Box>
            <Box sx={{ width: '100%' }}>
              <PostList
                username={user}
                onlyThisUser
                showAppMessage={showAppMessage}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default withSnackbar(User);
