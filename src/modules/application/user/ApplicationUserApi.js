const DB_IP=process.env.REACT_APP_SERVERIP;


export const fetchApplicationNames = async (plantID) => {
    const currentIP = process.env.REACT_APP_SERVERIP;
    console.log("env : ", currentIP);
    // console.log("Current user : ", userData);
    try {
      const response = await fetch(
        `http://${DB_IP}/application/user/${plantID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        if (response.status === 403) {
        //   navigate("/*");
        return 403;
        }
        throw new Error("Failed to fetch data,forbidden");
      }
      const data = await response.json();
      if (data) {
        console.log("Data from Database : ", data);
        // data.unshift("Select an application");
        // setAppDropdown(data);
        // setDropdownValue("Select an application");
        return data;
      }
    } catch (error) {
      console.log("Error fetching data ", error);
    }
    // setTabsModuleNames([]);
  };

  export const fetchTabNames=async(dropdownvalue,userData)=>
    {
        try {
            console.log("Current Dropdown selection : ", dropdownvalue);
            let plantID = "";
            if (userData.plantID) {
              plantID = userData.plantID;
            } else {
              throw new Error("PlantID not found ! ");
            }
            const response = await fetch(
              `http://${DB_IP}/application/user/${plantID}/${dropdownvalue}`,
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
            if (data) {
              console.log("Data from Database : ", data);
            //   setTabsModuleNames(data);
            //   setValue(data[0]);
              //further a function will be called to set the image data here
            //   fetchTabData(data[0], dropdownvalue);
            return data;
            }
          } catch (error) {
            console.log("Error fetching data ", error);
            // setTabsModuleNames([]);
            // navigate("/notfound");
          }
        }


        export const fetchTabData = async (module, application,userData) => {
            console.log("fetchTabData() called");
            console.log("Tab Value : ", module);
            console.log("Current Application : ", application);
            let plantID = "";
        
            try {
              if (userData.plantID) {
                plantID = userData.plantID;
              } else {
                throw new Error("PlantID not found ! ");
              }
              if (application === "" || module === "") {
                throw new Error("Module or Application Names are blank ");
              }
              console.log(
                "Current API call : ",
                `http://${DB_IP}/application/user/${plantID}/${application}/${module}`
              );
              const API = `http://localhost:8081/application/user/${plantID}/${application}/${module}`;
              const response = await fetch(API, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
              });
              if (!response.ok) {
                throw new Error("Failed to fetch data");
              }
              const data = await response.json();
              if (data) {
                // setMainData(data);
                console.log("Current Tab Data : ", data);
                return data;
                // const issuesList=data.issuesList;
              }
            } catch (error) {
              console.log("error occurred : ",error);
              return null;
            }
          };
        


          export const fetchCurrentUser = async () => {
            // let role = "";
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
            //   role = data.role;
            //   setCurrentUserData(data);
            return data;
        
            //   console.log("Role Test : ", role);
            //   fetchDivs(role);
            } catch (error) {
              console.error("Error fetching user list:", error);
            }
          };
          
          
          export const fetchCurrentDivs = async (role,currentPageLocation) => {
            //let role = "";
            try {
              console.log("fetchDivs() called");
              console.log("Current Page Location: ", currentPageLocation);
              // console.log("Currently passed Data : ",location.state)
              // if (userData.role) {
              //   role = userData.role;
              // } else {
              //   throw new Error("UserRole not found ! ");
              // }
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
        
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              if (response.ok) {
                console.log("Current Response : ", data);
                console.log("Current Divs : ", data.components);
                return data;
                // setDivIsVisibleList(data.components);
              }
            } catch (error) {
              console.log("Error in getting divs name :", error);
              return null;
            //   if (fetchDivs.length === 0) {
            //     navigate("/*");
            //   }
              // setsnackbarSeverity("error"); // Assuming setsnackbarSeverity is defined elsewhere
              // setSnackbarText("Database Error !"); // Assuming setSnackbarText is defined elsewhere
              // setOpen(true); // Assuming setOpen is defined elsewhere
              // setSearch("");
              // setEditRowIndex(null);
              // setEditValue("");
            }
          };


          export const postDatainDB = async (json_data) => {
            console.log("postDatainDB() called");
            console.log("current JSON_data is => ", JSON.stringify(json_data));
            try {
              const response = await fetch(`http://${DB_IP}/application/user`, {
                method: "POST",
        
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
        
                body: JSON.stringify(json_data),
              });
              if (response.ok) {
                console.log("Data has been updated successfully ! ");
                return true;
              }
              if (!response.ok) {
                throw new Error("Failed to fetch data");
              }
            } catch (error) {
              console.log("Error in posting Data to the database : ", error);
            //   setSnackbarSeverity("error");
            //   setSnackbarText("Error in Database  Connection ");
            //   setMainAlert(true);
              return false;
              // return 0;
            }
          };
        
