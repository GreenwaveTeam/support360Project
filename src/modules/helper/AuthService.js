import { jwtDecode } from "jwt-decode";

export const login = async (username, password) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (response.ok) {
    const { token } = await response.json();
    localStorage.setItem("token", token);
    return true;
  } else {
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = decodeToken(token);
    if (decodedToken.exp * 1000 > Date.now()) {
      return true;
    }
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
