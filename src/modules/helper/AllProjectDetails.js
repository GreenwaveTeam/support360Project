const DB_IP = process.env.REACT_APP_SERVERIP;
export const fetchAllProjectDetails = async () => {
    try {
      const response = await fetch(`http://${DB_IP}/plants/projectDetails`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 403) {
      console.log('Unauthorized access !')
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };