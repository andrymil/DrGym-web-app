import React, { useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const withSnackbar = (WrappedComponent) => {
  const WithSnackbar = (props) => {
    const [appMessage, setAppMessageState] = useState({
      status: false,
      text: null,
      type: null,
    });

    const setAppMessage = useCallback((message) => {
      setAppMessageState(message);
    }, []);

    const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      setAppMessage({ status: false, text: '', type: appMessage.type });
    };

    return (
      <>
        <WrappedComponent {...props} showAppMessage={setAppMessage} />
        <Snackbar
          open={appMessage?.status}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={(event) => handleCloseSnackbar(event, 'closeButton')}
            severity={appMessage?.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {appMessage?.text}
          </Alert>
        </Snackbar>
      </>
    );
  };

  WithSnackbar.displayName = `WithSnackbar(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithSnackbar;
};
