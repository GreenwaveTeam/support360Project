export const login = async (username, password) => {
  // if (localStorage.getItem("token") !== null) {
  //   localStorage.removeItem("token");
  // }
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
  localStorage.clear();
  // const navigate = useNavigate();
  // navigate("/login");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Returns true if token, false otherwise
};

// export const handleFetchResponse = (response, redirectTo) => {
//   const navigate = useNavigate();
//   if (response.status === 403) {
//     navigate(redirectTo);
//     return;
//   }
//   return response.json();
// };
