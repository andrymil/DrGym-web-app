import React from 'react';

export type ShowAppMessage = (args: {
  status: boolean;
  text: string;
  type: string;
}) => void;

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type WithAppMessage = {
  showAppMessage: ShowAppMessage;
};

export type WithCsrfToken = {
  csrfToken: string;
};
