import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import React, { Fragment } from 'react'
import VerifiedIcon from '@mui/icons-material/Verified';

export default function TicketDialog({ticketDialogOpen, setTicketDialogOpen, ticketNumber }) {

    const handleTicketDialogClose = (event,reason) => {
        console.log('handleTicketDialogClose() called ')
        if (reason && reason === "backdropClick") 
              return;
        setTicketDialogOpen(false);
        };
  return (
    <div >
    <Fragment>
          <Dialog
        open={ticketDialogOpen}
      >
        <DialogTitle id="ticket-dialog">
        <div style={{display:'flex'}}>
          <VerifiedIcon  sx={{color:'green'}}/>&nbsp;
          <span style={{fontSize:"17px",fontWeight:'bold'}}>
              Ticket raised successfully !
          </span>
          </div>
          <center>
          <div  style={{fontSize:"17px",marginLeft:'10px'}}>
          Ticket Number : 
            <span style={{fontSize:"17px",fontWeight:'bold',color:'red'}}>
           {ticketNumber}
          </span>
          </div>
          </center>
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleTicketDialogClose}
          variant="contained" size="small" 
          >
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
    </div>
  )
}
