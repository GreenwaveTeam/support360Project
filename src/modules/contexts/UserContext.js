import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    userID: "",
    name: "",
    role: "",
    plantID: "",
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userData, setUserData] = useState(() => {
//     const storedUserData = localStorage.getItem("userData");
//     return storedUserData ? JSON.parse(storedUserData) : {};
//   });

//   useEffect(() => {
//     localStorage.setItem("userData", JSON.stringify(userData));
//   }, [userData]);

//   return (
//     <UserContext.Provider value={{ userData, setUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUserContext = () => useContext(UserContext);
