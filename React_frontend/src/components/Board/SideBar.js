/*
  23-05-15 게시물 페이지 수정(오병주)
*/
import React, { useCallback } from "react"
import styled from "styled-components"
import { useSelector } from "react-redux";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";

const menus = [
	{ name: "자유 게시판", path: "free" },
	{ name: "영화 뉴스", path: "news" },
	{ name: "영화 토론", path: "debate" }
];

const SideBar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { category } = useParams();

	// 로그인 리덕스 상태
	const { LOGIN_data } = useSelector((state) => state.R_user_login);
	
	// 카테고리 누를때 실행되는 함수
	const handleChange = useCallback((data)=>{
		navigate(`/Board/list/${data}/all/1`)
	}, [navigate]);

	return (
		<SideBarWrapper>
			<SideBarContent>
				<SideBarHeader>
				{LOGIN_data.uid === "No_login" ?
					<Login>
						<Link to={`/UserLogin`} state={{ url: location.pathname}}>
							<span>
								로그인
							</span>
						</Link>
					</Login> :
					<>
						<User>
							<div className="id">
								{LOGIN_data.uid}
							</div>
							<div className="name">
								{LOGIN_data.uname}
							</div>
						</User>
						<InfoSideBar>
							<Link to="/Board/list/myinfo/content/1" className="item">
								<span>
									내가 쓴 글
								</span>
							</Link>
							<Link to="/Board/write" className="item write">
								<span>
									글 쓰기
								</span>
							</Link>
						</InfoSideBar>
					</>}
				</SideBarHeader>
				<SideMenu>
					<Title>
						커뮤니티
					</Title>
					<MenuList>
						{menus.map((data, index)=>
						<Li key={index} pathname={data.path} category={category} onClick={()=>{handleChange(data.path)}}>
							<span>
								{data.name}
							</span>
						</Li>
						)}		
					</MenuList>
				</SideMenu>
			</SideBarContent>
		</SideBarWrapper>
	);
};

const SideBarWrapper = styled.div`
	width: 270px;
	position: relative;
	float: left;   
`;

const SideBarContent = styled.div`
	border: 1px solid #ebeef1;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .15);
`;

const SideBarHeader = styled.div`
	padding: 20px;
	border-bottom: 1px solid #ebeef1;
`;

const User = styled.div`
	float: left;
	margin-left: 5px;
	padding-bottom: 15px;

	.id {
		line-height: 17px;
		font-size: 14px;
		font-weight: 700;
		color: #1e2022;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.name {
		margin-top: 4px;
		line-height: 18px;
		font-size: 12px;
		color: #16ae81;
	}
`;

const InfoSideBar = styled.div`
	display: table;
	width: 100%;
	table-layout: fixed;

	.item {
		padding-left: 0;
		display: table-cell;
		padding-right: 4px;
		cursor: pointer;
		text-decoration-line: none;

		span {
			display: block;
			box-sizing: border-box;
			text-align: center;
			padding: 11px 0 10px;
			line-height: 17px;
			font-size: 14px;
			background: transparent;
			border-color: #46cfa7;
			color: #46cfa7;
			text-decoration: none;
			border-radius: 4px;
			border: 1px solid #46cfa7;
		}
  }

	.write {
		background-color: #46cfa7;
		border-radius: 4px;

		span {
			color: white;
		}
	}
`;

const Login = styled.div`
	padding-right: 0;
	padding-left: 0;
	cursor: pointer;

	a {
		text-decoration-line: none;
	}

	span {
		display: block;
		padding: 11px 0 10px;
		line-height: 17px;
		font-size: 14px;
		box-sizing: border-box;
		text-align: center;
		background-color: #46cfa7;
		color: #fff;
		border-radius: 4px;
		border: 1px solid #46cfa7;
	}
`;

const SideMenu = styled.div`
	padding: 9px 16px 8px;
`;

const Title = styled.div`
	padding-top: 4px;
	padding-bottom: 6px;
	line-height: 15px;
	font-size: 12px;
	color: #7b858e;
`;

const MenuList = styled.ul`
	padding-left: 0;
	margin-top: 8px;
	margin-bottom: 16px;
	list-style-type: none;
`;

const Li = styled.li`
	line-height: 17px;
	font-size: 14px;
	color: #1e2022;
	border-radius: 4px;
	cursor: pointer;
	position: relative;
	background-color: ${(props)=> props.pathname === props.category ? "#E2E2E2;" : ""};
	font-weight: ${(props)=> props.pathname === props.category ? "600" : "500"};

	span {
		padding: 8px 12px 7px;
		display: block;
	}
`;

export default SideBar