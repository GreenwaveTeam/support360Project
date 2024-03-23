import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Container, MenuItem, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Dialog from '@mui/material/Dialog';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2'

/*Navigation Pane*/
import Sidebar from '../../components/navigation/sidebar/sidebar';
import Topbar from '../../components/navigation/topbar/topbar';
import Main from '../../components/navigation/mainbody/mainbody';
import DrawerHeader from '../../components/navigation/drawerheader/drawerheader.component';


/*Custom Components*/
import Table from '../../components/table/table.component'
import DialogBox from "../../components/dialog/dialog.component";
import TextField from "../../components/textfield/textfield.component";
import Dropdown from '../../components/dropdown/dropdown.component';


const Application = () => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [dialogPopup, setDialogPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  const [issueName,setIssueName]=useState(null)
  const [severity,setSeverity]=useState(null)
  const [issues,setissues]=useState([])
  const [dialogMessage,setDialogMessage]=useState(null)
  const [categories,setCategories]=useState([])
  const plantid='P009'
  const columns=[
    {
      "id": "issuename",
      "label": "Issue Name",
      "type": "textbox",
      "canRepeatSameValue":false
    },
    {
      "id": "severity",
      "label": "Severity",
      "type": "dropdown",
      "canRepeatSameValue":true,
      values:["Critical","Major","Minor"]
    },
  ]  
  const [selectedByteArray,setSelectedByteArray]=useState([])
  const [categoryname,setCategoryname]=useState(null)
  const location = useLocation();
  const application_name=location.state.application_name
  const [module_Name,setModule_Name]=useState(application_name+"_Module_")
  const urllist = [{ pageName: "Application", pagelink: "/Application" },
  { pageName: "Module", pagelink: "/Application"+'/Module'},
];
const [categorySubmitted,setCategorySubmitted]=useState(false)
const handleAddCategory=()=>{
  console.log(categories)
  console.log(categoryname)
  if(categories.includes(categoryname)){
    setDialogPopup(true);
    setDialogMessage("Category Name already Exists")
    setCategorySubmitted(false)
    return   
  }
  if(checkInput(categoryname))
    return
  setCategories([...categories,categoryname])
  setCategorySubmitted(true)
    
}
  const handleAreaClick=(area)=>{
    /*Display the listif issues selected with the div*/
    setShowPopup(true)
    setSelection(area)
    setissues(area.issues)
    setCategoryname(area.categoryname)
    setCategorySubmitted(true)
  } 
  const handleClosePopupForm=async()=>{
    setShowPopup(false)
    setSelection(null)
    setCategorySubmitted(false)
    setIssueName('')
    setSeverity('')
    setCategoryname('')

    setissues([])
  }
 
	  const handleEditIssue = async(prev,rowData) => {
		console.log("Handle delete")
		//console.log("Row data==>"+JSON.stringify(rowData))
		
		await axios.delete(`http://localhost:9080/application/admin/${plantid}/`+application_name+'/'+module_Name+'/'+categoryname+'/'+prev.issuename);
		if (selection) {
			const details = {
				left: selection.left,
				top: selection.top,
				width: selection.width,
				height: selection.height,
				categoryname: categoryname,
				issues: [rowData],
			};
			
			const requestData = {
				plant_id: '${plantid}',
				application_name: application_name,
				
				modulelist: [{modulename: module_Name, moduleimage: Array.from(selectedByteArray), issueslist: [details] }],
			};
			console.log(JSON.stringify(requestData))
			const detail = {
				left: selection.left,
				top: selection.top,
				width: selection.width,
				height: selection.height,
				categoryname: categoryname,
				issues: [...issues,{issuename: issueName, severity: severity }],
			};
			setSelectedAreas([...selectedAreas, detail]);
      
			try {
				// Here requestData contains entire module data including module_image
				const response = await axios.post('http://localhost:9080/application/admin/plant_id/application_name/moduleName', requestData);
				console.log("Posted data")
			} catch (error) {
				console.error('Error:', error);
			}
		}
	};
	
  const handleDeleteIssue=async(rowData)=>{
    console.log("Handle delete")
		await axios.delete('http://localhost:9080/application/admin/${plantid}/'+application_name+'/'+module_Name+'/'+categoryname+'/'+rowData.issuename);

  }
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setImageUrl(null); // Clear previous image URL when selecting a new file
    console.log("handle upload");
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
 
        const dataUrl = reader.result;
        const base64String = dataUrl.split(",")[1];
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        console.log("Byte Array====>"+byteArray)
        setSelectedByteArray(byteArray);
      };
      reader.readAsDataURL(file);
    }
    console.log("Outside====>")
    
    }
  

  
    const handleDeleteArea = async(e, area) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
      try{e.stopPropagation(); 
      setSelectedAreas(prev => prev.filter((areatodel, index) => areatodel.categoryname!==area.categoryname));
      setCategories(prev => prev.filter(category => category !== area.categoryname));
      const response =  axios.delete(`http://localhost:9080/application/admin/${plantid}/${application_name}/${module_Name}/${area.categoryname}`);
			// Optionally, update the UI or perform any additional actions after successful deletion
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    } catch (error) {
			console.error('Error deleting data:', error);
			// Handle errors, such as displaying an error message to the user
		}
  }

  });
  };
  
  useEffect(() => {
    console.log("Use Effect selected file");
    if (selectedFile) {
      setImageUrl(URL.createObjectURL(selectedFile)); // Set uploaded image URL
    } else {
      console.log('No file selected');
    }
  }, [selectedFile]);
  
  const handleModuleNameChange=async(e)=>{
    setModule_Name(e.target.value)
  }
  const handleMouseDown = async (event) => {
    setShowPopup(false);
    const image = event.target;
    const imageRect = image.getBoundingClientRect();
    const imageWidth = image.width;
    const imageHeight = image.height;
    const startX = (event.clientX - imageRect.left) / imageWidth;
    const startY = (event.clientY - imageRect.top) / imageHeight;
    let detailsToCheckOverlap=null
    let isMouseMoved=false

    const handleMouseMove = async (event) => {
      isMouseMoved=true
      const endX = (event.clientX - imageRect.left) / imageWidth;
      const endY = (event.clientY - imageRect.top) / imageHeight;

      const left = Math.min(startX, endX);
      const top = Math.min(startY, endY);
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);

      setSelection({ left, top, width, height });
      detailsToCheckOverlap={left, top, width, height }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if(!isMouseMoved)
      return
      setissues([])
      setShowPopup(true);
      const overlaps=handleOverlapCheck(detailsToCheckOverlap)

      if (overlaps) {
        setDialogPopup(true);
        setDialogMessage("Overlap is strictly restricted")
        setShowPopup(false);
        setSelection(null);
        return;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
   }
  const handleAddIssue=(event)=>{
    event.preventDefault();
    console.log("Handle Add Issue")
    const newIssue={issuename:issueName,severity:severity}
    const issueExists = (issues, issuename, issueName) => {
      // Use some() to iterate over each object in the list
      return( issues.some(obj => {
          // Check if the specified key of the object contains the search string
          return obj[issuename] === issueName;
      }))

  };
  if(issueExists(issues, 'issuename', issueName))
  {
    console.log("Issue===>"+issueExists+JSON.stringify(issues))
    setDialogPopup(true);
    setDialogMessage("Issue Name already exists")
    return
  }
  if(issueName===null|| severity===null||issueName.trim()==='' || severity.trim===''){
	
		setDialogPopup(true);
		setDialogMessage('Please provide both issue name and severity.');
		return 
	
  }
  if(!checkInput(issueName)){
    
    setissues(prevIssues=>{
        if(prevIssues&&issueName&&severity)
            return [...prevIssues,newIssue]
        else if(issueName&&severity)
            return [newIssue]
        
    })
    handleCoordinateSubmit(event)
  }
  }
  const handleCoordinateSubmit = async (event) => {
    event.preventDefault();

    if (selection) {
      
      const details = {
				left: selection.left,
				top: selection.top,
				width: selection.width,
				height: selection.height,
				categoryname: categoryname,
				issues: [{issuename: issueName, severity: severity }],
			};
      

      console.log(selection.left, selection.top);
      console.log(details);
      const detail = {
				left: selection.left,
				top: selection.top,
				width: selection.width,
				height: selection.height,
				categoryname: categoryname,
        issues: [...issues,{issuename: issueName, severity: severity }],
			};

      // Update selectedAreas with the new details
      setSelectedAreas([...selectedAreas, detail]);
      console.log(selectedAreas)
      const requestData = {
				plant_id: '${plantid}',
				application_name: application_name,
				
				modulelist: [{modulename: module_Name, moduleimage: Array.from(selectedByteArray), issueslist: [details] }],
			};
			console.log(JSON.stringify(requestData))
			try {
				// Here requestData contains entire module data including module_image
				const response = await axios.post('http://localhost:9080/application/admin/plant_id/application_name/moduleName', requestData);
				console.log("Posted data")
			} catch (error) {
				console.error('Error:', error);
			}
		}
      //setShowPopup(false);
    
  };
  const handleOverlapCheck=(details)=>{
      return selectedAreas.some((existing) => {
        const rightExisting = existing.left + existing.width;
        const rightNew = details.left + details.width;
        const bottomExisting = existing.top + existing.height;
        const bottomNew = details.top + details.height;

        return (
          (rightExisting < rightNew && existing.left > details.left && bottomExisting < bottomNew && existing.top > details.top) ||
          (rightExisting > details.left && rightExisting < rightNew && bottomExisting > details.top && bottomExisting < bottomNew) ||
          (existing.left > details.left && existing.left < rightNew && existing.top > details.top && existing.top < bottomNew) ||
          (existing.top > details.top && bottomExisting < bottomNew && existing.left < details.left && rightExisting > rightNew) ||
          (existing.top < details.top && bottomExisting > bottomNew && existing.left < details.left && rightExisting > rightNew) ||
          (existing.top < bottomNew && bottomExisting > bottomNew && existing.left < details.left && rightExisting > rightNew)||
          (rightExisting > rightNew && existing.left < rightNew && existing.top<details.top  && bottomExisting > details.top)||
          (existing.left < details.left && rightExisting > details.left && existing.top<details.top  && bottomExisting > details.top)||
          (existing.top < bottomNew && bottomExisting > bottomNew  && existing.left<details.left  && rightExisting > details.left)
        );
      });
  }

  const handleSubmit =  async() => {
    if (selectedFile && selectedAreas) {
      
      if(checkInput(module_Name))
        return
      if(selectedAreas.length===0)
      {  setDialogMessage("Configure issue details")
         setDialogPopup(true)
         return
      }
      const requestData = {
        plant_id: '${plantid}',
        application_name: application_name,
        module_name:module_Name,
        selectedFile:selectedFile,
        
        issueslist:selectedAreas,
        module_image:Array.from(selectedByteArray)
      };
      console.log("Module name:"+module_Name)
      console.log("Request Data====>"+JSON.stringify(requestData))
      //Send formData to the new API endpoint
      try {
        const response = await fetch('http://localhost:9080/application/admin/plant_id/application_name/moduleName', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });
        //const data = await response.json();
        //console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('Please select a file and draw an area before submitting.');
    }
    setCategoryname("")
    setIssueName("")
    setSeverity("Minor")
  };
  
  const checkInput=(input)=>{
    console.log("Check Input===>"+input)
    if(input==null||input.trim()=='')
      {  setDialogMessage("Empty string is not allowed")
         setDialogPopup(true)
         return true
      }
    const regex = /[^A-Za-z0-9 _]/;
    if(regex.test(input.trim())) {
      setDialogPopup(true);
      setDialogMessage("Special Character is not allowed")
      return true
    }
    return false
}
  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar open={open} handleDrawerOpen={() => setOpen(true)} urllist={urllist} />
      <Sidebar
        open={open}
        handleDrawerClose={() => setOpen(false)}
        adminList={[{ pagename: 'Issue Category', pagelink: '/IssueCategory' }, 
        { pagename: 'Application', pagelink: '/Application' },]}
        userList={['User Item 1', 'User Item 2', 'User Item 3']}
      />
      <Main open={open}>
        <DrawerHeader />
        
        {!imageUrl && (
            
        <form  style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
              <TextField
                label={'Enter Module  Name'}
                id="issuecategory"
                sx={{ width: '300px' }}
                value={module_Name}
                onChange={handleModuleNameChange}
              />
              
          </div>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Button>
        </form>
        )}
        
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              onMouseDown={handleMouseDown}
              style={{ cursor: 'crosshair', width: '100%', height: '100%' }}
            />
          )}

          {/* Render selected areas */}
          {selectedAreas.map((area, index) => (
  <div
    key={index}
    onClick={() => handleAreaClick(area)}
    style={{
      position: 'absolute',
      left: `${area.left * 100}%`,
      top: `${area.top * 100}%`,
      width: `${area.width * 100}%`,
      height: `${area.height * 100}%`,
      border: '2px solid #2196f3', // Blue color
      backgroundColor: 'rgba(33, 150, 243, 0.5)', // Semi-transparent blue
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = 'rgba(33, 150, 243, 0.7)'; // Lighter blue on hover
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = 'rgba(33, 150, 243, 0.5)';
    }}
  >
    <DeleteIcon 
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}
      onClick={(e) => {
        e.stopPropagation();
        handleDeleteArea(e,area); // Call a function to delete the area when delete icon is clicked
      }}
    />
  </div>
))}

          {/* Render the selection area */}
          {selection && (
            <div
              style={{
                position: 'absolute',
                left: `${selection.left * 100}%`,
                top: `${selection.top * 100}%`,
                width: `${selection.width * 100}%`,
                height: `${selection.height * 100}%`,
                border: '2px dashed red',
              }}
            />
          )}
          

          {/* Render the pop-up */}
          {showPopup && selection && (
            <Dialog
            open={showPopup} 
            onClose={handleClosePopupForm} width='100%'
            // PaperProps={{
            //   sx: {
            //     boxShadow: 3,
            //     p: 3,
            //     borderRadius: 10,
            //     position: 'fixed',
            //     left: '50%',
            //     transform: 'translate(-50%)',
            //     width: '50%',
            //     top: '10%',
            //     backgroundColor: 'white',
            //     padding: '20px',
            //     overflowY: 'auto',
            //     height: '90%',
            //     boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)',
            //   },
            // }}
          >
            <CloseIcon style={{ cursor: 'pointer', marginRight: 'auto' }}  onClick={handleClosePopupForm} />
              
            <Container  style={{ margin:'5%' }}>
            <form onSubmit={(event) => { handleAddIssue(event,module) }} >
              {!categorySubmitted && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <TextField
                    label={'Category Name'}
                    id="issue"
                    value={categoryname}
                    onChange={(e) => {
                      setCategoryname(e.target.value);
                    }}
                  />&nbsp;&nbsp;
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleAddCategory}
                  >
                    Add&nbsp;
                    <AddCircleOutlineOutlinedIcon
                      fontSize="large"
                      sx={{ color: "white" }}
                    ></AddCircleOutlineOutlinedIcon>
                  </Button>
                </Box>
              )}
              {categorySubmitted && (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <TextField
                      label={'Issue Name'}
                      id="issue"
                      value={issueName}
                      onChange={(e) => setIssueName(e.target.value)}
                    />
                    &nbsp;&nbsp;
                    <Dropdown
                      label={'Severity'}
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)} list={["Critical","Major","Minor"]}
                    />
                     
                    &nbsp;&nbsp;
                    <Button
                      color="primary"
                      variant="contained"
                      type='submit'
                    >
                      Add&nbsp;
                      <AddCircleOutlineOutlinedIcon
                        fontSize="large"
                        sx={{ color: "white" }}
                      ></AddCircleOutlineOutlinedIcon>
                    </Button>
                  </Box>
                  <Table rows={issues} setRows={setissues} savetoDatabse={handleEditIssue} deleteFromDatabase={handleDeleteIssue} columns={columns}/>
                </>
              )}
            </form>
            </Container>
          </Dialog>
          
          )}
        </div>
        
        <DialogBox openPopup={dialogPopup} setOpenPopup={setDialogPopup} dialogMessage={dialogMessage}/>
        
      </Main>
    </Box>
  );
};

export default Application;