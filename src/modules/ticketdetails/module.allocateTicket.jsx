import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import axios from "axios";
import {
  fetchAdminList,
  fetchUser,
  getAllOpenTicketDetails,
  updateStatus,
} from "./AllocateTicket";
import Badge from "@mui/material/Badge";
import CustomTable from "../../components/table/table.component";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import DataTableByCatagory from "./DataTableByCatagory";
import CustomTableTest from "../../components/table/CustomTableTest";
import SnackbarComponent from "../../components/snackbar/customsnackbar.component";
import {
  createActivity,
  createJobDetails,
  createTask,
  saveJobDetails,
} from "./Utility";
import dayjs from "dayjs";

export default function AllocateTicket() {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarSeverity, setsnackbarSeverity] = React.useState("");

  const [value, setValue] = React.useState("1");
  const [allTickets, setAllTickets] = React.useState({});
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [dialogOpenAssign, setDialogOpenAssign] = React.useState(false);
  const [admins, setAdmins] = React.useState([]);
  const [selectedAdmin, setSelecteAdmin] = React.useState("");
  const [userData, setUserData] = React.useState("");
  //   const application=1;
  //   const device=-2;
  //   const infrastructure=3;
  const Columns = [
    {
      id: "plantId",
      label: "Plant ID",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "ticketNo",
      label: "Ticket No",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "ticket_raising_time",
      label: "ticket_raising_time",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "type",
      label: "type",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "user",
      label: "user",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "useremail",
      label: "useremail",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "status",
      label: "status",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      buttonlabel: "View Details",
      type: "button",
      id: "viewDetails",
      label: "view Details",
      isButtonDisable: (row) => {
        // console.log("view Row : ", row);
        return false;
      },
      function: (row) => {
        console.log("Obj : ", row);
        setSelectedRow(row);
        setDialogOpen(true);
      },
    },
    {
      buttonlabel: "Assign",
      type: "button",
      id: "Assign",
      label: "Assign Ticket",
      isButtonDisable: (row) => {
        //console.log("Assign Row : ", row);
        if (row.status === "pending") return true;
        else return false;
      },
      function: (row) => {
        setSelectedRow(row);
        setDialogOpenAssign(true);
      },
    },
  ];

  const handleAdminIdChange = (event) => {
    // setSelectedAdminId(event.target.value);
  };
  const handleAddAssignment = () => {
    // Here you can implement the logic to add the assignment with the selected Admin ID
    // console.log("Assigning to Admin ID:", selectedAdminId);
    handleAssignClose();
  };
  const handleAssignClose = () => {
    setDialogOpenAssign(false);
    setSelectedRow(null);
    // setSelectedAdminId("");
  };
  const handleClose = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };
  // const fetchAllTicketsDetails = async () => {
  //   console.log("fetchAllTicketsDetails() called ");

  //   const response = await getAllOpenTicketDetails();
  //   setAdmins(await fetchAdminList());
  //   console.log(response);
  //   let applicationTicketArray = [];
  //   let deviceTicketArray = [];
  //   let infrastructureTicketArray = [];

  //   if (response) {
  //     response.forEach((element) => {
  //       element?.ticketNo.charAt(0).toLowerCase() === "a"
  //         ? applicationTicketArray.push(element)
  //         : element?.ticketNo.charAt(0).toLowerCase() === "d"
  //         ? deviceTicketArray.push(element)
  //         : infrastructureTicketArray.push(element);
  //     });
  //   }

  //   console.log("Application Tickets : ", applicationTicketArray);
  //   console.log("Device Tickets : ", deviceTicketArray);
  //   console.log("Infrastructure Tickets : ", infrastructureTicketArray);
  //   let finalTicket = {
  //     application: applicationTicketArray,
  //     device: deviceTicketArray,
  //     infrastructure: infrastructureTicketArray,
  //   };
  //   console.log("Final Ticket : ", finalTicket);
  //   setAllTickets(finalTicket);
  // };

  const fetchAllTicketsDetails = async () => {
    try {
      console.log("fetchAllTicketsDetails() called");

      // Fetch open ticket details and admin list concurrently
      const [response, adminList] = await Promise.all([
        getAllOpenTicketDetails(),
        fetchAdminList(),
      ]);

      setAdmins(adminList);
      console.log(response);

      // Initialize arrays for different ticket categories
      const applicationTicketArray = [];
      const deviceTicketArray = [];
      const infrastructureTicketArray = [];

      // Categorize tickets based on their ticket number prefix
      response?.forEach((element) => {
        if (element?.ticketNo.charAt(0).toLowerCase() === "a") {
          applicationTicketArray.push(element);
        } else if (element?.ticketNo.charAt(0).toLowerCase() === "d") {
          deviceTicketArray.push(element);
        } else {
          infrastructureTicketArray.push(element);
        }
      });

      // Log categorized tickets
      console.log("Application Tickets:", applicationTicketArray);
      console.log("Device Tickets:", deviceTicketArray);
      console.log("Infrastructure Tickets:", infrastructureTicketArray);

      // Create final tickets object
      const finalTicket = {
        application: applicationTicketArray,
        device: deviceTicketArray,
        infrastructure: infrastructureTicketArray,
      };

      // Log final tickets object and update state
      console.log("Final Ticket:", finalTicket);
      setAllTickets(finalTicket);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  React.useEffect(() => {
    setUserData(fetchUser);
    fetchAllTicketsDetails();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log("UseEffect called");
      fetchAllTicketsDetails();
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeAdmin = (event) => {
    setSelecteAdmin(event.target.value);
  };
  const handleSubmit = async (plantId, ticketNo) => {
    // Handle submit logic here
    if (selectedAdmin) {
      console.log("palnt id and ticke ", plantId, ticketNo);
      console.log("Selected User:", selectedAdmin);
      updateStatus(plantId, ticketNo);
      setDialogOpenAssign(false);
      setSelectedRow(null);
      setSelecteAdmin();
    } else {
      setSnackbarText("Select an Admin");
      setsnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const jobId = "J" + dayjs().format("YYYYMMDDTHHmmssSSS");
    const activity = [
      createActivity(
        "A202405141317511751",
        "Ticket Resolve",
        false,
        false,
        0,
        true,
        null,
        null,
        null,
        true,
        false,
        0,
        0,
        false,
        false,
        10,
        false,
        false,
        "SupportTicket",
        false,
        false,
        0,
        null,
        0,
        2,
        "T202405141316501650"
      ),
    ];

    const task = createTask(
      null,
      ticketNo,
      "T202405141316501650",
      null,
      null,
      null,
      null,
      null,
      null,
      activity
    );

    const job = createJobDetails(
      task,
      jobId,
      null,
      userData.email,
      userData.email,
      dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      null,
      null,
      null,
      "device",
      null
    );

    const success = await saveJobDetails(job);
    console.log("Succces ", success);
  };

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label={
                  <>
                    <Badge
                      color="secondary"
                      badgeContent={allTickets?.application?.length}
                    >
                      <div style={{ marginRight: "15px" }}>Application</div>
                    </Badge>
                  </>
                }
                value="1"
              />
              <Tab
                label={
                  <>
                    <Badge
                      color="secondary"
                      badgeContent={allTickets?.device?.length}
                    >
                      <div style={{ marginRight: "15px" }}>Device</div>
                    </Badge>
                  </>
                }
                value="2"
              />
              <Tab
                label={
                  <>
                    <Badge
                      color="secondary"
                      badgeContent={allTickets?.infrastructure?.length}
                    >
                      <div style={{ marginRight: "15px" }}>Infrastructure</div>
                    </Badge>
                  </>
                }
                value="3"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            {allTickets.application && (
              <CustomTable
                columns={Columns}
                rows={allTickets.application}
                isNotDeletable={true}
                setRows={setAllTickets}
                tablename={"Application Tickets"}
              ></CustomTable>
            )}
          </TabPanel>

          <TabPanel value="2">
            {allTickets.device && (
              <CustomTable
                columns={Columns}
                rows={allTickets.device}
                isNotDeletable={true}
                setRows={setAllTickets}
                tablename={"Device Tickets"}
              ></CustomTable>
            )}
          </TabPanel>

          <TabPanel value="3">
            {allTickets.infrastructure && (
              <CustomTable
                columns={Columns}
                rows={allTickets.infrastructure}
                isNotDeletable={true}
                setRows={setAllTickets}
                tablename={"Infrastructure Tickets"}
              ></CustomTable>
            )}
          </TabPanel>
        </TabContext>
      </Box>
      <div>
        <Dialog open={dialogOpen} onClose={handleClose} fullWidth>
          <div>
            {/* <DialogTitle>Details</DialogTitle> */}
            <DialogContent>
              {selectedRow && (
                <div>
                  <DataTableByCatagory
                    plantId={selectedRow.plantId}
                    ticketNo={selectedRow.ticketNo}
                  ></DataTableByCatagory>
                </div>
              )}
            </DialogContent>
          </div>
        </Dialog>
      </div>
      <div>
        <Dialog open={dialogOpenAssign} onClose={handleAssignClose} fullWidth>
          <DialogTitle>Assign Ticket</DialogTitle>
          <DialogContent>
            {/* <Typography>Select Admin ID:</Typography> */}
            {admins && (
              <FormControl sx={{ m: 1, minWidth: 150 }}>
                <InputLabel id="user-dropdown-label">Select Admin</InputLabel>
                <Select
                  labelId="user-dropdown-label"
                  id="user-dropdown"
                  value={selectedAdmin}
                  onChange={handleChangeAdmin}
                  label="Select User"
                >
                  {admins.map((admin) => (
                    <MenuItem key={admin.name} value={admin.name}>
                      {admin.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {selectedRow && (
              <Button
                variant="contained"
                onClick={() =>
                  handleSubmit(selectedRow.plantId, selectedRow.ticketNo)
                }
              >
                Allocate
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <SnackbarComponent
        openPopup={snackbarOpen}
        setOpenPopup={setSnackbarOpen}
        dialogMessage={snackbarText}
        snackbarSeverity={snackbarSeverity}
      ></SnackbarComponent>
    </>
  );
}
