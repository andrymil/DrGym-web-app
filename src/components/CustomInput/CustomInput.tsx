import React from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from '@mui/material';
import type { ReactNode } from 'react';
import { FormikErrors } from 'formik';

type CustomInputProps = OutlinedInputProps & {
  label: string;
  name: string;
  errorStr?: string | FormikErrors<any> | string[] | FormikErrors<any>[];
  touched?: boolean;
  tabIndex?: number;
  endAdornment?: ReactNode;
};

const CustomInput = ({
  label,
  name,
  type = 'text',
  value,
  errorStr,
  touched,
  onBlur,
  onChange,
  tabIndex,
  endAdornment,
  ...rest
}: CustomInputProps) => {
  const showError = !!errorStr && (!!touched || !!value);

  return (
    <FormControl fullWidth>
      <InputLabel error={showError}>
        {showError ? `${label} - ${errorStr}` : label}
      </InputLabel>
      <OutlinedInput
        error={showError}
        label={showError ? `${label} - ${errorStr}` : label}
        name={name}
        type={type}
        value={value || ''}
        onBlur={onBlur}
        onChange={onChange}
        inputProps={{
          tabIndex,
          ...(tabIndex === 1 && { autoFocus: true }),
        }}
        endAdornment={endAdornment}
        {...rest}
      />
    </FormControl>
  );
};

export default CustomInput;
