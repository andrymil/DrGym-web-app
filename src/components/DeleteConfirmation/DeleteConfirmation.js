import { forwardRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import style from './DeleteConfirmation.module.css';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteConfirmation({
  title = 'Warning!',
  message,
  open,
  loading,
  onConfirm,
  onClose,
}) {
  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? null : onClose}
        TransitionComponent={Transition}
        aria-labelledby="delete-confirmation"
      >
        <DialogTitle id="delete-confirmation" className={style.dialogTitle}>
          {title}
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>{message}</DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            disabled={loading}
            endIcon={
              loading && <CircularProgress color="secondary" size={18} />
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
