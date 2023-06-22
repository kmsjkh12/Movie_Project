/*
 23-03-13 마이페이지 css 구축(오병주)
 23-03-14 비밀번호 확인 구현(오병주)
*/
import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { USER_PW_CHECK_REQUEST, USER_PW_CHECK_RESET } from '../../reducer/R_user_login';
import InfoModify from './InfoModify';

const InfoCheck = () => {
	const dispatch = useDispatch();

	// 로그인 리덕스 상태 및 비밀번호 비교 상태
  const { LOGIN_data } = useSelector((state) => state.R_user_login);
	const { PW_data } = useSelector((state) => state.R_user_login);

	// 비밀번호 입력칸 변수
	const [pw, setpw] = useState('');

	// 비밀번호 input값 변경 감지 함수
	const ChangePw = (e) => {
    setpw(e.target.value);
  };

	// 비밀번호 재확인 상태 변수
	const [pwcheck, setpwcheck] = useState(false);

	// enter키를 누르면 확인 버튼이 눌러지게 하는 함수
  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onCheck();
    }
  };

	// 확인 버튼을 누를 때 함수
	const onCheck = useCallback(() => {
		// 테스트 계정 수정을 방지하는 예외처리
		for (var i = 1; i <= 1120; i++) {
			if (LOGIN_data.uid === 'temp' + i) {
				alert('기존에 존재하는 테스트 계정은 회원정보 수정이 불가능합니다.');
				return;
			}
		}
		if (LOGIN_data.uid === 'manager') {
			alert('기존에 존재하는 테스트 계정은 회원정보 수정이 불가능합니다.');
			return;
		}
		
		if (pw === '') {
			alert('비밀번호를 입력해주세요.');
			return;
		}

		dispatch({
			type: USER_PW_CHECK_REQUEST,
			data: pw
		});
		
	}, [pw, LOGIN_data.uid, dispatch]);

	// 비밀번호 재확인의 성공 여부를 알리는 useEffect
	useEffect(()=> {
		// 비밀번호가 일치하는 경우
		if (PW_data === 204) {
			// 다음 컴포넌트 화면을 위해 변수를 true로 바꾸고 상태를 리셋
			setpwcheck(true);
			dispatch({
				type: USER_PW_CHECK_RESET
			});
		}

		// 비밀번호가 일치하지 않는 경우
		if (PW_data === 400 || PW_data === 500) {
			alert('비밀번호가 일치하지 않습니다.');
			// 상태를 리셋
			dispatch({
				type: USER_PW_CHECK_RESET
			});
		}
	}, [PW_data, setpwcheck, dispatch]);
	
	return (
		<Content>
			<ContentTitle>
				<ContentLeft>
					<h2>
						회원정보 수정
					</h2>
				</ContentLeft>
				{pwcheck ? 
				<CheckText>
					<CheckStar style={{marginRight: "5px"}}>
						*	
					</CheckStar>
					모든 정보는 필수입력입니다
				</CheckText>
				: null}
			</ContentTitle>
			{pwcheck ? <InfoModify/> :
			<ContentDetails>
				<h4>
					비밀번호 재확인
				</h4>
				<p>
					정보를 안전하게 보호하기 위해 비밀번호를 한번 더 입력해주세요.
						<div>
							(기존에 존재하는 테스트계정은 회원정보 수정 및 삭제가 불가능합니다!)
						</div>
				</p>
				<ContentDetail>
					<Inputs>
						<InfoTextForm>
							<InfoLeft>
								<label>
									아이디
								</label>
							</InfoLeft>
							<CenterField>
								<InfoCenter>
									<InputText type="text" value={LOGIN_data.uid === 'No_login' ? '' : LOGIN_data.uid} disabled={true}>
									</InputText>
								</InfoCenter>
							</CenterField>
						</InfoTextForm>
						<InfoTextForm>
							<InfoLeft>
								<label>
									비밀번호
								</label>
								<CheckStar>
								*
								</CheckStar>
							</InfoLeft>
							<CenterField>
								<InfoCenter>
									<InputText type="password" placeholder='비밀번호를 입력해주세요' value={pw} onChange={ChangePw} onKeyPress={handleOnKeyPress} >
									</InputText>
								</InfoCenter>
							</CenterField>
						</InfoTextForm>
					</Inputs>
					<ButtonWrap>
						<Button onClick={onCheck}>
							<span>
								확인
							</span>
						</Button>
					</ButtonWrap>
				</ContentDetail>
			</ContentDetails> }
		</Content>
	);
};

