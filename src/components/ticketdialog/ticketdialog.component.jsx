import { Button, Dialog, DialogActions, DialogTitle, IconButton, Tooltip } from '@mui/material'
import React, { Fragment, useState } from 'react'
import VerifiedIcon from '@mui/icons-material/Verified';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


export default function TicketDialog({ticketDialogOpen, setTicketDialogOpen, ticketNumber }) {

    const handleTicketDialogClose = (event,reason) => {
        console.log('handleTicketDialogClose() called ')
        if (reason && reason === "backdropClick") 
              return;
        setTicketDialogOpen(false);
        };

        const [copyText,setCopyText]=useState("Copy")

        const handleCopyText=async (e)=>
        {
            setCopyText('Copied!')
            await navigator.clipboard.writeText(ticketNumber)
            setTimeout(()=>
            {
              setCopyText('Copy')
            },5000)
        }
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
          &nbsp;
          <Tooltip title={copyText} placement="top-end" >
          <IconButton onClick={handleCopyText}>
          <ContentCopyIcon fontSize='small'/>
          </IconButton>
          </Tooltip>
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
