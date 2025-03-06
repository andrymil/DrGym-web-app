import { Typography } from '@mui/material';
import Link from 'next/link';

export default function DrGymLogo() {
  return (
    <Link href="/">
      <Typography
        color="primary"
        variant="h5"
        component="div"
        sx={{ flexGrow: 1, px: '5px' }}
      >
        DrGym
      </Typography>
    </Link>
  );
}
