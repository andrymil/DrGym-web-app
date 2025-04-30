import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import WorkoutInfo from '@/components/WorkoutInfo';
import { formatRelativeTime } from '@/utils/dateUtils';
import UserHeader from '@/components/UserHeader';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import api from '@/utils/axiosInstance';
import PostDialog from '@/components/PostDialog';

export default function Post({ post, actions, onChanges, showAppMessage }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const workout = post.training;
  const realitveStartDate = formatRelativeTime(post.date);

  const handleDeletePost = async () => {
    try {
      setDeleting(true);
      await api.delete(`/api/posts/${post.id}`);
      onChanges();
      showAppMessage({
        status: true,
        text: 'Post deleted successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      showAppMessage({
        status: true,
        text: 'Error deleting post',
        type: 'error',
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: '1000px', margin: '0 auto', py: 2 }}>
        <Card sx={{ maxWidth: '100%' }}>
          <Grid container justifyContent="space-between">
            <Typography sx={{ pt: 2, pl: 2, m: 0 }} variant="h5" gutterBottom>
              {post.title}
            </Typography>
            {actions && (
              <Box sx={{ pt: 2, px: 2 }}>
                <Tooltip title="Edit post">
                  <IconButton
                    aria-label="edit post"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <EditIcon color="info" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete post" sx={{ ml: 1 }}>
                  <IconButton
                    aria-label="delete post"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Grid>
          <UserHeader
            username={post.username}
            avatar={post.avatar}
            subheader={
              realitveStartDate.charAt(0).toUpperCase() +
              realitveStartDate.slice(1)
            }
          />
          <Typography sx={{ pb: 1, pl: 2, m: 0 }} variant="body2" gutterBottom>
            {post.content}
          </Typography>
          <WorkoutInfo
            workout={workout}
            isPost
            post={post}
            showAppMessage={showAppMessage}
          />
        </Card>
      </Box>
      <DeleteConfirmation
        title="Delete Post"
        message={`Are you sure you want to delete this post? Workout associated with this post will not be deleted.`}
        open={deleteDialogOpen}
        loading={deleting}
        onConfirm={handleDeletePost}
        onClose={() => setDeleteDialogOpen(false)}
      />
      <PostDialog
        title="Edit Post"
        type="edit"
        post={post}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onChange={onChanges}
        showAppMessage={showAppMessage}
      />
    </>
  );
}
