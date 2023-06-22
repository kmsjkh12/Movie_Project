/*
 23-01-19 로그인 구현(오병주)
 23-01-25 페이지 이동 구현(오병주)
*/
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { USER_LOGIN_REQUEST, USER_LOGIN_RESET } from "../../reducer/R_user_login";
import { TICKET_PAGE_SETTING } from "../../reducer/R_ticket";
import { useLocation, Link, useNavigate } from "react-router-dom";
import LoginLoading from "./LoginLoading";
import FindIDModal from "./FindIDModal";
import FindPWModal from "./FindPWModal";

const LoginForm = () => {
  // useDispatch를 dispatch로 선언
  const dispatch = useDispatch();

  // 페이지 이동을 위해 선언
  const location = useLocation();
  const navigate = useNavigate();

  //input창 두개 관리를 위해 만든것
  const [inputs, setInputs] = useState({
    id: "",
    pw: "",
  });

  // 비구조화 할당을 통해 값 추출
  const { id, pw } = inputs;

  const onChange = (e) => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value, // name 키를 가진 값을 value 로 설정
    });
  };

  // id, pw 입력에 따른 로그인 버튼 활성화 함수
  const [isActive, setActive] = useState(true);

  // id, pw 입력마다 실행되는 함수 (id, pw 둘다 빈칸이 아닌경우 로그인 버튼이 활성화됨)
  const ActiveIsPassedLogin = () => {
    return id !== "" && pw !== "" ? setActive(false) : setActive(true);
  };

  // 체크박스 체크 유무 확인(로그인 상태 유지)
  const [check, setcheck] = useState(false);
  const [check_type, setcheck_type] = useState("");

  // 체크박스 상태 변경
  const Clickcheck = (check) => {
    setcheck(!check);
  };

  // 로그인 유지하기 체크박스를 변경 할때 마다 check_type 변수의 내용을 변경
  useEffect(() => {
    if (check === true) {
      setcheck_type("유지");
    } else {
      setcheck_type("");
    }
  }, [check]);

  // 로그인 상태확인용 리덕스 상태
  const { LOGIN_data } = useSelector((state) => state.R_user_login);
  const { LOGIN_loading } = useSelector((state) => state.R_user_login);
	const { LOGIN_done } = useSelector((state) => state.R_user_login);

  // enter키를 누르면 로그인이 실행되게 하는 함수
  const handleOnKeyPress = (e) => {
    if (e.key === "Enter" && !isActive) {
      submit();
    }
  };

  // 로그인 버튼 누를 때 적용되는 함수
  const submit = useCallback(() => {
    const datas = {
      uid: id,
      upw: pw,
      // 로그인 유지 버튼 유뮤를 uname 변수에 넣어서 보냄
      uname: check_type,
    };
    dispatch({
      type: USER_LOGIN_REQUEST,
      data: datas,
    });
  }, [id, pw, check_type,  dispatch]);

  // 로그인의 성공 여부를 알리는 useEffect
  useEffect(() => {
    if (LOGIN_data.uname === "error!!") {
      alert("존재하지 않는 회원입니다.");
      dispatch({ type: USER_LOGIN_RESET });
      return;
    }
    // 로그인에 성공했을 경우 메인페이지 또는 이전 페이지로 넘어가게 함
    if (LOGIN_data.uname !== '' && LOGIN_data.uname !== "error!!" && LOGIN_done) {
      if (location.state === null || location.state.url === "/UserJoin" || location.state.url === "/UserLogin") {
				navigate(`/`);
      }
			else {
				navigate(location.state.url, {state: {url: '/UserLogin'}});
			}
			dispatch({ type: USER_LOGIN_RESET });
    }
  }, [LOGIN_data, location.state, LOGIN_done, navigate, dispatch]);

  // 아이디 찾기 및 비밀번호 찾기 모달 상태관리
  const [findid, setfindid] = useState(false);
  const [findpw, setfindpw] = useState(false);

	// 예매 페이지에서 로그인하러 왔을경우 선택한 예매정보를 세팅해주는 useEffect
	useEffect(()=> {
		if (location.state && location.state.url === "/Reserve" && location.state.MOVIEINFO) {
			dispatch({
				type: TICKET_PAGE_SETTING,
				data: {
					movie: location.state.MOVIE,
					theater: location.state.THEATER,
					area: location.state.AREA,
					day: location.state.DAY,
					movieinfo: location.state.MOVIEINFO,
					reserve: location.state.RESERVE_SORT,
					like: location.state.LIKE_SORT
				}
			});
		}
	}, [location, dispatch]);

  return (
    <>
      {LOGIN_loading ? <LoginLoading /> : null}
      <Layout>
        <Title>
					회원 로그인
				</Title>
        <Form>
          <CheckText></CheckText>
          <LoginId
            name="id"
            type="text"
            placeholder="아이디"
            onChange={onChange}
            value={id}
            onKeyUp={ActiveIsPassedLogin}
            onKeyPress={handleOnKeyPress}
          ></LoginId>
          <LoginPw
            name="pw"
            type="password"
            placeholder="비밀번호"
            onChange={onChange}
            value={pw}
            onKeyUp={ActiveIsPassedLogin}
            onKeyPress={handleOnKeyPress}
          ></LoginPw>
          <LoginMid>
            <label className="autoLogin" htmlFor="hint">
              {" "}
              <input
                type="checkbox"
                id="hint"
                value={check}
                onClick={() => Clickcheck(check)}
              />{" "}
              로그인 유지하기
            </label>
          </LoginMid>
          <LoginButton onClick={submit} disabled={isActive}>
            로그인
          </LoginButton>
          <Links>
            <Link to="/UserJoin">
              회원가입
            </Link>
            {findid && <FindIDModal setfindid={setfindid}/>}
            <button className="findbutton" onClick={()=> setfindid(true)}>
              아이디 찾기
            </button>
            {findpw && <FindPWModal setfindpw={setfindpw}/>}
            <button className="findbutton" onClick={()=> setfindpw(true)}>
              비밀번호 찾기
            </button>
          </Links>
        </Form>
      </Layout>
    </>
  );
};

