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
