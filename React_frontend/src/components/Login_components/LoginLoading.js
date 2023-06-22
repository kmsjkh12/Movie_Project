/*
 23-02-12 로그인 및 회원가입 로딩창 구현(오병주)
*/
import React from 'react';
import styled from "styled-components";
import ClipLoader from "react-spinners/ClipLoader";

// 로그인 및 회원가입 로딩창
const LoginLoading = () => {
	return (
		<Background>
      <ClipLoader
				color="#000066"
				size={20}
			/>
    </Background>
	);
};

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #ffffffb7;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default LoginLoading;