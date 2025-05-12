import { useState } from 'react';
import { Formik, Form } from 'formik';
import {
  CircularProgress,
  InputAdornment,
  Button,
  Dialog,
  DialogContent,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import api from '@/utils/axiosInstance';
import FriendDialogTitle from './FriendDialogTitle';
import CustomInput from '@/components/CustomInput';
import {
  UsernameSchema,
  UsernameDefaultValues,
} from '@/utils/schemas/UsernameSchema';
import { getUsername } from '@/utils/localStorage';
import type { ShowAppMessage, SetState } from '@/types/general';

type FriendDialogProps = {
  popupStatus: boolean;
  togglePopup: SetState<boolean>;
  showAppMessage: ShowAppMessage;
};

export default function FriendDialog({
  popupStatus,
  togglePopup,
  showAppMessage,
}: FriendDialogProps) {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const username = getUsername();

  const handleAddFriend = async (formData, form) => {
    try {
      if (formData.username === username) {
        form.setFieldError('username', 'it is you');
        showAppMessage({
          status: true,
          text: 'You cannot add yourself as a friend.',
          type: 'error',
        });
        return;
      }
      setLoading(true);
      const response = await api.post(`/api/friends/sendRequest`, {
        sender: username,
        receiver: formData.username,
      });
      if (response.data === 'Request sent') {
        showAppMessage({
          status: true,
          text: `Friend request to ${formData.username} has been sent.`,
          type: 'success',
        });
        handleClose();
      } else if (
        response.data === 'There is no account associated with this username.'
      ) {
        form.setFieldError('username', 'no account found');
        showAppMessage({
          status: true,
          text: response.data,
          type: 'error',
        });
      } else {
        showAppMessage({
          status: true,
          text: response.data,
          type: 'info',
        });
        handleClose();
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      showAppMessage({
        status: true,
        text: 'Something went wrong.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    togglePopup(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      open={popupStatus}
      aria-labelledby="new-friend-dialog"
    >
      <FriendDialogTitle id="new-friend-dialog" onClose={handleClose}>
        Add friend
      </FriendDialogTitle>
      <Formik
        initialValues={UsernameDefaultValues()}
        validationSchema={UsernameSchema()}
        onSubmit={handleAddFriend}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          isValid,
          setFieldError,
          setFieldValue,
          touched,
          values,
        }) => {
          return (
            <Form>
              <DialogContent sx={{ p: 3, pt: 1 }}>
                <Grid container direction="column" gap={2}>
                  <Grid size={12}>
                    <CustomInput
                      label="Username"
                      name="username"
                      type="username"
                      value={values.username}
                      errorStr={errors.username}
                      touched={!!touched.username}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      tabIndex={0}
                      endAdornment={
                        values.username && (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                setFieldValue('username', '', false);
                                setFieldError('username', null);
                              }}
                            >
                              <CloseIcon color="primary" />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      endIcon={
                        loading && (
                          <CircularProgress color="primary" size={18} />
                        )
                      }
                    >
                      Send friend request
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
