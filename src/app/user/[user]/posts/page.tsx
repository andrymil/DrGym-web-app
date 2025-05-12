'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Typography from '@mui/material/Typography';
import { withSnackbar } from '@/utils/snackbarProvider';
import PostList from '@/components/PostList';
import { getUsername } from '@/utils/localStorage';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import PostDialog from '@/components/PostDialog';
import { ref } from 'yup';

const PostsContent = ({ showAppMessage }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [onlyThisUser, setOnlyThisUser] = useState(false);
  const [refetch, setRefetch] = useState(0);

  const username = getUsername();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const message = searchParams.get('message');
    const type = searchParams.get('type');
    if (message) {
      router.replace(`${pathname}`, { scroll: true });
      showAppMessage({
        status: true,
        text: message,
        type: type || 'info',
      });
    }
  }, [router, pathname, searchParams, showAppMessage]);

  const triggerRefetch = () => {
    setRefetch(+!refetch);
  };

  const handleChange = (event, newOption) => {
    setOnlyThisUser(newOption === 'my');
  };

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: 1, pb: 2 }}
      >
        <ToggleButtonGroup
          color="info"
          value={onlyThisUser ? 'my' : 'friends'}
          exclusive
          onChange={handleChange}
          aria-label="Whose posts to show"
        >
          <ToggleButton value="friends">Friends&apos; posts</ToggleButton>
          <ToggleButton value="my">My posts</ToggleButton>
        </ToggleButtonGroup>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ width: { xs: '100%', sm: 'auto' }, mt: { xs: 2, sm: 0 } }}
        >
          Add post
        </Button>
      </Grid>
      <PostList
        key={refetch}
        username={username}
        onlyThisUser={onlyThisUser}
        actions
        showAppMessage={showAppMessage}
      />
      <PostDialog
        title="Add New Post"
        type="add"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onChange={triggerRefetch}
        showAppMessage={showAppMessage}
      />
    </>
  );
};

const Posts = ({ showAppMessage }) => {
  return (
    <Suspense fallback={<Typography>Loading posts...</Typography>}>
      <PostsContent showAppMessage={showAppMessage} />
    </Suspense>
  );
};

export default withSnackbar(Posts);
