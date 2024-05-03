import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import Divider from "@mui/material/Divider";
import SaveIcon from "@mui/icons-material/Save";
import ReportIcon from "@mui/icons-material/Report";
// import Sidebar from "../../components/navigation/sidebar/sidebar";
// import Topbar from "../../components/navigation/topbar/topbar";
// import Main from "../../components/navigation/mainbody/mainbody";
// import DrawerHeader from "../../components/navigation/drawerheader/drawerheader.component";

//import { Button } from "primereact/button";
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableContainer,
  IconButton,
  TextField,
  Collapse,
  Badge,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Chip,
  Container, // Import TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert } from "@mui/material";
import CustomTable from "../../../components/table/table.component";
import TopbarPage from "../../../components/navigation/topbar/topbar";
import SidebarPage from "../../../components/navigation/sidebar/sidebar";
import Main from "../../../components/navigation/mainbody/mainbody";
import DrawerHeader from "../../../components/navigation/drawerheader/drawerheader.component";
import TicketDialog from "../../../components/ticketdialog/ticketdialog.component";
import { useUserContext } from "../../contexts/UserContext";
import { useLocation } from "react-router-dom";
//Theme
import { ColorModeContext, tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { useContext } from "react";
import { ExpandMore } from "@mui/icons-material";
import Dropdown from "../../../components/dropdown/dropdown.component";

export default function UserDeviceTree({ sendUrllist }) {
  const [open, setOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [data, setData] = useState(null);
  const [showAddItemButton, setShowAddItemButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [clickedNode, setClickedNode] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dialogCategory, setDialogCategory] = useState("");
  const [categoryIssues, setCategoryIssues] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [remarks, setRemarks] = useState("");
  const [addedItems, setAddedItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [deviceIssueDetails, setDeviceIssueDetails] = useState([]);
  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const [filteredDeviceIssueDetails, setFilteredDeviceIssueDetails] = useState(
    []
  );
  const [expanded, setExpanded] = useState(false);
  const [otherIssue, setOtherIssue] = useState("");
  const [ticketNumber, setTicketNumber] = useState("Ticket101");
  const { userData, setUserData } = useUserContext();
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const toast = useRef(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const currentPageLocation = useLocation().pathname;
  const deviceTicketJSON = {
    plantId: "plant101",
    ticketNo: ticketNumber,
    status: "open",
    deviceIssueDetails: deviceIssueDetails,
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

  //   React.useEffect(() => {
  //     console.log(
  //       "deviceIssueDetails:",
  //       JSON.stringify(deviceIssueDetails, null, 1)
  //     );
  //   }, [deviceIssueDetails]);

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
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/device/admin/getTree/${userData.plantID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const devData = await response.json();
          console.log("from API => ", JSON.stringify(devData));
          setData(devData);
          console.log("data");
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    setTicketNumber(generateRandomNumber);
    sendUrllist(urllist);
  }, []);

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    return "D" + randomNumber;
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      onClick={() => handleNodeClick(nodes)}
      // onContextMenu={(e) => handleContextMenu(e, nodes)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );
  const overviewTableColumns = [
    {
      id: "deviceName",
      label: " Device Name ",
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
      id: "priority",
      label: " Severity ",
      type: "chip",
      canRepeatSameValue: true,
    },
    {
      id: "remarks",
      label: " Remarks ",
      type: "textbox",
      canRepeatSameValue: true,
    },
  ];
  const handleNodeClick = (node) => {
    console.log("left click ", node.name);

    setSelectedNode(node);
    setClickedNode(node);
    setShowAddItemButton(false);
  };

  const handleContextMenu = (event, node) => {
    console.log("Right click ", node.name);

    event.preventDefault();
    event.stopPropagation();
    setSelectedNode(node);
    setShowAddItemButton(true);
    setButtonPosition({ x: event.clientX, y: event.clientY });
  };

  const handleClickOutsideNode = () => {
    setShowAddItemButton(false);
  };

  const handleSelectIssue = (event) => {
    setSelectedIssue(event.target.value);
  };

  const handleSelectPriority = (event) => {
    setSelectedPriority(event.target.value);
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };
  const handleSubmitPost = async (dataLocal) => {
    try {
      const response = await fetch(
        "http://localhost:8081/device/user/saveTicket",
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
        // setPostDataStatus("Error posting data. Please try again.");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      //setPostDataStatus("Error posting data. Please try again.");
    }

    setFilteredDeviceIssueDetails([]);
    setDeviceIssueDetails([]);
    setTicketNumber(generateRandomNumber);
  };

  const onHideDialog = () => {
    setVisible(false);
    setCategoryIssues();
    handleAddDeviceIssueDetails();
  };

  const handleAddItem = () => {
    // setRemarks("");
    // setSelectedIssue("");
    // setSelectedPriority("");

    if (selectedIssue && selectedPriority) {
      const existingIssue = tableData.find(
        (item) => item.issue === selectedIssue
      );
      if (existingIssue) {
        setAlertMessage("Issue already exists.");
        setShowAlert(true);
      } else {
        if (selectedIssue === "Other") {
          const newItem = {
            issue: otherIssue,
            priority: selectedPriority,
            remarks: remarks,
            category: selectedIssue,
          };
          setTableData([...tableData, newItem]);
          setRemarks("");
          setSelectedIssue("");
          setSelectedPriority("");
          setOtherIssue("");
          setShowAlert(false);
        } else {
          const newItem = {
            issue: selectedIssue,
            priority: selectedPriority,
            remarks: remarks,
            category: selectedNode.issue_category_name,
          };
          setTableData([...tableData, newItem]);
          setRemarks("");
          setSelectedIssue("");
          setSelectedPriority("");
          setOtherIssue("");
          setShowAlert(false);
          // setRemarks();
        }
      }
    } else {
      if (!selectedIssue) {
        setAlertMessage("Please select an issue");
        setShowAlert(true);
      }
      if (!selectedPriority) {
        setAlertMessage("Please select an severity");
        setShowAlert(true);
      }
    }
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleFilterChange = (value, field) => {
    const filteredData = deviceIssueDetails.filter((row) =>
      row[field].toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDeviceIssueDetails(filteredData);
  };

  const handleDeleteItem = (row) => {
    const issue = row.issue;
    console.log(" for delete => ", issue);
    const updatedData = tableData.filter((item) => item.issue !== issue);
    setTableData(updatedData);
  };

  const handleOpenDialog = (category) => {
    setVisible(true);
    console.log("category =>", category);

    const fetchData = async () => {
      try {
        const response = await fetch(
          // `http://localhost:9999/admin/P009/${category}`
          `http://localhost:8081/device/admin/${userData.plantID}/${category}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const categoryIssue = await response.json();
          setCategoryIssues(categoryIssue);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // setRemarks("");
    // setSelectedIssue();
    // setSelectedPriority();
  };
  const handleAddDeviceIssueDetails = () => {
    const newData = [
      ...deviceIssueDetails,
      ...tableData.map((item) => ({
        ...item,
        deviceName: selectedNode.name,
      })),
    ];
    setDeviceIssueDetails(newData);
    setTableData([]);
  };

  const handleDeleteItemFromReviewTable = (deviceName, issue) => {
    const updatedData = deviceIssueDetails.filter(
      (item) => !(item.deviceName === deviceName && item.issue === issue)
    );
    setDeviceIssueDetails(updatedData);
    setFilteredDeviceIssueDetails(
      filteredDeviceIssueDetails.filter(
        (item) => !(item.deviceName === deviceName && item.issue === issue)
      )
    );
  };

  const handleDeleteItemFromReviewTableTest = (row) => {
    const deviceName = row.deviceName;
    const issue = row.issue;
    const updatedData = deviceIssueDetails.filter(
      (item) => !(item.deviceName === deviceName && item.issue === issue)
    );
    setDeviceIssueDetails(updatedData);
    setFilteredDeviceIssueDetails(
      filteredDeviceIssueDetails.filter(
        (item) => !(item.deviceName === deviceName && item.issue === issue)
      )
    );
  };

  const urllist = [
    { pageName: "Home", pagelink: "/user/home" },
    {
      pageName: "Device Report",
      pagelink: "/user/ReportDevice",
    },
  ];

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Container maxWidth="lg">
      <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
        {divIsVisibleList && divIsVisibleList.includes("device-report") && (
          <div id="device-report">
            {deviceIssueDetails.length > 0 && (
              <TableContainer>
                <center>
                  {/* <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TextField
                          label="Device Name"
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
                      : deviceIssueDetails
                    ).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.deviceName}</TableCell>
                        <TableCell>{row.issue}</TableCell>
                        <TableCell>{row.priority}</TableCell>
                        <TableCell>{row.remarks}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              handleDeleteItemFromReviewTable(
                                row.deviceName,
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
                </Table> */}

                  <br></br>
                  <Card
                    sx={{ boxShadow: 1, padding: "7px", margin: "0px 2px" }}
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
                        badgeContent={deviceIssueDetails.length}
                        color="info"
                        sx={{ marginLeft: "8px" }}
                      >
                        {/* <NotificationsActiveIcon color="secondary" /> */}
                      </Badge>
                      &nbsp;
                    </div>

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <CustomTable
                        rows={deviceIssueDetails}
                        columns={overviewTableColumns}
                        setRows={setDeviceIssueDetails}
                        tablename={"Summary"}
                        deleteFromDatabase={handleDeleteItemFromReviewTableTest}
                        style={{
                          borderRadius: 2,
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
                        onClick={() => handleSubmitPost(deviceTicketJSON)}
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
                  {/* <Button
                  className="button"
                  variant="contained"
                  color="secondary" // Use secondary color for delete button
                  onClick={() => handleSubmitPost(deviceTicketJSON)}
                >
                  Submit
                </Button> */}
                </center>
              </TableContainer>
            )}
            <Card
              borderRadius={2}
              className="split-screen"
              onClick={handleClickOutsideNode}
            >
              <div className="left-panel">
                {data !== null && (
                  <div className="treeViewContainer">
                    <Chip
                      color="info"
                      variant="outlined"
                      size="large"
                      sx={{
                        fontSize: "0.9rem",
                        marginLeft: "5px",
                        marginBottom: "10px",
                      }}
                      label="Device Tree :"
                    />
                    <Divider sx={{ marginBottom: "0.6rem" }} />
                    <TreeView
                      className="treeView"
                      aria-label="rich object"
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpanded={["root"]}
                      defaultExpandIcon={<ChevronRightIcon />}
                    >
                      {renderTree(data)}
                    </TreeView>
                    <br />
                  </div>
                )}
              </div>
              <div className={`right-panel ${data === null ? "hidden" : ""}`}>
                {data !== null && selectedNode && (
                  <>
                    {/* <Box>
                <p className="selectedNodeInfo">
                  {selectedNode
                    ? `Selected Node: ${selectedNode.name}`
                    : "Select a node"}
                </p>
              </Box> */}

                    <div>
                      <Dialog
                        // header={`Report Issue for : ${selectedNode.name}`}
                        fullWidth
                        open={visible}
                        PaperProps={{
                          sx: {
                            // padding: "15px", // Add padding in the four corners
                            borderRadius: 2,
                            overflowX: "hidden", // Hide horizontal overflow
                          },
                        }}
                        onClose={onHideDialog}
                      >
                        <DialogTitle
                          id="alert-dialog-title"
                          sx={{ padding: "15px", fontWeight: "600" }}
                        >
                          {`Report Issue for : ${selectedNode.name}`}
                        </DialogTitle>
                        <Divider />

                        <div style={{ padding: "5px 15px" }}>
                          <TableContainer
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              columnGap: "1rem",
                            }}
                          >
                            {categoryIssues && categoryIssues.issueList ? (
                              <FormControl
                                variant="outlined"
                                sx={{ width: "200px" }}
                              >
                                <InputLabel>Select Issue</InputLabel>
                                <Select
                                  value={selectedIssue}
                                  onChange={(e) => {
                                    setSelectedIssue(e.target.value);
                                    if (e.target.value !== "Other") {
                                      setOtherIssue("");
                                    }
                                  }}
                                  label="Select Issue"
                                >
                                  {categoryIssues.issueList.map(
                                    (issue, index) => (
                                      <MenuItem
                                        key={index}
                                        value={issue.issuename}
                                      >
                                        {issue.issuename}
                                      </MenuItem>
                                    )
                                  )}
                                  <MenuItem value="Other">Other</MenuItem>
                                </Select>
                              </FormControl>
                            ) : (
                              <div>No issues found</div>
                            )}

                            {selectedIssue === "Other" && (
                              <TextField
                                sx={{ width: "200px" }}
                                label="miscellaneous issue"
                                value={otherIssue}
                                onChange={(e) => setOtherIssue(e.target.value)}
                                variant="outlined"
                                margin="dense"
                                fullWidth
                              />
                            )}
                            {/* <FormControl variant="outlined" sx={{ width: "200px" }}>
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
                              sx={{ width: "200px" }}
                            >
                              <TextField
                                label="Remarks"
                                variant="outlined"
                                value={remarks}
                                onChange={handleRemarksChange}
                                style={{ margin: "10px 0" }}
                              />
                            </FormControl>
                            {/* Plus icon button */}
                            {/* <IconButton
                          color="primary"
                          aria-label="add"
                          onClick={() => handleAddItem()}
                        >
                          <AddIcon />
                        </IconButton> */}
                          </TableContainer>

                          {/* <IconButton
                          color="primary"
                          aria-label="add"
                          onClick={() => handleAddItem()}
                        >
                          <AddIcon />
                        </IconButton> */}

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
                            Add Category
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
                            //         <TableCell>Issue</TableCell>
                            //         <TableCell>Priority</TableCell>
                            //         <TableCell>Remarks</TableCell>
                            //         <TableCell>Action</TableCell>
                            //       </TableRow>
                            //     </TableHead>
                            //     <TableBody>
                            //       {tableData.map((row, index) => (
                            //         <TableRow key={index}>
                            //           <TableCell>{row.issue}</TableCell>
                            //           <TableCell>{row.priority}</TableCell>
                            //           <TableCell>{row.remarks}</TableCell>
                            //           <TableCell>
                            //             <IconButton
                            //               onClick={() => handleDeleteItem(row.issue)}
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

                    {clickedNode &&
                      selectedNode.id !== "root" &&
                      clickedNode.id !== "root" && (
                        <div className="dlg">
                          <div className="clicked-node">
                            <Card
                              sx={{
                                minWidth: 550,

                                backgroundColor: colors.primary[400],
                                borderRadius: 2,
                                boxShadow: 2,
                              }}
                            >
                              <div className="Card-Components">
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0px 1rem",
                                  }}
                                >
                                  <h4>Node Details:</h4>
                                  <Button
                                    className="button"
                                    variant="contained"
                                    startIcon={<ReportIcon />}
                                    color="error" // Use secondary color for delete button
                                    onClick={() =>
                                      handleOpenDialog(
                                        selectedNode.issue_category_name
                                      )
                                    }
                                  >
                                    Report Issue
                                  </Button>
                                </div>
                                <Divider />
                                {/* <Toast ref={toast} />
                            <Dialog
                              group="declarative"
                              visible={visibleConfirm}
                              onHide={() => setVisibleConfirm(false)}
                              message="Are you sure you want to proceed?"
                              header="Add Issue"
                              icon="pi pi-exclamation-triangle"
                              accept={accept}
                              reject={reject}
                            >
                              <img
                                src="\tre.gif"
                                height={"400px"}
                                width={"250"}
                              />
                            </Dialog>
                            <div className="card flex justify-content-center">
                              <center>
                                <Button
                                  onClick={() => setVisibleConfirm(true)}
                                  icon="pi pi-check"
                                  label="Report Issue"
                                />
                              </center>
                            </div> */}

                                <div style={{ padding: "0rem 1.5rem" }}>
                                  <div className="CardText">
                                    <div style={{ marginBottom: "10px" }}>
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "5px",
                                          textAlign: "left",
                                        }}
                                      >
                                        Name:
                                      </p>
                                    </div>

                                    <div>
                                      <div className="value-comp">
                                        {selectedNode.name}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="CardText">
                                    <div style={{ marginBottom: "10px" }}>
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "5px",
                                        }}
                                      >
                                        Make:
                                      </p>
                                    </div>
                                    <div>
                                      <div className="value-comp">
                                        {selectedNode.make}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="CardText">
                                    <div style={{ marginBottom: "10px" }}>
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "5px",
                                        }}
                                      >
                                        Model:
                                      </p>
                                    </div>
                                    <div>
                                      <div className="value-comp">
                                        {selectedNode.model}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="CardText">
                                    <div style={{ marginBottom: "10px" }}>
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "5px",
                                        }}
                                      >
                                        Capacity:
                                      </p>
                                    </div>
                                    <div>
                                      <div className="value-comp">
                                        {selectedNode.capacity}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="CardText">
                                    <div style={{ marginBottom: "10px" }}>
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "5px",
                                        }}
                                      >
                                        Description:
                                      </p>
                                    </div>
                                    <div>
                                      <div className="value-comp">
                                        {selectedNode.description}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="CardText">
                                    <div style={{ marginBottom: "10px" }}>
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "5px",
                                        }}
                                      >
                                        Warranty End Date:
                                      </p>
                                    </div>
                                    <div>
                                      <div className="value-comp">
                                        {selectedNode.warranty_support_end_date}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="CardText">
                                    <div style={{ marginBottom: "10px" }}>
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "5px",
                                        }}
                                      >
                                        Support End Date:
                                      </p>
                                    </div>
                                    <div>
                                      <div className="value-comp">
                                        {selectedNode.warranty_end_date}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="CardText">
                                    <div
                                      style={{
                                        marginBottom: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "5px",
                                        }}
                                      >
                                        Issue Category Name:
                                      </p>
                                    </div>
                                    <div>
                                      <div className="value-comp">
                                        {selectedNode.issue_category_name}
                                      </div>
                                    </div>
                                  </div>
                                  {selectedNode.image_file && (
                                    <div style={{ marginBottom: "10px" }}>
                                      <div>
                                        <p
                                          style={{
                                            fontWeight: "bold",
                                            marginBottom: "5px",
                                          }}
                                        >
                                          Image:
                                        </p>
                                      </div>

                                      <div>
                                        <div>
                                          <img
                                            width="150"
                                            height="120"
                                            src={`data:image/jpeg;base64,${selectedNode.image_file}`}
                                            alt="NoImage"
                                            style={{ borderRadius: "5px" }}
                                            onError={(e) => {
                                              e.target.onerror = null; // Prevent infinite loop
                                              e.target.src = `data:image/jpeg;base64,${btoa(
                                                String.fromCharCode.apply(
                                                  null,
                                                  selectedNode.image_file
                                                )
                                              )}`;
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>
                      )}

                    {showAddItemButton && (
                      <div
                        style={{
                          position: "absolute",
                          top: buttonPosition.y,
                          left: buttonPosition.x,
                          zIndex: 9999,
                        }}
                      >
                        <Button
                          className="button"
                          variant="contained"
                          color="secondary"
                          onClick={() => setVisible(true)}
                        >
                          Add Item
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
            <TicketDialog
              ticketDialogOpen={ticketOpen}
              setTicketDialogOpen={setTicketOpen}
              ticketNumber={ticketNumber}
            ></TicketDialog>
          </div>
        )}
      </Card>
    </Container>
  );
}
