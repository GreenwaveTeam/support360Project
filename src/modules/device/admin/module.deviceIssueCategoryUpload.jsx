// import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';

/*Navigation Pane*/
import Sidebar from '../../../components/navigation/sidebar/sidebar';
import Topbar from '../../../components/navigation/topbar/topbar';
import Main from '../../../components/navigation/mainbody/mainbody';
import DrawerHeader from '../../../components/navigation/drawerheader/drawerheader.component';

/*Custom Components */
import Table from '../../../components/table/table.component'
import DialogBox from "../../../components/snackbar/customsnackbar.component";
import Textfield from "../../../components/textfield/textfield.component";
import Dropdown from "../../../components/dropdown/dropdown.component";


import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Box, Container } from '@mui/material';
import { useNavigate,useLocation } from 'react-router-dom';
import Swal from 'sweetalert2'

import axios from 'axios';
import NotFound from '../../../components/notfound/notfound.component';


const DeviceCategory = () => {
  const plantid='P009'
  
  const [open, setOpen] = useState(false);
  const [categorylist, setCategorylist] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [editRow, setEditRow] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [filteredRows,setFilteredRows]=useState([])
  const [snackbarSeverity,setsnackbarSeverity]=useState(null)
  
  const [divIsVisibleList,setDivIsVisibleList]=useState([]);
  const currentPageLocation=useLocation().pathname;


  const columns=[
    {
      "id": "categoryname",
      "label": "Category Name",
      "type": "textbox",
      "canRepeatSameValue":false
    },
    
  ]  
  const fetchDivs = async () => {
    try {
      console.log("fetchDivs() called");
      console.log("Current Page Location: ", currentPageLocation);
  
      const response = await fetch(
        `http://localhost:8081/role/roledetails?role=superadmin&pagename=/admin/Device/CategoryConfigure`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetch div"+JSON.stringify(data))
      if (response.ok) {
        console.log("Current Response : ",data)
        console.log("Current Divs : ",data.components)
        setDivIsVisibleList(data.components)
      }
    } catch (error) {
      console.log("Error in getting divs name :", error);
      // setsnackbarSeverity("error"); // Assuming setsnackbarSeverity is defined elsewhere
      // setSnackbarText("Database Error !"); // Assuming setSnackbarText is defined elsewhere
      // setOpen(true); // Assuming setOpen is defined elsewhere
      // setSearch("");
      // setEditRowIndex(null);
      // setEditValue("");
    }
  };
  
  
  useEffect(() => {
    console.log('UseEffect for Device Category');
    const fetchData = async () => {
      try {
        console.log(`userhome Bearer ${localStorage.getItem("token")}`);
        // Make the API call to fetch data
        const response = await axios.get(`http://localhost:8081/device/admin/${plantid}/categories`,{headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },});
        
        // Extract data from the response
        const data = await response.data;
        console.log("data=====>", JSON.stringify(data)); 
        if (data) {
          const renamedData = data.map(item => ({
            categoryname: item.issuecategoryname, // Use correct key
            issuelist: item.issueList.map(issue => ({
              issuename: issue.issuename, // Use correct key
              severity: issue.severity
            }))
          }));
          console.log(renamedData)
          setCategorylist(renamedData);
          setFilteredRows(renamedData)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    fetchDivs();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleEditClick = (rowData) => {
    console.log("Edit Click: " + rowData.categoryname);
    setEditRow(rowData);
    setEditedValue(rowData.categoryname); // Set initial value of input
  };

  const checkInput = (input) => {
    console.log("Check Input===>" + input);
    if (input == null || input.trim() === '') {
      setDialogMessage("Empty string is not allowed");
      setOpenPopup(true);
      setsnackbarSeverity("error")
      return true;
    }
    const regex = /[^A-Za-z0-9 _]/;
    if (regex.test(input.trim())) {
      setOpenPopup(true);
      setDialogMessage("Special Character is not allowed");
      setsnackbarSeverity("error")
      return true;
    }
    return false;
  };

  const handleDeleteClick = async (rowData) => {
    
				
    console.log("Handle del")
    // Create a request body object
    const requestBody = {
        plantid: plantid,
        categoryname: rowData.categoryname
    };

    try {
        // Send requestBody as request body in the DELETE request
        await axios.delete('http://localhost:8081/device/admin/categories', 
        {
          headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        data: requestBody 
      });
        setCategorylist(categorylist.filter((category)=>(category!==rowData)))
      } catch (error) {
        console.error('Error:', error);
        setOpenPopup(true);
        setDialogMessage("Database error");
        setsnackbarSeverity("error")
        // Handle errors, such as displaying an error message to the user
    }
};

  const handleInputChange = (e) => {
    const { value } = e.target;
    setEditedValue(value); // Update input value
  };

  
  const handleRedirect = (category) => {
    const categoryname = category.categoryname;
    console.log("Category==========>"+category.categoryname);
    navigate(`/admin/Device/CategoryConfigure/Issue`, {
      state: { issuelist: category.issuelist, categoryname: category.categoryname },
    });
  };

  const editCategory = async (selectedCategory, updatedCategory) => {
    console.log("Save to database method called")
    if (updatedCategory.issuelist !== null) {
      const requestData = {
        issuecategoryname: updatedCategory.categoryname,
        plantid: plantid,
        issueList: updatedCategory.issuelist
      };
      try {
        const response = await axios.put(`http://localhost:8081/device/admin/${plantid}/categories/` + selectedCategory.categoryname, requestData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
			  
          },
        });
        return true;
        console.log(response.data); // Handle response data
      } catch (error) {
        console.error('Error:', error);
        setOpenPopup(true);
        setDialogMessage("Databse Error");
        setsnackbarSeverity("error")
        return false
      }
    }
  };

  const navigate = useNavigate();

  function submitCategory(event) {
    event.preventDefault();
    if (categoryName.trim() !== '') {
      const categoryExists = categorylist.some(cat => cat.categoryname === categoryName);
      if (categoryExists) {
        setDialogMessage('Category name already exists.');
        setOpenPopup(true);
        return;
      }
      if (checkInput(categoryName)) return;
      const row = { categoryname: categoryName, issuelist: [] };
      setCategorylist([...categorylist, row]);
      handleRedirect(row);
      setCategoryName('');
    } else {
      setDialogMessage('Please provide a category name.');
      setOpenPopup(true);
    }
  }

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  if(localStorage.getItem("token")===null){
   console.log("Not found")
    return(<NotFound/>)
  }
  
  return (
    
    <div>    
      {divIsVisibleList.length!==0 && 
    <Box sx={{ display: 'flex' }}>
      <Topbar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        urllist={[
          {pageName:'Admin Home',pagelink:'/AdminPage'},{ pageName: 'Device Issue Category', pagelink: '/admin/Device/CategoryConfigure' }
        ]}
      />
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

        <div
          
        >
          <Container >
          {divIsVisibleList&&divIsVisibleList.includes("add-new-category")&& 
                  
            <form onSubmit={submitCategory} style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
              
              <Textfield
                label={'Issue Category '}
                id="issuecategory"
                value={categoryName} style={{width:'200px'}}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              &nbsp;

            <Button
              color="primary"
              variant="contained" style={{width:'200px'}}
              type='submit'
            >
              Add &nbsp;
              <AddCircleOutlineOutlinedIcon
                fontSize="large"
                sx={{ color: "white" }}
              ></AddCircleOutlineOutlinedIcon>
            </Button>
            </form>
            }
            &nbsp;&nbsp;
            {divIsVisibleList&&divIsVisibleList.includes("device-category-table")&& 
            
            <Table rows={categorylist} columns={columns} setRows={setCategorylist}
            savetoDatabse={editCategory} redirectColumn={'categoryname'} handleRedirect={handleRedirect} isDeleteDialog={true} deleteFromDatabase={handleDeleteClick} 
            editActive={true} tablename={"Existing Device Issue Category"} /*style={}*/ redirectIconActive={true} />
            }
            </Container>
          
          {/* </Box> */}
        </div>
      </Main>
      <DialogBox snackbarSeverity={snackbarSeverity} openPopup={openPopup} setOpenPopup={setOpenPopup} dialogMessage={dialogMessage}/>
    </Box>
    } 
    {divIsVisibleList.length===0 && 
    <NotFound/>
    }
    </div>
  
  );
};

export default DeviceCategory;
