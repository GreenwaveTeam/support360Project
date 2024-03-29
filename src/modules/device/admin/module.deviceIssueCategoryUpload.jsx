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
import { useNavigate } from 'react-router-dom';
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
  const columns=[
    {
      "id": "categoryname",
      "label": "Category Name",
      "type": "textbox",
      "canRepeatSameValue":false
    },
    
  ]  
  useEffect(() => {
    console.log('UseEffect for Device Category');
    const fetchData = async () => {
      try {
        console.log(`userhome Bearer ${localStorage.getItem("token")}`);
        // Make the API call to fetch data
        const response = await axios.get(`http://192.168.7.8:8081/device/admin/${plantid}/categories`,{headers:{
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
        await axios.delete('http://192.168.7.8:8081/device/admin/categories', { data: requestBody });
        setCategorylist(categorylist.filter((category)=>(category!==rowData)))
      } catch (error) {
        console.error('Error:', error);
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
    navigate(`/Device/Category/Issue`, {
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
        const response = await axios.put(`http://192.168.7.8:8081/device/admin/${plantid}/categories/` + selectedCategory.categoryname, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data); // Handle response data
      } catch (error) {
        console.error('Error:', error);
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
  if(plantid==null)
    return(<NotFound/>)
  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        urllist={[
          { pageName: 'Device Issue Category', pagelink: '/Device/Category' }
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
            &nbsp;&nbsp;
          
            <Table rows={categorylist} columns={columns} setRows={setCategorylist}
            savetoDatabse={editCategory} redirectColumn={'categoryname'} handleRedirect={handleRedirect} isDeleteDialog={true} deleteFromDatabase={handleDeleteClick} 
            editActive={true} tablename={"Existing Device Issue Category"} /*style={}*/ redirectIconActive={true} />
          </Container>
          {/* </Box> */}
        </div>
      </Main>
      <DialogBox snackbarSeverity={snackbarSeverity} openPopup={openPopup} setOpenPopup={setOpenPopup} dialogMessage={dialogMessage}/>
    </Box>
  );
};

export default DeviceCategory;
