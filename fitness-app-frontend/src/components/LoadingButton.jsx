import React from 'react';
import { Button, CircularProgress } from '@mui/material';

const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <Button
      {...props}
      disabled={loading || props.disabled}
      startIcon={loading ? <CircularProgress size={20} /> : props.startIcon}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};

export default LoadingButton;