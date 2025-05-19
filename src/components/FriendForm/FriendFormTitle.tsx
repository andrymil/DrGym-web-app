import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import type { ReactNode } from 'react';
import type { DialogTitleProps } from '@mui/material/DialogTitle';

type FriendFormTitleProps = DialogTitleProps & {
  children: ReactNode;
  onClose: () => void;
};

const FriendFormTitle = ({
  children,
  onClose,
  ...other
}: FriendFormTitleProps) => {
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <Tooltip title="Close" arrow placement="left">
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 12,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </DialogTitle>
  );
};

export default FriendFormTitle;
