/*
 23-01-24 로그인 상태확인 구현(오병주)
 23-01-25 페이지 이동 구현(오병주)
 23-01-27 로그아웃 구현(오병주)
*/
import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { USER_LOGOUT_REQUEST } from "../../reducer/R_user_login";
import LoginLoading from "../Login_components/LoginLoading";

const TopButtons = () => {
  // 로그인 상태확인용 리덕스 상태
  const dispatch = useDispatch();
  const { LOGIN_data } = useSelector((state) => state.R_user_login);
  const { LOGOUT_loading } = useSelector((state) => state.R_user_login);
  const { LOGOUT_done } = useSelector((state) => state.R_user_login);

  // 현재 페이지의 정보와 페이지 이동을 위해 선언 
  const location = useLocation();

  // 로그아웃 버튼을 눌렀을 때 실행되는 함수
  const onLogout = useCallback(() => {

    if (!window.confirm("로그아웃 시 메인화면으로 이동합니다.")) {
      return;
    };

    dispatch({
      type: USER_LOGOUT_REQUEST,
    });
  }, [dispatch]);

  // 로그아웃 성공시 메인화면으로 보내는 useEffect
  useEffect(()=> {
    if (LOGOUT_done) {
      window.location.assign('/');
    }
  }, [LOGOUT_done]);

  return (
    <>
      {LOGOUT_loading || LOGOUT_done ? <LoginLoading /> : null}
      <NavBar>
        <div className="nav">
          {LOGIN_data.uname === '' || LOGIN_data.uname === "error!!" ? (
            <div className="Top_right">
              {/* 로그인으로 갈때는 이전 url의 주소를 넘겨줘야함 */}
              <Link to={`/UserLogin`} state={{ url: location.pathname}}>
                로그인
              </Link>
              <Link to="/UserJoin">
                회원가입
              </Link>
            </div>
          ) : (
            <div className="Top_right">
              <span>{LOGIN_data.uname}님 환영합니다.</span>
              <button onClick={onLogout}>로그아웃</button>
            </div>
          )}
          <h2 className="logo">
            <Link to="/" style={{ content: "" }}>
              홈버튼
            </Link>
          </h2>
          <ul className="MenuListLeft">
            <li className="topMenuLiLeft">
              <strong>
                영화  
              </strong>
            </li>
            <li className="topMenuLiLeft">
              <strong>
                예매
              </strong>
            </li>
            <li className="topMenuLiLeft">
              <strong>
                커뮤니티
              </strong>
            </li>
          </ul>
          <ul className="MenuListRight">
            <li className="topMenuLiRight">
              <strong>
                관리자1
              </strong>
            </li>
            <li className="topMenuLiRight">
              <strong>
                관리자2
              </strong>
            </li>
          </ul>
          <div className="RightIcon">
          <Button style={{ marginRight: "5px" }}>
						<Link to="/TimeTable">						
            	<CalendarOutlined style={{fontSize: "25px", marginRight: "15px", color: "white"}}/>
						</Link>
          </Button>
          <Button>
            <Link to="/Mypage/Reserve">
              <UserOutlined style={{ fontSize: "25px", color: "white" }} />
            </Link>
          </Button>
          </div>
          <div className="menu_pan">
            <div className="layout">
              <div className="menu_category">
                <div className="title_category">
                  영화
                </div>
                <div className="category">
                  <Link to="/Allmovie">전체영화</Link>
                </div>
                <div className="category">
                  <Link to="/Screenmovie">현재상영작</Link>
                </div>
                <div className="category">
                  <Link to="/Comingmovie">상영예정작</Link>
                </div>
              </div>
              <div className="menu_category">
                <div className="title_category">
                  예매
                </div>
                <div className="category">
                  <Link to="/Reserve">빠른예매</Link>
                </div>
                <div className="category">
                  <Link to="/TimeTable">상영시간표</Link>
                </div>
              </div>
              <div className="menu_category">
                <div className="title_category">
                  커뮤니티
                </div>
                <div className="category">    
                  <Link to="/Board/list/free/all/1">게시판</Link>
                </div>
              </div>
              <div className="menu_category">
                <div className="title_category">
                  관리자1
                </div>
                <div className="category">
                  <Link to="/ManagerPage/Movie">영화관리</Link> 
                </div>
                <div className="category">
                  <Link to="/ManagerPage/MovieInfo">상영정보관리</Link>
                </div>
                <div className="category">
                  <Link to="/ManagerPage/Building">영화관 관리</Link>
                </div>
              </div>
              <div className="menu_category">
                <div className="title_category">
                  관리자2
                </div>
                <div className="category">
                  <Link to="/ManagerPage/User">회원관리</Link>
                </div>
                <div className="category">
                  <Link to="/ManagerPage/Reserve">예매기록조회</Link>
                </div>
                <div className="category">
                  <Link to="/ManagerPage/Document">작성기록관리</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NavBar>
    </>
  );
};

