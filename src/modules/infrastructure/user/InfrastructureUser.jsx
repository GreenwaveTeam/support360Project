import React, { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import TopbarPage from "../../../components/navigation/topbar/topbar";
import SidebarPage from "../../../components/navigation/sidebar/sidebar";
import Main from "../../../components/navigation/mainbody/mainbody";
import DrawerHeader from "../../../components/navigation/drawerheader/drawerheader.component";
import RenewMessageComponent from "../../../components/renew/renew.component";
import {
  Badge,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Alert,
  Collapse,
  Button,
  Box,
  DialogTitle,
  Divider,
  Card,
  Container,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import CustomTable from "../../../components/table/table.component";
import TicketDialog from "../../../components/ticketdialog/ticketdialog.component";
import { useUserContext } from "../../contexts/UserContext";
import { useLocation } from "react-router-dom";
import { ExpandMore } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import Dropdown from "../../../components/dropdown/dropdown.component";
import dayjs from "dayjs";
import { extendTokenExpiration } from "../../helper/Support360Api";
import Fab from "@mui/material/Fab";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CustomButton from "../../../components/button/button.component";
import SnackbarComponent from "../../../components/snackbar/customsnackbar.component";
import { fetchAllProjectDetails } from "../../helper/AllProjectDetails";
const DB_IP = process.env.REACT_APP_SERVERIP;
export default function InfrastructureUser({ sendUrllist }) {
  const [open, setOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");
  const [infrastructures, setInfrastructures] = useState([]);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState("");
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [remarks, setRemarks] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [infraIssueDetails, setInfraIssueDetails] = useState([]);
  const [filteredDeviceIssueDetails, setFilteredDeviceIssueDetails] = useState(
    []
  );
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState("Select a Project");
  const [snackbarText, setSnackbarText] = useState("Data saved !");
  const [snackbarSeverity, setsnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("Ticket101");
  const [ticketOpen, setTicketOpen] = useState(false);
  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const { userData, setUserData } = useUserContext();
  const currentPageLocation = useLocation().pathname;
  const [isUserUnderSupport, setIsUserUnderSupport] = useState(false);

  const [plantID, setPlantId] = useState();
  const [userName, setUserName] = useState();
  const [userEmailId, setUserEmailId] = useState();
  const [plantIdList, setPlantIdList] = useState([]);

  const [currentUserData, setCurrentUserData] = useState();

  console.log("userData ==>> ", userData);

  //Dialog

  const [reviewOpen, setReviewOpen] = React.useState(false);

  const handleClickOpen = () => {
    setReviewOpen(true);
  };

  const handleCloseDialog = (event, reason) => {
    if (reason === "backdropClick") {
      setReviewOpen(false);
    }
    // setOpen(false);
  };

  const infraTicketJSON = {
    plantId: plantID,
    userName: userName,
    userEmailId: userEmailId,
    ticketNo: ticketNumber,
    status: "open",
    infraIssueDetails: infraIssueDetails,
  };

  const overviewTableColumns = [
    {
      id: "infrastructureName",
      label: " infrastructure Name ",
      type: "textbox",
      canRepeatSameValue: true,
    },
    {
      id: "issue",
      label: " Issue Name ",
      type: "textbox",
      canRepeatSameValue: true,
    },
    {
      id: "severity",
      label: " Severity ",
      type: "textbox",
      canRepeatSameValue: true,
    },
    {
      id: "remarks",
      label: " Remarks ",
      type: "textbox",
      canRepeatSameValue: true,
    },
  ];
  const columns = [
    {
      id: "issue",
      label: "Issue Name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "severity",
      label: "Severity",
      type: "chip",
      canRepeatSameValue: false,
    },
    {
      id: "remarks",
      label: "Remarks",
      type: "textbox",
      canRepeatSameValue: false,
    },
  ];
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    extendTokenExpiration();
    fetchUser();
    fetchProjectAndPlantDetails();
    // fetchDivs();
  }, []);
  const fetchUser = async () => {
    let role = "";
    try {
      const response = await fetch(`http://${DB_IP}/users/user`, {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log("fetchUser data : ", data);
      // setFormData(data.role);
      setCurrentUserData(data);
      setPlantId(data.plantID);
      setUserName(data.name);
      setUserEmailId(data.email);
      role = data.role;

      console.log("Role Test : ", role);
      fetchDivs(role);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };
  const fetchDivs = async (role) => {
    try {
      console.log("fetchDivs() called");
      console.log("Current Page Location: ", currentPageLocation);

      const response = await fetch(
        `http://${DB_IP}/role/roledetails?role=${role}&pagename=${currentPageLocation}`,
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
      if (response.ok) {
        console.log("Current Response : ", data);
        console.log("Current Divs : ", data.components);
        setDivIsVisibleList(data.components);
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
  React.useEffect(() => {
    console.log(
      "deviceIssueDetails:",
      JSON.stringify(infraIssueDetails, null, 1)
    );
  }, [infraIssueDetails]);

  React.useEffect(() => {
    console.log("infraTicketJSON:", JSON.stringify(infraTicketJSON, null, 1));
  }, [infraTicketJSON]);

  useEffect(() => {
    console.log(`Bearer ${localStorage.getItem("token")}`);
    console.log("User Data plant : ", userData.plantID);
    // Fetch data from the API
    console.log(
      "infra : ",
      `http://${DB_IP}/infrastructure/admin/${userData.plantID}/${selectedProject}`
    );
    fetch(
      `http://${DB_IP}/infrastructure/admin/${userData.plantID}/${selectedProject}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Set the fetched infrastructure names
        setInfrastructures(
          data.infraDetails.map((item) => item.infrastructure_name)
        );
      })
      .catch(
        (error) => console.error("Error fetching data:", error),
        setInfrastructures([])
      );
    setTicketNumber(generateRandomNumber);
    sendUrllist(urllist);
  }, [selectedProject]); // Empty dependency array to run effect only once on component mount

  useEffect(() => {
    // Fetch issues for the selected infrastructure
    if (selectedInfrastructure) {
      fetch(
        `http://${DB_IP}/infrastructure/admin/${userData.plantID}/${selectedInfrastructure}/${selectedProject}/issues`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const selectedInfra = data.infraDetails.find(
            (item) => item.infrastructure_name === selectedInfrastructure
          );
          setSelectedIssues(
            selectedInfra.issues.map((issue) => issue.issue_name)
          );
        })
        .catch((error) => console.error("Error fetching issues:", error));
    }
  }, [selectedInfrastructure]); // Fetch issues when selectedInfrastructure changes

  const handleSubmitPost = async (dataLocal) => {
    console.log("cureent Data ", dataLocal);
    try {
      const response = await fetch(
        `http://${DB_IP}/infrastructure/user/saveInfraTicket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(dataLocal),
        }
      );

      if (response.ok) {
        // setPostDataStatus("Data successfully posted!");
        console.log("post completed");
        setTicketOpen(true);
        setReviewOpen(false);
      } else {
        console.log("Error posting data. Please try again.");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      //setPostDataStatus("Error posting data. Please try again.");
    }

    setFilteredDeviceIssueDetails([]);
    setInfraIssueDetails([]);
    setTicketNumber(generateRandomNumber);
  };
  const generateRandomNumber = () => {
    const randomNumber = dayjs().format("YYYYMMDDTHHmmssSSS");
    return "I" + randomNumber;
  };
  const handleInfrastructureChange = (event) => {
    console.log("handleInfrastructureChange called");
    setSelectedInfrastructure(event.target.value);
    setVisible(true);
    setTableData([]);
    // setSelectedInfrastructure("");
  };
  const fetchProjectAndPlantDetails = async () => {
    console.log("fetchProjectAndPlantDetails() called");
    const projectDetails = await fetchAllProjectDetails();
    console.log("Project Details : ", projectDetails);
    const plantIdList = [];
    const projectList = [];
    if (projectDetails) {
      projectDetails.forEach((data) => {
        const currentPlant = data.plant_id;
        const currentProject = data.project_name;
        if (data.plant_id === userData.plantID) {
          plantIdList.push(currentPlant);
          projectList.push(currentProject);
        }
      });
    }
    projectList.unshift("Select a Project");
    console.log("Final PlantList : ", plantIdList);
    console.log("Final ProjectList : ", projectList);
    setPlantIdList(plantIdList);
    setProjectList(projectList);
  };
  const onHideDialog = () => {
    setVisible(false);
    setSelectedInfrastructure("");
    handleAddDeviceIssueDetails();
  };
  const handleAddDeviceIssueDetails = () => {
    const newData = [
      ...infraIssueDetails,
      ...tableData.map((item) => ({
        ...item,
        infrastructureName: selectedInfrastructure,
      })),
    ];
    setInfraIssueDetails(newData);
    setTableData([]);
  };

  const handleSelectPriority = (event) => {
    setSelectedPriority(event.target.value);
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleAddItem = () => {
    if (!selectedIssue) {
      // setAlertMessage("Please select an issue");
      // setShowAlert(true);
      setsnackbarSeverity("error");
      setSnackbarText("Please select an issue !");
      setSnackbarOpen(true);
      return;
    }
    if (!selectedPriority) {
      // setAlertMessage("Please select an Seviarity");
      // setShowAlert(true);
      setsnackbarSeverity("error");
      setSnackbarText("Please select an Severity !");
      setSnackbarOpen(true);
      return;
    }
    if (selectedIssue && selectedPriority) {
      const existingIssue = tableData.find(
        (item) => item.issue === selectedIssue
      );
      if (existingIssue) {
        setAlertMessage("Issue already exists.");
        setShowAlert(true);
      } else {
        setTableData([
          ...tableData,
          {
            issue: selectedIssue,
            severity: selectedPriority,
            remarks: remarks,
          },
        ]);
        setSelectedIssue("");
        setSelectedPriority("");
        setRemarks("");
      }
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleDeleteItem = (row) => {
    const issue = row.issue;
    const updatedData = tableData.filter((item) => item.issue !== issue);
    setTableData(updatedData);
  };
  const handleFilterChange = (value, field) => {
    const filteredData = infraIssueDetails.filter((row) =>
      row[field].toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDeviceIssueDetails(filteredData);
  };
  const handleDeleteItemFromReviewTableTest = (row) => {
    const infrastructureName = row.infrastructureName;
    const issue = row.issue;
    const updatedData = infraIssueDetails.filter(
      (item) =>
        !(
          item.infrastructureName === infrastructureName && item.issue === issue
        )
    );
    setInfraIssueDetails(updatedData);
    setFilteredDeviceIssueDetails(
      filteredDeviceIssueDetails.filter(
        (item) =>
          !(
            item.infrastructureName === infrastructureName &&
            item.issue === issue
          )
      )
    );
  };

  const handleDeleteItemFromReviewTable = (infrastructureName, issue) => {
    const updatedData = infraIssueDetails.filter(
      (item) =>
        !(
          item.infrastructureName === infrastructureName && item.issue === issue
        )
    );
    setInfraIssueDetails(updatedData);
    setFilteredDeviceIssueDetails(
      filteredDeviceIssueDetails.filter(
        (item) =>
          !(
            item.infrastructureName === infrastructureName &&
            item.issue === issue
          )
      )
    );
  };
  const urllist = [
    { pageName: "Home", pagelink: "/user/home" },
    {
      pageName: "Infrastructure Report",
      pagelink: "/user/ReportInfrastructure",
    },
  ];

  return (
    <Container maxWidth="lg">
      <>
        {
          <Fab
            size="large"
            variant="extended"
            color="secondary"
            aria-label="add"
            sx={{ position: "fixed", left: "90%", bottom: "5%" }}
            className="mobileViewFloatBtn"
            onClick={handleClickOpen}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <AddIcon />

              <Typography style={{ marginRight: "14px" }}>Review</Typography>
              <Badge
                badgeContent={infraIssueDetails.length}
                color="primary"
              ></Badge>
            </div>
          </Fab>
        }
      </>
      <Card>
        <CardContent sx={{ padding: "0" }}>
          <div style={{ padding: "1.1rem  0.8rem  0.6rem  0.8rem " }}>
            {/* <Chip
              label={"Infrastructure"}
              size="medium"
              variant="outlined"
              color="info"
              fontSize="1rem"
            /> */}
            <Typography
              sx={{ fontSize: 14, fontWeight: 600 }}
              color="text.secondary"
              gutterBottom
            >
              Infrastructure
            </Typography>
          </div>
          <Divider sx={{ opacity: "0.8" }} />
          {divIsVisibleList &&
            divIsVisibleList.includes("infrastructure-report") && (
              <div id="infrastructure-report">
                <div>
                  <center>
                    <FormControl
                      variant="outlined"
                      sx={{
                        width: "200px",
                        verticalAlign: 0,
                        marginTop: "20px",
                      }}
                    >
                      <Dropdown
                        id={"project-dropdown"}
                        value={selectedProject}
                        onChange={(event) =>
                          setSelectedProject(event.target.value)
                        }
                        list={projectList}
                        label={"Project"}
                        // error={dropDownError}
                        style={{ width: "200px" }}
                      ></Dropdown>
                      <br></br>
                      {/* <InputLabel id="infrastructureDropdownLabel">
                        Select Infrastructure
                      </InputLabel> */}
                      {/* {isUserUnderSupport === false &&
                        selectedProject !== "Select a Project" && (
                          <RenewMessageComponent />
                        )} */}
                      {selectedProject !== "Select a Project" && (
                        <>
                          <InputLabel
                            id="infrastructure-label"
                            style={{ marginTop: "37%" }}
                          >
                            Select Infrastructure
                          </InputLabel>
                          <Select
                            labelId="infrastructure-label"
                            id="infrastructureDropdown"
                            value={selectedInfrastructure}
                            onChange={handleInfrastructureChange}
                            label="Select Infrastructure"
                          >
                            {infrastructures.map((infra, index) => (
                              <MenuItem key={index} value={infra}>
                                {infra}
                              </MenuItem>
                            ))}
                          </Select>
                        </>
                      )}
                    </FormControl>
                  </center>
                  <br />
                  <div>
                    <Dialog
                      //header={`Report Issue for : ${selectedInfrastructure}`}
                      open={visible}
                      fullWidth
                      //style={{ width: "50vw", height: "60vh" }}
                      onClose={onHideDialog}
                    >
                      <DialogTitle
                        id="alert-dialog-title"
                        sx={{ padding: "15px", fontWeight: "600" }}
                      >
                        {`Report Issue for : ${selectedInfrastructure}`}
                      </DialogTitle>
                      <Divider />
                      <div style={{ padding: "5px 15px" }}>
                        {selectedInfrastructure && (
                          <TableContainer
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              columnGap: "1rem",
                            }}
                          >
                            <FormControl
                              variant="outlined"
                              sx={{ width: "200px", verticalAlign: 0 }}
                            >
                              <InputLabel id="issuesDropdownLabel">
                                Select Issue
                              </InputLabel>
                              <Select
                                labelId="issuesDropdownLabel"
                                id="issuesDropdown"
                                value={selectedIssue}
                                onChange={(e) =>
                                  setSelectedIssue(e.target.value)
                                }
                                //   onChange={(e) => {
                                //     setSelectedIssue(e.target.value);
                                label="Select Issue"
                              >
                                {selectedIssues.map((issue, index) => (
                                  <MenuItem key={index} value={issue}>
                                    {issue}
                                  </MenuItem>
                                ))}
                                <MenuItem value="Other">Other</MenuItem>
                              </Select>
                            </FormControl>

                            {/* <FormControl
                        variant="outlined"
                        sx={{ width: "200px", verticalAlign: 0 }}
                      >
                        <InputLabel>Select Priority</InputLabel>
                        <Select
                          value={selectedPriority}
                          onChange={handleSelectPriority}
                          label="Select Priority"
                        >
                          <MenuItem value="Major">Major</MenuItem>
                          <MenuItem value="Minor">Minor</MenuItem>
                          <MenuItem value="Critical">Critical</MenuItem>
                        </Select>
                      </FormControl> */}
                            <FormControl
                              variant="outlined"
                              sx={{ width: "200px" }}
                            >
                              <Dropdown
                                label={"Severity"}
                                //select
                                //formstyle={{ width: "50%" }}
                                value={selectedPriority}
                                list={["Critical", "Major", "Minor"]}
                                onChange={handleSelectPriority}
                              />
                            </FormControl>
                            <FormControl
                              variant="outlined"
                              sx={{ width: "200px", verticalAlign: 0 }}
                            >
                              <TextField
                                label="Remarks"
                                variant="outlined"
                                value={remarks}
                                onChange={handleRemarksChange}
                                style={{ margin: "10px 0" }}
                              />
                            </FormControl>
                            {/* <IconButton
                        color="primary"
                        aria-label="add"
                        onClick={() => handleAddItem()}
                      >
                        <AddIcon />
                      </IconButton> */}
                          </TableContainer>
                        )}
                        <Button
                          variant="contained"
                          onClick={() => handleAddItem()}
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                            width: "30%",
                            margin: "auto",
                            display: "flex",
                          }}
                        >
                          Add Issue
                          <AddIcon
                            fontSize="medium"
                            sx={{ paddingLeft: "0.2rem" }}
                          />
                        </Button>
                        <br />

                        {showAlert && (
                          <Alert
                            severity="error"
                            onClose={() => setShowAlert(false)}
                          >
                            {alertMessage}
                          </Alert>
                        )}

                        {tableData.length > 0 && (
                          // <TableContainer>
                          //   <Table>
                          //     <TableHead>
                          //       <TableRow>
                          //         <TableCell>Issues</TableCell>
                          //         <TableCell>Priority</TableCell>
                          //         <TableCell>Remarks</TableCell>
                          //         <TableCell>Actions</TableCell>
                          //       </TableRow>
                          //     </TableHead>
                          //     <TableBody>
                          //       {tableData.map((item, index) => (
                          //         <TableRow key={index}>
                          //           <TableCell>{item.issue}</TableCell>
                          //           <TableCell>{item.priority}</TableCell>
                          //           <TableCell>{item.remarks}</TableCell>
                          //           <TableCell>
                          //             <IconButton
                          //               color="secondary"
                          //               aria-label="delete"
                          //               onClick={() => handleDeleteItem(item.issue)}
                          //             >
                          //               <DeleteIcon />
                          //             </IconButton>
                          //           </TableCell>
                          //         </TableRow>
                          //       ))}
                          //     </TableBody>
                          //   </Table>
                          // </TableContainer>
                          <CustomTable
                            rows={tableData}
                            columns={columns}
                            setRows={setTableData}
                            deleteFromDatabase={handleDeleteItem}
                            editActive={false}
                            tablename={"Added Issues"}
                            redirectIconActive={false}
                            isDeleteDialog={false}
                          ></CustomTable>
                        )}
                        <br />
                      </div>
                    </Dialog>
                  </div>
                </div>

                {/* {infraIssueDetails.length > 0 && (
                  <TableContainer>
                    <center>
                      <br></br>
                      <Card
                        sx={{ boxShadow: 2, padding: "7px", margin: "0px 2px" }}
                        style={{}}
                      >
                        <div
                          align="center"
                          style={{
                            padding: "5px",
                            flex: 1,
                            overflow: "auto",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              flex: 1,
                            }}
                          >
                            Issues Overview
                          </span>
                          <span
                            style={{
                              color: "#610C9F",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          ></span>
                          <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                          >
                            <ExpandMoreIcon />
                            &nbsp;
                          </ExpandMore>
                          <Badge
                            badgeContent={infraIssueDetails.length}
                            color="info"
                            sx={{ marginLeft: "8px" }}
                          >
                            {/* <NotificationsActiveIcon color="secondary" /> */}
                {/* </Badge>
                          &nbsp;
                        </div>

                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                          <CustomTable
                            rows={infraIssueDetails}
                            columns={overviewTableColumns}
                            setRows={setInfraIssueDetails}
                            tablename={"Summary"}
                            deleteFromDatabase={
                              handleDeleteItemFromReviewTableTest
                            }
                            style={{
                              borderRadius: 1,
                              // maxHeight: 440,
                              // maxWidth: 1200,
                            }}
                            isDeleteDialog={false}
                          ></CustomTable>
                          <br />
                          <Button
                            className="button"
                            variant="contained"
                            color="secondary" // Use secondary color for delete button
                            onClick={() => handleSubmitPost(infraTicketJSON)}
                          >
                            <SaveIcon
                              fontSize="small"
                              sx={{ marginRight: "0.3rem" }}
                            />
                            Submit
                          </Button>
                        </Collapse>
                      </Card>
                      <br></br>
                    </center>
                  </TableContainer>
                )}  */}

                <Dialog
                  open={reviewOpen}
                  onClose={(event, reason) => handleCloseDialog(event, reason)}
                >
                  <DialogTitle>
                    <div className="IssueDialog">
                      {infraIssueDetails.length !== 0 && (
                        <div>
                          <div
                            style={{
                              overflowY: "auto",
                            }}
                          >
                            <div
                              align="center"
                              style={{
                                flex: 1,
                                overflow: "auto",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  flex: 1,
                                }}
                              >
                                Issues Overview
                              </span>
                              <span
                                style={{
                                  color: "#610C9F",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                              >
                                {/* [{dropdownValue}]{" "} */}
                              </span>
                            </div>
                            {/* <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "blue",
                      }}
                    >
                      {tabsmoduleNames.length !== 0 && (
                        <CustomButton
                          size={"large"}
                          id={"final-submit"}
                          variant={"contained"}
                          color={"success"}
                          onClick={handleFinalReportClick}
                          style={classes.btn}
                          buttontext={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              Raise a Ticket
                              <ArrowRightIcon fontSize="small" />
                            </div>
                          }
                        ></CustomButton>
                      )}
                      &nbsp;
                      {progressVisible && (
                        <CircularProgress
                          color="info"
                          thickness={5}
                          size={20}
                        />
                      )}
                    </div> */}
                          </div>
                          {/* <Collapse in={expanded} timeout="auto" unmountOnExit> */}

                          {/* </Collapse> */}
                        </div>
                      )}
                    </div>
                  </DialogTitle>
                  <Divider textAlign="left"></Divider>

                  <DialogContent>
                    {/* <DialogContentText id="alert-dialog-slide-description"> */}
                    <div>
                      {
                        <div>
                          <CustomTable
                            rows={infraIssueDetails}
                            columns={overviewTableColumns}
                            setRows={setInfraIssueDetails}
                            tablename={"Issues Overview"}
                            deleteFromDatabase={
                              handleDeleteItemFromReviewTableTest
                            }
                            style={{
                              borderRadius: 1,
                              // maxHeight: 440,
                              // maxWidth: 1200,
                            }}
                            isDeleteDialog={false}
                          ></CustomTable>
                          <br />
                          {/* </Collapse> */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {/* <Button
                            // className="button"
                            variant="contained"
                            color="success" // Use secondary color for delete button
                            disabled={infraIssueDetails.length === 0}
                            onClick={() => handleSubmitPost(infraTicketJSON)}
                          >
                            <SaveIcon
                              fontSize="small"
                              sx={{ marginRight: "0.3rem" }}
                            />
                            Raise a Ticket
                          </Button> */}

                            <CustomButton
                              size={"large"}
                              id={"final-submit"}
                              variant={"contained"}
                              color={"success"}
                              onClick={() => handleSubmitPost(infraTicketJSON)}
                              // style={classes.btn}
                              disabled={infraIssueDetails.length === 0}
                              buttontext={
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  Raise a Ticket
                                  <ArrowRightIcon fontSize="small" />
                                </div>
                              }
                            ></CustomButton>
                          </div>
                        </div>
                      }
                    </div>
                    {/* <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <Textfield
                id="user-misc-issue"
                label={
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Miscellaneous Issue
                  </span>
                }
                multiline={true}
                rows={1}
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
                style={{
                  flex: "1",
                  marginRight: "10px",
                }}
                value={miscellaneousInput}
                onChange={(e) => {
                  setMiscellaneousInput(e.target.value);
                  console.log("Miscellaneous Issue:", e.target.value);
                }}
                error={additionalMiscellaneousError}
              />

              <Textfield
                id="user-misc-remarks"
                label={
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Remarks
                  </span>
                }
                multiline
                rows={1}
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
                style={{
                  flex: "1",
                  marginRight: "10px",
                }}
                value={miscellaneousRemarks}
                onChange={(e) => {
                  setmiscellaneousRemarks(e.target.value);
                  console.log("Remarks:", e.target.value);
                }}
              />

              <div>
                <Dropdown
                  style={{ width: "200px", marginRight: "10px" }}
                  id={"modal-severity-dropdown"}
                  list={severityList}
                  label={
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Severity
                    </span>
                  }
                  value={miscellaneousSeverity}
                  onChange={(e) => {
                    setmiscellaneousSeverity(e.target.value);
                    console.log(e.target.value);
                  }}
                  error={additionalMiscellaneousSeverityError}
                />
                <Button
                  size="small"
                  id="miscellaneous-add"
                  variant="contained"
                  color="primary"
                  sx={{
                    height: "50px",
                    width: "80px",
                    borderRadius: "5px",
                    backgroundImage:
                      "linear-gradient(to right, #6a11cb 0%, #2575fc 100%);",
                  }}
                  startIcon={<AddCircleIcon />}
                  onClick={handleAdditionalMiscellaneous}
                >
                  Add
                  
                </Button>
              </div>
            </div> */}
                    {/* </DialogContentText> */}
                  </DialogContent>
                </Dialog>

                <TicketDialog
                  ticketDialogOpen={ticketOpen}
                  setTicketDialogOpen={setTicketOpen}
                  ticketNumber={ticketNumber}
                ></TicketDialog>
              </div>
            )}
        </CardContent>
      </Card>
      <SnackbarComponent
        openPopup={snackbarOpen}
        setOpenPopup={setSnackbarOpen}
        dialogMessage={snackbarText}
        snackbarSeverity={snackbarSeverity}
      ></SnackbarComponent>
    </Container>
  );
}
