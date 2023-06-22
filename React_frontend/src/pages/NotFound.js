import React from 'react';
import styled from 'styled-components';
import { InfoCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<Layout>
			<Error>
				<Inner>
					<InfoCircleOutlined style={{fontSize: "32px"}}/>
					<h3>
						찾으시는 페이지가 없습니다.
					</h3>
					<p>
						요청하신 페이지를 찾을 수 없습니다.
						<br/>
						입력하신 경로가 정확한지 다시 한번 확인해 주시기 바랍니다.
					</p>
					<Link to="/">
						<button>
							<span>
								홈화면으로
							</span>
						</button>				
					</Link>
				</Inner>
			</Error>
		</Layout>
	);
};

const Layout = styled.div`
  width: 100%;
  margin-top: 5rem;
	margin-bottom: 5rem;
  background-color: #fff;
`;

const Error = styled.div`
	padding: 95px 0 125px;
	text-align: center;
	color: #333;
`;

const Inner = styled.div`
	font-weight: 400;
	letter-spacing: 0;
	font-size: 12px;
	line-height: 1;
	color: #666;

	h3 {
		padding-bottom: 20px;
    font-weight: bold;
    font-size: 28px;
    color: #666;
		margin-top: 17px;
		margin-bottom: 0px;
	}

	p {
		padding-bottom: 30px;
    font-size: 16px;
    line-height: 23px;
    color: #b5b5b5;
		margin: 0;
	}

	button {
    width: 150px;
    height: 44px;
		border: 1px solid #5f0081;
    background-color: #5f0080;
		border-radius: 3px;
		cursor: pointer;

		span {
			display: inline-block;
			line-height: 43px;
    	font-size: 15px;
			color: #fff;
    	height: 100%;
    	text-align: center;
			font-weight: 500;
		}
	}
`;

export default NotFound;