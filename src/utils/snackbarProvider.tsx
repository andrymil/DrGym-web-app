import React, { useState, useCallback, ComponentType } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type Message = {
  status: boolean;
  text: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

type WithSnackbarProps = {
  showAppMessage: (message: Message) => void;
};

export function withSnackbar<P extends object>(
  WrappedComponent: ComponentType<P & WithSnackbarProps>
): React.FC<P> {
  const WithSnackbar: React.FC<P> = (props) => {
    const [appMessage, setAppMessageState] = useState<Message>({
      status: false,
      text: '',
      type: 'info',
    });

    const setAppMessage = useCallback((message: Message) => {
      setAppMessageState(message);
    }, []);

    const handleCloseSnackbar = (
      _event?: React.SyntheticEvent | Event,
      reason?: string
    ) => {
      if (reason === 'clickaway') return;
      setAppMessage({ status: false, text: '', type: appMessage.type });
    };

    return (
      <>
        <WrappedComponent {...props} showAppMessage={setAppMessage} />
        <Snackbar
          open={appMessage.status}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={(event) => handleCloseSnackbar(event, 'closeButton')}
            severity={appMessage.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {appMessage.text}
          </Alert>
        </Snackbar>
      </>
    );
  };

  WithSnackbar.displayName = `WithSnackbar(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithSnackbar;
}
