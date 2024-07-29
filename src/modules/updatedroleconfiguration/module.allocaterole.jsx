import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import {
  getPageComponentDetails,
  addOrUpdateAccessibility,
  getRoleDetails,
} from "./allocaterole";
import { TabContext, TabPanel } from "@mui/lab";
import { Button, Chip, Paper, Tooltip } from "@mui/material";
import CustomDialog from "../../components/dialog/dialog.component";
import { Dialog } from "primereact/dialog";
import CustomTable from "../../components/table/table.component";
import SnackbarComponent from "../../components/snackbar/customsnackbar.component";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import { borderColor, display } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useLocation, useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { extendTokenExpiration } from "../helper/Support360Api";

export default function AllocateRole({sendUrllist}) {
  //States and variables
  const [value, setValue] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [roleData, setRoleData] = React.useState([]);

  //Custom dialog related states
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [openConfirmText, setOpenConfirmText] = React.useState("");

  const [showReviewDialog, setShowReviewDialog] = React.useState(false);
  const [selectedPage, setSelectedPage] = React.useState("");
  const [showPages, setshowPages] = React.useState(true);
  //Snackbar related states
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarSeverity, setsnackbarSeverity] = React.useState("error");

  //States to allocate breadcrumbs
  const urllist = [
    { pageName: "Admin Home", pagelink: "/admin/home" },
    { pageName: "Role", pagelink: "/admin/roleconfigure" },
  ]; 

  //Delete related states
  const [deleteObj, setDeleteObj] = React.useState(null);

  //Location related states
  const location =useLocation()
  const role = location.state.role;
  const description = location.state.description;

  const navigate=useNavigate()

  const columns = [
    // {
    //   id: "role",
    //   label: "Role",
    //   type: "text",
    //   canRepeatSameValue: false,
    // },
    // {
    //   id: "description",
    //   label: "Description",
    //   type: "text",
    //   canRepeatSameValue: false,
    // },
    {
      id: "page_name",
      label: "Page",
      type: "text",
      canRepeatSameValue: false,
    },
    {
      id: "component",
      label: "Component",
      type: "text",
      canRepeatSameValue: false,
    },
    {
      id: "component_description",
      label: "Description",
      type: "text",
      canRepeatSameValue: false,
    },
  ];
  // const data = [
  //   {
  //     pagename: "Page 1",
  //     pageimage: "",
  //     component: [
  //       {
  //         component: "Main body",
  //         component_description: "Component Description",
  //         left: 0.15735695,
  //         top: 0.012106538,
  //         width: 0.6594005,
  //         height: 0.55811137,
  //       },
  //       {
  //         component: "Navbar",
  //         component_description: "Component Description",
  //         left: 0.0027247956,
  //         top: 0.00968523,
  //         width: 0.14509536,
  //         height: 0.468523,
  //       },
  //     ],
  //   },
  //   {
  //     pagename: "Page 2",
  //     pageimage: "",
  //     component: [
  //       {
  //         component: "Main body 2",
  //         component_description: "Component Description",
  //         left: 0.15735695,
  //         top: 0.012106538,
  //         width: 0.6594005,
  //         height: 0.55811137,
  //       },
  //       {
  //         component: "Navbar 2",
  //         component_description: "Component Description",
  //         left: 0.0027247956,
  //         top: 0.00968523,
  //         width: 0.14509536,
  //         height: 0.468523,
  //       },
  //     ],
  //   },
  //   {
  //     pagename: "Page 3",
  //     pageimage: "",
  //     component: [
  //       {
  //         component: "Main body 3",
  //         component_description: "Component Description",
  //         left: 0.15735695,
  //         top: 0.012106538,
  //         width: 0.6594005,
  //         height: 0.55811137,
  //       },
  //       {
  //         component: "Navbar 3",
  //         component_description: "Component Description",
  //         left: 0.0027247956,
  //         top: 0.00968523,
  //         width: 0.14509536,
  //         height: 0.468523,
  //       },
  //     ],
  //   },
  // ];

  //Styles
  // const highlightStyle = {
  //   position: "absolute",
  //   left: `${isHighlighted?.left * 100}%`,
  //   top: `${isHighlighted?.top * 100}%`,
  //   width: `${isHighlighted?.width * 100}%`,
  //   height: `${isHighlighted?.height * 100}%`,
  //   backgroundColor: "rgba(255, 255, 255, 0.5)",
  //   border: '2px dashed rgba(255, 0, 0, 0.5)',

  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   color: "white",
  //   fontSize: "16px",
  //   fontWeight: "bold",
  //   textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  //   transition: "all 0.3s ease",
  //   cursor: "pointer",
  // };

  // const highlightOverlayStyle = {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   width: '100%',
  //   height: '100%',
  //   backgroundColor: 'rgba(255, 255, 255, 0.5)',
  //   pointerEvents: 'none', // Ensures the overlay does not intercept mouse events
  // };

  //Functions
  const handleChange = (event, newValue, pagename) => {
    setValue(newValue);
    setSelectedPage(data.at(newValue).pagename);
    console.log("Selected page:", data.at(newValue).pagename);
  };
  const fetchData = async () => {
    const responsedetails = await getPageComponentDetails();
    const roleDetails = await getRoleDetails(role);
    setRoleData(roleDetails);
    console.log("Pages:", responsedetails);
    setData(responsedetails);
    setSelectedPage(responsedetails.at(0).pagename);
  };
  const handleConfirm = () => {
    handleDeleteConfirmed();
  };
  const handleAddComponent = (selectedComponent) => {
    if (
      roleData.find(
        (obj) =>
          role === obj.role &&
          obj.page_name.trim().toLowerCase() === selectedPage.trim().toLowerCase() &&
          obj.component.trim().toLowerCase() === selectedComponent.component.trim().toLowerCase()
      )
    ) {
      setsnackbarSeverity("error");
      setSnackbarText("Component already exists");
      setShowSnackbar(true);
      return;
    }

    const roles = [
      ...roleData,
      {
        role: role,
        description: description,
        page_name: selectedPage,
        component: selectedComponent.component,
        component_description:selectedComponent.component_description
      },
    ];
    handleSubmitRole(roles);
    setRoleData([
      ...roleData,
      {
        role: role,
        description: description,
        page_name: selectedPage,
        component: selectedComponent.component,
        component_description:selectedComponent.component_description
      },
    ]);
  };

  
  const handleSubmitRole = (role) => {
    console.log("Handle submit method invoked");
    addOrUpdateAccessibility(role);
  };
  const handleDeleteConfirmed = () => {
    const roles = roleData.filter(
      (obj) =>
        !(obj.page_name.trim().toLowerCase() === deleteObj.page.trim().toLowerCase() && obj.component.trim().toLowerCase() === deleteObj.component.trim().toLowerCase())
    );
    handleSubmitRole(roles);

    setRoleData(
      roleData.filter(
        (obj) =>
          !(
            obj.page_name.trim().toLowerCase() === deleteObj.page.trim().toLowerCase() && obj.component.trim().toLowerCase() === deleteObj.component.trim().toLowerCase()
          )
      )
    );
    setDeleteObj(null)
  };
  // const handleDeleteClick = (deleteobj) => {
  //   console.log("Handle Delete click");
  //   setRoleData(
  //     roleData.filter(
  //       (obj) =>
  //         !(
  //           obj.role === deleteobj.role &&
  //           obj.page_name === deleteobj.page_name &&
  //           obj.component === deleteobj.component
  //         )
  //     )
  //   );
  // };
  const handleDeleteInvoked = (page, comp) => {
    console.log("handleDeleteInvoked()")
    setDeleteObj({ page: page, component: comp });
    setOpenConfirmDialog(true);
    setOpenConfirmText("Delete Component");
  };
  const handleDeleteRowInvoked=(delObj)=>{
    console.log("handleDeleteInvoked()")
    setDeleteObj({ page: delObj.page_name, component: delObj.component });
    setOpenConfirmDialog(true);
    setOpenConfirmText("Delete Component");
  }
  //Use effects
  React.useEffect(() => {
    if (
      localStorage.getItem("token") === null ||
      localStorage.getItem("token") === ""
    ) {
      console.log("Local storage::", localStorage.getItem("token"));
      navigate("/login");
    } else {
      extendTokenExpiration();
      fetchData();
      sendUrllist(urllist);
    }
  }, []);
  React.useEffect(() => {
    console.log("Data:::", roleData);
  }, [roleData]);

  return (
    <div>
      <Paper
        elevation={3}
        style={{
          marginBottom: "3px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "3px",
        }}
      >
        {/* <Tooltip title={'Click on the search icon to go to a different page'}><Button variant="contained" color="warning" onClick={()=>setshowPages(!showPages)}>{!showPages&&<SearchIcon/>}{showPages&&<CloseIcon/>}</Button></Tooltip>
         */}
        <Chip
          color="info"
          label={
            role
          }
        />

        <Typography fontSize={15}>
          Click on the highlighted area to add a component{" "}
          <KeyboardDoubleArrowDownIcon />
        </Typography>

        {roleData.length > 0 && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setShowReviewDialog(true)}
          >
            Review
          </Button>
        )}
      </Paper>

      <Paper elevation={2}>
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            display: "flex",
            height: "100vh",
            borderColor: "black",
            borderRadius: "2px",
          }}
        >
          <TabContext value={value}>
            {showPages && (
              <Paper elevation={3}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  orientation="vertical"
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                  aria-label="scrollable force tabs example"
                >
                  {data.map((currentrow, index) => (
                    <Tab
                      key={index}
                      value={index}
                      label={<Typography>{currentrow.pagename}</Typography>}
                    />
                  ))}
                </Tabs>
              </Paper>
            )}
            <Paper elevation={1}>
              {data.map((currentrow, index) => (
                <TabPanel value={index} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "80vh",
                      objectFit: "contain",
                    }}
                  >
                    <img
                      draggable={false}
                      src={`data:image/jpeg;base64,${currentrow.pageimage}`}
                      alt={`Module ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                    {currentrow.component.map((currentcomp, compindex) => (
                      <Tooltip
                        title={
                          <Typography>
                            {currentcomp.component_description}
                          </Typography>
                        }
                        placement="top-start"
                      >
                        <Box
                          style={{
                            backgroundColor:
                              roleData.some((row) => {
                                // console.log("Current check::",currentcomp.component," , ",row.component," , ",currentrow.pagename," , ",row.page_name, " , ",currentcomp.component===row.component," , ",currentrow.pagename===row.page_name)
                                return (
                                  currentcomp.component === row.component &&
                                  currentrow.pagename === row.page_name
                                );
                              }) && "rgba(190,215,215,0.5)",
                            border:
                              roleData.includes(
                                (row) =>
                                  currentcomp.component === row.component &&
                                  currentcomp.page_name === row.page_name
                              ) && "0.5px dashed black",
                          }}
                          sx={{
                            position: "absolute",
                            left: `${currentcomp.left * 100}%`,
                            top: `${currentcomp.top * 100}%`,
                            width: `${currentcomp.width * 100}%`,
                            height: `${currentcomp.height * 100}%`,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            backgroundColor: "rgba(240,248,255,0.5)",
                            border: "0.5px dashed rgba(0, 0, 0, 0.5)",
                          }}
                        >
                          {roleData.some((row) => {
                            // console.log("Current check::",currentcomp.component," , ",row.component," , ",currentrow.pagename," , ",row.page_name, " , ",currentcomp.component===row.component," , ",currentrow.pagename===row.page_name)
                            return (
                              currentcomp.component === row.component &&
                              currentrow.pagename === row.page_name
                            );
                          })===false && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Tooltip title={"Add Component to the role"}>
                                <Button
                                  onClick={()=>{
                                    //setSelectedComponent({component:currentcomp.component,component_description:currentcomp.component_description});
                                    handleAddComponent({component:currentcomp.component,component_description:currentcomp.component_description})
                                  }}
                                >
                                  <AddCircleOutlineIcon color="error" />
                                </Button>
                              </Tooltip>
                            </Box>
                          )}

                          {roleData.some((row) => {
                            // console.log("Current check::",currentcomp.component," , ",row.component," , ",currentrow.pagename," , ",row.page_name, " , ",currentcomp.component===row.component," , ",currentrow.pagename===row.page_name)
                            return (
                              currentcomp.component === row.component &&
                              currentrow.pagename === row.page_name
                            );
                          }) && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Tooltip title={"Remove Component from the role"}>
                                <Button
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleDeleteInvoked(
                                      currentrow.pagename,
                                      currentcomp.component
                                    );
                                  }}
                                >
                                  <CancelIcon color="error" />
                                </Button>
                              </Tooltip>
                            </Box>
                          )}
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                </TabPanel>
              ))}
            </Paper>
          </TabContext>
        </Box>
      </Paper>
      <CustomDialog
        proceedButtonText={openConfirmText}
        proceedButtonClick={handleConfirm}
        cancelButtonText={"Cancel"}
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
      />
       <Dialog
        header={
          <div
            
          >
            <Typography fontSize={25}>Review and Submit Role</Typography>
          </div>
        }
        visible={showReviewDialog}
        style={{ width: "50vw" }}
        onHide={() => {
          setShowReviewDialog(false);
        }}
      >
        <CustomTable
          rows={roleData}
          setRows={setRoleData}
          columns={columns}
          editActive={false}
          deleteFromDatabase={handleDeleteRowInvoked}
          tablename={"Configured Components"}
        />
      </Dialog> 
      <SnackbarComponent
        dialogMessage={snackbarText}
        openPopup={showSnackbar}
        setOpenPopup={setShowSnackbar}
        snackbarSeverity={snackbarSeverity}
      />
    </div>
  );
}
