import React from 'react';
import styled from 'styled-components';
import SideBar from '../components/MyPages/SideBar';
import { Outlet } from "react-router-dom";

const Mypage = () => {
	return (
		<Container>
			<InnerWraps>
				<SideBar/>
				<Outlet />
			</InnerWraps>
		</Container>
	);
};

const Container = styled.div`
  padding: 0;
  width: 1235px;
  margin : 0 auto;
  box-sizing: border-box; 
  margin-bottom: 0;
`;

const InnerWraps = styled.div`
	display: flex;
	width: 1060px;
	padding: 50px 0px 80px;
	margin: 0px auto;
	flex-direction: row;
	-webkit-box-pack: justify;
	justify-content: space-between;
`;

export default Mypage;