import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useMediaQuery } from '@mui/system';
import { useTheme } from '@mui/material';
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
        aria-describedby="alert-dialog-description"S
        fullScreen={fullScreen}
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
          <Button sx={{color:'red',fontWeight:'bold'}} onClick={handleButtonClick}>{proceedButtonText}</Button>
          <Button sx={{fontWeight:'bold'}} onClick={handleClose} autoFocus>
            {cancelButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
    </div>
    
  );
}