import React from "react";
import FadeLoader from "react-spinners/FadeLoader";
import styled from "styled-components";

const MovieSearchLoading = ({height}) => {
  return (
    <div className="contentWrap">
      <StyledDiv ht={height}>
      </StyledDiv>
      <div
        style={{
          position: "fixed",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -40%)",
        }}
      >
        <FadeLoader
          color="#36d7b7"
          height={15}
          width={5}
          radius={2}
          margin={2}
        />
      </div>
    </div>
  );
};

// 받아온 height를 이용해서 여백추가(Footer가 올라오는것 방지)
const StyledDiv = styled.div`
  height: ${props => `${props.ht}px`} ;
`;

export default MovieSearchLoading;
