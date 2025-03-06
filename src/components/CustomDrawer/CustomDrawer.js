import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import DrGymLogo from '@/components/DrGymLogo';
import Link from 'next/link';
import { getAvatar } from '@/utils/localStorage';
import { Typography } from '@mui/material';
import CustomAvatar from '@/components/CustomAvatar';

export default function CustomDrawer({ handleLogout, username, status }) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
      <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="top"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            top: 'var(--template-frame-height, 0px)',
          },
        }}
      >
        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            {status === 'authenticated' ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Link href={`/user/${username}/account`}>
                  <IconButton
                    onClick={toggleDrawer(false)}
                    aria-label="account"
                  >
                    <CustomAvatar username={username} color={getAvatar()} />
                  </IconButton>
                </Link>
                <Typography sx={{ mt: '12px' }} variant="h6" component="div">
                  {username}
                </Typography>
              </Box>
            ) : (
              <DrGymLogo />
            )}
            <IconButton onClick={toggleDrawer(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          {status === 'authenticated' ? (
            <>
              <Link href={`/user/${username}/posts`}>
                <MenuItem onClick={toggleDrawer(false)}>
                  <ListItemIcon>
                    <EmojiPeopleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Posts</ListItemText>
                </MenuItem>
              </Link>
              <Link href={`/user/${username}/workouts`}>
                <MenuItem onClick={toggleDrawer(false)}>
                  <ListItemIcon>
                    <FitnessCenterIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Workouts</ListItemText>
                </MenuItem>
              </Link>
              <Link href={`/user/${username}/stats`}>
                <MenuItem onClick={toggleDrawer(false)}>
                  <ListItemIcon>
                    <BarChartIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Statistics</ListItemText>
                </MenuItem>
              </Link>
              <Link href={`/user/${username}/friends`}>
                <MenuItem onClick={toggleDrawer(false)} sx={{ mb: 2 }}>
                  <ListItemIcon>
                    <GroupIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Friends</ListItemText>
                </MenuItem>
              </Link>
              <Divider sx={{ mb: 2 }} />
              <MenuItem
                onClick={() => {
                  handleLogout();
                  toggleDrawer(false);
                }}
              >
                <Button color="primary" variant="outlined" fullWidth>
                  Sign out
                </Button>
              </MenuItem>
            </>
          ) : (
            <>
              <Link href="/register">
                <MenuItem onClick={toggleDrawer(false)} sx={{ mt: 2 }}>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
              </Link>
              <Link href="/login">
                <MenuItem onClick={toggleDrawer(false)}>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem>
              </Link>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
