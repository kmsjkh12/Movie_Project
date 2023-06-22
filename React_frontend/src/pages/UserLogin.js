import React from "react";
import LoginForm from "../components/Login_components/LoginForm";
import { createGlobalStyle } from "styled-components";

const UserLogin = () => {
  return (
    <>
      <GlobalStyle />
      <LoginForm />
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #fff;
  }
`;

export default UserLogin;