const Layout = styled.div`
  width: 100%;
  margin-top: 5rem;
  margin-bottom: 7px;
  background-color: #fff;
`;

const Title = styled.div`
  margin-bottom: 30px;
  font-size: 28px;
  line-height: 35px;
  font-weight: 550;
  text-align: center;
  letter-spacing: -1px;
  color: rgb(51, 51, 51);
`;

const Form = styled.div`
  width: 640px;
  margin: 0px auto;
`;

const CheckText = styled.div`
  position: inline-block;
  padding-bottom: 10px;
  border-bottom: 2px solid rgb(51, 51, 51);
  font-size: 13px;
  color: rgb(102, 102, 102);
  line-height: 17px;
  width: 70%;
  margin: auto;
  display: block;
`;

const LoginId = styled.input`
  margin-top: 40px !important;
  border-radius: 2px;
  width: 60%;
  height: 50px;
  border: 1px solid #e5e5e5;
  padding: 9px 12px;
  outline: none;
  box-sizing: border-box;
  margin: auto;
  display: block;
  font-size: 14px;
`;

const LoginPw = styled.input`
  margin-top: 20px !important;
  border-radius: 2px;
  height: 50px;
  border: 1px solid #e5e5e5;
  padding: 9px 12px;
  outline: none;
  box-sizing: border-box;
  margin: auto;
  display: block;
  width: 60%;
  font-size: 14px;
`;

const LoginMid = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-left: 128px;

  .autoLogin {
    font-size: 14px;
    color: #8d8d8d;
    line-height: 3;
    cursor: pointer;
  }

  .btn {
    font-size: 14px;
    color: #8d8d8d;
    line-height: 3;
    cursor: pointer;
    border: none;
    background-color: white;
  }
`;

const LoginButton = styled.button`
  position: relative;
  line-height: 19px;
  text-align: center;
  background-color: #503396;
  font-weight: 700;
  cursor: pointer;
  line-height: 48px;
  padding: 0 20px;
  margin-top: 20px !important;
  width: 60%;
  font-size: 16px;
  border-radius: 3px;
  display: inline-block;
  text-decoration: none;
  color: #fff;
  border: 0;
  height: 10%;
  margin: auto;
  display: block;

  &:disabled {
    background-color: #dddfe4 !important;
    cursor: default !important;
  }
`;

const Links = styled.div`
  padding: 20px 0 30px 0;
  text-align: center;
  line-height: 1.1;
  margin-top: 10px;
  margin-bottom: 60px;
  margin-left: 10px;

  a {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    margin: 0 0 0 0px;
    padding: 0;
    font-size: 0.9333em;
    color: #666;
    text-decoration: none;
  }

  .findbutton {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    margin: 0 0 1px 27px;
    padding: 0;
    font-size: 0.9333em;
    color: #666;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
  }

  .findbutton:before {
    content: "";
    display: block;
    position: absolute;
    left: -13px;
    top: 50%;
    width: 1px;
    height: 16px;
    margin-top: -8px;
    background-color: #7e7e7e;
    pointer-events: none;
  }
`;

export default LoginForm;
