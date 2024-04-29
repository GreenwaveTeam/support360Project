import React, { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import TopbarPage from "../../../components/navigation/topbar/topbar";
import SidebarPage from "../../../components/navigation/sidebar/sidebar";
import Main from "../../../components/navigation/mainbody/mainbody";
import DrawerHeader from "../../../components/navigation/drawerheader/drawerheader.component";

import {
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Alert,
  Button,
  Box,
} from "@mui/material";
import { Dialog } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import CustomTable from "../../../components/table/table.component";
import TicketDialog from "../../../components/ticketdialog/ticketdialog.component";
import { useUserContext } from "../../contexts/UserContext";
import { useLocation } from "react-router-dom";

export default function InfrastructureUser({ sendUrllist }) {
  const [open, setOpen] = useState(false);
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
  const [ticketNumber, setTicketNumber] = useState("Ticket101");
  const [ticketOpen, setTicketOpen] = useState(false);
  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const { userData, setUserData } = useUserContext();
  const currentPageLocation = useLocation().pathname;
  console.log("userData ==>> ", userData);

  const infraTicketJSON = {
    plantId: "plant101",
    ticketNo: ticketNumber,
    status: "open",
    infraIssueDetails: infraIssueDetails,
  };
  const columns = [
    {
      id: "issue",
      label: "Issue Name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "priority",
      label: "Severity",
      type: "textbox",
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
    fetchDivs();
  }, []);

  const fetchDivs = async () => {
    try {
      console.log("fetchDivs() called");
      console.log("Current Page Location: ", currentPageLocation);

      const response = await fetch(
        `http://localhost:8081/role/roledetails?role=${userData.role}&pagename=${currentPageLocation}`,
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
    // Fetch data from the API
    fetch(`http://localhost:8081/infrastructure/admin/${userData.plantID}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Set the fetched infrastructure names
        setInfrastructures(
          data.infraDetails.map((item) => item.infrastructure_name)
        );
      })
      .catch((error) => console.error("Error fetching data:", error));
    setTicketNumber(generateRandomNumber);
    sendUrllist(urllist);
  }, []); // Empty dependency array to run effect only once on component mount

  useEffect(() => {
    // Fetch issues for the selected infrastructure
    if (selectedInfrastructure) {
      fetch(
        `http://localhost:8081/infrastructure/admin/${userData.plantID}/${selectedInfrastructure}/issues`,
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
    try {
      const response = await fetch(
        "http://localhost:8081/infrastructure/user/saveInfraTicket",
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
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    return "D" + randomNumber;
  };
  const handleInfrastructureChange = (event) => {
    console.log("handleInfrastructureChange called");
    setSelectedInfrastructure(event.target.value);
    setVisible(true);
    setTableData([]);
    // setSelectedInfrastructure("");
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
      setAlertMessage("Please select an issue");
      setShowAlert(true);
    }
    if (!selectedPriority) {
      setAlertMessage("Please select an Seviarity");
      setShowAlert(true);
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
            priority: selectedPriority,
            remarks: remarks,
          },
        ]);
        setSelectedIssue("");
        setSelectedPriority("");
        setRemarks("");
      }
    }
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
    <div>
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
                  <InputLabel id="infrastructureDropdownLabel">
                    Select Infrastructure
                  </InputLabel>
                  <Select
                    labelId="infrastructureDropdownLabel"
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
                </FormControl>
              </center>
              <div>
                <Dialog
                  header={`Report Issue for : ${selectedInfrastructure}`}
                  visible={visible}
                  style={{ width: "50vw", height: "60vh" }}
                  onHide={onHideDialog}
                >
                  {selectedInfrastructure && (
                    <TableContainer
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
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
                          onChange={(e) => setSelectedIssue(e.target.value)}
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

                      <FormControl
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
                      <IconButton
                        color="primary"
                        aria-label="add"
                        onClick={() => handleAddItem()}
                      >
                        <AddIcon />
                      </IconButton>
                    </TableContainer>
                  )}

                  {showAlert && (
                    <Alert severity="error" onClose={() => setShowAlert(false)}>
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
                </Dialog>
              </div>
            </div>
            {infraIssueDetails.length > 0 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TextField
                          label="infrastructure Name"
                          variant="standard"
                          size="small"
                          onChange={(e) =>
                            handleFilterChange(e.target.value, "deviceName")
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Issue"
                          variant="standard"
                          size="small"
                          onChange={(e) =>
                            handleFilterChange(e.target.value, "issue")
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Priority"
                          variant="standard"
                          size="small"
                          onChange={(e) =>
                            handleFilterChange(e.target.value, "priority")
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Remarks"
                          variant="standard"
                          size="small"
                          onChange={(e) =>
                            handleFilterChange(e.target.value, "remarks")
                          }
                        />
                      </TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(filteredDeviceIssueDetails.length > 0
                      ? filteredDeviceIssueDetails
                      : infraIssueDetails
                    ).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.infrastructureName}</TableCell>
                        <TableCell>{row.issue}</TableCell>
                        <TableCell>{row.priority}</TableCell>
                        <TableCell>{row.remarks}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              handleDeleteItemFromReviewTable(
                                row.infrastructureName,
                                row.issue
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <center>
                  <Button
                    className="button"
                    variant="contained"
                    color="secondary" // Use secondary color for delete button
                    onClick={() => handleSubmitPost(infraTicketJSON)}
                  >
                    Submit
                  </Button>
                </center>
              </TableContainer>
            )}
            <TicketDialog
              ticketDialogOpen={ticketOpen}
              setTicketDialogOpen={setTicketOpen}
              ticketNumber={ticketNumber}
            ></TicketDialog>
          </div>
        )}
    </div>
  );
}
