import { useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
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
import FriendFormTitle from './FriendFormTitle';
import CustomInput from '@/components/CustomInput';
import {
  UsernameSchema,
  UsernameDefaultValues,
} from '../../../schemas/UsernameSchema';
import { getUsername } from '@/utils/localStorage';
import type { SetState, WithAppMessage } from '@/types/general';

type FriendFormProps = WithAppMessage & {
  popupStatus: boolean;
  togglePopup: SetState<boolean>;
};

type FriendFormValues = {
  username: string;
};

export default function FriendForm({
  popupStatus,
  togglePopup,
  showAppMessage,
}: FriendFormProps) {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const username = getUsername();

  const handleAddFriend = async (
    formData: FriendFormValues,
    form: FormikHelpers<FriendFormValues>
  ) => {
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
          text: response.data as string,
          type: 'error',
        });
      } else {
        showAppMessage({
          status: true,
          text: response.data as string,
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
      <FriendFormTitle id="new-friend-dialog" onClose={handleClose}>
        Add friend
      </FriendFormTitle>
      <Formik<FriendFormValues>
        initialValues={UsernameDefaultValues()}
        validationSchema={UsernameSchema()}
        onSubmit={handleAddFriend}
      >
        {({
          errors,
          handleBlur,
          handleChange,
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
                                void setFieldValue('username', '', false);
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