const Content = styled.div`
	width: 820px;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
`;

const ContentTitle = styled.div`
	display: flex;
	position: relative;
	flex-direction: row;
	width: 100%;
	padding-bottom: 20px;
	-webkit-box-pack: justify;
	justify-content: space-between;
`;

const ContentLeft = styled.div`
	display: flex;
	flex-direction: row;
	-webkit-box-align: center;
	align-items: center;

	h2 {
		font-weight: 500;
    font-size: 24px;
    color: rgb(51, 51, 51);
    letter-spacing: -0.5px;
    line-height: 48px;
		margin: 0;
	}
`;

const CheckText = styled.div`
	position: absolute;
	right: 2px;
	bottom: 0;
	padding-bottom: 8px;
	font-size: 13px;
	color: rgb(102, 102, 102);
	line-height: 17px;
`;

const ContentDetails = styled.div`
	position: relative;
	min-height : 405px;
	width: 820px;
	margin: 0 auto;

	h4 {
		padding-bottom: 8px;
    font-weight: 400;
    font-size: 18px;
		margin: 0;
		box-sizing: border-box;
	}

	p {
		padding-bottom: 20px;
    font-size: 12px;
    line-height: 1.5;
    color: rgb(102, 102, 102);
		margin: 0;
	}
`;

const ContentDetail = styled.div`
	box-sizing: border-box;
	margin: 0;
	padding: 0;
`;

const Inputs = styled.div`
	padding: 7px 60px 7px 120px;
	border-top: 2px solid rgb(51, 51, 51);
	border-bottom: 1px solid rgb(221, 221, 221);
	box-sizing: border-box;
	margin: 0;
`;


const InfoTextForm = styled.div`
	display: inline-flex;
	width: 100%;
	padding: 10px 20px;
`;

const InfoLeft = styled.div`
	width: 139px;
	padding-top: 12px;

	label{
		font-weight: 500;
    color: rgb(51, 51, 51);
    line-height: 20px;
		font-size: 15px;
	}
`;

const CheckStar = styled.span`
	color: rgb(238, 106, 123);
	margin-left: 2px;
`;

const CenterField = styled.div`
	flex: 1 1 0%;
	box-sizing: border-box;
  margin: 0;
`;

const InfoCenter = styled.div`
	padding-bottom: 0px;
	position: relative;
	height: 48px;
`;

const InputText = styled.input`
	width: 340px;
	height: 46px;
	padding: 2px 11px 1px 15px;
	border-radius: 4px;
	border: 1px solid rgb(221, 221, 221);
	font-weight: 400;
	font-size: 16px;
	line-height: 1.5;
	color: rgb(51, 51, 51);
	outline: none;
	box-sizing: border-box;

	:disabled {
  	border-color: rgb(221, 221, 221);
    color: black;
	}
`;

const ButtonWrap = styled.div`
	display: flex;
	-webkit-box-pack: center;
	justify-content: center;
	margin-top: 37px;
`;

const Button = styled.button`
	display: block;
	padding: 0px 10px;
	text-align: center;
	overflow: hidden;
	width: 240px;
	height: 56px;
	border-radius: 3px;
	color: rgb(255, 255, 255);
	background-color: rgb(95, 0, 128);
	border: 0px none;
	cursor: pointer;

	span {
		display: inline-block;
    font-size: 16px;
    font-weight: 500;
		box-sizing: border-box;
    margin: 0;
		padding: 0;
	}
`;

export default InfoCheck;