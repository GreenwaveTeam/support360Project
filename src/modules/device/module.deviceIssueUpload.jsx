import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, MenuItem, Button, Container } from '@mui/material';

/*Navigation Pane*/
import Sidebar from '../../components/navigation/sidebar/sidebar';
import Topbar from '../../components/navigation/topbar/topbar';
import Main from '../../components/navigation/mainbody/mainbody';
import DrawerHeader from '../../components/navigation/drawerheader/drawerheader.component';


/*Custom Components*/
import Table from '../../components/table/table.component'
import DialogBox from "../../components/dialog/dialog.component";
import TextField from "../../components/textfield/textfield.component";
import Dropdown from "../../components/dropdown/dropdown.component";


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
    { pageName: "Issue Category", pagelink: "/IssueCategory" },
    { pageName: "Issue", pagelink: "/"+categoryname+"/Issue" }
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
          const response = await axios.post(`http://localhost:9080/device/admin/${plantid}/categories/`+categoryname, requestData, {
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
          const response = await axios.put(`http://localhost:9080/device/admin/${plantid}/categories/categoryname/`+prev.issuename, requestData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
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
          
          const response = await axios.delete('http://localhost:9080/device/admin/categories/issue', {data: requestBody}
    );} catch (error) {
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
            return
        } 
      const newIssue = { issuename: issueName, severity: severity };
      setIssueList(prevIssues => [...prevIssues, newIssue]);
      setFilteredRows(prevIssues => [...prevIssues, newIssue]);
    } else {
      setOpenPopup(true);
      setDialogMessage('Please provide both issue name and severity.');
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
        adminList={[{ pagename: 'Issue Category', pagelink: '/IssueCategory' }, { pagename: 'Issue', pagelink: '/Issue' }]}
        userList={['User Item 1', 'User Item 2', 'User Item 3']}
      />
      <Main open={open}>
        <DrawerHeader />
        <Box 
        // style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Box>
            <Container>
            <form style={{display:'flex', flexDirection:'row',  alignContent:'center'}} onSubmit={submitIssue}>
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
            
              <TextField label={'Issue Name'} id="issue"  value={issueName} onChange={(e) => setIssueName(e.target.value)} />&nbsp;&nbsp;
              <Dropdown label={'Severity'}  value={severity} onChange={(e) => setSeverity(e.target.value)} list={["Critical","Major","Minor"]}/>
              
              <Button
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
          <Table rows={issueList} setRows={setIssueList} columns={columns} savetoDatabse={editIssueCategory} deleteFromDatabase={deleteIssueCategory}
          editActive={true} tablename={"Existing Device Issues"} /*style={}*/ /> 
        </Box>
        <DialogBox openPopup={openPopup} setOpenPopup={setOpenPopup} dialogMessage={dialogMessage} />
      </Main>
    </Box>
  );
};

export default DeviceIssue;
