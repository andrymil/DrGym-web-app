import { alpha } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar, { ToolbarProps } from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import DrGymLogo from '@/components/DrGymLogo';
import CustomDrawer from '@/components/CustomDrawer';
import IconButton from '@mui/material/IconButton';
import CustomAvatar from '@/components/CustomAvatar';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { getAvatar, removeUserData } from '@/utils/localStorage';
import { useTheme } from '@mui/material';

const StyledToolbar = ({ children, ...rest }: ToolbarProps) => {
  const theme = useTheme();

  return (
    <Toolbar
      {...rest}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
        backdropFilter: 'blur(24px)',
        border: '1px solid',
        borderColor: theme.palette.divider,
        backgroundColor: alpha(theme.palette.background.default, 0.4),
        boxShadow: theme.shadows[1],
        padding: '8px 12px',
      }}
    >
      {children}
    </Toolbar>
  );
};

export default function CustomAppBar() {
  const { data: session, status } = useSession();
  const username = session?.user?.username;
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    try {
      removeUserData();
      void signOut({
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login?message=You have been signed out&type=info`,
      });
    } catch (err) {
      console.error('Error logging out', err);
      router.push(
        `/user/${username}/posts?message=Failed to sign out. Please try again.&type=error`
      );
    }
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              minHeight: '56px',
              display: 'flex',
              alignItems: 'center',
              px: 0,
            }}
          >
            <DrGymLogo />
            {status === 'authenticated' && (
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Link href={`/user/${username}/posts`}>
                  <Button
                    variant={
                      pathname == `/user/${username}/posts`
                        ? 'outlined'
                        : 'text'
                    }
                    color="secondary"
                    size="small"
                    startIcon={<EmojiPeopleIcon />}
                  >
                    Posts
                  </Button>
                </Link>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Link href={`/user/${username}/workouts`}>
                  <Button
                    variant={
                      pathname == `/user/${username}/workouts`
                        ? 'outlined'
                        : 'text'
                    }
                    color="secondary"
                    size="small"
                    startIcon={<FitnessCenterIcon />}
                  >
                    Workouts
                  </Button>
                </Link>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Link href={`/user/${username}/stats`}>
                  <Button
                    variant={
                      pathname == `/user/${username}/stats`
                        ? 'outlined'
                        : 'text'
                    }
                    color="secondary"
                    size="small"
                    startIcon={<BarChartIcon />}
                  >
                    Statistics
                  </Button>
                </Link>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Link href={`/user/${username}/friends`}>
                  <Button
                    variant={
                      pathname == `/user/${username}/friends`
                        ? 'outlined'
                        : 'text'
                    }
                    color="secondary"
                    size="small"
                    startIcon={<GroupIcon />}
                  >
                    Friends
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {status === 'authenticated' && (
              <>
                <Link href={`/user/${username}/account`}>
                  <IconButton aria-label="account">
                    <CustomAvatar username={username} color={getAvatar()} />
                  </IconButton>
                </Link>
                <Button
                  onClick={handleLogout}
                  color="primary"
                  variant="outlined"
                  size="small"
                >
                  Sign out
                </Button>
              </>
            )}
            {status === 'unauthenticated' && (
              <>
                <Link href="/login">
                  <Button color="primary" variant="text" size="small">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button color="primary" variant="contained" size="small">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </Box>
          <CustomDrawer
            handleLogout={handleLogout}
            username={username}
            status={status}
          />
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
