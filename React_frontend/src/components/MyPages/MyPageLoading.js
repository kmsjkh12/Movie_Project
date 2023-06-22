import React from 'react';
import styled from "styled-components";
import ClipLoader from "react-spinners/ClipLoader";

// 마이페이지 로딩창
const MyPageLoading = () => {
	return (
		<Height>
			<Background>
				<ClipLoader
					color="#000066"
					size={20}
				/>
			</Background>
		</Height>
	);
};

const Height = styled.div`
	position: relative;
	height: 550px;
`;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: -10%;
  left: 0px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default MyPageLoading;