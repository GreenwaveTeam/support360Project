import React, { useState, useEffect } from 'react';
import { Box, MenuItem, Button, Container, Dialog, Typography } from '@mui/material';
import axios from 'axios';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { TabPanel } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import {  useLocation, useNavigate } from 'react-router-dom';

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

/*Navigation Pane*/
import Sidebar from '../../../components/navigation/sidebar/sidebar';
import Topbar from '../../../components/navigation/topbar/topbar';
import Main from '../../../components/navigation/mainbody/mainbody';
import DrawerHeader from '../../../components/navigation/drawerheader/drawerheader.component';


/*Custom Components*/
import Table from '../../../components/table/table.component'
import Snackbar from "../../../components/snackbar/customsnackbar.component";
import TextField from "../../../components/textfield/textfield.component";
import Dropdown from "../../../components/dropdown/dropdown.component";
import CustomDialog from '../../../components/dialog/dialog.component';
import NotFound from '../../../components/notfound/notfound.component';

import styles from './module.module.css'
import Textfield from '../../../components/textfield/textfield.component';

export default function ModuleConfigure ()  {
	const plantid='P009'
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('1');
	const [showPopup, setShowPopup] = useState(false);
	const [selection, setSelection] = useState(null);
	const [issues, setIssues] = useState([]);
	const [issueName, setIssueName] = useState('');
	const location = useLocation();
	const application_name=(location.state.application_name)
	console.log("App==>"+application_name)
	const [severity, setSeverity] = useState('');
	const [categoryname, setCategoryname] = useState('');
	const [dialogPopup, setDialogPopup] = useState(false);
	const [dialogMessage, setDialogMessage] = useState('');
	const [snackbarSeverity,setsnackbarSeverity]=useState(null)
	const [isDataChanged, setDataChanged] = useState(1);
	const [data, setData] = useState(null);
	const navigate = useNavigate();
	
	const [selectedAreas,setSelectedAreas]=useState(null)
	const [module_Name, setModule_Name] = useState(null);
	const [categorySubmitted,setCategorySubmitted]=useState(false)
	const[categories,setCategories]=useState(null);
	const [currentModule,setCurrentModule]=useState(null)
	const [deleteDialog,setDeleteDialog]=useState(false)
	const [deleteModule,setDeleteModule]=useState(null)
	const [deleteCategory,setDeleteCategory]=useState(null)
	const [deleteArea,setDeleteArea]=useState(null)
	const [filterValue, setFilterValue] = useState('');


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
	  ;
	
	  useEffect(() => {
		const fetchData = async () => {
			console.log("useFffect called*********************************************")
		
			console.log("Application name====>"+application_name)
		  try {
			const response = await axios.get(`http://localhost:8081/application/admin/${plantid}/${application_name}`,{headers:{
			  Authorization: `Bearer ${localStorage.getItem("token")}`,
			  "Content-Type": "application/json",
			},});
			const moduleData = response.data;
			console.log("Module data=========>"+JSON.stringify(moduleData))
			setData(moduleData);
			setSelectedAreas(moduleData.modulelist[0].issueslist)
			setCurrentModule(moduleData.modulelist[0])
			setModule_Name(moduleData.modulelist[0].modulename)
			setCategories(moduleData.modulelist[0].issueslist.map(issueDetail => issueDetail.categoryname))
			console.log(moduleData);
		  } catch (error) {
			console.error('Error fetching data:', error);
		}
		}

    fetchData();
  }, []);

	
	useEffect(()=>handleDataChange,[selectedAreas])
	const handleAddCategory=()=>{
  if(categories.includes(categoryname)){
    setDialogPopup(true);
	setsnackbarSeverity('error')
    setDialogMessage("Category Name already Exists")
    setCategorySubmitted(false)
		
    return   
  }
  if(checkInput(categoryname))
    return
		setCategorySubmitted(true)
		
	}
	const handleDataChange=()=>{
		setData(prev => {
			// Clone the previous data object to avoid mutating the original state
			const newData = { ...prev };
		
			// Update the specific property inside the data object
			newData.modulelist = newData.modulelist.map(item => {
				if (item.modulename === module_Name) {
					
					return {
						...item,
						issueslist: selectedAreas
					};
				} else {
					// Return the original object unchanged
					return item;
				}
			});
		
			// Return the updated data object
			return newData;
		});
		
	}
	const handleChange = (event, newValue) => {
		setValue(newValue);
		setSelection(null)
		const moduleIndex = parseInt(newValue) - 1;
	 const selectedModule = data.modulelist[moduleIndex];
		setModule_Name(selectedModule.modulename)
		setCurrentModule(selectedModule)
	 if (selectedModule && selectedModule.issueslist) {
			setSelectedAreas(selectedModule.issueslist);
			
			setCategories(selectedModule.issueslist.map(issueDetail => issueDetail.categoryname));

	 
		} else {
			setSelectedAreas([]);
		}
	};


	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};
	// Handler function for updating the filter value
