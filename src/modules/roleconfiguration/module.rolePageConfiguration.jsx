import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Button, TextField, Typography } from '@mui/material';
import React, { useState,useEffect } from 'react';
import Dropdown from "../../components/dropdown/dropdown.component";
import Table from '../../components/table/table.component';
import { useLocation } from 'react-router-dom';

import Snackbar from "../../components/snackbar/customsnackbar.component";
import axios from 'axios';
import packagedata from '../../pagedata.json'

/*Navigation Pane*/
import Sidebar from '../../components/navigation/sidebar/sidebar';
import Topbar from '../../components/navigation/topbar/topbar';
import Main from '../../components/navigation/mainbody/mainbody';
import DrawerHeader from '../../components/navigation/drawerheader/drawerheader.component';



export default function RolePageConfiguration() {
//  ;const jsonData = {
//     "pagelist": [
//       {
//         "page": "Infrastructure",
//         "modules":[{
//             "pagelink":"/admin/Infrastructure",
//             "components":["add-new-infrastructure-category","existing-infrastructure-table"]
//         },
//         {
//             "pagelink":"/admin/infrastructure/addIssues",
//             "components":["add-issues-selected-category","edit-issues-selected-category"]
//         }
    
//     ]
//       },
      
//       {
//         "page": "Device",
//         "modules": [
//           {
//             "pagelink":"/admin/Device/CategoryConfigure",
//             "components":["add-new-device-category","existing-device-table"]
//         },
          
//         ]
//       }
//     ]
//   };
  const jsonData=packagedata;
  const convertedData = [];
  
  jsonData.pagelist.forEach(page => {
    page.modules.forEach(module => {
      if (module.pagelink) {
        convertedData.push({
          pagename: module.pagelink,
          components: module.components 
        });
      } 
    });
  });
  
  console.log(convertedData);
  const pageDetails = convertedData;
  const pagelist = pageDetails.map(page => page.pagename);

 // const pagelist = ['Page1', 'Page2'];
  const [selectedPage, setSelectedPage] = useState('');
  const [componentList, setComponentList] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [rows, setRows] = useState([]);
  const [filteredRows,setFilteredRows]=useState([])
  const [openPopup, setOpenPopup] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [snackbarSeverity,setsnackbarSeverity]=useState(null)
  
  const location=useLocation()
  const role=location.state.role;
  const [open, setOpen] = useState(false);
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  // const handleCheck = (value) => {
  //   setSelectedComponents(prev => [...prev, value]);
  // };
  useEffect(()=>{
    const fetchData = async () => {
      try {
        console.log(`userhome Bearer ${localStorage.getItem("token")}`);
        // Make the API call to fetch data
        const response = await axios.get(`http://localhost:8081/role/${role}`,{headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },});
        
        // Extract data from the response
        const data = await response.data;
        //console.log("data=====>", JSON.stringify(data)); 
        const convertedData = [];

        data.pagedetails.forEach(page => {
          page.components.forEach(component => {
            convertedData.push({ page: page.pagename, component: component });
          });
        });
        console.log("converted data=====>", JSON.stringify(convertedData)); 
        setRows(convertedData);
        setFilteredRows(convertedData)
        // if (data) {
        //   const renamedData = data.map(item => ({
        //     role: item
            
        //   }));
        //   console.log(renamedData)
        //   
        //   setFilteredRows(renamedData)
        //}
      }catch(e){
        //console.error('Error:', error);
    setOpenPopup(true);
    setDialogMessage('Database Error');
    setsnackbarSeverity('error')
  }
}
fetchData();}
  ,[]);
  useEffect(()=>{
    const fetchData = async () => {
      try {
        console.log(`userhome Bearer ${localStorage.getItem("token")}`);
        console.log("Role"+role)
        // Make the API call to fetch data
        const response = await axios.get(`http://localhost:8081/role/${role}`,{headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },});
        
        // Extract data from the response
        const data = await response.data;
        console.log("data=====>", JSON.stringify(data)); 
        if (data) {
          const renamedData = data.components.map(item => ({
            page: data.pagename,
            component:item
            
          }));
          console.log(renamedData)
          setRows(renamedData);
          setFilteredRows(renamedData)
        }
      }catch(e){
        //console.error('Error:', error);
    
      }
    }
    fetchData();
  },[])
  const columns = [
    {
      "id": "page",
      "label": "Page Name",
      "type": "textbox",
      "canRepeatSameValue": false
    },
    {
      "id": "component",
      "label": "Component Name",
      "type": "textbox",
      "canRepeatSameValue": false
    },
  ];
  
  const handlePageChange = (event) => {
    const selectedPage = event.target.value;
    setSelectedComponents([])
    console.log("PAge=>"+selectedPage)
    setSelectedPage(selectedPage);
    const page = pageDetails.find(page => page.pagename === selectedPage);
    if (page) {
      console.log("Comonents===>"+page.components)

      setComponentList(page.components);
    }
  };
  const handleDelete=async(rowdata)=>{
    const requestBody = {
      role: role,
      pagename: rowdata.page,
      components: [rowdata.component]
    }; console.log("Delete=>"+JSON.stringify(requestBody))
      try {
        
        const response = await axios.delete('http://localhost:8081/role',{
          headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          
        },
        data:requestBody
      },);
        setRows(rows.filter((row)=>(row!==rowdata)));
        console.log("Successfully deleted")
        } catch (error) {
        console.error('Error:', error);
        setOpenPopup(true);
        setDialogMessage('Database Error');
        setsnackbarSeverity('error')
      }
  }
  const handleComponentSelect = (value) => {
    const currentIndex = selectedComponents.indexOf(value);
    const newChecked = [...selectedComponents];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    console.log("NEw check"+JSON.stringify(newChecked))
    setSelectedComponents(newChecked);
  };

  const handleRoleSubmit = async() => {
    try{
    let currentRow=selectedComponents.map(item => {
      return {page:selectedPage,component:item}
    });
    if(rows.find(item=>{if(item.page===selectedPage){
      return (selectedComponents.find(comp=>(item.component===comp)))
    }})){
      setsnackbarSeverity('error')
      setDialogMessage("The given component is already added!!")
      setOpenPopup(true)
      return
    }

    const requestData = {
      role: role,
      pagename: selectedPage,
      components: selectedComponents
    };
    console.log("Request=>"+JSON.stringify(requestData))
    console.log("Bearer=>"+localStorage.getItem("token"))
    const response = await axios.post(`http://localhost:8081/role`, requestData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json',
      },
    });
    setRows(prev=>[...prev,...currentRow])
    setsnackbarSeverity('success')
      setDialogMessage("Changes are saved!!")
      setOpenPopup(true)
      setComponentList([])
      setSelectedPage('')
    }
    catch(e){
      setsnackbarSeverity('error')
      setDialogMessage("Database Error!!")
      setOpenPopup(true)
      return
    }

  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar open={open} handleDrawerOpen={handleDrawerOpen} urllist={[
          {pageName:'Admin Home',pagelink:'/AdminPage'},{ pageName: 'Role', pagelink: '/admin/role' }
          ,{ pageName: 'Page', pagelink: '/admin/role/page' }
        ]} />
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
    
      
      <Box sx={{display:'flex' ,flexDirection:'column', alignItems:'center'}}>
      {/* <TextField
        label={"Role"}
       value={selectedRole}
        required
        onChange={handleRoleChange}
        /> &nbsp;&nbsp;&nbsp; */}
        <Typography sx={{fontWeight:800,fontSize:25 ,fontStyle:'oblique'}}>Current Role : {<span style={{fontWeight:'bold',color:'red'}}>{role}</span>}</Typography>
        <Dropdown
          id="pageDetails" style={{width:'200px'}}
          label="Page"
          value={selectedPage}
          onChange={handlePageChange}
          list={pagelist}
        />&nbsp;
        {componentList.length > 0 && (
          <Box>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {componentList.map((value, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleComponentSelect(value)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedComponents.includes(value)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText id={value} primary={value} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          </Box>
        )}
        &nbsp;
        <Button color="primary" variant="contained" type='submit' sx={{width:'200px'}} onClick={handleRoleSubmit}>Add</Button>
      </Box>
      &nbsp;&nbsp;
      <Table rows={rows} setRows={setRows} columns={columns} editActive={false} deleteFromDatabase={handleDelete}/>
      <Snackbar snackbarSeverity={snackbarSeverity} openPopup={openPopup} setOpenPopup={setOpenPopup} dialogMessage={dialogMessage}/>
   
    </Box>
    </Main>
    </Box>
  );
}
