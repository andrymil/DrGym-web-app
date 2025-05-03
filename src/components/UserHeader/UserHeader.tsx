import { useState } from 'react';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Link from 'next/link';
import {
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import CustomAvatar from '@/components/CustomAvatar';

type UserHeaderProps = {
  username: string;
  avatar: string;
  subheader?: string;
  id?: number;
  actions?: string;
  onDelete?: (username: string) => Promise<void>;
  onAccept?: (id: number, username: string, avatar: string) => Promise<void>;
  onDecline?: (id: number, username: string) => Promise<void>;
};

export default function UserHeader({
  username,
  avatar,
  id,
  subheader,
  actions,
  onDelete,
  onAccept,
  onDecline,
}: UserHeaderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await onDelete(username);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleAcceptRequest = async () => {
    try {
      setLoading(true);
      await onAccept(id, username, avatar);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineRequest = async () => {
    try {
      setLoading(true);
      await onDecline(id, username);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardHeader
        avatar={
          <IconButton
            onClick={() => router.push(`/user/${username}`)}
            sx={{
              bgcolor: 'transparent',
              padding: '5px',
            }}
          >
            <CustomAvatar username={username} color={avatar} />
          </IconButton>
        }
        title={
          <Grid container justifyContent="space-between" alignItems="center">
            <Link href={`/user/${username}`} passHref>
              <Typography
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {username}
              </Typography>
            </Link>
            {actions === 'friend' && (
              <Tooltip title="Remove friend">
                <IconButton
                  aria-label="remove friend"
                  onClick={handleDeleteClick}
                >
                  <PersonRemoveIcon color="error" />
                </IconButton>
              </Tooltip>
            )}
            {actions === 'request' && (
              <Box>
                {loading ? (
                  <CircularProgress size={24} sx={{ mr: 4 }} />
                ) : (
                  <>
                    <Tooltip title="Accept request">
                      <IconButton
                        disabled={loading}
                        aria-label="accept request"
                        onClick={handleAcceptRequest}
                      >
                        <CheckIcon color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Decline request">
                      <IconButton
                        disabled={loading}
                        aria-label="decline request"
                        onClick={handleDeclineRequest}
                      >
                        <CloseIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            )}
          </Grid>
        }
        subheader={subheader}
      />
      <DeleteConfirmation
        title="Remove Friend"
        message={`Are you sure you want to remove ${username} from your friends?`}
        open={deleteDialogOpen}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
      />
    </>
  );
}
