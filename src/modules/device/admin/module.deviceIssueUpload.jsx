import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, MenuItem, Button, Container } from '@mui/material';
import Swal from 'sweetalert2'
/*Navigation Pane*/
import Sidebar from '../../../components/navigation/sidebar/sidebar';
import Topbar from '../../../components/navigation/topbar/topbar';
import Main from '../../../components/navigation/mainbody/mainbody';
import DrawerHeader from '../../../components/navigation/drawerheader/drawerheader.component';


/*Custom Components*/
import Table from '../../../components/table/table.component'
import DialogBox from "../../../components/snackbar/customsnackbar.component";
import TextField from "../../../components/textfield/textfield.component";
import Dropdown from "../../../components/dropdown/dropdown.component";


import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";


const DeviceIssue = () => {
  const [open, setOpen] = useState(false);
  const plantid='P009'
  //const history=useHis
  const location = useLocation();
  const categoryname  = location.state.categoryname;
  console.log("Category:  ", categoryname);
  const issues = location.state.issuelist;
  const [issueList, setIssueList] = useState(issues);
  const [filteredRows,setFilteredRows]=useState(issues)
  const urllist = [
    { pageName: "Device Issue Category", pagelink: "/Device/Category" },
    { pageName: "Device Issue", pagelink: "/"+categoryname+"/Device/Category/Issue" }
  ];
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
  const [issueName, setIssueName] = useState('');
  const [severity, setSeverity] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [snackbarSeverity,setsnackbarSeverity]=useState(null)
  // useEffect(() => {
  //   console.log("Location.state");
  //   // Create a copy of the location object
  //   const updatedLocation = { ...location };
  //   // Update the state inside the copied location object
  //   updatedLocation.state = {
  //     ...updatedLocation.state,
  //     issuelist: issueList
  //   };
  //   // Replace the location with the updated one
  //   window.history.replaceState({issuelist: issueList}, '', location.pathname );
  // }, [issueList]);
    const addIssueCategory = async () => {
      console.log("useEffectIssue")
      
        try {
          const requestData = {
            issuecategoryname: categoryname,
            plantid: plantid,
            issueList: [{issuename: issueName, severity: severity }]
          };
          const response = await axios.post(`http://19:8081/device/admin/${plantid}/categories/`+categoryname, requestData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log(response.data); // Handle response data
        } catch (error) {
          console.error('Error:', error);
        }
      
    };
   
    const editIssueCategory = async (prev,rowData) => {
      console.log("useEffectIssue")
      
        try {
          const requestData = {
            issuecategoryname: categoryname,
            plantid: plantid,
            issueList: [{issuename: rowData.issuename, severity: rowData.severity }]
          };
          console.log("Edit Issue called")
          const response = await axios.put(`http://192.168.7.8:8081/device/admin/${plantid}/categories/${categoryname}/`+prev.issuename, requestData, {headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },});
          console.log(response.data); // Handle response data
        } catch (error) {
          console.error('Error:', error);
        }
      
    };
    const deleteIssueCategory = async (rowdata) => {
      
      console.log("useEffectIssue")
      const requestBody={ 
        plantid: plantid,
        categoryname: categoryname,
        issuename: rowdata.issuename
    } 
        try {
          
          const response = await axios.delete('http://192.168.7.8:8081/device/admin/categories/issue', {data: requestBody},{headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },});
          setIssueList(issueList.filter((issue)=>(issue!==rowdata)));
          console.log("Successfully deleted")
          } catch (error) {
          console.error('Error:', error);
        }
    };
  
  const submitIssue = (event) => {
    event.preventDefault();
    if (issueName.trim() !== '' && severity.trim() !== '') {
      const issueExists = issueList.some(issue => issue.issuename === issueName);

        if (issueExists) {
            setOpenPopup(true);
            setDialogMessage('Issue name already exists.');
            setsnackbarSeverity('error')
            return
        } 
      const newIssue = { issuename: issueName, severity: severity };
      setIssueList(prevIssues => [...prevIssues, newIssue]);
      setFilteredRows(prevIssues => [...prevIssues, newIssue]);
    } else {
      setOpenPopup(true);
      setDialogMessage('Please provide both issue name and severity.');
      setsnackbarSeverity('error')
      return
    }
    addIssueCategory()
    setIssueName('');
    setSeverity('');
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar open={open} handleDrawerOpen={handleDrawerOpen} urllist={urllist} />
      <Sidebar
        open={open}
        handleDrawerClose={handleDrawerClose}
        adminList={[
          {
            pagename: "Device Issue Category",
            pagelink: "/admin/Device/CategoryConfigure",
          },
          { pagename: "Application", pagelink: "/admin/ApplicationConfigure" },
          { pagename: "Device ", pagelink: "/admin/DeviceConfigure" },
          {
            pagename: "Infrastructure ",
            pagelink: "/admin/InfrastructureConfigure",
          },
        ]}
        userList={[
          {
            pagename: "Report Application",
            pagelink: "/user/ReportApplication",
          },
          {
            pagename: "Report Infrastructure",
            pagelink: "/user/ReportInfrastructure",
          },
          { pagename: "Report Device", pagelink: "/user/ReportDevice" },
        ]}
      />
      <Main open={open}>
        <DrawerHeader />
        <Box 
        // style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Box>
            <Container>
            <form style={{display:'flex', flexDirection:'column',  alignItems:'center'}} onSubmit={submitIssue}>
            {/* <CustomTextfield
              //onChange={(e) => setAddIssue(e.target.value)}
              // sx={classes.txt}
              label={"Enter Issue Name"}
              variant={"outlined"}  onChange={(e) => setIssueName(e.target.value)} 
              required
              value={issueName}
              //error={addIssueError}
            />&nbsp;&nbsp;
            <CustomDropdown
              id={"add-severity"}
              value={severity} onChange={(e) => setSeverity(e.target.value)}
              label={"Severity"}
            > 
              <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="Major">Major</MenuItem>
                <MenuItem value="Minor">Minor</MenuItem>
              
            </CustomDropdown>*/}
            
              <TextField label={'Issue Name'} id="issue" style={{width:'200px'}} value={issueName} onChange={(e) => setIssueName(e.target.value)} />
              <Dropdown label={'Severity'}  value={severity} style={{width:'200px'}} onChange={(e) => setSeverity(e.target.value)} list={["Critical","Major","Minor"]}/>
              &nbsp;&nbsp;
              <Button style={{width:'200px'}}
              color="primary"
              variant="contained"
              type='submit'
            >
              Add &nbsp;
              <AddCircleOutlineOutlinedIcon
                fontSize="large"
                sx={{ color: "white" }}
              ></AddCircleOutlineOutlinedIcon>
            </Button>
              {/* <Button variant="contained" sx={{ width: '300px' }} type='submit'>Add Issue</Button> */}
            </form>
          {/* <Table rows={issues} header={'Current Acronym Name ➥ '+categoryname} filteredRows={issues} setRows={setissues} setFilteredRows={setissues} editIssueCategory={handleEditIssue} deleteIssueCategory={handleDeleteIssue}/> 
         */}
         </Container>
         </Box>
         &nbsp;
          <Table rows={issueList} setRows={setIssueList} columns={columns} savetoDatabse={editIssueCategory} deleteFromDatabase={deleteIssueCategory}
          editActive={true} snackbarSeverity={snackbarSeverity} isDeleteDialog={true} tablename={"Existing Device Issues"} /*style={}*/ /> 
        </Box>
        <DialogBox openPopup={openPopup}  snackbarSeverity={snackbarSeverity} setOpenPopup={setOpenPopup} dialogMessage={dialogMessage} />
      </Main>
    </Box>
  );
};

export default DeviceIssue;
