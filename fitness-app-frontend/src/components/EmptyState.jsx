import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  sx = {} 
}) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        px: 2,
        ...sx
      }}
    >
      {icon && (
        <Box sx={{ mb: 2, color: 'text.secondary' }}>
          {React.cloneElement(icon, { sx: { fontSize: 64 } })}
        </Box>
      )}
      
      {title && (
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
      )}
      
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      
      {action}
    </Box>
  );
};

export default EmptyState;