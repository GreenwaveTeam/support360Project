import React, { useState, useEffect } from 'react';
import { Box, MenuItem, Button, Container, Dialog } from '@mui/material';
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import axios from 'axios';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { TabPanel } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
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
import Dropdown from "../../components/dropdown/dropdown.component";


const ModuleConfigure = () => {
	const plantid='P009'
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('1');
	const [showPopup, setShowPopup] = useState(false);
	const [selection, setSelection] = useState(null);
	const [issues, setIssues] = useState([]);
	const [issueName, setIssueName] = useState('');
	const [severity, setSeverity] = useState('');
	const [categoryname, setCategoryname] = useState('');
	const [dialogPopup, setDialogPopup] = useState(false);
	const [dialogMessage, setDialogMessage] = useState('');
	const [isDataChanged, setDataChanged] = useState(1);
	const location = useLocation();
	const [data, setData] = useState(location.state.application_data);
	const navigate = useNavigate();
	const [selectedAreas,setSelectedAreas]=useState(data.modulelist[0].issueslist)
	const [module_Name, setModule_Name] = useState(data.modulelist[0].modulename);
	const [categorySubmitted,setCategorySubmitted]=useState(false)
	const[categories,setCategories]=useState([])
	const [currentModule,setCurrentModule]=useState(data.modulelist[0])
	console.log("Current module==>"+JSON.stringify(currentModule))
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
	useEffect(()=>handleDataChange,[selectedAreas])
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
		setCategorySubmitted(true)
		setCategories([...categories,categoryname])
  
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
		const moduleIndex = parseInt(newValue) - 1;
	 const selectedModule = data.modulelist[moduleIndex];
	 	console.log("Module:"+selectedModule.modulename)
		setModule_Name(selectedModule.modulename)
		setCurrentModule(selectedModule)
	 if (selectedModule && selectedModule.issueslist) {
			setSelectedAreas(selectedModule.issueslist);
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

	const handleAreaClick = (area) => {
		setShowPopup(true);
		setSelection(area);
		setIssues(area.issues);
		setCategoryname(area.categoryname);
		setCategorySubmitted(true)
	};

	const handleDeleteArea = async (moduleName, categoryName, area) => {
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
			try {
			
			setSelectedAreas(prev => prev.filter((areatodel, index) => areatodel.categoryname!==categoryName));
      		setCategories(prev => prev.filter(category => category !== area.categoryName));
			console.log("Data=====>"+moduleName)
			const response =axios.delete(`http://localhost:9080/application/admin/${plantid}/${data.application_name}/${moduleName}/${categoryName}`);
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
    
		setIssues((prevIssues) => {
			if (prevIssues && issueName && severity) return [...prevIssues, newIssue];
			else if (issueName && severity) return [newIssue];
			
		});
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
			console.log(moduleData)
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
			console.log("Issues"+JSON.stringify(issues))
			setSelectedAreas([...selectedAreas, detail]);
      
			console.log(JSON.stringify(requestData))
			try {
				// Here requestData contains entire module data including module_image
				const response = await axios.post('http://localhost:9080/application/admin/plant_id/application_name/moduleName', requestData);
				console.log("Posted data")
			} catch (error) {
				console.error('Error:', error);
			}
		}
	};

	const checkInput = (input) => {
		if (!input || !input.trim()) {
			setDialogPopup(true);
			setDialogMessage('Empty string is not allowed');
			return true;
		}
		const regex = /[^A-Za-z0-9 _]/;
		if (regex.test(input.trim())) {
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
	const handleDeleteIssue = async(issuename) => {
		const url=`http://localhost:9080/application/admin/${plantid}/`+data.application_name+'/'+module_Name+'/'+categoryname+'/'+issuename
		console.log("Handle delete==>"+url)
		await axios.delete(url);
	  };
	  const handleEditIssue = async(prev,rowData) => {
		console.log("Handle delete")
		//console.log("Row data==>"+JSON.stringify(rowData))
		const url=`http://localhost:9080/application/admin/${plantid}/`+data.application_name+'/'+module_Name+'/'+categoryname+'/'+rowData.issuename
		console.log("Handle delete==>"+url)
		
		await axios.delete(`http://localhost:9080/application/admin/${plantid}/${data.application_name}/${module_Name}/${categoryname}/${prev.issuename}`);
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

			const left = Math.min(startX, endX);
			const top = Math.min(startY, endY);
			const width = Math.abs(endX - startX);
			const height = Math.abs(endY - startY);

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
				setDialogPopup(true);
				console.log("Overlapped")
				setDialogMessage("Overlap is strictly restricted")
				setShowPopup(false);
				setSelection(null);
				return;
			}
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const handleOverlapCheck = (details) => {
		console.log("Handle overlap")
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
				(existing.top < bottomNew && bottomExisting > bottomNew && existing.left < details.left && rightExisting > details.left)
			);
		});
	};

	const handleRedirect = () => {
		console.log(data)
		navigate(`/Application/Module`, {
			state: { application_name:data.application_name },
		});
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<Topbar open={open} handleDrawerOpen={handleDrawerOpen} urllist={[{ pageName: 'Application', pagelink: '/Application' }]} />
			<Sidebar open={open} handleDrawerClose={handleDrawerClose} adminList={[{ pagename: 'Issue Category', pagelink: '/IssueCategory' }, { pagename: 'Issue', pagelink: '/Issue' }]} userList={['User Item 1', 'User Item 2', 'User Item 3']} />
			<Main open={open}>
				<DrawerHeader />
				<Box sx={{ width: '100%', typography: 'body1' }}>
					{data.modulelist.length > 0 && (
						<TabContext value={value}>
							<Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
								<TabList onChange={handleChange} aria-label="lab API tabs example">
									{data.modulelist.map((module, index) => (
										<Tab key={index} label={module.modulename} value={(index + 1).toString()} />
									))}
									<Button variant="contained" sx={{ marginLeft: 'auto', fontSize: '10px', width: 'auto', height: '8vh' }} type="submit" onClick={handleRedirect}>
										Add Module
									</Button>
								</TabList>
							</Box>
							{data.modulelist.map((module, index) => (
								<TabPanel key={index} value={(index + 1).toString()}>
									<Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
										{module && module.moduleimage && <img src={`data:image/jpeg;base64,${module.moduleimage}`} alt={`Module ${index + 1}`} style={{ cursor: 'crosshair', width: '100%', height: '100%', userSelect:'none'}} onMouseDown={handleMouseDown} />}
										{selection && (
											<Box
												sx={{
													position: 'absolute',
													left: `${selection.left * 100}%`,
													top: `${selection.top * 100}%`,
													width: `${selection.width * 100}%`,
													height: `${selection.height * 100}%`,
													border: '2px dashed red',
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
														handleDeleteArea(module.modulename, area.categoryname,index, area); // Call a function to delete the area when delete icon is clicked
													}}
												/>
											</Box>
										))}
									</Box>
									{/* Render the pop-up */}
									{showPopup && selection && (
										<Dialog open={showPopup} 
										onClose={handleClosePopupForm}
								// 		 boxShadow={3} p={3} borderRadius={10} 
								// 			sx={{
								// 				position: 'fixed',
								// 				left: '50%',
        						// 		transform: 'translate(-50%)',
								// 				width:'50%',
								// 				top:'10%',
								// 				backgroundColor:'white',
								// 				 // Specify the thickness and color of the border
    							// 				padding: '20px',
								// 				overflowY: 'auto', // Enable vertical scrolling
								// 				height: '90%', // Adjust as needed
								// 				padding: '10px',
								// 				 boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)',
								// 				 // Semi-transparent black
                				// //zIndex: 999, // Ensure the overlay is above other content
								// 			}}
										>
											<Container style={{ margin:'5%' }}>
											<Box className="addIssue">
											<CloseIcon style={{ cursor: 'pointer', marginRight: 'auto' }}onClick={handleClosePopupForm} />
													
												<form onSubmit={(event) => { handleAddIssue(event,module) }}>
													{!categorySubmitted && (
														<Box sx={{display:'flex', flexDirection:'column'}}>
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
													<Box sx={{display :'flex', flexDirection:'row'}}>	
													<TextField
														label={'Issue Name'}
														id="issue"
														value={issueName}
														onChange={(e) => setIssueName(e.target.value)}
													/>
													&nbsp;&nbsp;
													<Dropdown
														label={'Severity'}
														select
														value={severity} list={["Critical","Major","Minor"]}
														onChange={(e) => setSeverity(e.target.value)}
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
													<Table rows={issues} setRows={setIssues} savetoDatabse={handleEditIssue} deleteFromDatabase={handleDeleteIssue} columns={columns}/>
													</>
													)}
												</form>
											</Box>
											</Container>
										</Dialog>
									)}
								</TabPanel>
							))}
						</TabContext>
					)}
				</Box>
				<DialogBox openPopup={dialogPopup} setOpenPopup={setDialogPopup} dialogMessage={dialogMessage}/>
			</Main>
		</Box>
	);
};

export default ModuleConfigure;