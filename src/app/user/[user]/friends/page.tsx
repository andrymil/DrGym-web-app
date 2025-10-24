'use client';

import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import UserHeader from '@/components/UserHeader';
import api, { handleAxiosError } from '@/utils/axiosInstance';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import CardHeader from '@mui/material/CardHeader';
import { withSnackbar } from '@/utils/snackbarProvider';
import FriendForm from '@/components/FriendForm';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Divider } from '@mui/material';
import type { WithAppMessage } from '@/types/general';
import type {
  Friend,
  ReceivedInvitation,
  GetFriendsResponse,
  GetInvitationsResponse,
} from '@/types/api/friends';
import type { PatchInvitationRequest } from '@/schemas/api/FriendsSchema';

const Friends = ({ showAppMessage }: WithAppMessage) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [invitations, setInvitations] = useState<ReceivedInvitation[]>([]);
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
        setInvitations(InvitationsResponse.data.received);
      } catch (error) {
        console.error('Error fetching friends:', error);

        const { message } = handleAxiosError(error);
        showAppMessage({
          status: true,
          text: message,
          type: 'error',
        });

        setError('Failed to fetch friends. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    void fetchFriends();
  }, [showAppMessage]);

  const handleAcceptInvitation = async (
    id: number,
    username: string,
    avatar: string
  ) => {
    try {
      const payload: PatchInvitationRequest = {
        decision: 'accepted',
      };

      await api.patch(`/api/me/friends/invitations/${id}`, payload);

      showAppMessage({
        status: true,
        text: `Accepted invitation from ${username}`,
        type: 'success',
      });

      setInvitations((previous) =>
        previous.filter((invitation) => invitation.id !== id)
      );
      setFriends((prevFriends) => [...prevFriends, { username, avatar }]);
    } catch (error) {
      console.error('Error accepting friend invitation:', error);

      const { message } = handleAxiosError(error);
      showAppMessage({
        status: true,
        text: message,
        type: 'error',
      });
    }
  };

  const handleRejectInviation = async (id: number, username: string) => {
    try {
      const payload: PatchInvitationRequest = {
        decision: 'rejected',
      };

      await api.patch(`/api/me/friends/invitations/${id}`, payload);

      showAppMessage({
        status: true,
        text: `Declined invitation from ${username}`,
        type: 'info',
      });
      setInvitations((previous) =>
        previous.filter((invitation) => invitation.id !== id)
      );
    } catch (error) {
      console.error('Error declining friend invitation', error);

      const { message } = handleAxiosError(error);
      showAppMessage({
        status: true,
        text: message,
        type: 'error',
      });
    }
  };

  const handleDeleteFriend = async (username: string) => {
    try {
      await api.delete(`/api/me/friends/${username}`);

      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.username !== username)
      );

      showAppMessage({
        status: true,
        text: `Removed ${username} from friends`,
        type: 'success',
      });
    } catch (error) {
      console.error('Error removing friend', error);

      const { message } = handleAxiosError(error);
      showAppMessage({
        status: true,
        text: message,
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
        {invitations.length > 0 && !loading && (
          <>
            <Typography variant="h5" gutterBottom>
              Friend Invitations
            </Typography>
            {invitations.map((invitation) => (
              <Card key={invitation.id} sx={{ maxWidth: '100%', my: 1 }}>
                <UserHeader
                  id={invitation.id}
                  username={invitation.sender.username}
                  avatar={invitation.sender.avatar}
                  actions="invitation"
                  onAccept={handleAcceptInvitation}
                  onDecline={handleRejectInviation}
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
