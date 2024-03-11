import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import {
  Avatar,
  CssBaseline,
  Button,
  Grid,
  Box,
  Typography,
  Container,
  Stack,
  Alert,
} from "@mui/material";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import Textfield from "../../components/textfield/textfield.component";
import Dropdown from "../../components/dropdown/dropdown.component";
import Datepicker from "../../components/datepicker/datepicker.component";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

export default function UserRegistration() {
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
  const [newPlantName, setNewPlantName] = useState({
    plantName: "",
    plantID: "",
  });
  const [cnfpass, setCnfpass] = useState("");
  const [pass, setPass] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [plantList, setPlantList] = useState([]);
  const [showPlantTextField, setShowPlantTextField] = useState(false);
  const [hideBtn, setHideBtn] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPasswordClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    fetchData();
    fetchExistingUser();
  }, []);

  const handleAddPlantClick = () => {
    setShowPlantTextField(true);
    setHideBtn(true);
  };

  const hashedPasswordChange = (e) => {
    setPass(e.target.value);
  };

  const handleFormdataInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlenewPlantNameInputChange = (event) => {
    const { name, value } = event.target;
    setNewPlantName({ ...newPlantName, [name]: value });
    console.log(name, value);
  };

  const handleDesignationChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, designation: value });
  };

  const handlePhoneNumberChange = (event) => {
    const { value } = event.target;
    if (!isNaN(value) && value.length <= 10) {
      setFormData({ ...formData, phoneNumber: value });
    }
  };

  const confirmPassword = async (e) => {
    const confirmPass = e.target.value;
    setCnfpass(confirmPass);
    const hashedPassword = await bcrypt.hash(pass, 10);
    setFormData({ ...formData, password: hashedPassword });
    const passwordsMatch = await bcrypt.compare(confirmPass, hashedPassword);
    if (!passwordsMatch) {
      setShowPasswordError(true);
    } else {
      setShowPasswordError(false);
    }
  };

  function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  // const checkExixtingUser = async () => {
  //   // const { userID } = useParams;
  //   for (let i of userList) {
  //     // if (i.userID === userID) {
  //     //   setFormData(i);
  //     // }
  //     console.log("i.userID", i.userID);
  //   }
  // };

  // const checkExistingUser = async () => {
  //   const { userID } = useParams;
  //   for (let i of userList) {
  //     if (i.userID === userID) {
  //       setFormData({
  //         userID: i.userID,
  //         name: i.name,
  //         designation: i.designation,
  //         email: i.email,
  //         password: i.password,
  //         phoneNumber: i.phoneNumber,
  //         plantID: i.plantID,
  //         plantName: i.plantName,
  //         address: i.address,
  //         division: i.division,
  //         customerName: i.customerName,
  //         supportStartDate: i.supportStartDate,
  //         supportEndDate: i.supportEndDate,
  //         accountOwnerCustomer: i.accountOwnerCustomer,
  //         accountOwnerGW: i.accountOwnerGW,
  //       });
  //     }
  //     console.log("i.userID", i.userID);
  //   }
  // };

  const fetchExistingUser = async () => {
    try {
      const response = await fetch("http://localhost:8081/users/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      console.log("data : ", data);
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
          password: i.password,
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

  console.log("formData", formData);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8081/plants/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setPlantList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const postPlantName = async () => {
    try {
      const response = await fetch("http://localhost:8081/plants/plant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlantName),
      });
      if (response.created) {
        console.log("Plant Added successfully");
      } else {
        console.error("Failed to Add Plant");
      }
      console.log("newPlantName : ", newPlantName);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/users/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.created) {
        console.log("User registered successfully");
      } else {
        console.error("Failed to register user");
      }
      console.log("formDataWithChangedPassword : ", formData);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log("formData : ", formData);
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <HowToRegTwoToneIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          User Registration Page
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box component="table" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Textfield
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  value={formData.name}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  autoComplete="userID"
                  name="userID"
                  required
                  fullWidth
                  id="userID"
                  label="User ID"
                  value={formData.userID}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <FormControl fullWidth>
                  <InputLabel>Designation</InputLabel>
                  <Select
                    required
                    id="designation"
                    value={formData.designation}
                    label="Designation"
                    onChange={handleDesignationChange}
                  >
                    <MenuItem value={""}>Select</MenuItem>
                    <MenuItem value={"Ten"}>Ten</MenuItem>
                    <MenuItem value={"Twenty"}>Twenty</MenuItem>
                    <MenuItem value={"Thirty"}>Thirty</MenuItem>
                  </Select>
                </FormControl> */}
                <Dropdown
                  id="designation"
                  value={formData.designation}
                  label="Designation"
                  onChange={handleDesignationChange}
                  list={["Operator", "Supervisor", "Lab Tester"]}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  id="email"
                  type="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  required
                  style={{ width: "90%" }}
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  // autoComplete="new-password"
                  value={pass}
                  onChange={hashedPasswordChange}
                />
                <Button
                  id="showpasswoed"
                  onClick={handleShowPasswordClick}
                  style={{
                    width: "10%",
                    height: "56px",
                  }}
                  variant="contained"
                  color="inherit"
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  // type="password"
                  id="confirmPassword"
                  value={cnfpass}
                  onChange={(e) => confirmPassword(e)}
                />
              </Grid>
              {showPasswordError && (
                <Stack
                  sx={{ display: "flex", justifyContent: "right" }}
                  spacing={2}
                >
                  <Alert variant="filled" severity="error">
                    Password Does Not Match
                  </Alert>
                </Stack>
              )}
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  id="phoneNumber"
                  autoComplete="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </Grid>
              <Grid item xs={12}>
                {showPlantTextField ? (
                  <>
                    <Textfield
                      required
                      style={{ width: "40%" }}
                      name="plantName"
                      label="Plant Name"
                      id="plantName"
                      value={newPlantName.plantName}
                      onChange={handlenewPlantNameInputChange}
                    />
                    <Textfield
                      required
                      style={{ width: "40%" }}
                      name="plantID"
                      label="PlantID"
                      id="plantID"
                      value={newPlantName.plantID}
                      onChange={handlenewPlantNameInputChange}
                    />
                    <Button
                      id="save"
                      onClick={(e) => {
                        postPlantName();
                        setShowPlantTextField(false);
                        setHideBtn(false);
                        fetchData();
                      }}
                      style={{
                        width: "10%",
                        height: "56px",
                        borderRadius: "50px",
                      }}
                      variant="contained"
                      color="success"
                    >
                      Save
                    </Button>
                    <Button
                      id="cancel"
                      onClick={(e) => {
                        setShowPlantTextField(false);
                        setHideBtn(false);
                      }}
                      style={{
                        width: "10%",
                        height: "56px",
                        borderRadius: "50px",
                      }}
                      variant="contained"
                      color="error"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    {/* <FormControl style={{ width: "40%" }}>
                      <InputLabel>Plant Name</InputLabel>
                      <Select
                        required
                        id="plantName"
                        value={formData.plantName}
                        label="Plant Name"
                        onChange={(event) => {
                          const { value } = event.target;
                          for (let i of plantList) {
                            if (i.plantName === value) {
                              setFormData({
                                ...formData,
                                plantID: i.plantID,
                                plantName: value,
                              });
                              return;
                            }
                          }
                        }}
                        name="plantName"
                      >
                        {plantList.map((p) => (
                          <MenuItem key={p.plantID} value={p.plantName}>
                            {p.plantName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
                    <Dropdown
                      style={{ width: "40%" }}
                      id="plantName"
                      value={formData.plantName}
                      label="Plant Name"
                      onChange={(event) => {
                        const { value } = event.target;
                        for (let i of plantList) {
                          if (i.plantName === value) {
                            setFormData({
                              ...formData,
                              plantID: i.plantID,
                              plantName: value,
                            });
                            return;
                          }
                        }
                      }}
                      list={plantList.map((p) => p.plantName)}
                    />
                    <Textfield
                      required
                      style={{ width: "40%" }}
                      name="plantID"
                      label="PlantID"
                      id="plantID"
                      value={formData.plantID}
                    />
                    <Button
                      id="addPlantName"
                      onClick={handleAddPlantClick}
                      style={{
                        width: "20%",
                        height: "56px",
                        display: hideBtn ? "none" : "inline",
                        borderRadius: "50px",
                      }}
                      variant="contained"
                    >
                      Add New Plant
                    </Button>
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  name="address"
                  label="Address"
                  id="address"
                  autoComplete="address"
                  value={formData.address}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  name="division"
                  label="Division"
                  id="division"
                  autoComplete="division"
                  value={formData.division}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  name="customerName"
                  label="Customer Name"
                  id="customerName"
                  autoComplete="customerName"
                  value={formData.customerName}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Support Start Date"
                    value={formData.supportStartDate}
                    onChange={(startDate) =>
                      setFormData({ ...formData, supportStartDate: startDate })
                    }
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider> */}
                <Datepicker
                  label="Support Start Date"
                  value={formData.supportStartDate}
                  onChange={(startDate) =>
                    setFormData({ ...formData, supportStartDate: startDate })
                  }
                  format="DD-MM-YYYY"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Datepicker
                  label="Support End Date"
                  value={formData.supportEndDate}
                  onChange={(endDate) => {
                    if (endDate < formData.supportEndDate) {
                      setShowDateError(true);
                    } else {
                      setShowDateError(false);
                      setFormData({ ...formData, supportEndDate: endDate });
                    }
                  }}
                  format="DD-MM-YYYY"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              {showDateError && (
                <Stack
                  sx={{ display: "flex", justifyContent: "right" }}
                  spacing={2}
                >
                  <Alert variant="filled" severity="error">
                    SupportEndDate Should Not be less than SupportStartDate
                  </Alert>
                </Stack>
              )}
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  name="accountOwnerCustomer"
                  label="Account Owner Customer"
                  id="accountOwnerCustomer"
                  autoComplete="accountOwnerCustomer"
                  value={formData.accountOwnerCustomer}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Textfield
                  required
                  fullWidth
                  name="accountOwnerGW"
                  label="Account Owner GW"
                  id="accountOwnerGW"
                  autoComplete="accountOwnerGW"
                  value={formData.accountOwnerGW}
                  onChange={handleFormdataInputChange}
                />
              </Grid>
            </Grid>
            {userExist ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Update User
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register User
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </Container>
  );
}
