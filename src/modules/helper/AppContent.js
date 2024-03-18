import React, { useState } from "react";
import { request, setAuthHeader } from "../helpers/axios_helper";
import Buttons from "./Buttons";
import AuthContent from "./AuthContent";
import LoginForm from "./LoginForm";
// import WelcomeContent from './WelcomeContent';

export default function AppContent() {
  const [componentToShow, setComponentToShow] = useState("welcome");

  const login = () => {
    setComponentToShow("login");
  };

  const logout = () => {
    setComponentToShow("welcome");
    setAuthHeader(null);
  };

  const onLogin = (e, username, password) => {
    e.preventDefault();
    request("POST", "/login", {
      login: username,
      password: password,
    })
      .then((response) => {
        setAuthHeader(response.data.token);
        setComponentToShow("messages");
      })
      .catch((error) => {
        setAuthHeader(null);
        setComponentToShow("welcome");
      });
  };

  const onRegister = (event, firstName, lastName, username, password) => {
    event.preventDefault();
    request("POST", "/register", {
      firstName: firstName,
      lastName: lastName,
      login: username,
      password: password,
    })
      .then((response) => {
        setAuthHeader(response.data.token);
        setComponentToShow("messages");
      })
      .catch((error) => {
        setAuthHeader(null);
        setComponentToShow("welcome");
      });
  };

  return (
    <>
      <Buttons login={login} logout={logout} />

      {/* {componentToShow === "welcome" && <WelcomeContent /> } */}
      {componentToShow === "login" && (
        <LoginForm onLogin={onLogin} onRegister={onRegister} />
      )}
      {componentToShow === "messages" && <AuthContent />}
    </>
  );
}
