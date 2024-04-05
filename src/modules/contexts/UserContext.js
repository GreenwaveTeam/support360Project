import React, { createContext, useContext, useEffect, useState } from "react";
import bcrypt from "bcryptjs";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userData, setUserData] = useState({
//     userID: "",
//     name: "",
//     role: "",
//     plantID: "",
//   });

//   return (
//     <UserContext.Provider value={{ userData, setUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUserContext = () => useContext(UserContext);

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : {};
  });

  const hashData = async (json) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(JSON.stringify(json), salt);
    return hash;
  };

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
