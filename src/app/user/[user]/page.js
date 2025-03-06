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
import axiosInstance from '@/utils/axiosInstance';
import PostList from '@/components/PostList';
import { getUsername } from '@/utils/localStorage';
import { withSnackbar } from '@/utils/snackbarProvider';
import { Typography } from '@mui/material';

const User = ({ params, showAppMessage }) => {
  const [loading, setLoading] = useState(true);
  const { user } = React.use(params);
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const router = useRouter();
  const username = getUsername();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/users/${user}`);
        setUserData({
          name: response.data?.name,
          surname: response.data?.surname,
          weight: response.data?.weight,
          height: response.data?.height,
          'favourite Exercise': response.data?.favoriteExerciseName,
        });
        setAvatar(response.data?.avatar || null);
      } catch (err) {
        showAppMessage({
          status: true,
          text: 'Failed to fetch user data',
          type: 'error',
        });
      }
    };

    const checkFriendStatus = async () => {
      try {
        setLoading(true);
        if (username === user) {
          router.replace(`/user/${user}/account`);
          return;
        }
        const response = await axiosInstance.get(
          `/api/friends/isFriend/${username}/${user}`
        );
        if (response.data) {
          fetchUserData();
          setLoading(false);
        } else {
          router.replace(
            `/user/${username}/posts?message=User ${user} is not your friend&type=warning`
          );
        }
      } catch (err) {
        router.replace(
          `/user/${username}/posts?message=An error occurred. Redirected.&type=error`
        );
      }
    };

    checkFriendStatus();
  }, [router, user, username, showAppMessage]);

  const handleDeleteFriend = async (username) => {
    try {
      await axiosInstance.delete(`/api/friends/removeFriend`, {
        data: {
          user1: getUsername(),
          user2: username,
        },
      });
      router.replace(
        `/user/${getUsername()}/posts?message=Removed ${username} from friends&type=success`
      );
    } catch (err) {
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
                {Object.entries(userData).map(
                  ([key, value]) =>
                    key !== 'username' && (
                      <Grid xs={12} key={key}>
                        <Typography variant="body1" color="textSecondary">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </Typography>
                        {value ? (
                          <Typography variant="h6">{value}</Typography>
                        ) : (
                          <Typography color="textSecondary" variant="body2">
                            Not specified
                          </Typography>
                        )}
                      </Grid>
                    )
                )}
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
