import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { USER_ID_FIND_REQUEST, USER_ID_FIND_RESET } from "../../reducer/R_user_login";

const FindIDModal = ({ setfindid }) => {
  const dispatch = useDispatch();

  // 모달창 스크롤 막는 useEffect
	useEffect(() => {
		document.body.style.cssText = `
			position: fixed; 
			top: -${window.scrollY}px;
			overflow-y: scroll;
			width: 100%;`;
		return () => {
			const scrollY = document.body.style.top;
			document.body.style.cssText = '';
			window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
		};
	}, []);

  // x버튼 클릭시 findid를 false로 해서 모달창을 닫음
  const closeModal = useCallback(()=> {
    setfindid(false);
  }, [setfindid]);

  // 이름과 이메일 변수
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
  });
  const { name, email } = inputs; 

  // 이름 또는 이메일 input 변경 시 변수값 변경하는 함수
  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  // 이름과 이메일 입력에 따른 아이디 찾기 버튼 활성화 함수
  const [isActive, setActive] = useState(true);

  // 이름과 이메일이 둘다 빈칸이 아닌경우 아이디 찾기 버튼이 활성화됨
  const ActiveIsPassed = () => {
    return name !== "" && email !== "" ? setActive(false) : setActive(true);
  };

  // enter키를 누르면 아이디 찾기가 실행되게 하는 함수
  const handleOnKeyPress = (e) => {
    if (e.key === "Enter" && !isActive) {
      IDfind();
    }
  };

  // 아이디 찾기 리덕스 상태 및 변수
  const { ID_FIND_data } = useSelector((state) => state.R_user_login);
  const [success, setsuccess] = useState(false);
  const [searchid, setsearchid] = useState('');

  // 아이디 찾기 누르면 실행되는 함수
	const IDfind = useCallback(() => {
		dispatch({
      type: USER_ID_FIND_REQUEST,
			data: {uname: name, uemail: email}
    });
	}, [dispatch, name, email]);

	// IDfind를 호출해서 ID_FIND_data의 상태가 변경이 됐을 때 유효성 검사를 해주는 useEffect
	useEffect(() => {
		if (ID_FIND_data === 'error') {
			alert('존재하지 않는 계정입니다.');
			dispatch({
				type: USER_ID_FIND_RESET
			});
      setsuccess(false);
      return;
    }

    if (ID_FIND_data !== '') {
      dispatch({
				type: USER_ID_FIND_RESET
			});
      setsuccess(true);
      setsearchid(ID_FIND_data.uid);
    }
	}, [dispatch, ID_FIND_data]);

  return (
    <>
      <Modal>
        <Layout>
          <div className="header_layout">
            <Title>
							아이디 찾기
						</Title>
            <Close onClick={closeModal}>
              <CloseOutlined style={{ fontSize: "25px", color: "white" }} />
            </Close>
          </div>
          <ModalContents>
            <div>
              이름 : 
              <Text1
              name="name"
              type="text"
              placeholder="이름"
              onChange={onChange}
              value={name}
              onKeyUp={ActiveIsPassed}
              onKeyPress={handleOnKeyPress}/>
            </div>
            <div>
              이메일 : 
              <Text2
              name="email"
              type="text"
              placeholder="이메일"
              onChange={onChange}
              value={email}
              onKeyUp={ActiveIsPassed}
              onKeyPress={handleOnKeyPress}/>
            </div>
            <CheckButton onClick={IDfind} disabled={isActive}>
              아이디 찾기
            </CheckButton>
            <ModalResult>
              {success ?
              <div>
                검색결과 &nbsp;: <strong>&nbsp;{searchid}</strong>
              </div> :
              <div>
                이름과 이메일을 입력해주세요.
              </div>}
            </ModalResult>
          </ModalContents>
        </Layout>
      </Modal>
    </>
  );
};

const Modal = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 10001; ///배경에 픽스를 주고 투명도를 준다.
`;

const Layout = styled.div`
  width: 480px;
  height: 340px;
  background-color: white;
  position: relative;
  box-sizing: border-box;
  margin: 50px auto;
  margin-top: 210px !important;
  padding: 20px;
  background: #fff; //로그인 배경이다

  .header_layout {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    background: #503396; // 로그인 윗쪽 배경
  }
`;

const Title = styled.h3`
  color: #fff;
  float: left;
  padding-left: 15px;
  padding-top: 10px;
  margin: 0;
`;

const Close = styled.button`
  background-color: #503396;
  float: right;
  margin-right: 10px;
  margin-top: 10px;
  padding: 0;
  border: 0;
  cursor: pointer;
`;

const ModalContents = styled.div`
  margin: 0 auto;
  width: 100%;
  padding: 50px 50px 20px 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: column;
  //padding 순서는 상우하좌
`;

const Text1 = styled.input`
  margin-top: 10px;
  margin-left: 26px;
  border-radius: 2px;
  width: 80%;
  height: 40px;
  border: 1px solid #e5e5e5;
  padding: 9px 12px;
  outline: none;
  box-sizing: border-box;
`;

const Text2 = styled.input`
  margin-top: 15px;
  margin-left: 10px;
  border-radius: 2px;
  width: 80%;
  height: 40px;
  border: 1px solid #e5e5e5;
  padding: 9px 12px;
  outline: none;
  box-sizing: border-box;
`;

const CheckButton = styled.button`
  position: relative;
  line-height: 19px;
  text-align: center;
  background-color: #503396;
  font-weight: 700;
  cursor: pointer;
  line-height: 48px;
  padding: 0 20px;
  margin-top: 20px;
  width: 100%;
  font-size: 16px;
  border-radius: 3px;
  display: inline-block;
  text-decoration: none;
  color: #fff;
  border: 0;
  height: 48px;

  &:disabled {
    background-color: #dddfe4 !important;
    cursor: default !important;
  }
`;

const ModalResult = styled.div`
  margin-top: 30px;
  font-size: 18px;
`;

export default FindIDModal;
