export const fetchDivs = async (
  userData,
  location,
  currentPageLocation,
  role
) => {
  try {
    console.log("fetchDivs() called");
    console.log("Current Page Location: ", currentPageLocation);
    console.log("Currently passed Data : ", location.state);
    console.log("Current UserData in fetchDivs() : ", userData);
    // let role = "";
    // if (userData.role) {
    //   role = userData.role;
    // } else {
    //   throw new Error("UserRole not found ! ");
    // }
    console.log(
      "Current URL : ",
      `http://localhost:8081/role/roledetails?role=${role}&pagename=${currentPageLocation}`
    );
    const response = await fetch(
      `http://localhost:8081/role/roledetails?role=${role}&pagename=${currentPageLocation}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.ok) {
      console.log("Current Response : ", data);
      console.log("Current Divs : ", data.components);
      // setDivIsVisibleList(data.components);
      return data.components;
    }
  } catch (error) {
    console.log("Error in getting divs name :", error);
    return null;
    // setsnackbarSeverity("error"); // Assuming setsnackbarSeverity is defined elsewhere
    // setSnackbarText("Database Error !"); // Assuming setSnackbarText is defined elsewhere
    // setOpen(true); // Assuming setOpen is defined elsewhere
    // setSearch("");
    // setEditRowIndex(null);
    // setEditValue("");
  }
};

export const updateInfraNameDB = async (
  prev_infra,
  new_infraname,
  userData
) => {
  console.log("updateInfraNameDB() called");
  console.log("Previous Infrastructure : ", prev_infra);
  console.log("New Infrastucture : ", new_infraname);
  let plantID = "";
  try {
    if (userData.plantID) {
      plantID = userData.plantID;
    } else {
      throw new Error("PlantID not found ! ");
    }
    const response = await fetch(`http://localhost:8081/infrastructure/admin`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        prev_infra: prev_infra,
        new_infraname: new_infraname,
        plantID: plantID,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.log("Error in updating infra name");
    //   setsnackbarSeverity("error");
    //   setSnackbarText("Database Error !");
    //   setOpen(true);
    // setSearch("");
    // setEditRowIndex(null);
    // setEditValue("");
    return false;
  }
};