const NavBar = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  color: white;
  text-align: center;
  justify-content: center;
  height: 5.75rem;
  border-bottom: 1px solid #fff;
  background-color: black;
  z-index: 999;

  .logo {
    position: absolute;
    left: 50.4%;
    top: 0;
    width: 4.688rem;
    height: 5.625rem;
    margin: 0 0 0 -70px;
    padding: 0;
    background: url(/img/logo_black.jpg);
    background-size: cover;
    transform: translate(-50.4%, 0);
    margin: 0;

    a {
      display: block;
      width: 4.688rem;
      height: 5.625rem;
      margin: 0;
      padding: 0;
      font-size: 0;
      line-height: 0;
    }
  }

  .nav {
    position: relative;
    background-color: black;
    width: 100%;
  }

  .Top_left {
    position: absolute;
    top: 0.938rem;
    left: 13%;
    font-size: 0.8667em;
    font-family: NanumBarunGothic, Dotum, "돋움", sans-serif;
    transform: translate(-13%);
    a {
      color: #888;
      float: left;
      margin-right: 1.25rem;
      text-decoration: none;
      :hover {
        text-decoration: underline;
      }
    }
  }

  .Top_right {
    position: absolute;
    top: 0.938rem;
    right: 13%;
    font-size: 0.8667em !important;
    font-family: NanumBarunGothic, Dotum, "돋움", sans-serif !important;
    transform: translate(13%);
    a {
      margin-top: 0.075rem;
      color: #888;
      float: left;
      margin-right: 1.25rem;
      text-decoration: none;
      :hover {
        text-decoration: underline;
      }
    }
    button {
      color: #888;
      float: left;
      margin-right: 1.25rem;
      text-decoration: none;
      background-color: black;
      padding: 0;
      border: 0;
      cursor: pointer;
      :hover {
        text-decoration: underline;
      }
    }
    span {
      margin-top: 0.088rem;
      color: #888;
      float: left;
      margin-right: 0.938rem;
      text-decoration: none;
      background-color: black;
      padding: 0;
      border: 0;
      font-weight: 600;
      font-family: NanumBarunGothic, Dotum, "돋움", sans-serif !important;
    }
  }

  .RightIcon {
    display: flex;
    position: absolute;
    top: 75%;
    right : 16%;
    width: 36px;
    transform: translate(16%, -75%);
  }

  .MenuListLeft {
    position: absolute;
    padding: 0;
    margin: 0;
    top: 100%;
    left : 23%;
    transform: translate(-23%, -95%);
    display : flex;
    width: 28%;

    :hover ~ .menu_pan{
      display: block;
    }
      // translate는 좌우, 상하
    .topMenuLiLeft {
      list-style-type: none;
      width: 33.3%;
      float: left;
      height: 40px;

      strong {
        cursor: pointer;
        font-weight: 500;
      }
    }
  }

  .MenuListRight {
    position: absolute;
    padding: 0;
    margin: 0;
    top: 100%;
    right : 29.3%;
    transform: translate(29.3%, -95%);
    display : flex;
    width: 23%;

    :hover ~ .menu_pan{
      display: block;
    }

    .topMenuLiRight {
      list-style-type: none;
      width: 50%;
      float: right;
      height: 40px;

      strong {
        cursor: pointer;
        font-weight: 500;
      }
    }
  }

  .menu_pan {
    width: 100%;
    position: absolute;
    font-size: 15px;
    display: none;
    z-index: 999;
    top: 93px;
    background-color: black;
    
    &:hover {
      display: block;
    }
  }

  .layout {
    position: relative;
    height: 204px;
  }

  .menu_category {
    margin: 25px 0;
    transition: 0.2s ease-in-out;
    transform: translateY (-20px);
  }

  .menu_category .category {
    transition: 0.2s ease-in-out;
    transform: translateY (-20px);
  }

  .menu_category:nth-child(1) {
    position: absolute;
    left: 20.2%;
    transform: translate(-20.2%);
  }

  .menu_category:nth-child(2) {
    position: absolute;
    left: 30.1%;
    transform: translate(-30.1%);
  }

  .menu_category:nth-child(3) {
    position: absolute;
    left: 40.2%;
    transform: translate(-40.2%);
  }

  .menu_category:nth-child(4) {
    position: absolute;
    right: 38.7%;
    transform: translate(38.7%);
  }

  .menu_category:nth-child(5) {
    position: absolute;
    right: 26.2%;
    transform: translate(26.2%);
  }

  .caterogy:nth-child(1) {
    font-weight: bold;
  }

  .category {
    padding: 9px 0px;
    margin-right: 20px;
    cursor: pointer;
  }

  .title_category {
    padding-right: 20px;
    font-weight: bold;
    padding-bottom: 10px;
  }

  .category:hover {
    text-decoration: underline;
  }

  a {
    text-decoration: none;
    color: white;
  }
`;

const Button = styled.button`
  content: "";
  cursor: pointer;
  background-color: black;
  padding: 0;
  margin-left: 10px;
  border: 0;
`;

export default TopButtons;