const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
};

// Filtered module list based on the filter value
const filteredModules = data!==null&&data.modulelist.filter(module =>
    module.modulename.toLowerCase().includes(filterValue.toLowerCase())
);
	const handleAreaClick = (area) => {
		setShowPopup(true);
		setSelection(area);
		setIssues(area.issues);
		setCategoryname(area.categoryname);
		setCategorySubmitted(true)
	};
	const handleDeleteAreaClick=(e,moduleName, categoryName, area)=>{
		e.preventDefault()
		setDeleteDialog(true)
		setDeleteArea(area)
		setDeleteCategory(categoryName)
		setDeleteModule(moduleName)
	}
	const handleDeleteAreaConfirm=()=>{
		handleDeleteArea(deleteModule,deleteCategory,deleteArea)
	}
	const handleDeleteArea = async (moduleName, categoryName, area) => {
		const requestBody = {
			plant_id: plantid,
			application_name: data.application_name,
			moduleName: moduleName,
			categoryname: categoryName
		};
	
		try {
					const response = await axios.delete('http://localhost:8081/application/admin/plant_id/application/module/category', {  
						headers:{
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "application/json",
					  },
					  data: requestBody
					});
					// Optionally, update the UI or perform any additional actions after successful deletion
					setSelectedAreas(prev => prev.filter(areatodel => areatodel.categoryname !== categoryName));
					setCategories(prev => prev.filter(category => category !== categoryName));
					console.log("Category name=>"+categoryName)

					
				} catch (error) {
					// Handle errors, such as displaying an error message to the user
					
					setsnackbarSeverity("error")
					setDialogPopup(true);
    				
    				setDialogMessage("Database error")
				}
			}

	
	

	const handleAddIssue = (event,moduleData) => {
		event.preventDefault()
		const newIssue = { issuename: issueName, severity: severity };
		const issueExists = (issues, issuename, issueName) => {
      // Use some() to iterate over each object in the list
      return( issues.some(obj => {
          // Check if the specified key of the object contains the search string
          return obj[issuename] === issueName;
      }))

  };
  if(issueExists(issues, 'issuename', issueName))
  {
	setsnackbarSeverity('error')
    setDialogPopup(true);
    setDialogMessage("Issue Name already exists")
    return
  }
  if(issueName===null|| severity===null||issueName.trim()==='' || severity.trim===''){
		setsnackbarSeverity('error')
		setDialogPopup(true);
		setDialogMessage('Please provide both issue name and severity.');
		return 
	
  }
  
  if(!checkInput(issueName)){
    
		
		handleCoordinateSubmit(event,moduleData)
	}
	};

	const handleCoordinateSubmit = async (event,moduleData) => {
		event.preventDefault()
		if (selection) {
			const details = {
				left: selection.left,
				top: selection.top,
				width: selection.width,
				height: selection.height,
				categoryname: categoryname,
				issues: [{issuename: issueName, severity: severity }],
			};
			const requestData = {
				plant_id: plantid,
				application_name: data.application_name,
				
				modulelist: [{modulename: moduleData.modulename, moduleimage: moduleData.moduleimage, issueslist: [details] }],
			};
			const detail = {
				left: selection.left,
				top: selection.top,
				width: selection.width,
				height: selection.height,
				categoryname: categoryname,
				issues: [...issues,{issuename: issueName, severity: severity }],
			};
			
			try {
				console.log("Bearer token:"+localStorage.getItem("token"))
				// Here requestData contains entire module data including module_image
				const response = await axios.post('http://localhost:8081/application/admin/plant_id/application_name/moduleName',requestData, 
				{headers:{
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				  },});
				  setIssues((prevIssues) => {
					if (prevIssues && issueName && severity) return [...prevIssues, { issuename: issueName, severity: severity }];
					else if (issueName && severity) return [{ issuename: issueName, severity: severity }];
					
				});
				setSelectedAreas([...selectedAreas, detail]);
				!categories.includes(categoryname) && setCategories([...categories, categoryname]);
  
				
			} catch (error) {
				console.error('Error:', error);
				setsnackbarSeverity('error')
				setDialogPopup(true);
				setDialogMessage('Database Error.');
			}
		}
	};

	const checkInput = (input) => {
		if (!input || !input.trim()) {
			setsnackbarSeverity('error')
			setDialogPopup(true);
			setDialogMessage('Empty string is not allowed');
			return true;
		}
		const regex = /[^A-Za-z0-9 _]/;
		if (regex.test(input.trim())) {
			setsnackbarSeverity('error')
			setDialogPopup(true);
			setDialogMessage('Special characters are not allowed');
			return true;
		}
		return false;
	};

	const handleClosePopupForm = () => {
		setShowPopup(false)
    setSelection(null)
    setCategorySubmitted(false)
    setIssues([])
	};
	const handleDeleteIssue = async (rowdata) => {
		
		const requestBody = {
			plant_id: plantid,
			application_name: data.application_name,
			moduleName: module_Name,
			categoryname: categoryname,
			issuename: rowdata.issuename
		};
	
		
		try {
			console.log("Bearer token:=>"+localStorage.getItem("token"))
			await axios.delete('http://localhost:8081/application/admin/plant/application/modulename/category/issue',  
			{headers:{
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			  },
			  data:requestBody
			});
			const detail = {
				left: selection.left,
				top: selection.top,
				width: selection.width,
				height: selection.height,
				categoryname: categoryname,
				issues: issues.filter(issue => issue.issuename !== rowdata.issuename),
			};
			setSelectedAreas([...selectedAreas.filter(area => area.categoryname!== detail.categoryname), detail]);
			setIssues(issues.filter((row)=>(row!==rowdata)))
		} catch (error) {
			console.error('Error deleting issue:', error.response ? error.response.data : error.message);
			setsnackbarSeverity('error')
			setDialogPopup(true);
			setDialogMessage('Database Error');
				return false;
			// Handle errors, such as displaying an error message to the user
		}
	};
	  const handleEditIssue = async(prev,rowData) => {
		try{
		const deleteRequestBody = {
			plant_id: plantid,
			application_name: data.application_name,
			moduleName: module_Name,
			categoryname: categoryname,
			issuename: prev.issuename
		  };
		  console.log("Bearer===>"+localStorage.getItem("token"))
		  const response = await axios.delete('http://localhost:8081/application/admin/plant/application/modulename/category/issue', {
				headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				data: deleteRequestBody
			});
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
				plant_id: plantid,
				application_name: data.application_name,
				
				modulelist: [{modulename: currentModule.modulename, moduleimage: currentModule.moduleimage, issueslist: [details] }],
			};
			const detail = {
				left: selection.left,
				top: selection.top,
				width: selection.width,
				height: selection.height,
				categoryname: categoryname,
				issues: issues.filter(issue => issue.issuename !== prev.issuename).concat({issuename: rowData.issuename, severity: rowData.severity}),
			};
			console.log("Request data===>"+requestData)
				// Here requestData contains entire module data including module_image
				const response = await axios.post('http://localhost:8081/application/admin/plant_id/application_name/moduleName',requestData,
				{headers:{
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				  },
				  });
				  setSelectedAreas([...selectedAreas.filter(area => area.categoryname!== detail.categoryname), detail]);
				  return true
		}	
			} catch (error) {
				console.error('Error:', error);
				setsnackbarSeverity('error')
				setDialogPopup(true);
				setDialogMessage('Database Error');
				return false;
			}
		
	};
	
	const handleMouseDown = async (event) => {
		setShowPopup(false);
		const image = event.target;
		const imageRect = image.getBoundingClientRect();
		const imageWidth = image.width;
		const imageHeight = image.height;
		const startX = (event.clientX - imageRect.left) / imageWidth;
		const startY = (event.clientY - imageRect.top) / imageHeight;
		let detailsToCheckOverlap = null;
		let isMouseMoved = false;

		const handleMouseMove = async (event) => {
			isMouseMoved = true;
			const endX = (event.clientX - imageRect.left) / imageWidth;
			const endY = (event.clientY - imageRect.top) / imageHeight;

			
			let left = Math.min(startX, endX);
			let top = Math.min(startY, endY);
			let width = Math.abs(endX - startX);
			let height = Math.abs(endY - startY);
		
			// Ensure the selection box remains within the bounds of the image
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
			setIssues([]);
			setShowPopup(true);
			const overlaps = handleOverlapCheck(detailsToCheckOverlap);

			if (overlaps) {
				setsnackbarSeverity('error')
				setDialogPopup(true);
				setDialogMessage("Overlap is strictly restricted")
				setShowPopup(false);
				setSelection(null);
				return;
			}
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};
	const handleTouchStart = (event) => {
		const imageRef=event.target
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
		
			// Ensure the selection box remains within the bounds of the image
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
			setIssues([]);
			setShowPopup(true);
			const overlaps = handleOverlapCheck(detailsToCheckOverlap);
	
			if (overlaps) {
				setsnackbarSeverity('error');
				setDialogPopup(true);
				setDialogMessage("Overlap is strictly restricted");
				setShowPopup(false);
				setSelection(null);
			}
		};
	
		document.addEventListener('touchmove', handleTouchMove);
		document.addEventListener('touchend', handleTouchEnd);
	};
	const handleOverlapCheck = (details) => {
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
				(existing.top < bottomNew && bottomExisting > bottomNew && existing.left < details.left && rightExisting > rightNew) ||
				(rightExisting > rightNew && existing.left < rightNew && existing.top < details.top && bottomExisting > details.top) ||
				(existing.left < details.left && rightExisting > details.left && existing.top < details.top && bottomExisting > details.top) ||
				(existing.top < bottomNew && bottomExisting > bottomNew && existing.left < details.left && rightExisting > details.left)||
				(existing.top < bottomNew && bottomExisting > bottomNew  && existing.left>details.left  && rightExisting < rightNew)
			);
		});
	};

	const handleRedirect = () => {
		navigate(`/admin/ApplicationConfigure/Module`, {
			state: { application_name:data.application_name ,modulelist:data.modulelist},
		});
	};
	if(localStorage.getItem("token")===null)
    return(<NotFound/>)
	return (
		
		 <Box sx={{ display: 'flex' }}>
			<Topbar open={open} handleDrawerOpen={handleDrawerOpen} urllist={[
    			{pageName:'Admin Home',pagelink:'/AdminPage'},{ pageName: 'Application', pagelink: '/admin/ApplicationConfigure' },
				{ pageName: 'Modules Configure', pagelink: '/admin/ApplicationConfigure/Modules' }]} />
			<Sidebar open={open} handleDrawerClose={handleDrawerClose} 
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
			  ]}/>
			<Main open={open}>
				<DrawerHeader />
				 <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width:'100vw'}}>
				
					{data && data.modulelist.length > 0 && (
						<TabContext value={value}>
							<Box sx={{ borderBottom: 1}}>
								<Box sx={{display:'flex', flexDirection:'row'}}>
							<Textfield
							id="filter-input"
							label={
								<div style={{ display: "flex", alignItems: "center" }}>
								  <SearchOutlinedIcon />
								  <span style={{ fontSize: "20px" }}>Search Module...</span>
								</div>
							  }
							  variant="outlined"
							value={filterValue}
							onChange={handleFilterChange}
							 // Adjust margin as needed
						/>
						<Box sx={{ flexGrow: 1 }} />
						 {/* Empty Box to fill remaining space */}
							<Button
								variant="contained"
								onClick={handleRedirect}sx={{ marginRight: '50px',padding: '4px ', // Decrease padding to make the button smaller
								fontSize: '0.75rem', marginTop: '5px', // Adjust the margin in the y-axis
								marginBottom: '5px', borderRadius:'10px'}}
								
							>
								Add Module
							</Button>
							{/* <Button
								variant="contained"
								onClick={handleDeleteModule}sx={{ marginRight: '50px',padding: '4px ', // Decrease padding to make the button smaller
								fontSize: '0.75rem' , borderRadius:'10px',marginTop: '5px', // Adjust the margin in the y-axis
								marginBottom: '5px' }}
							>
								Delete Module
							</Button> */}
							</Box>
								<TabList onChange={handleChange}
									variant="scrollable"
									scrollButtons="auto"
									aria-label="scrollable auto tabs example">
									{filteredModules.map((module, index) => (
										<Tab key={index} label={module.modulename} value={(index + 1).toString()} />
									))}
									
								</TabList>
							</Box>
							{filteredModules.map((module, index) => (
								<TabPanel key={index} value={(index + 1).toString()}>
									<Box sx={{ position: 'relative', width: '80vw', height: '80vh', objectFit:'contain'}}>
									<Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
										{module && module.moduleimage && <img draggable={false} className={styles.imagestyle} src={`data:image/jpeg;base64,${module.moduleimage}`} alt={`Module ${index + 1}`} style={{ cursor: 'crosshair', width: '100%', height: '100%' }}  onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}/>}
										{selection && (
											<Box
												sx={{
													position: 'absolute',
													left: `${selection.left * 100}%`,
													top: `${selection.top * 100}%`,
													width: `${selection.width * 100}%`,
													height: `${selection.height * 100}%`,
													border: '2px dashed red',
													maxWidth: '100%',
   													 maxHeight: '100%',
    												overflow: 'hidden',
												}}
											/>
										)}
										{module && selectedAreas.map((area, areaIndex) => (
											<Box
												key={areaIndex}
												onClick={() => handleAreaClick(area)}
												sx={{
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
														
														handleDeleteAreaClick(e,module.modulename, area.categoryname, area); // Call a function to delete the area when delete icon is clicked
													}}
												/>
											</Box>
										))}
									</Box>
									{/* Render the pop-up */}
									{showPopup && selection && (
										<Dialog
										open={showPopup}
										onClose={handleClosePopupForm}
										maxWidth="md" // Adjust maxWidth as needed
										PaperProps={{
										  sx: {
											padding: '20px', // Add padding in the four corners
											borderRadius: '30px',
											overflowX: 'hidden', // Hide horizontal overflow
										  },
										}}
									  >
										<Container >
										  <Box className="addIssue">
											
											<form onSubmit={(event) => { handleAddIssue(event,module) }}>
											  {!categorySubmitted && (
												<Box sx={{ display: 'flex', flexDirection: 'column', alignItems:'center'}}>
												  <Typography
													variant="h6"
													color="textSecondary"
													component="h2"
													gutterBottom
													fontWeight={900}
												>
													Name of the Selected Snippet
												</Typography>
												  <TextField
													label={'Snippet Name'}
													id="issue"
													value={categoryname}
													onChange={(e) => {
													  setCategoryname(e.target.value);
													}} style={{width:'50%'}}
												  />&nbsp;&nbsp;
												  <Button
													variant="contained"
													onClick={handleAddCategory} style={{width:'50%'}}
												  >
													Add Category
												  </Button>
												</Box>
											  )}
											  {categorySubmitted && (
												<>
												  <Typography
													variant="h6"
													color="textSecondary"
													component="h2"
													gutterBottom
													fontWeight={900}
												>
													Current Snippet Name ➥ &nbsp;
													<span style={{ color: "red" }}>{categoryname}</span>
												</Typography>
												<Box sx={{ display: 'flex', flexDirection: 'column', alignItems:'center'}}>
												  <TextField
													  label={'Issue Name'}
													  id="issue" style={{width:'50%'}}
													  value={issueName}
													  onChange={(e) => setIssueName(e.target.value)}
													/>
													<Dropdown
													  label={'Severity'}
													  select formstyle={{width:'50%'}}
													  value={severity}
													  list={["Critical","Major","Minor"]}
													  onChange={(e) => setSeverity(e.target.value)}
													/>
													&nbsp;
													<Button
													  variant="contained" style={{width:'50%'}}
													  type='submit'
													>
													  Add Issue&nbsp;
													  {/* <AddCircleOutlineOutlinedIcon
														fontSize="large"
														sx={{ color: 'white' }}
													  /> */}
													</Button>
												  </Box>
												  &nbsp;&nbsp;
												  <Table
													rows={issues} isDeleteDialog={true}
													setRows={setIssues}
													savetoDatabse={handleEditIssue}
													deleteFromDatabase={handleDeleteIssue}
													columns={columns} editActive={true} tablename={"Existing Issues"} /*style={}*/ 
												  />
												</>
											  )}
											</form>
										  </Box>
										</Container>
									  </Dialog>
									)}
									</Box>
								</TabPanel>
								
							))}
						</TabContext>
					)}
				</Box>
				<CustomDialog open={deleteDialog}setOpen={setDeleteDialog}proceedButtonText={"Delete"}
				proceedButtonClick={handleDeleteAreaConfirm}cancelButtonText="Cancel"/>
				<Snackbar openPopup={dialogPopup} snackbarSeverity={snackbarSeverity} setOpenPopup={setDialogPopup} dialogMessage={dialogMessage}/>
			</Main>
		</Box>
	);
};

 
