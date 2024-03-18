import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import Datepicker from "../../components/datepicker/datepicker.component";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

function UserHome() {
  const [supporttillDate, setSupporttillDate] = useState(new Date());
  const [userExist, setUserExist] = useState(false);
  const { userID } = useParams();
  const [formData, setFormData] = useState({
    userID: "",
    name: "",
    designation: "",
    email: "",
    password: "",
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
  });

  useEffect(() => {
    fetchExistingUser();
  }, []);

  const fetchExistingUser = async () => {
    try {
      const response = await fetch("http://localhost:8081/users/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      checkExistingUser(data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const checkExistingUser = (data) => {
    for (let i of data) {
      if (i.userID === userID) {
        setUserExist(true);
        setFormData((prevData) => ({
          ...prevData,
          userID: i.userID,
          name: i.name,
          designation: i.designation,
          email: i.email,
          phoneNumber: i.phoneNumber,
          plantID: i.plantID,
          plantName: i.plantName,
          address: i.address,
          division: i.division,
          customerName: i.customerName,
          supportStartDate: dayjs(
            convertDateFormat(i.supportStartDate),
            "DD-MM-YYYY"
          ),
          supportEndDate: dayjs(
            convertDateFormat(i.supportEndDate),
            "DD-MM-YYYY"
          ),
          accountOwnerCustomer: i.accountOwnerCustomer,
          accountOwnerGW: i.accountOwnerGW,
        }));
      }
    }
  };

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
              borderRadius: "50px",
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
              borderRadius: "50px",
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
              borderRadius: "50px",
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
          <div
            style={{
              borderRadius: "50px",
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
