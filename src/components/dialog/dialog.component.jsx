import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function CustomDialog(
{
    open,
    setOpen,
    proceedButtonText,
    proceedButtonClick,
    cancelButtonText
}
) {
//   const [open, setOpen] = React.useState(false);

//   const proceedButtonClick = () => {
//     setOpen(true);
//   };
  const handleButtonClick=()=>{
    setOpen(false)
    proceedButtonClick()
  }
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div >
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
     
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to proceed ?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleButtonClick}>{proceedButtonText}</Button>
          <Button onClick={handleClose} autoFocus>
            {cancelButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
    </div>
    
  );
}