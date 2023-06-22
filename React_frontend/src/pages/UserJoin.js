import React from "react";
import JoinForm from "../components/Login_components/JoinForm";
import { createGlobalStyle } from "styled-components";

const UserJoin = () => {
  return (
    <>
      <GlobalStyle />
      <JoinForm />
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #fff;
  }
`;

export default UserJoin;
