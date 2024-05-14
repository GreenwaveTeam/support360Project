/***********************  Configure Infrastructure  ************************* */
const DB_IP=process.env.REACT_APP_SERVERIP;
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
    console.log('IP from env : ',DB_IP)
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
      `http://${DB_IP}/role/roledetails?role=${role}&pagename=${currentPageLocation}`,
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
    const response = await fetch(`http://${DB_IP}/infrastructure/admin`, {
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


export const fetchUser = async () => {
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
    role = data.role;

    console.log("Role Test : ", role);
    return data;
    // fetchDivsForCurrentPage(role);
  } catch (error) {
    console.error("Error fetching user list:", error);
  }
};


export const getAllInfrastructure=async(userData)=>
  {
    console.log('getAllInfrastructure() called ')
    let plantID = "";
    try {
      if (userData.plantID) {
        plantID = userData.plantID;
      } else {
        throw new Error("PlantID not found ! ");
      }
      const response = await fetch(
        `http://${DB_IP}/infrastructure/admin/${plantID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.log("Response => " + response.status);
        throw new Error("HTTP error " + response.status);
      }
      const data = await response.json();
      console.log('Infrastructure Data from DB :  ',data)
      return data;
      //setProgressVisible(false);
      // setsnackbarSeverity("success")
      // setSnackbarText("Data refereshed successfully !")
      // setOpen(true)
    } catch (error) {
      //setProgressVisible(false);
      // setsnackbarSeverity("error");
      // setSnackbarText(error.toString());
      // setOpen(true);
      console.log("Error fetching data from database !",error);
      return null;
      // navigate("/notfound");
    }
  };

  export const deleteInfrastructureFromDb=async(userData,infra_name)=>
    {
      console.log('deleteInfrastructureFromDb() called')
      let plantID = "";
      try {
        if (userData.plantID) {
          plantID = userData.plantID;
        } else {
          throw new Error("PlantID not found ! ");
        }
        const response = await fetch(
          `http://${DB_IP}/infrastructure/admin`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              infrastructureName: infra_name,
              plantID: plantID,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;

      }
      catch (error) {
        console.log('Error in deleting ',error)
        return false;
      }
    }


    /***********************  Add Infrastructure  ************************* */
    export const fecthCurrentInfrastructureDetails = async(plantId,inf) => 
    {
      console.log("fecthCurrentInfrastructureDetails() called ! ");
      try {
        console.log("fetchDBdata() called ");
        console.log("plant ID => ", plantId);
        console.log("infrastructure => ", inf);
        const response = await fetch(
          `http://${DB_IP}/infrastructure/admin/${plantId}/${inf}/issues`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    };

   export const deleteCurrentInfrastructure=async(plantID,inf,issue)=>
      {
        console.log('deleteCurrentInfrastructure() called')
        try {
          // const plantID = plantId.toString();
          // const currentIP=`http://192.168.7.18:8082/infrastructure/admin/${plantId}/${inf}/${issue}`
          // console.log('IP => ',currentIP);
          const response = await fetch(
            `http://${DB_IP}/infrastructure/admin/issue`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                plantID: plantID,
                infrastructureName: inf,
                issue: issue,
              }),
            }
          );

          if (response.ok) {
            console.log("Data deleted successfully from DB");
    
            // const updatedRows = rows.filter((row) => row.issue_name !== issue);
            //here database operatiion will be performed
            // setRows(updatedRows);
            // setFilteredRows(updatedRows);
            // setSnackbarText("Deleted successfully !");
            // setsnackbarSeverity("success");
            // setOpen(true);
            return true;
          }
          if (!response.ok) {
            throw new Error("Failed to delete data");
          }
        }
        catch (error) {
          // setsnackbarSeverity("error");
          // setSnackbarText("Database Error !");
          // setOpen(true);
          return false;
        }
      }

      export const saveCurrentModifiedData=async(json_data)=>
        {
          console.log('saveCurrentModifiedData() called')
          try{
          const response = await fetch(
            `http://${DB_IP}/infrastructure/admin/issues`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(json_data),
            }
          );
          if (response.ok) {
            console.log("Data has been updated successfully ! ");
            // foundRow.issue_name = editedValue;
            // foundRow.severity = editedSeverity;
            // // newdata.edited = true;
            // setRows(new_rows);
            // setFilteredRows(new_rows);
            // console.log("Final array  => ", new_rows);
            // setSearch("");
            // setOpen(true);
    
            // Resetting man !!
            // setEditRowIndex(null);
            // setEditValue("");
            return true;
          }
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
        } catch (error) {
          // setSearch("");
    
          // // Resetting man !!
          // setEditRowIndex(null);
          // setEditValue("");
          // setSnackbarText("Database Error !");
          // setsnackbarSeverity("error");
          // setOpen(true);
          // console.log("Current row values  are : ", filteredRows);
          return false;
        }
        }


        export const saveNewInfrastructure=async(json_data)=>
          {
            console.log('saveInfrastructureDetails() called ')
            try{
            const response = await fetch(
              `http://${DB_IP}/infrastructure/admin`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(json_data),
              }
            );
            if (response.ok) {
              console.log("Data has been successfully saved !");
              // const updatedRows = [
              //   {
              //     issue_name: addIssue.trim(),
              //     severity: addSeverity,
              //   },
              //   ...rows,
              // ];
              // //updatedRows.push( { issueName: addIssue.trim() }) //remember rows are object here ...
              // setRows(updatedRows);
              // setFilteredRows(updatedRows);
              // setAddIssue("");
              // setOpen(true);
              // setAddSeverity("");
              // setAddissueError(false);
              // setAddissueError(false);
              return true;
            }
            else {
              throw new Error("Failed to fetch data");
            }
          } catch (error) {
            // setSnackbarText("Database Error !");
            // setsnackbarSeverity("error");
            // setOpen(true);
            // setAddIssue("");
            // setAddSeverity("");
            console.log('Error saving Data ',error)
            return false;
          }
          }




