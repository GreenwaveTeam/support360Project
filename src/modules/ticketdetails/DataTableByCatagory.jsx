import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import axios from "axios";
import {
  fetchTicketDetailByPlantAndTicket,
  fetchUser,
  getAllOpenTicketDetails,
} from "./AllocateTicket";
import Badge from "@mui/material/Badge";
import CustomTable from "../../components/table/table.component";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

export default function DataTableByCatagory({ plantId, ticketNo }) {
  const [ticketDetails, setTicketDetails] = React.useState();
  const infraColumns = [
    {
      id: "infrastructure_name",
      label: "infrastructure_name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "issue_name",
      label: "issue_name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "remarks",
      label: "remarks",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "ticket_number",
      label: "ticket_number",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "severity",
      label: "severity",
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
      id: "ticket_raising_time",
      label: "ticket_raising_time",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "plant_id",
      label: "plant_id",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "userName",
      label: "userName",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "userEmailId",
      label: "userEmailId",
      type: "textbox",
      canRepeatSameValue: false,
    },
  ];

  const deviceColumns = [
    {
      id: "device_name",
      label: "device_name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "issue_name",
      label: "issue_name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "remarks",
      label: "remarks",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "ticket_number",
      label: "ticket_number",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "severity",
      label: "severity",
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
      id: "ticket_raising_time",
      label: "ticket_raising_time",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "plant_id",
      label: "plant_id",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "userName",
      label: "userName",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "userEmailId",
      label: "userEmailId",
      type: "textbox",
      canRepeatSameValue: false,
    },
  ];

  const applicationColumns = [
    {
      id: "application_name",
      label: "application_name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "module_name",
      label: "module_name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "selected_coordinates_acronym",
      label: "acronym",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "issue_name",
      label: "issue_name",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "remarks",
      label: "remarks",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "ticket_number",
      label: "ticket_number",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "severity",
      label: "severity",
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
      id: "ticket_raising_time",
      label: "ticket_raising_time",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "plant_id",
      label: "plant_id",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "userName",
      label: "userName",
      type: "textbox",
      canRepeatSameValue: false,
    },
    {
      id: "userEmailId",
      label: "userEmailId",
      type: "textbox",
      canRepeatSameValue: false,
    },
  ];

  //   React.useEffect(() => {
  //     const response = fetchTicketDetailByPlantAndTicket(plantId, ticketNo);
  //     console.log("Final Response : ", response);
  //     setTicketDetails(fetchTicketDetailByPlantAndTicket(plantId, ticketNo));
  //   }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTicketDetailByPlantAndTicket(
          plantId,
          ticketNo
        );
        console.log("Final Response : ", response);
        setTicketDetails(response);
      } catch (error) {
        // Handle errors if any
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [plantId, ticketNo]); // Make sure to include any dependencies in the dependency array

  //   React.useEffect(() => {
  //     const interval = setInterval(() => {
  //       console.log("UseEffect called");
  //       setTicketDetails(fetchTicketDetailByPlantAndTicket(plantId, ticketNo));
  //     }, 3000);
  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTicketDetailByPlantAndTicket(
          plantId,
          ticketNo
        );
        console.log("Final Response : ", response);
        setTicketDetails(response);
      } catch (error) {
        // Handle errors if any
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(() => {
      console.log("UseEffect called");
      fetchData();
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, [plantId, ticketNo]); // Make sure to include any dependencies in the dependency array

  return (
    <>
      <div>
        {ticketNo.charAt(0) === "I" && ticketDetails && (
          <div>
            <CustomTable
              columns={infraColumns}
              rows={ticketDetails}
              setRows={setTicketDetails}
              isNotDeletable={true}
              tablename={"Ticket Details"}
            ></CustomTable>
          </div>
        )}
        {ticketNo.charAt(0) === "A" && ticketDetails && (
          <div>
            <CustomTable
              columns={applicationColumns}
              rows={ticketDetails}
              setRows={setTicketDetails}
              isNotDeletable={true}
              tablename={"Ticket Details"}
            ></CustomTable>
          </div>
        )}
        {ticketNo.charAt(0) === "D" && ticketDetails && (
          <div>
            <CustomTable
              columns={deviceColumns}
              rows={ticketDetails}
              setRows={setTicketDetails}
              isNotDeletable={true}
              tablename={"Ticket Details"}
            ></CustomTable>
          </div>
        )}
      </div>
    </>
  );
}
