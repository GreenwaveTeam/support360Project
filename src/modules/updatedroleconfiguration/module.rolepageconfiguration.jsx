import React, { useState } from 'react';
import { Button} from '@mui/material';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import axios from 'axios';
import { Box } from '@mui/system';



export default function RolepageconfigurationUpdated() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selection, setSelection] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [snackbarPopup, setSnackbarPopup] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [snackbarSeverity, setsnackbarSeverity] = useState('');
    const [componentName,setComponentName]=useState('')
    const [data,setData]=useState([])
    const [page,setPage]=useState('')
    const DB_IP = process.env.REACT_APP_SERVERIP;
  
    
    const handleAddComponent=async()=>{
        try{
        const details={
            page:page,component:componentName,left:selection.left
            ,top:selection.top,width:selection.width,height:selection.height,
            pageImage:Array.from(selectedFile)
        }
        console.log("Handle Add Component:",details)
        setData([...data,details])
        setShowPopup(false)
        const response = await axios.post(
            `http://${DB_IP}/role/addpagecomponent`,
            details,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
        }catch(err){
            console.log("Error:",err)
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result;
                const base64String = dataUrl.split(',')[1];
                const byteCharacters = atob(base64String);
                const byteArray = new Uint8Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteArray[i] = byteCharacters.charCodeAt(i);
                }
                setSelectedFile(byteArray);
                console.log("Byte array::",byteArray)
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMouseDown = (event) => {
        const image = event.target;
        const imageRect = image.getBoundingClientRect();
        const imageWidth = image.width;
        const imageHeight = image.height;
        const startX = (event.clientX - imageRect.left) / imageWidth;
        const startY = (event.clientY - imageRect.top) / imageHeight;
        let detailsToCheckOverlap = null;
        let isMouseMoved = false;

        const handleMouseMove = (event) => {
            isMouseMoved = true;
            const endX = (event.clientX - imageRect.left) / imageWidth;
            const endY = (event.clientY - imageRect.top) / imageHeight;

            let left = Math.min(startX, endX);
            let top = Math.min(startY, endY);
            let width = Math.abs(endX - startX);
            let height = Math.abs(endY - startY);

            left = Math.max(Math.min(left, 1), 0);
            top = Math.max(Math.min(top, 1), 0);
            width = Math.max(Math.min(width, 1 - left), 0);
            height = Math.max(Math.min(height, 1 - top), 0);

            setSelection({ left, top, width, height });
            detailsToCheckOverlap = { left, top, width, height };
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            if (!isMouseMoved) return;

            setShowPopup(true);
            const overlaps = handleOverlapCheck(detailsToCheckOverlap);

            if (overlaps) {
                setsnackbarSeverity('error');
                setSnackbarPopup(true);
                setDialogMessage('Overlap is strictly restricted');
                setShowPopup(false);
                setSelection(null);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (event) => {
        const imageRef = event.target;
        const imageRect = imageRef.getBoundingClientRect();
        const imageWidth = imageRect.width;
        const imageHeight = imageRect.height;
        const touch = event.touches[0];
        const startX = (touch.clientX - imageRect.left) / imageWidth;
        const startY = (touch.clientY - imageRect.top) / imageHeight;
        let detailsToCheckOverlap = null;
        let isTouchMoved = false;

        const handleTouchMove = (event) => {
            isTouchMoved = true;
            const touch = event.touches[0];
            const endX = (touch.clientX - imageRect.left) / imageWidth;
            const endY = (touch.clientY - imageRect.top) / imageHeight;

            let left = Math.min(startX, endX);
            let top = Math.min(startY, endY);
            let width = Math.abs(endX - startX);
            let height = Math.abs(endY - startY);

            left = Math.max(Math.min(left, 1), 0);
            top = Math.max(Math.min(top, 1), 0);
            width = Math.max(Math.min(width, 1 - left), 0);
            height = Math.max(Math.min(height, 1 - top), 0);

            setSelection({ left, top, width, height });
            detailsToCheckOverlap = { left, top, width, height };
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            if (!isTouchMoved) return;

            setShowPopup(true);
            const overlaps = handleOverlapCheck(detailsToCheckOverlap);

            if (overlaps) {
                setsnackbarSeverity('error');
                setSnackbarPopup(true);
                setDialogMessage('Overlap is strictly restricted');
                setShowPopup(false);
                setSelection(null);
            }
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    };

    const handleOverlapCheck = (details) => {
        // Implement your logic to check for overlaps
        return false; // Placeholder return
    };

    return (
        <div>
            {!selectedFile &&
            <>
            <InputText value={page} onChange={(event)=>setPage(event.target.value)}/>
            <Button
                variant="contained"
                component="label"
                color="success"
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    handleFileChange(e);
                }}
            >
                Upload Image
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    multiple={false}
                />
            </Button>
            </>
            }
            {selectedFile && (
                <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "80vh",
                  objectFit: "contain",
                }}
              >   <img
                        src={URL.createObjectURL(new Blob([selectedFile]))}
                        alt="Uploaded"
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        draggable={false}
                        style={{
                            cursor: "crosshair",
                            width: "100%",
                            height: "100%",
                          }}
                    />
                    {selection && (
                        <div
                            style={{
                                position: 'absolute',
                                left: `${selection.left * 100}%`,
                                top: `${selection.top * 100}%`,
                                width: `${selection.width * 100}%`,
                                height: `${selection.height * 100}%`,
                                border: '2px dashed rgba(255, 0, 0, 0.5)',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                    {showPopup &&
                    
                        <Dialog header={"Enter Component Name"} visible={showPopup} onHide={()=>setShowPopup(false)}>
                            <InputText value={componentName} onChange={(event)=>setComponentName(event.target.value)}/>
                            <Button onClick={handleAddComponent} variant='contained'>Submit</Button>
                        </Dialog>

                    }
                </Box>
            )}
        </div>
    );
}
