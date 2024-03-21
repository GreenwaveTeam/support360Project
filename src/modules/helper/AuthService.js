import { jwtDecode } from "jwt-decode";

// export const login = async (username, password) => {
//   const response = await fetch("http://localhost:8081/auth/signin", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ username, password }),
//   });
//   if (response.ok) {
//     const token = await response.json();
//     console.log("token : ", token);
//     // localStorage.setItem("token", token);
//     return true;
//   } else {
//     return false;
//   }
// };

export const login = async (username, password) => {
  try {
    const response = await fetch("http://localhost:8081/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const res = await response.json();
      console.log("token : ", res);
      localStorage.setItem("token", res.token);
      return true;
    } else {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Failed to login");
    }
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log("token auth : ", token);
  if (token) {
    const decodedToken = decodeToken(token);
    console.log("decodedToken : ", decodedToken);
    // if (decodedToken.exp * 1000 > Date.now()) {
    //   return true;
    // }
    return true;
  }
  return false;
};

const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
};
