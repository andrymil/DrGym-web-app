import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

type CustomInputProps = TextFieldProps & {
  label: string;
  errorStr?: string;
  touched?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setHasChanges?: (value: React.SetStateAction<boolean>) => void;
};

const CustomInput = ({
  label,
  value,
  errorStr,
  touched,
  handleChange,
  setHasChanges,
  ...rest
}: CustomInputProps) => {
  const showError = !!errorStr && (!!touched || !!value);

  return (
    <TextField
      {...rest}
      error={showError}
      label={showError ? errorStr : label}
      type="number"
      value={value || ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        if (setHasChanges) {
          setHasChanges(true);
        }
        const value = e.target.value;
        if (!value || parseInt(value, 10) >= 0) {
          handleChange(e);
        }
      }}
      slotProps={{
        htmlInput: {
          min: 0,
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === '-' || e.key === 'e') {
              e.preventDefault();
            }
          },
        },
      }}
    />
  );
};

export default CustomInput;
