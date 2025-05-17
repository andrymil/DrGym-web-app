import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import style from './DeleteConfirmation.module.css';

type DeleteConfirmationProps = {
  title?: string;
  message: string;
  open: boolean;
  loading: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export default function DeleteConfirmation({
  title = 'Warning!',
  message,
  open,
  loading,
  onConfirm,
  onClose,
}: DeleteConfirmationProps) {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        slotProps={{
          transition: {
            direction: 'up',
          },
        }}
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
            onClick={void onConfirm}
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
