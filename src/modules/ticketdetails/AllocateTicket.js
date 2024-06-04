import axios from "axios";
const DB_IP = process.env.REACT_APP_SERVERIP;
export const fetchUser = async () => {
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
    const response = await axios.get(`http://${DB_IP}/ticket`, {
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
};

export const getAllClosedTicketDetails = async (plantID) => {
  // let role = "";
  try {
    console.log(`userhome Bearer ${localStorage.getItem("token")}`);
    // Make the API call to fetch data
    const response = await axios.get(
      `http://${DB_IP}/ticket/ticketDetails/closed/${plantID}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract data from the response
    const data = await response.data;
    console.log("data=====>", data);
    if (data) {
      return data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchAdminList = async () => {
  try {
    const response = await fetch(
      `http://${DB_IP}/users/`,
      // const response = await fetch("http://${DB_IP}/admins/",
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

export const fetchTicketDetailByPlantAndTicket = async (plantId, ticketNo) => {
  try {
    const response = await fetch(
      `http://${DB_IP}/ticket/ticketDetails?plantId=${plantId}&ticketNo=${ticketNo}`,
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

export const updateStatus = async (plantId, ticketNo, tikcetStatus) => {
  console.log(
    "update Link : ",
    `http://${DB_IP}/ticket/upadteStatus?plantId=${plantId}&ticketNo=${ticketNo}&ticketStatus=${tikcetStatus}`
  );

  try {
    const response = await fetch(
      `http://${DB_IP}/ticket/upadteStatus?plantId=${plantId}&ticketNo=${ticketNo}&ticketStatus=${tikcetStatus}`,
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
    if (response.ok) {
      console.log("Status Updated Successfully");
      return true;
    } else {
      console.log("Database error");
      return false;
    }
  } catch (error) {
    console.error("Error fetching user list:", error);
  }
};

const username = "user123";
const password = "pass123";
const encoded = btoa(username + ":" + password);

export const getSelectedOptionTask = async (selected_asset) => {
  console.log(
    "getSelectedOptionTask : ",
    `http://localhost:8086/usergroup/jobAssetGroup/${selected_asset} `
  );
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
    console.log(
      "Response Data : ",
      response.data,
      " Selected Option : ",
      selected_asset
    );
    // let selectedOptionData=response.data.filter((element)=>element.assetGroup===selected_asset)
    // console.log("Final Selected Option Data : ",selectedOptionData)
    // return selectedOptionData;
    return response.data;
  } catch (error) {
    console.error("Error for fetching the task dropdown value : ", error);
    // return null;
  }
};

const AUTH_API = "localhost:8097";

export const login = async () => {
  // if (localStorage.getItem("token") !== null) {
  //   localStorage.removeItem("token");
  // }
  console.log(`http://${AUTH_API}/auth/signin`);
  try {
    const response = await fetch(
      // `http://${DB_IP}/auth/signin`
      `http://${AUTH_API}/auth/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username:"info@greenwave.co.in", password:"user_123" }),
      }
    );

    if (response.ok) {
      const res = await response.json();

      console.log("token : ", res);
      // await sessionStorage.setItem("token", res.token);
      // await sessionStorage.setItem("username", username);
      // sessionStorage.setItem("expire", res.expire);
      return res.token;
    } else {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Failed to login");
    }
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};

export const fetchStatusFromJob = async (ticketNo,token) => {
  

  try {
    const response = await fetch(
      // console.log("URL : ",`http://localhost:8090/dashboard/jobStatus?ticketNo=${ticketNo}`),
      `http://localhost:8090/dashboard/jobStatus?ticketNo=${ticketNo}`,
      {
        method: "GET",
        headers: {
           Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("After call");
    if (response.ok) {
      // console.log(response)
      const data = await response.json();
      console.log("inside API : ", ticketNo, " ", data.status);
      return data.Status;
    }

    // setTicketDetails(data);
  } catch (error) {
    console.error("Error fetching user list:", error);
  }
};

export const fetchTicketResponseTime = async (plantId) => {
  try {
    const response = await fetch(
      `http://${DB_IP}/ticket/responseTime?plantId=${plantId}`,
      {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log("fetchTicketResponseTime : ", data);
      console.log("fetchTicketResponseTime : ", Array.isArray(data));
      return data;
    }
  } catch (error) {
    console.error("Error fetching fetchTicketResponseTime:", error);
  }
};

export const fetchTicketResolveTime = async (plantId) => {
  try {
    const response = await fetch(
      `http://${DB_IP}/ticket/resolveTime?plantId=${plantId}`,
      {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log("fetchTicketResolveTime : ", data);
      return data;
    }
  } catch (error) {
    console.error("Error fetching fetchTicketResolveTime:", error);
  }
};

export const fetchTicketCloseTime = async (plantId) => {
  try {
    const response = await fetch(
      `http://${DB_IP}/ticket/closeTime?plantId=${plantId}`,
      {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log("fetchTicketCloseTime : ", data);
      return data;
    }
  } catch (error) {
    console.error("Error fetchTicketCloseTime:", error);
  }
};


export const fetchModuleImageMap = async (plantId) => {
  try {
    const response = await fetch(
      `http://${DB_IP}/application/moduleData/${plantId}`,
      {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      // console.log("fetchModuleImageMap : ", data);
      return data;
    }
  } catch (error) {
    console.error("Error fetchModuleImageMap:", error);
  }
};



export const fetchApplicationTicketDetails = async (ticketNo) => {
  try {
    const response = await fetch(
      `http://${DB_IP}/application/ticketDetails/${ticketNo}`,
      {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      // console.log("fetchApplicationTicketDetails : ", data);
      return data;
    }
  } catch (error) {
    console.error("Error fetchApplicationTicketDetails:", error);
  }
};
