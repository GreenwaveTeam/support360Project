import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
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
        <div style={{display:'flex'}}>
          <WarningAmberIcon  sx={{color:'#FFC700'}}/>&nbsp;
          <span style={{fontSize:"17px"}}>
              Are you sure you want to proceed ?
          </span>
          </div>
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleButtonClick} style={{color:'red',fontWeight:'bold'}}>{proceedButtonText}</Button>
          <Button onClick={handleClose} autoFocus style={{fontWeight:'bold'}}>
            {cancelButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
    </div>
    
  );
}