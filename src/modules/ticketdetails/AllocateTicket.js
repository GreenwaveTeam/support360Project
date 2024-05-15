import axios from "axios";

export const fetchUser = async () => {
    // let role = "";
    try {
      const response = await fetch("http://localhost:8081/users/user", {
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
      return data;
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };


  export const getAllOpenTicketDetails = async () => {
    // let role = "";
    try {
        console.log(`userhome Bearer ${localStorage.getItem("token")}`);
        // Make the API call to fetch data
        const response = await axios.get(`http://localhost:8081/ticket`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });
          
      
    

        // Extract data from the response
        const data = await response.data;
        console.log("data=====>", data);
        if (data) {
         return data;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    export const fetchAdminList = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/users/",
          // const response = await fetch("http://localhost:8081/admins/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 403) {
          
          return;
        }
        const data = await response.json();
        console.log("response : ", data);
  
        const filteredData = data.filter((item) => item.plantID === "NA");
        return filteredData;
      } catch (error) {
        console.log(error);
      }
    };




    export const fetchTicketDetailByPlantAndTicket = async (plantId,ticketNo) => {
      try {
        const response = await fetch(
          `http://localhost:8081/ticket/ticketDetails?plantId=${plantId}&ticketNo=${ticketNo}`,
          {
            method: "GET",
            headers: {
              // Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        // setTicketDetails(data);
        return data;
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    export const updateStatus = async (plantId,ticketNo) => {
      try {
        const response = await fetch(
          `http://localhost:8081/ticket/upadteStatus?plantId=${plantId}&ticketNo=${ticketNo}`,
          {
            method: "PUT",
            headers: {
              // Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        //const data = await response.json();
        // setTicketDetails(data);
        //return data;
        if(response.ok){
          console.log("Status Updated Successfully")
        }
        else{
          console.log("Database error")
        }

      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    const username = "user123";
const password = "pass123";
const encoded = btoa(username + ":" + password);

    export const getSelectedOptionTask = async (selected_asset) => {
      try {
        console.log("getSelectedOptionTask() called ", selected_asset);
    
        const response = await axios.get(
          `http://localhost:8086/usergroup/jobAssetGroup/${selected_asset} `,
          {
            headers: {
              Authorization: "Basic " + encoded,
            },
          }
        );
        //console.log("Current Response for Task Dropdown : ",response)
        //The current response is giving all the groups information not to the selected option so i am filtering the data and returning that response
        console.log("Response Data : ",response.data," Selected Option : ",selected_asset)
        // let selectedOptionData=response.data.filter((element)=>element.assetGroup===selected_asset)
        // console.log("Final Selected Option Data : ",selectedOptionData)
        // return selectedOptionData;
        return response.data;
      } catch (error) {
        console.error("Error for fetching the task dropdown value : ", error);
        // return null;
      }
    };




    
