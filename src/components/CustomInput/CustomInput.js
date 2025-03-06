import React from 'react';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';

const CustomInput = ({
  label,
  name,
  type = 'text',
  value,
  error,
  touched,
  onBlur,
  onChange,
  tabIndex,
  endAdornment,
  ...rest
}) => {
  const showError = !!error && (!!touched || !!value);

  return (
    <FormControl fullWidth>
      <InputLabel error={showError}>
        {showError ? `${label} - ${error}` : label}
      </InputLabel>
      <OutlinedInput
        error={showError}
        label={showError ? `${label} - ${error}` : label}
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
