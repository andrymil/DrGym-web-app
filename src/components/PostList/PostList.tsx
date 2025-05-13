import { useState, useEffect, useCallback } from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Post from '@/components/Post';
import SkeletonCard from '@/components/SkeletonCard';
import api from '@/utils/axiosInstance';
import type { ShowAppMessage } from '@/types/general';
import type { Post as PostType } from '@/types/api/post';
import { AxiosResponse } from 'axios';

type PostListProps = {
  username: string;
  onlyThisUser?: boolean;
  actions?: boolean;
  showAppMessage: ShowAppMessage;
};

const PostList = ({
  username,
  onlyThisUser,
  actions,
  showAppMessage,
}: PostListProps) => {
  const [postsData, setPostsData] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      let response: AxiosResponse<PostType[]>;
      if (onlyThisUser) {
        response = await api.get<PostType[]>(`/api/posts/user/${username}`);
        setPostsData(response.data);
      } else {
        response = await api.get<PostType[]>(`/api/posts/friends/${username}`);
        setPostsData(response.data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error fetching posts');
      showAppMessage({
        status: true,
        text: 'Something went wrong',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [username, onlyThisUser, showAppMessage]);

  useEffect(() => {
    if (username) {
      void fetchPosts();
    }
  }, [username, onlyThisUser, showAppMessage, fetchPosts]);

  if (loading)
    return (
      <Grid container direction="column" alignItems="center">
        {Array.from({ length: 1 }).map((_, index) => (
          <SkeletonCard key={index} type="post" />
        ))}
      </Grid>
    );
  if (error) return <Typography textAlign="center">{error}</Typography>;
  return (
    <Grid container direction="column" alignItems="center">
      {postsData.length === 0 ? (
        <Typography variant="h6">There are no posts here yet.</Typography>
      ) : (
        postsData.map((post) => (
          <Post
            key={post.id}
            post={post}
            actions={actions && onlyThisUser}
            onChanges={fetchPosts}
            showAppMessage={showAppMessage}
          />
        ))
      )}
    </Grid>
  );
};

export default PostList;
