import React from "react";
import { createGlobalStyle } from "styled-components";
import BoxList from "../components/BoxOffice/BoxList";
import HomeBanner from "../components/Common_components/HomeBanner";

const Home = () => {
  return (
    <>
      <GlobalStyle />
      <HomeBanner />
      <BoxList />
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: black;
  }
`;

export default Home;
