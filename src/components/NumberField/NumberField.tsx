import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

type CustomInputProps = TextFieldProps & {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setHasChanges?: (value: React.SetStateAction<boolean>) => void;
};

const CustomInput = ({
  handleChange,
  setHasChanges,
  ...rest
}: CustomInputProps) => {
  return (
    <TextField
      {...rest}
      type="number"
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
