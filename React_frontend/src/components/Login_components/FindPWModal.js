import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { USER_PW_FIND_REQUEST, USER_PW_FIND_RESET, USER_PW_CHANGE_REQUEST } from "../../reducer/R_user_login";

const FindPWModal = ({ setfindpw }) => {
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

  // x버튼 클릭시 findpw를 false로 해서 모달창을 닫음
  const closeModal = useCallback(()=> {
    setfindpw(false);
    setsuccess(false);
  }, [setfindpw]);

  // 이름, 아이디, 이메일 변수
  const [inputs, setInputs] = useState({
    name: "",
		id : "",
    email: "",
  });
  const { name, id, email } = inputs; 

  // input값 변경 시 변수값 변경하는 함수
  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  // 이름, 아이디, 이메일 입력에 따른 비밀번호 찾기 버튼 활성화 함수
  const [isActive, setActive] = useState(true);

  // 이름, 아이디, 이메일이 빈칸이 아닌경우 비밀번호 찾기 버튼이 활성화됨
  const ActiveIsPassed = () => {
    return name !== "" && id !== "" && email !== "" ? setActive(false) : setActive(true);
  };

  // enter키를 누르면 비밀번호 찾기가 실행되게 하는 함수
  const handleOnKeyPress = (e) => {
    if (e.key === "Enter" && !isActive) {
      PWfind();
    }
  };

  // 비밀번호 찾기 리덕스 상태 및 변수
  const { PW_FIND_data } = useSelector((state) => state.R_user_login);
  const [success, setsuccess] = useState(false);
  const [searchid, setsearchid] = useState('');

  // 비밀번호 찾기 누르면 실행되는 함수
	const PWfind = useCallback(() => {

    // 테스트 계정 수정을 방지하는 예외처리
		for (var i = 1; i <= 1120; i++) {
			if (id === 'temp' + i) {
				alert('기존에 존재하는 테스트 계정은 회원정보 수정이 불가능합니다.');
				return;
			}
		}
		if (id === 'manager') {
			alert('기존에 존재하는 테스트 계정은 회원정보 수정이 불가능합니다.');
			return;
		}

		dispatch({
      type: USER_PW_FIND_REQUEST,
			data: {uname: name, uid: id, uemail: email}
    });
	}, [dispatch, name, id, email]);

	// PWfind를 호출해서 PW_FIND_data의 상태가 변경이 됐을 때 유효성 검사를 해주는 useEffect
	useEffect(() => {
		if (PW_FIND_data === 'error') {
			alert('존재하지 않는 계정입니다.');
			dispatch({
				type: USER_PW_FIND_RESET
			});
      setsuccess(false);
      return;
    }

    if (PW_FIND_data !== '') {
      alert('비밀번호 변경 화면으로 넘어갑니다.');
      dispatch({
				type: USER_PW_FIND_RESET
			});
      setsuccess(true);
      setsearchid(PW_FIND_data.uid);
    }
	}, [dispatch, PW_FIND_data]);

  // 새 비밀번호에 대한 변수
  const [inputpw, setInputpw] = useState({
    newpw: "",
    newpwconfirm: ""
  });
  const { newpw, newpwconfirm } = inputpw; 

  // 오류메시지 변수
	const [messages, setMessages] = useState({
    newpwMessage: '',
    newpwConfirmMessage: ''
  });
  const { newpwMessage, newpwConfirmMessage } = messages; 

  // 유효성검사 변수
	const [checks, setChecks] = useState({
		isnewPw: false,
		isnewPwConfirm: false
	});
	const { isnewPw, isnewPwConfirm } = checks; 

  // 비밀번호에 대한 input값 변경 시 변수값 변경하는 함수
  const onChangepw = (e) => {
    const { value, name } = e.target;
    setInputpw({
      ...inputpw,
      [name]: value
    });

    // 새 비밀번호가 변경될때 실행
		if (name === 'newpw') {
			const pwRegExp = /^(?=.*[a-zA-z])(?=.*[0-9]).{8,99}$/;

			// 새 비밀번호 확인이랑 새 비밀번호랑 같으면서 새 비밀번호 확인이 빈칸이 아닌경우
			if (value === newpwconfirm && newpwconfirm !== '') {
				if (!pwRegExp.test(value)) {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						newpwMessage: '영어와 숫자의 조합으로 8글자 이상 입력해주세요', // newpwMessage의 값 변경
						newpwConfirmMessage: '' // newpwConfirmMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isnewPw: false,	 // isnewPw 상태 변경
						isnewPwConfirm: true 	// isnewConfirmPw 상태 변경
					});
				}
				else {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						newpwMessage: '', // newpwMessage의 값 변경
						newpwConfirmMessage: '' // newpwConfirmMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isnewPw: true, 	// isnewPw 상태 변경
						isnewPwConfirm: true 	// isnewConfirmPw 상태 변경
					});
				}
			}

			// 새 비밀번호 확인이랑 새 비밀번호랑 다르면서 새 비밀번호 확인이 빈칸이 아닌 경우
			if (value !== newpwconfirm && newpwconfirm !== '') {
				if (!pwRegExp.test(value)) {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						newpwMessage: '영어와 숫자의 조합으로 8글자 이상 입력해주세요', // newpwMessage의 값 변경
						newpwConfirmMessage: '동일한 비밀번호를 입력해주세요' // newpwConfirmMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isnewPw: false,	 // isnewPw 상태 변경
						isnewPwConfirm: false 	// isnewConfirmPw 상태 변경
					});
				}
				else {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						newpwMessage: '', // newpwMessage의 값 변경
						newpwConfirmMessage: '동일한 비밀번호를 입력해주세요' // newpwConfirmMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isnewPw: true, 	// isnewPw 상태 변경
						isnewPwConfirm: false 	// isnewConfirmPw 상태 변경
					});
				}
			}

			// 새 비밀번호 확인이 빈칸인 경우
			if (newpwconfirm === '') {
				if (!pwRegExp.test(value)) {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						newpwMessage: '영어와 숫자의 조합으로 8글자 이상 입력해주세요', // newpwMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isnewPw: false,	 // isnewPw 상태 변경
					});
				}
				else {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						newpwMessage: '', // newpwMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isnewPw: true, 	// isnewPw 상태 변경
					});
				}
			}
		}

		// 새 비밀번호 확인이 변경될때 실행
		if (name === 'newpwconfirm') {
			if (value !== newpw) {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					newpwConfirmMessage: '동일한 비밀번호를 입력해주세요' // newpwConfirmMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isnewPwConfirm: false	 // isnewPwConfirm 상태 변경
				});
			}
			else {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					newpwConfirmMessage: '' // newpwConfirmMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isnewPwConfirm: true 	// isnewConfirmPw 상태 변경
				});
			}
		}
  };

  // 비밀번호 입력에 따른 비밀번호 변경 버튼 활성화 함수
  const [isActivepw, setActivepw] = useState(true);

  // 비밀번호에 대한 input이 빈칸이 아닌경우 비밀번호 변경 버튼이 활성화됨
  const ActiveIsPassedpw = () => {
    return newpw !== "" && newpwconfirm !== "" ? setActivepw(false) : setActivepw(true);
  };

  // enter키를 누르면 비밀번호 변경이 실행되게 하는 함수
  const handleOnKeyPresspw = (e) => {
    if (e.key === "Enter" && !isActivepw) {
      PWchange();
    }
  };

  // 비밀번호 변경 누르면 실행되는 함수
	const PWchange = useCallback(() => {
    // 유효성검사 후 백엔드 호출
		if (isnewPw && isnewPwConfirm) {
      dispatch({
        type: USER_PW_CHANGE_REQUEST,
        data: { uid : searchid, newPw: newpw }
      });
    }
    else {
      alert('입력 정보를 확인해주세요.');
    }
	}, [isnewPw, isnewPwConfirm, searchid, newpw, dispatch]);

  // 비밀번호 변경 확인 리덕스 상태
  const { PW_CHANGE_done } = useSelector((state) => state.R_user_login);
  const { PW_CHANGE_error } = useSelector((state) => state.R_user_login);

  // 비밀번호 변경을 감지하여 실행되는 useEffect
	useEffect(() => {
		if (PW_CHANGE_done) {
			alert('비밀번호가 변경되었습니다.');
			window.location.assign('/UserLogin');
    }

    if (PW_CHANGE_error) {
      alert('예기치 못한 오류가 발생하였습니다. (비밀번호 수정 실패)');
      window.location.assign('/UserLogin');
    }
	}, [PW_CHANGE_done, PW_CHANGE_error]);

  return (
    <>
      <Modal>
        <Layout>
          <div className="header_layout">
            <Title>
							비밀번호 찾기
						</Title>
            <Close onClick={closeModal}>
              <CloseOutlined style={{ fontSize: "25px", color: "white" }} />
            </Close>
          </div>
          <ModalContents>
            {!success ? <>
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
              아이디 :
              <Text2
              name="id"
              type="text"
              placeholder="아이디"
              onChange={onChange}
              value={id}
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
            <CheckButton onClick={PWfind} disabled={isActive}>
              비밀번호 찾기
            </CheckButton>
            <ModalResult>
              <div>
                이름, 아이디, 이메일을 입력해주세요.
              </div>
            </ModalResult></> : <>
            <div>
              <strong>
                새 비밀번호
              </strong>
              <Text3
              name="newpw"
              type="password"
              placeholder="새 비밀번호"
              onChange={onChangepw}
              value={newpw}
              onKeyUp={ActiveIsPassedpw}
              onKeyPress={handleOnKeyPresspw}/>
              <ErrorField>
                <ErrorText>
                  {newpwMessage}
                </ErrorText>
              </ErrorField>
            </div>
            <div>
              <strong>
                새 비밀번호 확인
              </strong>
              <Text3
              name="newpwconfirm"
              type="password"
              placeholder="새 비밀번호 확인"
              onChange={onChangepw}
              value={newpwconfirm}
              onKeyUp={ActiveIsPassedpw}
              onKeyPress={handleOnKeyPresspw}/>
              <ErrorField>
                <ErrorText>
                  {newpwConfirmMessage}
                </ErrorText>
              </ErrorField>
            </div>
            <CheckButton onClick={PWchange} disabled={isActivepw}>
              비밀번호 변경
            </CheckButton>
          </>}
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
  height: 385px;
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

const Text3 = styled.input`
  margin-top: 12px;
  border-radius: 2px;
  width: 100%;
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

const ErrorField = styled.div`
	box-sizing: border-box;
	margin-top: 5px;
  margin-bottom: 15px;
`;

const ErrorText = styled.p`
	font-size: 13px;
	font-weight: bold;
	color: rgb(240, 63, 64);
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	margin-left: 5px;
`;

export default FindPWModal;
