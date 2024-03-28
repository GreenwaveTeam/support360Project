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
