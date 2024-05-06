// api.js

export const fetchPlants = async () => {
  try {
    const response = await fetch("http://localhost:8081/plants/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 403) {
      // Handle unauthorized access
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchRoles = async () => {
  try {
    const response = await fetch("http://localhost:8081/role", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 403) {
      // Handle unauthorized access
      console.log("error fetching roles");
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const addPlant = async (newPlantName) => {
  try {
    const response = await fetch("http://localhost:8081/plants/plant", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlantName),
    });
    if (response.ok) {
      console.log("Plant Added successfully : ", newPlantName);
      return true;
    } else {
      console.error("Failed to Add Plant");
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export const updateUser = async (updateFormData) => {
  try {
    const response = await fetch(
      `http://localhost:8081/users/user/${updateFormData.userID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateFormData),
      }
    );
    if (response.ok) {
      console.log("User Updated successfully");
      return true;
    } else {
      console.error("Failed to update user");
      return false;
    }
  } catch (error) {
    console.error("Error : ", error);
    return false;
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await fetch("http://localhost:8081/auth/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const text = await response.text();
      return { success: true, message: text };
    } else {
      const text = await response.text();
      return { success: false, message: text };
    }
  } catch (error) {
    console.error("Error : ", error);
    return {
      success: false,
      message: "An error occurred while registering user.",
    };
  }
};

export const updateAdmin = async (updateFormData) => {
  try {
    console.log(
      "updateFormData.adminID : ",
      `http://localhost:8081/admins/admin/${updateFormData.adminID}`
    );
    console.log("updateFormData : ", updateFormData);
    const response = await fetch(
      `http://localhost:8081/admins/admin/${updateFormData.adminID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateFormData),
      }
    );
    if (response.ok) {
      console.log("Admin Updated successfully");
      return true;
    } else {
      console.error("Failed to update admin");
      return false;
    }
  } catch (error) {
    console.error("Error : ", error);
    return false;
  }
};

export const registerAdmin = async (formData) => {
  try {
    const response = await fetch("http://localhost:8081/auth/admin/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const text = await response.text();
      return { success: true, message: text };
    } else {
      const text = await response.text();
      return { success: false, message: text };
    }
  } catch (error) {
    console.error("Error : ", error);
    return {
      success: false,
      message: "An error occurred while registering admin.",
    };
  }
};

export const extendTokenExpiration = async () => {
  try {
    const response = await fetch(
      `http://localhost:8081/auth/extendTokenExpiration?token=${localStorage.getItem(
        "token"
      )}`
    );
    const data = await response.text();
    console.log("old token : ", localStorage.getItem("token"));
    console.log("new token : ", data);
    localStorage.setItem("token", data);
    console.log("extendTokenExpiration data : ", data);
  } catch (error) {
    console.log(error);
  }
};
