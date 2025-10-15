'use client';

import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import UserHeader from '@/components/UserHeader';
import api from '@/utils/axiosInstance';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import CardHeader from '@mui/material/CardHeader';
import { withSnackbar } from '@/utils/snackbarProvider';
import FriendForm from '@/components/FriendForm';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Divider } from '@mui/material';
import { getUsername } from '@/utils/localStorage';
import type { WithAppMessage } from '@/types/general';
import type {
  Friend,
  ReceivedInvitation,
  GetFriendsResponse,
  GetInvitationsResponse,
} from '@/types/api/friends';

const Friends = ({ showAppMessage }: WithAppMessage) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<ReceivedInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);

        const friendsResponse =
          await api.get<GetFriendsResponse>('/api/me/friends');
        setFriends(friendsResponse.data.friends);

        const InvitationsResponse = await api.get<GetInvitationsResponse>(
          '/api/me/friends/invitations'
        );
        setRequests(InvitationsResponse.data.received);
      } catch (err) {
        console.error('Error fetching friends:', err);
        showAppMessage({
          status: true,
          text: 'Something went wrong',
          type: 'error',
        });
        setError('Failed to fetch friends. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    void fetchFriends();
  }, [showAppMessage]);

  const handleAcceptRequest = async (
    id: number,
    username: string,
    avatar: string
  ) => {
    try {
      await api.post(`/api/friends/acceptRequest?invitationId=${id}`);
      showAppMessage({
        status: true,
        text: `Accepted friend request from ${username}`,
        type: 'success',
      });
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.sender.username !== username)
      );
      setFriends((prevFriends) => [...prevFriends, { username, avatar }]);
    } catch (err) {
      console.error('Error accepting friend request:', err);
      showAppMessage({
        status: true,
        text: 'Something went wrong',
        type: 'error',
      });
    }
  };

  const handleDeclineRequest = async (id: number, username: string) => {
    try {
      await api.post(`/api/friends/rejectRequest?invitationId=${id}`);
      showAppMessage({
        status: true,
        text: `Declined friend request from ${username}`,
        type: 'info',
      });
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.sender.username !== username)
      );
    } catch (err) {
      console.error('Error declining friend request', err);
      showAppMessage({
        status: true,
        text: 'Something went wrong',
        type: 'error',
      });
    }
  };

  const handleDeleteFriend = async (username: string) => {
    try {
      await api.delete(`/api/friends/removeFriend`, {
        data: {
          user1: getUsername(),
          user2: username,
        },
      });
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.username !== username)
      );
      showAppMessage({
        status: true,
        text: `Removed ${username} from friends`,
        type: 'success',
      });
    } catch (err) {
      console.error('Error removing friend', err);
      showAppMessage({
        status: true,
        text: 'Failed to delete friend',
        type: 'error',
      });
    }
  };

  if (error) {
    return (
      <Typography textAlign="center" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
          py: 2,
        }}
      >
        {requests.length > 0 && !loading && (
          <>
            <Typography variant="h5" gutterBottom>
              Friend Requests
            </Typography>
            {requests.map((request) => (
              <Card key={request.id} sx={{ maxWidth: '100%', my: 1 }}>
                <UserHeader
                  id={request.id}
                  username={request.sender.username}
                  avatar={request.sender.avatar}
                  actions="request"
                  onAccept={handleAcceptRequest}
                  onDecline={handleDeclineRequest}
                />
              </Card>
            ))}
            <Divider sx={{ my: 4 }} />
          </>
        )}
        <Grid container justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mr: 4 }}>
            {!loading && !friends.length
              ? 'You have not added any friends yet'
              : 'Your Friends'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add friend
          </Button>
        </Grid>
        {!loading
          ? friends.map((friend) => (
              <Card key={friend.username} sx={{ maxWidth: '100%', my: 1 }}>
                <UserHeader
                  username={friend.username}
                  avatar={friend.avatar}
                  actions="friend"
                  onDelete={handleDeleteFriend}
                />
              </Card>
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} sx={{ maxWidth: '100%', my: 1 }}>
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
            ))}
      </Box>
      <FriendForm
        popupStatus={dialogOpen}
        togglePopup={setDialogOpen}
        showAppMessage={showAppMessage}
      />
    </>
  );
};

export default withSnackbar(Friends);
