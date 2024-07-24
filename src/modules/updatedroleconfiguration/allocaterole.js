import axios from "axios";

const DB_IP =  process.env.REACT_APP_SERVERIP;
;

export async function getPageComponentDetails(){
    try
    {
        const response= await axios.get(
            `http://${DB_IP}/role/getpagesDetails`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                
            }
        )
        console.log("get page component::",response.data)
        return response.data;
    }
    catch(error){
        console.log("Error in allocaterole:",error)
    }
}
export async function addOrUpdateAccessibility(data){
    try {
        console.log("addOrUpdateAccessibility:",JSON.stringify(data))
        // Send requestBody as request body in the PUT request
        const response = await axios.put(
          `http://${DB_IP}/role/updateaccessibility`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Updated accessibility")
    }
    catch(error){
        console.log("Error in allocaterole:",error)
    }
}

export async function getRoleDetails(role){
    try{
        const response = await axios.get(
            `http://${DB_IP}/role/fetchroleaccessibility/${role}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          return response.data
    }catch(err){
        console.log("Error in getRoleDetails:",err)
    }
}

export async function fetchAllRoleDetails(){
    try{
        
            console.log(`user/home Bearer ${localStorage.getItem("token")}`);
            // Make the API call to fetch data
            const response = await axios.get(`http://${DB_IP}/role`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });
    
          return response.data
    }catch(err){
        console.log("Error in fetchAllRoleDetails:",err)
    }
}
export async function deleteRole(requestBody){
    try{
        const response = await axios.delete(`http://${DB_IP}/role/currentrole`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            data: requestBody,
          });
    }catch(err){
        console.log("Error in deleteRole:",err)
    }
}
export async function updateAccessibilityRoleDescription(data,role){
  try {
      console.log("addOrUpdateAccessibility:",JSON.stringify(data))
      // Send requestBody as request body in the PUT request
      const response = await axios.put(
        `http://${DB_IP}/role/updateroledetails/${role}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Updated accessibility")
  }
  catch(error){
      console.log("Error in updateAccessibilityRoleDescription:",error)
  }
}
