import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import style from './WorkoutFormTitle.module.css';
import Tooltip from '@mui/material/Tooltip';

const WorkoutFormTitle = ({ children, onClose, ...other }) => {
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other} className={style.title}>
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
            <CloseIcon sx={{ color: '#fff' }} />
          </IconButton>
        </Tooltip>
      ) : null}
    </DialogTitle>
  );
};

export default WorkoutFormTitle;
