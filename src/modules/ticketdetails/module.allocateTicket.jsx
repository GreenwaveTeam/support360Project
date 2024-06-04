// 5a72b5a21245ea165112a0615a678ace71d6a368
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import axios from "axios";
import {
  fetchAdminList,
  fetchStatusFromJob,
  fetchUser,
  getAllAssetGroups,
  getAllOpenTicketDetails,
  getSelectedOptionTask,
  login,
  updateStatus,
} from "./AllocateTicket";
import Badge from "@mui/material/Badge";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomTable from "../../components/table/table.component";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import DataTableByCatagory from "./DataTableByCatagory";
import SnackbarComponent from "../../components/snackbar/customsnackbar.component";
import {
  createActivity,
  createJobDetails,
  createTask,
  saveJobDetails,
} from "./Utility";
import dayjs from "dayjs";
import { useState } from "react";
import {
  fetchCurrentDivs,
  fetchCurrentUser,
} from "../application/user/ApplicationUserApi";
// import { useLocation } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import TaskIcon from "@mui/icons-material/Task";
import CancelIcon from "@mui/icons-material/Cancel";
export default function AllocateTicket({ sendUrllist }) {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarSeverity, setsnackbarSeverity] = React.useState("");
  const navigate = useNavigate();
  const [value, setValue] = React.useState("");
  const [allTickets, setAllTickets] = React.useState({});
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [dialogOpenAssign, setDialogOpenAssign] = React.useState(false);
  const [performers, setPerformers] = React.useState([]);
  const [approvers, setApprovers] = React.useState([]);
  const [selectedPerformer, setSelectedPerformer] = React.useState("");
  const [selectedApprover, setSelectedApprover] = React.useState("");
  const [userData, setUserData] = React.useState("");
  const [jobStatus, setJobStatus] = React.useState("");
  const [applicationTickets, setApplicationTickets] = React.useState([]);
  const [deviceTickets, setDeviceTickets] = React.useState([]);
  const [infrastructureTickets, setInfrastructureTickets] = useState([]);
  const currentPageLocation = useLocation().pathname;
  const [divIsVisibleList, setDivIsVisibleList] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs());
  const [token, setToken] = React.useState("");
  // const [tikcetStatus, setTicketStatus] = React.useState("");

  //   const application=1;
  //   const device=-2;
  //   const infrastructure=3;
  const urllist = [
    { pageName: "Home", pagelink: "/admin/home" },
    // { pageName: "User Configure", pagelink: "/admin/configurePage" },
    {
      pageName: "Ticket Allocate",
      pagelink: "/admin/allocateTicket",
    },
  ];

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
      label: "Raising Time",
      type: "textbox",
      canRepeatSameValue: false,
    },

    {
      id: "user",
      label: "Raised By",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "useremail",
      label: "User Email",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "job_status",
      label: "Job Status",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "status",
      label: "Status",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      type: "iconButton",
      id: "view",

      label: "Details",
      buttons: [
        {
          buttonlabel: "View",
          icon: <VisibilityIcon />,
          isButtonRendered: (row) => {
            // //console.log("view Row : ", row);
            return true;
          },
          isButtonDisabled: (row) => {
            return false;
          },
          function: (row) => {
            // //console.log("Obj : ", row);
            handleFetchJobStatus(row.ticketNo);
            setSelectedRow(row);
            setDialogOpen(true);
          },
        },
      ],
    },
    {
      buttons: [
        {
          buttonlabel: "Resolve",
          startIcon: <TaskIcon />,
          isButtonRendered: (row) => {
            // //console.log("view Row : ", row);
            if (row.status === "WIP") return true;
            else return false;
          },
          isButtonDisabled: (row) => {
            //console.log("Assign Row : ", row);
            // if (row.status === "WIP") return true;
            // else
            //const status = handleFetchJobStatus(row.ticketNo);
            if (row.job_status.toLowerCase() === "Finished".toLowerCase()) {
              return false;
            } else {
              return true;
            }
          },
          function: async (row) => {
            // //console.log(ro)
            const plantId = row.plantId;

            const ticketNo = row.ticketNo;
            const tikcetStatus = row.status;
            await updateStatus(plantId, ticketNo, tikcetStatus);
            //console.log("Obj : ", row);
            setSelectedRow(row);
            // setDialogOpen(true);
          },
        },

        {
          buttonlabel: "Assign",
          startIcon: <AssignmentIndIcon />,
          isButtonRendered: (row) => {
            //console.log("Assign Row : ", row);
            if (row.status === "open") return true;
            else return false;
          },

          isButtonDisabled: (row) => {
            //console.log("Assign Row : ", row);
            if (row.status === "WIP") return true;
            else return false;
          },

          function: (row) => {
            setSelectedRow(row);
            setDialogOpenAssign(true);
          },
        },
        {
          buttonlabel: "Close",
          startIcon: <CancelIcon />,
          isButtonRendered: (row) => {
            //console.log("Assign Row : ", row);
            if (row.status === "resolve") return true;
            else return false;
          },
          isButtonDisabled: (row) => {
            //console.log("Assign Row : ", row);
            // if (row.status === "WIP") return true;
            // else
            return false;
          },
          function: async (row) => {
            const plantId = row.plantId;

            const ticketNo = row.ticketNo;
            const tikcetStatus = row.status;
            await updateStatus(plantId, ticketNo, tikcetStatus);
            //console.log("Obj : ", row);
            setSelectedRow(row);
          },
        },
      ],

      type: "button",
      id: "action",
      label: "Action",
    },
    // {
    //   buttonlabel: "Assign",
    //   type: "button",
    //   id: "Assign",
    //   label: "Assign Ticket",
    //   isButtonDisable: (row) => {
    //     //console.log("Assign Row : ", row);
    //     if (row.status === "pending") return true;
    //     else return false;
    //   },
    //   function: (row) => {
    //     setSelectedRow(row);
    //     setDialogOpenAssign(true);
    //   },
    // },
  ];
  React.useEffect(() => {
    fetchUser1();

    fetchAllTicketsDetails();
    // fetchOp30Token();
    //console.log("Use effect called");
    sendUrllist(urllist);
    // const status = handleFetchJobStatus(row.ticketNo);
  }, []);

  React.useLayoutEffect(() => {
    fetchOp30Token();
  });
  const fetchOp30Token = async () => {
    const OpToken = await login();
    setToken(OpToken);
    console.log("New ", token);
  };

  const fetchUser1 = async () => {
    // let role = "";
    // try {
    //   const response = await fetch("http://localhost:8081/users/user", {
    //     method: "GET",
    //     headers: {
    //       // Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   });
    //   const data = await response.json();
    //   //console.log("fetchUser data : ", data);
    //   // setFormData(data.role);
    //   role = data.role;
    //   setCurrentUserData(data);

    //   //console.log("Role Test : ", role);
    //   fetchDivs(role);
    // } catch (error) {
    //   console.error("Error fetching user list:", error);
    // }

    const userData = await fetchCurrentUser();
    if (userData) {
      setUserData(userData);
      //console.log("userData : ", userData);
      let role = userData.role;
      //console.log("Role in Ticket  : ", role);
      const currentDivs = await fetchCurrentDivs(role, currentPageLocation);
      if (currentDivs) {
        //console.log("currentDivs : ", currentDivs);
        if (currentDivs.length === 0) {
          navigate("/*");
          return;
        }
        if (
          currentDivs.components &&
          currentDivs.components.includes("Application_Ticket_Tab")
        ) {
          setValue("1");
          //console.log("Application_Ticket_Tab");
        } else if (
          currentDivs.components &&
          currentDivs.components.includes("Device_Ticket_Tab")
        ) {
          setValue("2");
          //console.log("Device_Ticket_Tab");
        } else if (
          currentDivs.components &&
          currentDivs.components.includes("Infrastructure_Ticket_Tab")
        ) {
          setValue("3");
          //console.log("Infrastructure_Ticket_Tab");
        }
        setDivIsVisibleList(currentDivs.components);
      }
    }
  };

  const handleFetchJobStatus = async (ticketNo) => {
    console.log("Before Call ", token);
    const data = await fetchStatusFromJob(ticketNo);
    //console.log("status ", data);
    if (data) {
      setJobStatus(data);
      return data;
    }
  };
  const handleAddAssignment = () => {
    // Here you can implement the logic to add the assignment with the selected Admin ID
    // //console.log("Assigning to Admin ID:", selectedAdminId);
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
  //   //console.log("fetchAllTicketsDetails() called ");

  //   const response = await getAllOpenTicketDetails();
  //   setAdmins(await fetchAdminList());
  //   //console.log(response);
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

  //   //console.log("Application Tickets : ", applicationTicketArray);
  //   //console.log("Device Tickets : ", deviceTicketArray);
  //   //console.log("Infrastructure Tickets : ", infrastructureTicketArray);
  //   let finalTicket = {
  //     application: applicationTicketArray,
  //     device: deviceTicketArray,
  //     infrastructure: infrastructureTicketArray,
  //   };
  //   //console.log("Final Ticket : ", finalTicket);
  //   setAllTickets(finalTicket);
  // };

  const fetchAllTicketsDetails = async () => {
    try {
      //console.log("fetchAllTicketsDetails() called ");

      // Fetch open ticket details and admin list concurrently
      const [response, adminList] = await Promise.all([
        getAllOpenTicketDetails(),
        fetchAdminList(),
      ]);

      setPerformers(adminList);
      setApprovers(adminList);
      //console.log(response);

      // Initialize arrays for different ticket categories
      const applicationTicketArray = [];
      const deviceTicketArray = [];
      const infrastructureTicketArray = [];

      // Process each ticket
      for (const element of response) {
        if (!element?.ticketNo) continue;
        const firstChar = element.ticketNo.charAt(0).toLowerCase();
        const jobStatus = await fetchStatusFromJob(element.ticketNo);
        //console.log("Ticket and Status : ", element.ticketNo, " : ", jobStatus);
        const ticketWithStatus = {
          ...element,
          job_status: jobStatus || "Not Assigned",
        }; // Adding job_status property

        switch (firstChar) {
          case "a":
            applicationTicketArray.push(ticketWithStatus);
            break;
          case "d":
            deviceTicketArray.push(ticketWithStatus);
            break;
          default:
            infrastructureTicketArray.push(ticketWithStatus);
        }
      }

      // Log categorized tickets
      //console.log("Application Tickets:", applicationTicketArray);
      //console.log("Device Tickets:", deviceTicketArray);
      //console.log("Infrastructure Tickets:", infrastructureTicketArray);

      // Update state variables with categorized tickets
      setApplicationTickets(applicationTicketArray);
      setDeviceTickets(deviceTicketArray);
      setInfrastructureTickets(infrastructureTicketArray);

      // Create final tickets object
      const finalTicket = {
        application: applicationTicketArray,
        device: deviceTicketArray,
        infrastructure: infrastructureTicketArray,
      };

      // Log final tickets object and update state
      //console.log("Final Ticket:", finalTicket);
      setAllTickets(finalTicket);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      //console.log("UseEffect called");
      fetchAllTicketsDetails();
    }, 2000000000000000000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangePerformer = (event) => {
    setSelectedPerformer(event.target.value);
  };
  const handleChangeApprover = (event) => {
    setSelectedApprover(event.target.value);
  };
  const handleSubmit = async (selectedRow) => {
    // .plantId, selectedRow.ticketNo
    const plantId = selectedRow.plantId;
    const ticketNo = selectedRow.ticketNo;
    const tikcetStatus = selectedRow.status;
    //console.log(
    //   "Current final From Date :  ",
    //   dayjs(fromDate).format("YYYYMMDDTHHmmssSSS")
    // );
    // Handle submit logic here
    if (selectedApprover && selectedPerformer) {
      //console.log("palnt id and ticket ", plantId, ticketNo);
      // //console.log("Selected User:", selectedAdmin);

      const jobId = "J" + dayjs().format("YYYYMMDDTHHmmssSSS");

      const allAssetData = await getSelectedOptionTask("Green Plant", token);
      const currentAsset_Activity = allAssetData.filter(
        (item) => item.taskId === "T20240514130854854"
      ); //Currently the database is itc_itd_op360 , make sure to change it to OP360_PCPB_Development in UserGroups API & in the TaskAPI the check for published tasks is commented

      let current_starttime = dayjs(fromDate);
      if (!currentAsset_Activity[0]?.activityList) {
        setSnackbarText("Task Not Found!");
        setsnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      //console.log("Current Activity : ", currentAsset_Activity);
      let finalDuration = 0;
      const finalActivityList = currentAsset_Activity[0].activityList.map(
        (obj) => {
          // Apply the function constructor to create a new Activity object
          const startTime = current_starttime.format(
            "YYYY-MM-DDTHH:mm:ss.SSSZ"
          );
          const endTIme = current_starttime
            .add(obj.duration, "minute")
            .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
          current_starttime = current_starttime.add(obj.duration, "minute");

          //const duration = endTime.diff(startTime, 'millisecond');
          finalDuration += obj.duration;
          return createActivity(
            obj.taskId || null,
            obj.taskName || null,
            obj.jobId || null,
            obj.activityId || null,
            obj.activityName || null,
            obj.sequence || null,
            obj.logbook || null,
            obj.duration || null,
            obj.xPos || null,
            obj.yPos || null,
            selectedPerformer,
            selectedPerformer,
            // obj.performer || "",
            // obj.approver || "",
            // obj.scheduledActivityStartTime || null,
            // obj.scheduledActivityEndTime || null,
            startTime,
            endTIme,
            obj.actualActivityStartTime || null,
            obj.actualActivityEndTime || null,
            obj.notBelongToPerformer || false,
            obj.notBelongToApprover || false,
            obj.actvityStatus || "Not Started",
            // "Not Started",
            obj.isActvityBtnDisableOnCompletion || false,
            obj.isActvityBtnDisbleForActvtOrder || false,
            obj.actAbrv || null,
            obj.available || true,
            obj.performerAvlReasons || [],
            obj.assetAvailable || true,
            obj.assetAvlReasons || [],
            obj.actualActvtyStrt || null,
            obj.actualActvtEnd || null,
            obj.reviewerActivityStartTime || null,
            obj.reviewerActivityStopTime || null,
            obj.remarks || null,
            obj.assetId || "",
            obj.assetName || "",
            obj.assetIDList || [],
            obj.assetNameList || [],
            obj.groupOrDept || false,
            obj.groupOrDeptName || null,
            obj.performerType || null,
            // boolean_current_groupOrDept,
            // current_groupOrDept,
            // current_performerType,
            obj.getGroupOrDeptWisePerformer || null,
            obj.completedActivity || 0,
            obj.pendingActivity || 0,
            obj.rejectedActivity || 0,
            obj.date || null,
            obj.actvtCount || 0,
            obj.actFile || null,
            obj.buffer || 0,
            obj.delayDueToBuffer || null,
            obj.enforce || false,
            obj.selectedAssetList || null,
            obj.selectedAssetIdsList || null
          );
        }
      );

      const task = createTask(
        null,
        ticketNo,
        "T20240514130854854",
        null,
        null,
        null,
        null,
        null,
        null,
        // activity,
        finalActivityList
      );

      const job = createJobDetails(
        task,
        jobId,
        null,
        userData.email,
        selectedApprover,
        dayjs(fromDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        dayjs(fromDate)
          .add(finalDuration, "minute")
          .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        null,
        null,
        selectedRow.ticket_priority,
        selectedRow.plantId,
        null
      );

      const success = await saveJobDetails(job, token);
      //console.log("Succces ", job);
      await updateStatus(plantId, ticketNo, tikcetStatus);

      setSelectedRow(null);
      setSelectedApprover("");
      setSelectedPerformer("");
      setDialogOpenAssign(false);
      setSnackbarText("Assigned Successfully");
      setsnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarText("Select an Admin");
      setsnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
  };

  const handleFromDateChange = (newValue) => {
    //console.log("handleFromDateChange() called => ", newValue);
    const currentTime = dayjs();
    const selectedTime = dayjs(newValue);

    const currentYear = currentTime.year();
    const currentMonth = currentTime.month() + 1; //index starts from 0 for month count
    const currentDay = currentTime.date();
    const currentHour = currentTime.hour();
    const currentMinute = currentTime.minute();

    const selectedYear = selectedTime.year();
    const selectedMonth = selectedTime.month() + 1;
    const selectedDay = selectedTime.date();
    const selectedHour = selectedTime.hour();
    const selectedMinute = selectedTime.minute();

    //console.log("Current Date and Time:");
    //console.log(
    //   `Year: ${currentYear}, Month: ${currentMonth}, Day: ${currentDay}, Hour: ${currentHour}, Minute: ${currentMinute}`
    // );

    //console.log("Selected Date and Time:");
    //console.log(
    //   `Year: ${selectedYear}, Month: ${selectedMonth}, Day: ${selectedDay}, Hour: ${selectedHour}, Minute: ${selectedMinute}`
    // );

    if (
      selectedYear < currentYear ||
      (selectedYear === currentYear &&
        (selectedMonth < currentMonth ||
          (selectedMonth === currentMonth &&
            (selectedDay < currentDay ||
              (selectedDay === currentDay &&
                (selectedHour < currentHour ||
                  (selectedHour === currentHour &&
                    selectedMinute < currentMinute)))))))
    ) {
      //console.log("Past Time selected !");
      setSnackbarText("Past time cannot be selected");
      setsnackbarSeverity("error");
      setSnackbarOpen(true);
      setFromDate(dayjs());
      return;
    }
    setFromDate(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {divIsVisibleList &&
                divIsVisibleList.includes("Application_Ticket_Tab") && (
                  <Tab
                    id="Application_Ticket_Tab"
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
                )}
              {divIsVisibleList &&
                divIsVisibleList.includes("Device_Ticket_Tab") && (
                  <Tab
                    id="Device_Ticket_Tab"
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
                )}
              {divIsVisibleList &&
                divIsVisibleList.includes("Infrastructure_Ticket_Tab") && (
                  <Tab
                    id="Infrastructure_Ticket_Tab"
                    label={
                      <>
                        <Badge
                          color="secondary"
                          badgeContent={allTickets?.infrastructure?.length}
                        >
                          <div style={{ marginRight: "15px" }}>
                            Infrastructure
                          </div>
                        </Badge>
                      </>
                    }
                    value="3"
                  />
                )}
            </TabList>
          </Box>
          <TabPanel value="1">
            {applicationTickets && (
              <CustomTable
                columns={Columns}
                rows={applicationTickets}
                isNotDeletable={true}
                setRows={setApplicationTickets}
                tablename={"Application Tickets"}
              ></CustomTable>
            )}
          </TabPanel>

          <TabPanel value="2">
            {deviceTickets && (
              <CustomTable
                columns={Columns}
                rows={deviceTickets}
                isNotDeletable={true}
                setRows={setDeviceTickets}
                tablename={"Device Tickets"}
              ></CustomTable>
            )}
          </TabPanel>

          <TabPanel value="3">
            {infrastructureTickets && (
              <CustomTable
                columns={Columns}
                rows={infrastructureTickets}
                isNotDeletable={true}
                setRows={setInfrastructureTickets}
                tablename={"Infrastructure Tickets"}
              ></CustomTable>
            )}
          </TabPanel>
        </TabContext>
      </Box>
      <div>
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          fullWidth
          maxWidth="100%"
        >
          <div>
            <DialogTitle>
              <h6>
                {jobStatus
                  ? "Job Status : " + jobStatus
                  : "Ticket Not Assigned"}
              </h6>
            </DialogTitle>
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
          <Divider sx={{ opacity: "0.8" }} />
          <DialogContent sx={{ pt: 0 }}>
            {/* <Typography>Select Admin ID:</Typography> */}
            <div style={{ display: "grid" }}>
              {performers && (
                <FormControl sx={{ m: 1, minWidth: 150 }}>
                  <InputLabel id="user-dropdown-label">
                    Select Performer
                  </InputLabel>
                  <Select
                    labelId="user-dropdown-label"
                    id="user-dropdown"
                    value={selectedPerformer}
                    onChange={handleChangePerformer}
                    label="Select User"
                  >
                    {performers.map((admin) => (
                      <MenuItem key={admin.userId} value={admin.userId}>
                        {admin.name + " ( " + admin.userId + " )"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {approvers && (
                <FormControl sx={{ m: 1, minWidth: 150 }}>
                  <InputLabel id="user-dropdown-label">
                    Select Approver
                  </InputLabel>
                  <Select
                    labelId="user-dropdown-label"
                    id="user-dropdown"
                    value={selectedApprover}
                    onChange={handleChangeApprover}
                    label="Select User"
                  >
                    {approvers.map((admin) => (
                      <MenuItem key={admin.userId} value={admin.userId}>
                        {admin.name + " ( " + admin.userId + " )"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <div style={{ marginTop: "1rem" }}></div>
              <LocalizationProvider
                style={{ mt: "1rem" }}
                dateAdapter={AdapterDayjs}
              >
                <MobileDateTimePicker
                  //   defaultValue={dayjs(elem.date) || null}

                  label="From Date"
                  value={fromDate}
                  onChange={(newValue) => handleFromDateChange(newValue)}
                  // renderInput={(params) => <TextField {...params} />}
                  //   disabled={!elem.editable || elem.disabled}
                  format="DD-MM-YYYY HH:mm"
                  sx={{ width: "98%", margin: "auto" }}
                  minDate={dayjs()}
                ></MobileDateTimePicker>
              </LocalizationProvider>
              {selectedRow && (
                <Button
                  sx={{ mt: "1rem" }}
                  variant="contained"
                  onClick={() => handleSubmit(selectedRow)}
                >
                  Allocate
                </Button>
              )}
            </div>
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
