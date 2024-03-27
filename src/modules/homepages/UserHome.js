import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import Datepicker from "../../components/datepicker/datepicker.component";
import { useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
// import { useParams } from "react-router-dom";

function UserHome() {
  const [supporttillDate, setSupporttillDate] = useState(new Date());
  const [userExist, setUserExist] = useState(false);
  // const { userID } = useParams();
  const [formData, setFormData] = useState({
    userID: "",
    name: "",
    designation: "",
    email: "",
    phoneNumber: "",
    plantID: "",
    plantName: "",
    address: "",
    division: "",
    customerName: "",
    supportStartDate: "",
    supportEndDate: "",
    accountOwnerCustomer: "",
    accountOwnerGW: "",
    role: "",
  });
  const [ticketData, setTicketData] = useState({
    total_ticket_raised: "",
    pending_tickets: "",
    resolved_tickets: "",
    last_ticket_raised: "",
  });

  useEffect(() => {
    fetchUser();
    fetchTicketDetails();
  }, []);

  // const fetchUser = async () => {
  //   console.log(`userhome Bearer ${localStorage.getItem("token")}`);
  //   try {
  //     const response = await fetch("http://localhost:8081/users/user", {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
  //         // "Access-Control-Allow-Origin": "*",
  //         // "Access-Control-Request-Headers":
  //         //   "Authorization, Content-Type, X-Auth-Token, Origin",
  //         // "Access-Control-Allow-Meathods": "OPTIONS, GET, POST",
  //         // "Access-Control-Allow-Origin": process.env.REACT_APP_API_URL,
  //       },
  //       // mode: "no-cors",
  //     }).then((response) => {
  //       console.log("response : ", response.json());
  //     });
  //     // setFormData((prevData) => ({
  //     //   ...prevData,
  //     //   userID: data.userID,
  //     //   name: data.name,
  //     //   designation: data.designation,
  //     //   email: data.email,
  //     //   phoneNumber: data.phoneNumber,
  //     //   plantID: data.plantID,
  //     //   plantName: data.plantName,
  //     //   address: data.address,
  //     //   division: data.division,
  //     //   customerName: data.customerName,
  //     //   supportStartDate: dayjs(
  //     //     convertDateFormat(data.supportStartDate),
  //     //     "DD-MM-YYYY"
  //     //   ),
  //     //   supportEndDate: dayjs(
  //     //     convertDateFormat(data.supportEndDate),
  //     //     "DD-MM-YYYY"
  //     //   ),
  //     //   accountOwnerCustomer: data.accountOwnerCustomer,
  //     //   accountOwnerGW: data.accountOwnerGW,
  //     // }));
  //   } catch (error) {
  //     console.error("Error fetching user list:", error);
  //   }
  // };

  const fetchUser = async () => {
    console.log(`userhome Bearer ${localStorage.getItem("token")}`);
    try {
      const response = await fetch("http://localhost:8081/users/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("fetchUser data : ", data);
      setFormData((prevData) => ({
        ...prevData,
        userID: data.userID,
        name: data.name,
        designation: data.designation,
        email: data.email,
        phoneNumber: data.phoneNumber,
        plantID: data.plantID,
        plantName: data.plantName,
        address: data.address,
        division: data.division,
        customerName: data.customerName,
        supportStartDate: dayjs(
          convertDateFormat(data.supportStartDate),
          "DD-MM-YYYY"
        ),
        supportEndDate: dayjs(
          convertDateFormat(data.supportEndDate),
          "DD-MM-YYYY"
        ),
        accountOwnerCustomer: data.accountOwnerCustomer,
        accountOwnerGW: data.accountOwnerGW,
        role: data.role,
      }));
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const fetchTicketDetails = async () => {
    console.log(`userhome Bearer ${localStorage.getItem("token")}`);
    try {
      const response = await fetch(
        "http://localhost:8081/users/user/ticketInfo",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log("fetchTicketDetails data : ", data);
      setTicketData((prevData) => ({
        ...prevData,
        total_ticket_raised: data.total_ticket_raised,
        pending_tickets: data.pending_tickets,
        resolved_tickets: data.resolved_tickets,
        last_ticket_raised: data.last_ticket_raised,
      }));
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  // const fetchExistingUser = async () => {
  //   try {
  //     const response = await fetch("http://localhost:8081/users/", {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     checkExistingUser(data);
  //   } catch (error) {
  //     console.error("Error fetching user list:", error);
  //   }
  // };

  // const checkExistingUser = (data) => {
  //   for (let i of data) {
  //     if (i.userID === userID) {
  //       setUserExist(true);
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         userID: i.userID,
  //         name: i.name,
  //         designation: i.designation,
  //         email: i.email,
  //         phoneNumber: i.phoneNumber,
  //         plantID: i.plantID,
  //         plantName: i.plantName,
  //         address: i.address,
  //         division: i.division,
  //         customerName: i.customerName,
  //         supportStartDate: dayjs(
  //           convertDateFormat(i.supportStartDate),
  //           "DD-MM-YYYY"
  //         ),
  //         supportEndDate: dayjs(
  //           convertDateFormat(i.supportEndDate),
  //           "DD-MM-YYYY"
  //         ),
  //         accountOwnerCustomer: i.accountOwnerCustomer,
  //         accountOwnerGW: i.accountOwnerGW,
  //       }));
  //     }
  //   }
  // };

  function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  return (
    <Container style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <>
        <div style={{ width: "50%", height: "100%", padding: "50px" }}>
          <div
            style={{
              borderRadius: "20px",
              border: "2px solid black",
              marginTop: "20px",
              marginBottom: "20px",
              marginLeft: "20px",
              marginRight: "20px",
              width: "100%",
              height: "30%",
            }}
          >
            <Typography>Support Till Date</Typography>
            <Datepicker
              label="Support Start Date"
              value={formData.supportEndDate}
              format="DD-MM-YYYY"
              slotProps={{ textField: { fullWidth: true } }}
            />
          </div>
          <div
            style={{
              borderRadius: "20px",
              border: "2px solid black",
              marginTop: "20px",
              marginBottom: "20px",
              marginLeft: "20px",
              marginRight: "20px",
              width: "100%",
              height: "70%",
            }}
          >
            <Typography>reiheih</Typography>
          </div>
        </div>
        <div style={{ width: "50%", height: "100%", padding: "50px" }}>
          <div
            style={{
              borderRadius: "20px",
              border: "2px solid black",
              marginTop: "20px",
              marginBottom: "20px",
              marginLeft: "20px",
              marginRight: "20px",
              width: "100%",
              height: "70%",
            }}
          >
            <Typography>
              Total Issue Raised : {ticketData.total_ticket_raised}
            </Typography>
            <Typography>
              Pending Tickets : {ticketData.pending_tickets}
            </Typography>
            <Typography>
              Resolved Tickets : {ticketData.resolved_tickets}
            </Typography>
          </div>
          <div
            style={{
              borderRadius: "20px",
              border: "2px solid black",
              marginTop: "20px",
              marginBottom: "20px",
              marginLeft: "20px",
              marginRight: "20px",
              width: "100%",
              height: "30%",
            }}
          >
            <Typography>reiheih</Typography>
          </div>
        </div>
      </>
    </Container>
  );
}

export default UserHome;
