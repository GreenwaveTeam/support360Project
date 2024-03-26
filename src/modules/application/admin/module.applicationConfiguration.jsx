import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Divider, Typography } from '@mui/material'
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

/*Navigation Pane*/
import Sidebar from '../../../components/navigation/sidebar/sidebar';
import Topbar from '../../../components/navigation/topbar/topbar';
import Main from '../../../components/navigation/mainbody/mainbody';
import DrawerHeader from '../../../components/navigation/drawerheader/drawerheader.component';


/*Custom Components*/
import Table from '../../../components/table/table.component'
import DialogBox from "../../../components/dialog/customsnackbar.component";
import TextField from "../../../components/textfield/textfield.component";

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from'sweetalert2'

export default function ModuleConfiguration() {
  const plantid='P009'
    const [open, setOpen] = useState(false);
    const [application_name,setApplication_name]=useState('')
    const [dialogPopup, setDialogPopup] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [snackbarSeverity,setsnackbarSeverity]=useState(null)
    const columns=[
      {
        "id": "application_name",
        "label": "Application Name",
        "type": "textbox",
        "canRepeatSameValue":false
      },
      
    ]  
    const [data,setData]=useState([])
    const [filteredRows,setFilteredRows]=useState([])
    const navigate=useNavigate()
    const handleDrawerOpen = () => {
        setOpen(true);
      };
    
      const handleDrawerClose = () => {
        setOpen(false);
      };
    
    
  const urllist = [
    { pageName: "Application", pagelink: "/Application" }
  ];useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:9080/application/admin/${plantid}`);
        const moduleData = response.data;
        setData(moduleData);
        setFilteredRows(moduleData)
        console.log(moduleData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

    const [editRow,setEditRow]=useState(false)
    const handleEditSave=()=>{

    }
    const handleDeleteClick=async(rowData)=>{
      
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
          try{ 
              const requestBody = {
                plant_id: plantid,
                application_name: rowData.application_name 
                // Add other properties from rowData if needed
              };     
              console.log("Request body=>"+JSON.stringify(requestBody))
              axios.delete(`http://localhost:9080/application/admin/plantid/applicationname`,{ data: requestBody });
             const updatedCategories = data.filter(app => app.application_name !== rowData.application_name);
            setData(updatedCategories);
          }catch(e)
          {
            console.log("Exception")
          }
          

        }})
      
       
    }
  
    const handleSaveClick = async (prev, rowData) => {
  console.log("applicationedit===>" + JSON.stringify(rowData));
  
  // Create a request body object
  

  try {
    // Send requestBody as request body in the PUT request
    const response = await axios.put(`http://localhost:9080/application/admin/${plantid}/${prev.application_name}`, rowData);
    console.log("Posted data");
  } catch (error) {
    console.error('Error:', error);
    // Handle errors, such as displaying an error message to the user
  }
};

    
    const handleEditCancel=()=>{

    }
    
    const handleRedirect=(appdata)=>{
      console.log(appdata)
      navigate(`/Application/Modules`, {
        state: { application_data:appdata},
      });
    }
    const handleSubmit = (event) => {
      event.preventDefault()
      if(data.some(app=>app.application_name===application_name)){
        setDialogPopup(true);
        setDialogMessage("Application Name already Exists")
        setsnackbarSeverity('error')
        return
      }
      if(application_name.trim()===''){
        setDialogPopup(true);
        setDialogMessage("Application Name cannot remain blank")
        setsnackbarSeverity('error')
        return
      }
      const regex = /[^A-Za-z0-9 _]/;
      if (regex.test(application_name.trim())) {
        setsnackbarSeverity('error')
        setDialogPopup(true);
        setDialogMessage('Special characters are not allowed');
        return true;
      }
      console.log("Application name:"+application_name);
      navigate(`/Application/`+'Module', {
        state: { application_name:application_name},
      });
    };

    
    return (
   
        <Box sx={{ display: 'flex' }}>
      <Topbar open={open} handleDrawerOpen={handleDrawerOpen} urllist={urllist} />
      <Sidebar
        open={open}
        handleDrawerClose={handleDrawerClose}
        adminList={[{ pagename: 'Issue Category', pagelink: '/IssueCategory' }, { pagename: 'Issue', pagelink: '/Issue' }]}
        userList={['User Item 1', 'User Item 2', 'User Item 3']}
      />
      <Main open={open}>
      <DrawerHeader />
      <Box >
        <Container>
      <form onSubmit={handleSubmit} >
              <TextField
                label={'Application Name'}
                id="issuecategory"
                onChange={(e)=>{setApplication_name(e.target.value)}}
              />
            &nbsp; &nbsp;
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
            </form>
            {/* <Box boxShadow={3} p={3} borderRadius={10}  
            sx={{backgroundColor: "#B5C0D0",display: 'flex',flexDirection:'column',width:'40%',
            justifyContent: 'center',}}alignItems={'center'} marginTop={'10px'}>
            <Typography variant="h6"fontWeight={900} gutterBottom >Existing Application</Typography>
            
            
            <DataTable
                value={data}
                paginator
                
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                 width="100%" height="100%"
            >
                <Column
                field="applicationname"
                header="Existing Application"
                body={(rowData) => (
                        <Typography variant="body1">{rowData.application_name}</Typography>
                    )}/>
                <Column
          
          body={(rowData) => (
            <>

                  <ArrowForwardIcon onClick={() => {handleRedirect(rowData)}} />
                  <DeleteIcon onClick={() => handleDeleteClick(rowData)} />
                </>
          )}
        />
                
            </DataTable> 
            </Box>*/}
            </Container>
            &nbsp;
            <Table rows={data} setRows={setData} 
            redirectColumn={'application_name'} columns={columns} savetoDatabse={handleSaveClick} handleRedirect={handleRedirect} deleteFromDatabase={handleDeleteClick}
            editActive={true} tablename={"Existing Applications"} /*style={}*/ redirectIconActive={true}/>
            </Box>
            <DialogBox snackbarSeverity={snackbarSeverity}openPopup={dialogPopup} setOpenPopup={setDialogPopup} dialogMessage={dialogMessage}/>
    </Main>
    </Box>

  )
}
