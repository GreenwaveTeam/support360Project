import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';

export default function SnackbarComponent({ openPopup, setOpenPopup, dialogMessage,snackbarSeverity }) {
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  // Render the Snackbar component if openPopup is true
  return (
    <Snackbar
      open={openPopup}
      //autoHideDuration={1000}
      
      onClose={handleClosePopup}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Positioning top right
      className="custom-snackbar" // Apply custom CSS class
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClosePopup}
        severity={snackbarSeverity!==null?snackbarSeverity:"error"} // You can adjust severity based on your requirement
        sx={{ width: '100%' }}
      >
        {dialogMessage}
        
      </MuiAlert>
    </Snackbar>
  );
}
