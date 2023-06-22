/*
 23-03-10 마이페이지 css 구축(오병주)
*/
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";

// 마이페이지 왼쪽 사이드바
const SideBar = () => {
	// 로그인 상태확인용 리덕스 상태
	const dispatch = useDispatch();
	const { LOGIN_data } = useSelector((state) => state.R_user_login);
	const { LOGIN_STATUS_error } = useSelector((state) => state.R_user_login);
	const { LOGOUT_done } = useSelector((state) => state.R_user_login);

	// 페이지 이동을 위해 선언
	const location = useLocation();
	const navigate = useNavigate();	

	// 사이드바의 css 수정을 위한 state
	const [state, setState] = useState({
    Reserve: false,
    Cancel: false,
		Finish: false,
		Like: false,
		Comment: false,
		Modify: false
  });

	const { Reserve, Cancel, Finish, Like, Comment, Modify } = state;

	// url에 따라 state 수정
	useEffect(()=> {
		setState (s => ({
			...s,
			Reserve: false,
			Cancel: false,
			Finish: false,
			Like: false,
			Comment: false,
			Modify: false,
			[location.pathname.substring(8, 15)]: true
		}));

		// 취소내역 상세 예외
		if (location.pathname.substring(8, 15) === 'CancelD') {
			setState (s => ({
				...s,
				Cancel: true
			}));
		}

		// 지난관람내역 상세 예외
		if (location.pathname.substring(8, 15) === 'FinishD') {
			setState (s => ({
				...s,
				Finish: true
			}));
		}

	}, [location.pathname])

	// 로그인이 안되어있으면 마이페이지에 진입못하게 하는 useEffect
	useEffect(() => {
		if (LOGIN_STATUS_error !== null && LOGIN_data.uname === '') {
			if (LOGOUT_done) {
				return;
			}
			alert("로그인 이후 사용 가능한 페이지입니다.");
			navigate('/UserLogin', {state: {url: '/Mypage/Reserve'}});
    }
  }, [LOGIN_STATUS_error, LOGIN_data.uname, LOGOUT_done, navigate, dispatch]);

	return (
		<SideBarLayout>
			<SideTitle>
				마이페이지
			</SideTitle>
			<SideUL>
				<li>
					<Link to="/Mypage/Reserve" className={"btn" + (Reserve ? " active" : "")}>
						예매내역
						<span>
							<RightOutlined/>
						</span>
					</Link>
				</li>
				<li>
					<Link to="/Mypage/Cancel" className={"btn" + (Cancel ? " active" : "")}>
						예매 취소내역
						<span>
							<RightOutlined/>
						</span>
					</Link>
				</li>
				<li>
					<Link to="/Mypage/Finish" className={"btn" + (Finish ? " active" : "")}>
						지난 관람내역
						<span>
							<RightOutlined/>
						</span>
					</Link>
				</li>
				<li>
					<Link to="/Mypage/Like" className={"btn" + (Like ? " active" : "")}>
						찜한 영화
						<span>
							<RightOutlined/>
						</span>
					</Link>
				</li>
				<li>
					<Link to="/Mypage/Comment" className={"btn" + (Comment ? " active" : "")}>
						관람평 내역
						<span>
							<RightOutlined/>
						</span>
					</Link>
				</li>
				<li>
					<Link to="/Mypage/Modify" className={"btn" + (Modify ? " active" : "")}>
						회원정보 수정
						<span>
							<RightOutlined/>
						</span>
					</Link>
				</li>
			</SideUL>
		</SideBarLayout>
	);
};

const SideBarLayout = styled.div`
	width: 170px;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
`;

const SideTitle = styled.div`
	padding: 9px 0px 30px 1px;
	font-weight: 500;
	font-size: 28px;
	line-height: 35px;
	color: rgb(51, 51, 51);
	letter-spacing: -1px;
	font-weight: 550;
`;

const SideUL = styled.ul`
	margin: 0;
	padding: 0;
	list-style-type: none;
	border: 1px solid rgb(221, 223, 225);

	li {
		width: 100%;
		box-sizing: border-box;
    margin: 0;
		padding: 0;
		display: list-item;

		.btn {
			cursor: pointer;
			text-decoration: none;
			padding: 14px 20px 16px;
			display: flex;
			-webkit-box-pack: justify;
			justify-content: space-between;
			-webkit-box-align: center;
			align-items: center;
			line-height: 19px;
			letter-spacing: -0.3px;
			font-size: 14px;
			color: rgb(102, 102, 102);
			box-sizing: border-box;
			border-bottom: 1px solid rgb(221, 223, 225);

			&.active {
				background-color: rgb(246, 246, 246);
				color: black;
				font-weight: 550;
			}

			:hover {
				background-color: rgb(246, 246, 246);
				color: black;
				font-weight: 550;
			}
		}
	}
`;

export default SideBar;