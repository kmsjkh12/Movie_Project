/*eslint-disable*/
/*
 23-03-13 마이페이지 css 구축(오병주)
 23-03-15 회원정보 수정 구축(오병주)
 23-03-16 회원탈퇴 구축(오병주)
*/
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import Post from '../Login_components/Post';
import { USER_UPDATE_REQUEST, USER_UPDATE_RESET, USER_DROP_REQUEST, USER_EMAIL_REQUEST, USER_EMAIL_RESET } from '../../reducer/R_user_join';
import { useLocation } from 'react-router-dom';

const InfoModify = () => {
	// 주소검색 팝업창 관리
	const [popup, setpopup] = useState(false);

	// 주소 관리를 위한 변수
	const [M_address, setM_address] = useState('');

	// 팝업창에서 주소 선택시 기본주소 Input에 주소 값 넣어주는 것
	const InsertAddress = (value) => {
		setM_address(value);

		// 상세주소는 초기화
		setInputs({
			...inputs,
			S_address: '',
		});

		setChecks({
			...checks,	// 기존의 check 객체를 복사한 뒤
			isM_Address: true, 	// 기본 주소 상태 변경
			isS_Address: false // 상세 주소 상태 변경
		});
	}

	// 사용자가 입력하는 input 관리
	const [inputs, setInputs] = useState({
		pw: '',
		newpw: '',
		newpwConfirm: '',
    name: '',
		email: '',
		phone1: '',
		phone2: '',
		S_address: '',
		year: '',
		month: '',
		day: '',
  });

	const {
		pw,
		newpw, 
		newpwConfirm, 
		name, 
		email, 
		phone1, 
		phone2,
		S_address, 
		year, 
		month, 
		day } = inputs;	// 비구조화 할당을 통해 값 추출

	// 오류메시지 상태저장
	const [messages, setMessages] = useState({
		newpwMessage: '',
		newpwConfirmMessage: '',
		nameMessage: '',
		emailMessage: '',
		phoneMessage: '',
		birthMessage: ''
	});

	const {newpwMessage,
				 newpwConfirmMessage, 
				 nameMessage, 
				 emailMessage, 
				 phoneMessage,
				 birthMessage} = messages; // 비구조화 할당을 통해 값 추출

	// 유효성검사 상태저장
	const [checks, setChecks] = useState({
		isPw: false,
		isNewPw: false,
		isNewPwConfirm: false,
		isName: true,
		isEmail: true,
		isPhone1: true,
		isPhone2: true,
		isM_Address: true,
		isS_Address: true,
		isYear: true,
		isMonth: true,
		isDay: true
	});

	const {
				isPw,
				isNewPw, 
				isNewPwConfirm, 
				isName, 
				isEmail, 
				isPhone1, 
				isPhone2,
				isM_Address,
				isS_Address,
				isYear,
				isMonth,
				isDay} = checks; // 비구조화 할당을 통해 값 추출

	// Input 내용이 바뀔때 실행되는 함수
	const ChangeInput = (e) => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출

    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value // name 키를 가진 값을 value 로 설정
    });

		// 모든 if문은 value 기준으로 해야 바로바로 체크됨 id, pw 이런 변수 사용 x

		// 현재 비밀번호가 변경될때 실행
		if (name === 'pw') {
			// 현재 비밀번호와 새 비밀번호가 같은 경우
			if (value === newpw) {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					newpwMessage: '현재 비밀번호와 다르게 입력해주십시오', // newpwMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isNewPw: false, 	// isNewPw 상태 변경
				});
			}
			// 비밀번호가 서로 다른경우
			else {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					newpwMessage: '', // newpwMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isNewPw: true, 	// isNewPw 상태 변경
					isPw: true			// isPw 상태변경
				});
			}
		}

		// 새 비밀번호가 변경될때 실행
		if (name === 'newpw') {
			const pwRegExp = /^(?=.*[a-zA-z])(?=.*[0-9]).{8,99}$/; 

			// 새 비밀번호 확인이랑 새 비밀번호랑 같으면서 새 비밀번호 확인이 빈칸이 아닌경우
			if (value === newpwConfirm && newpwConfirm !== '') {
				if (!pwRegExp.test(value)) {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						newpwMessage: '영어와 숫자의 조합으로 8글자 이상 입력해주세요', // newpwMessage의 값 변경
						newpwConfirmMessage: '' // newpwConfirmMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isNewPw: false,	 // isNewPw 상태 변경
						isNewPwConfirm: true 	// isNewPwConfirm 상태 변경
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
						isNewPw: true, 	// isNewPw 상태 변경
						isNewPwConfirm: true 	// isNewPwConfirm 상태 변경
					});
				}
			}

			// 새 비밀번호 확인이랑 새 비밀번호랑 다르면서 새 비밀번호 확인이 빈칸이 아닌 경우
			if (value !== newpwConfirm && newpwConfirm !== '') {
				if (!pwRegExp.test(value)) {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						newpwMessage: '영어와 숫자의 조합으로 8글자 이상 입력해주세요', // newpwMessage의 값 변경
						newpwConfirmMessage: '동일한 비밀번호를 입력해주세요' // newpwConfirmMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isNewPw: false,	 // isNewPw 상태 변경
						isNewPwConfirm: false 	// isNewPwConfirm 상태 변경
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
						isNewPw: true, 	// isNewPw 상태 변경
						isNewPwConfirm: false 	// isNewPwConfirm 상태 변경
					});
				}
			}

			// 새 비밀번호 확인이 빈칸인 경우
			if (newpwConfirm === '') {
				if (!pwRegExp.test(value)) {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						newpwMessage: '영어와 숫자의 조합으로 8글자 이상 입력해주세요', // newpwMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isNewPw: false,	 // isNewPw 상태 변경
					});
				}
				else {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						newpwMessage: '', // newpwMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isNewPw: true, 	// isNewPw 상태 변경
					});
				}
			}

			// 현재 비밀번호와 새 비밀번호가 같으면서 새 비밀번호의 길이가 7자리를 초과할경우
			if (value === pw && value.length > 7) {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					newpwMessage: '현재 비밀번호와 다르게 입력해주십시오', // newpwMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isNewPw: false, 	// isNewPw 상태 변경
				});
			}
		}

		// 새 비밀번호 확인이 변경될때 실행
		if (name === 'newpwConfirm') {
			if (value !== newpw) {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					newpwConfirmMessage: '동일한 비밀번호를 입력해주세요' // newpwConfirmMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isNewPwConfirm: false	 // isNewPwConfirm 상태 변경
				});
			}
			else {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					newpwConfirmMessage: '' // newpwConfirmMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isNewPwConfirm: true 	// isNewConfirmPw 상태 변경
				});
			}
		}

		// 이름이 변경될때 실행
		if (name === 'name') {
			if (value.length < 2 || value.length > 5) {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					nameMessage: '이름의 형식이 올바르지 않습니다' // nameMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isName: false	 // isName 상태 변경
				});
			}
			else {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					nameMessage: '' // nameMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isName: true 	// isName 상태 변경
				});
			}
		}

		// email이 변경될 때 실행
		if (name === 'email') {
			const emailRegExp = /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

			if (!emailRegExp.test(value)) {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					emailMessage: '이메일 형식으로 입력해주세요' // emailMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isEmail: false	 // isEmail 상태 변경
				});
				setemailButton(true);
			}
			else {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					emailMessage: '' // emailMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isEmail: true 	// isEmail 상태 변경
				});
				setemailButton(false);
			}
		}

		// 휴대폰 가운데 번호가 수정될 때 실행
		if (name === 'phone1') {
			// 특수문자등이 입력됐을경우 없애주기 위한 변수
			const result = value.replace(/\D/g, '');

			// 숫자만 입력되게 하기 위해서 setInputs를 다시해줌
			setInputs({
				...inputs, // 기존의 input 객체를 복사한 뒤
				[name]: result // name 키를 가진 값을 value 로 설정
			});

			// 입력된 숫자 확인
			if (result.length < 4) {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					phoneMessage: '휴대전화 번호를 확인해주세요' // phoneMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isPhone1: false	 // isPhone1 상태 변경
				});
			}
			else {
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isPhone1: true	 // isPhone1 상태 변경
				});
				if (isPhone2) {		// 만약에 마지막 번호가 있을경우
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						phoneMessage: '' // phoneMessage의 값 변경
					});
				}
			}
		}

		// 휴대폰 마지막 번호가 수정될 때 실행
		if (name === 'phone2') {
			// 특수문자등이 입력됐을경우 없애주기 위한 변수
			const result = value.replace(/\D/g, '');

			// 숫자만 입력되게 하기 위해서 setInputs를 다시해줌
			setInputs({
				...inputs, // 기존의 input 객체를 복사한 뒤
				[name]: result // name 키를 가진 값을 value 로 설정
			});

			// 입력된 숫자 확인
			if (result.length < 4) {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					phoneMessage: '휴대전화 번호를 확인해주세요' // phoneMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isPhone2: false	 // isPhone2 상태 변경
				});
			}
			else {
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isPhone2: true	 // isPhone2 상태 변경
				});
				if (isPhone1) {		// 만약에 중간번호가 있을경우
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						phoneMessage: '' // phoneMessage의 값 변경
					});
				}
			}
		}

		// 상세주소가 변경될때 실행
		if (name === 'S_address') {
			if (value.length < 1) {
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isS_Address: false	 // isS_Address 상태 변경
				});
			}
			else {
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isS_Address: true 	// isS_Address 상태 변경
				});
			}
		}

		// 생일년도를 입력할 경우
		if (name === 'year') {
			// 특수문자등이 입력됐을경우 없애주기 위한 변수
			const result = value.replace(/\D/g, '');

			// 숫자만 입력되게 하기 위해서 setInputs를 다시해줌
			setInputs({
				...inputs, // 기존의 input 객체를 복사한 뒤
				[name]: result // name 키를 가진 값을 value 로 설정
			});

			// 입력된 숫자 확인
			if (result.length < 4) {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					birthMessage: '생년월일을 확인해주세요' // birthMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isYear: false	 // isYear 상태 변경
				});
			}
			else {
				if (result > 1940 && result < 2009) {
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isYear: true	 // isYear 상태 변경
					});
					if (isMonth && isDay) {	// 만약에 다른 생년월일이 채워졌을경우
						setMessages({
							...messages, // 기존의 message 객체를 복사한 뒤
							birthMessage: '' // birthMessage의 값 변경
						});
					}
				}
				if (result > 2008) {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						birthMessage: '16세 이상부터 가입이 가능합니다' // birthMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isYear: false	 // isYear 상태 변경
					});
				}
			}
		}

		// 생일달을 입력할 경우
		if (name === 'month') {
			// 특수문자등이 입력됐을경우 없애주기 위한 변수
			const result = value.replace(/\D/g, '');

			// 숫자만 입력되게 하기 위해서 setInputs를 다시해줌
			setInputs({
				...inputs, // 기존의 input 객체를 복사한 뒤
				[name]: result // name 키를 가진 값을 value 로 설정
			});
			setMessages({
				...messages, // 기존의 message 객체를 복사한 뒤
				birthMessage: '생년월일을 확인해주세요' // birthMessage의 값 변경
			});
			setChecks({
				...checks,	// 기존의 check 객체를 복사한 뒤
				isMonth: false	 // isMonth 상태 변경
			});

			if (result < 13 && result > 0) {
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isMonth: true	 // isMonth 상태 변경
				});
				if (isYear && isDay) {		// 만약에 다른 생년월일이 채워졌을경우
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						birthMessage: '' // birthMessage의 값 변경
					});
				}
			}
		}

		// 생일 Day를 입력할 경우
		if (name === 'day') {
			// 특수문자등이 입력됐을경우 없애주기 위한 변수
			const result = value.replace(/\D/g, '');

			// 숫자만 입력되게 하기 위해서 setInputs를 다시해줌
			setInputs({
				...inputs, // 기존의 input 객체를 복사한 뒤
				[name]: result // name 키를 가진 값을 value 로 설정
			});

			setMessages({
				...messages, // 기존의 message 객체를 복사한 뒤
				birthMessage: '생년월일을 확인해주세요' // birthMessage의 값 변경
			});
			setChecks({
				...checks,	// 기존의 check 객체를 복사한 뒤
				isDay: false	 // isDay 상태 변경
			});

			if (result < 32 && result > 0) {
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isDay: true	 // isDay 상태 변경
				});
				if (isYear && isMonth) {		// 만약에 다른 생년월일이 채워졌을경우
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						birthMessage: '' // birthMessage의 값 변경
					});
				}
			}
		}
	};

	// 처음에 렌더링 될때 사용자의 정보를 채워주는 useEffect (의존성 배열을 비워둬서 한번만 실행됨)
	useEffect(()=> {
		setM_address(LOGIN_data.uaddr);
		setInputs({
			...inputs,
			id: LOGIN_data.uid,
			name: LOGIN_data.uname,
			email: LOGIN_data.uemail,
			phone1: LOGIN_data.utel.substring(3, 7),
			phone2: LOGIN_data.utel.substring(7, 11),
			S_address: LOGIN_data.uaddrsecond,
			year: LOGIN_data.ubirth.substring(0, 4),
			month: LOGIN_data.ubirth.substring(5, 7),
			day: LOGIN_data.ubirth.substring(8, 10)
		});
	}, [])
	
	const dispatch = useDispatch();
	const location = useLocation();

	// 로그인 리덕스 상태
  const { LOGIN_data } = useSelector((state) => state.R_user_login);

	// Email 중복을 확인하기 위한 변수 및 리덕스 상태
	const { EMAIL_status } = useSelector((state) => state.R_user_join);
	const [emailchange, setemailchange] = useState(true);
	const [emailButton, setemailButton] = useState(false);
	const [emailText, setemailText] = useState(true);

	// 회원정보 수정 상태를 확인하기 위한 리덕스 상태
	const { UPDATE_status } = useSelector((state) => state.R_user_join);

	// 회원탈퇴 상태를 확인하기 위한 리덕스 상태
	const { DROP_status } = useSelector((state) => state.R_user_join);

	// 이메일변경 버튼을 누를때 실행되는 함수
	const emailTextOn = useCallback(()=> {
		if(!window.confirm('이메일을 변경하시겠습니까?')) {
			return;
		}
		setemailchange(false);
		setemailText(false);
		setInputs(inputs => ({
			...inputs,
			email: ''
		}));
		setChecks(checks => ({
			...checks,
			isEmail: false
		}));
	}, [])

	// 이메일 중복확인 누르면 실행되는 함수
	const Emailcheck = useCallback(() => {
		if (email === LOGIN_data.uemail) {
			alert('현재 사용자가 사용중인 이메일입니다.');
			return;
		}

		if (email === '') {
			alert('이메일을 입력해주세요.');
			return;
		}

		dispatch({
      type: USER_EMAIL_REQUEST,
			data: email
    });
	}, [dispatch, email, LOGIN_data.uemail]);

	// Emailcheck를 호출해서 EMAIL_status의 상태가 변경이 됐을 때 유효성 검사를 해주는 useEffect
	useEffect(() => {
		if (EMAIL_status === 204) {
			alert("사용 가능한 이메일입니다.");
			dispatch({
				type: USER_EMAIL_RESET
			});
			setemailButton(true);
			setemailText(true);
		}
		if (EMAIL_status === 400) {
			alert("이미 사용중인 이메일입니다.");
			dispatch({
				type: USER_EMAIL_RESET
			});
		}
	}, [dispatch, EMAIL_status]);

	// 회원정보 수정을 누를 시 실행되는 함수
	const memberUpdate = () => {

		if (!window.confirm("회원 정보를 수정하시겠습니까?")) {
      return;
    };

		var res_month = month;
		var res_day = day;

		// 생일의 달을 한자리로 입력했을경우 바꿔줌
		if (month.length === 1) {
			res_month = "0"+res_month;
		}

		// 생일의 일을 한자리로 입력했을경우 바꿔줌
		if (day.length === 1) {
			res_day = "0"+res_day;
		}

		const datas = {
			uid: LOGIN_data.uid,
			upw: pw,
			uname: name,
			uemail: email,
			utel: "010"+phone1+phone2,
			uaddr: M_address,
			uaddrsecond: S_address,
			ubirth: year+"-"+res_month+"-"+res_day,
			newPw: newpw
		};
		
		// 입력이 전부 되어있을 경우
		if (isPw && isNewPw && isNewPwConfirm && isName && isEmail && emailText && 
			isPhone1 && isPhone2 && isM_Address && isS_Address &&isYear && isMonth && isDay) {
			dispatch({
				type: USER_UPDATE_REQUEST,
				data: datas
			});
		}
		else {
			alert("모든 정보입력 및 확인을 해주십시오.");
		}
	};

	// UPDATE_status의 상태가 변경 됐을 때 회원정보 수정 성공 여부를 알려주는 useEffect
	useEffect(() => {
		if (UPDATE_status === 204) {
			alert('회원정보 수정이 완료 되었습니다.');
			window.location.replace(location.pathname);
		}

		if (UPDATE_status === 400) {
			alert('현재 비밀번호가 일치하지 않습니다.');
			dispatch({
				type: USER_UPDATE_RESET
			});
		}

		if (UPDATE_status === 500) {
			alert('예기치 못한 오류가 발생하였습니다.');
			window.location.assign('/Mypage/Modify');
		}

	}, [UPDATE_status, location.pathname, dispatch])

	// 회원탈퇴를 누를 시 실행되는 함수
	const memberDrop = useCallback(() => {
		
		if (!window.confirm("회원을 탈퇴하시겠습니까?\n(모든 정보는 사라지고 복구되지 않습니다.)")) {
      return;
    };
	
		dispatch({
			type: USER_DROP_REQUEST,
		});
		
	}, [dispatch]);

	// DROP_status의 상태가 변경 됐을 때 회원탈퇴 성공 여부를 알려주는 useEffect
	useEffect(() => {
		if (DROP_status === 204) {
			alert('회원탈퇴가 완료 되었습니다.');
			window.location.assign('/');
			return;
		}

		if (DROP_status !== '') {
			alert('예기치 못한 오류가 발생하였습니다.');
			window.location.assign('/');
		}
	}, [DROP_status])

	return (
		<>
			<Layout>
				<Form>
					<InfoForm>
						<InfoTextForm>
							<InfoLeft>
								<label>
									아이디
								</label>
								<CheckStar>
									*
								</CheckStar>
							</InfoLeft>
							<CenterField>
								<InfoCenter>
									<InputText type="text" value={LOGIN_data.uid} disabled={true} >
									</InputText>
								</InfoCenter>
							</CenterField>
						</InfoTextForm>
						<InfoTextForm>
							<InfoLeft>
								<label>
									현재 비밀번호
								</label>
								<CheckStar>
								*
								</CheckStar>
							</InfoLeft>
							<CenterField>
								<InfoCenter>
									<InputText type="password" placeholder='비밀번호를 입력해주세요' maxLength={30} name="pw" onChange={ChangeInput} value={pw}>
									</InputText>
								</InfoCenter>
							</CenterField>
						</InfoTextForm>
						<InfoTextForm>
							<InfoLeft>
								<label>
									새 비밀번호
								</label>
								<CheckStar>
								*
								</CheckStar>
							</InfoLeft>
							<CenterField>
								<InfoCenter>
									<InputText type="password" placeholder='새 비밀번호를 입력해주세요'  maxLength={30} name="newpw" onChange={ChangeInput} value={newpw} >
									</InputText>
								</InfoCenter>
								<ErrorField>
									<ErrorText>
										{newpwMessage}
									</ErrorText>
								</ErrorField>
							</CenterField>
						</InfoTextForm>
						<InfoTextForm>
							<InfoLeft>
								<label>
									새 비밀번호확인
								</label>
								<CheckStar>
								*
								</CheckStar>
							</InfoLeft>
							<CenterField>
								<InfoCenter>
									<InputText type="password" placeholder='새 비밀번호를 한번 더 입력해주세요' maxLength={30} name="newpwConfirm" onChange={ChangeInput} value={newpwConfirm}>
									</InputText>
								</InfoCenter>
								<ErrorField>
									<ErrorText>
										{newpwConfirmMessage}
									</ErrorText>
								</ErrorField>
							</CenterField>
						</InfoTextForm>
						<InfoTextForm>
							<InfoLeft>
								<label>
									이름
								</label>
								<CheckStar>
								*
								</CheckStar>
							</InfoLeft>
							<CenterField>
								<InfoCenter>
									<InputText type="pass" placeholder='이름을 입력해 주세요' maxLength={5} name="name" onChange={ChangeInput} value={name}>
									</InputText>	
								</InfoCenter>
								<ErrorField>
									<ErrorText>
										{nameMessage}
									</ErrorText>
								</ErrorField>
							</CenterField>
						</InfoTextForm>
						<InfoTextForm>
							<InfoLeft>
								<label>
									이메일
								</label>
								<CheckStar>
								*
								</CheckStar>
							</InfoLeft>
							<CenterField>
								<InfoCenter>
									<InputText type="text" placeholder='이메일을 입력해주세요' maxLength={49} name="email" onChange={ChangeInput} value={email} disabled={emailText}>
									</InputText>
								</InfoCenter>
								<ErrorField>
									<ErrorText>
										{emailMessage}
									</ErrorText>
								</ErrorField>
							</CenterField>
							{emailchange ? 
							<InfoCheck onClick={emailTextOn} style={{marginRight: "22px"}}>
								이메일변경
							</InfoCheck> : 
							<InfoCheck onClick={Emailcheck} disabled={emailButton} style={{marginRight: "22px"}}>
								중복확인
							</InfoCheck>
							}
						</InfoTextForm>
						<InfoTextForm>
							<InfoLeft>
								<label>
									전화번호
								</label>
								<CheckStar>
								*
								</CheckStar>
							</InfoLeft>
							<CenterField>
								<InfoCenter>
									<InputTextDiv type='text' value='010' readOnly>
									</InputTextDiv>
									<InputTextDiv type='text' name='phone1' maxLength={4} value={phone1} onChange={ChangeInput}>
									</InputTextDiv>
									<InputTextDiv	type='text' name='phone2' maxLength={4} value={phone2} onChange={ChangeInput}>
									</InputTextDiv>
								</InfoCenter>
								<ErrorField>
									<ErrorText>
										{phoneMessage}
									</ErrorText>
								</ErrorField>
							</CenterField>
						</InfoTextForm>
						<InfoTextForm>
							<InfoLeft>
								<label>
									주소
								</label>
								<CheckStar>
								*
								</CheckStar>
							</InfoLeft>
							<InfoCenter>
								<InputText type="text" placeholder='주소를 검색해주세요' readOnly value={M_address}>
								</InputText>
							</InfoCenter>
							<InfoCheck onClick={()=>{setpopup(!popup);}}>
								주소검색
							</InfoCheck>
							{popup && <div><Post setAddress={setpopup} M_address={M_address} InsertAddress={InsertAddress} /></div>}
						</InfoTextForm>
						{/* 주소를 선택하면 상세주소 칸이 생김 */}
						{M_address === '' ? null : 
						<InfoTextForm>
							<InfoLeft>
								<label>
									상세주소
								</label>
								<CheckStar>
								*
								</CheckStar>
							</InfoLeft>
							<InfoCenter>
								<InputText type="text" placeholder='상세주소를 입력해주세요' maxLength={49} value={S_address} onChange={ChangeInput} name="S_address">
								</InputText>
							</InfoCenter>
						</InfoTextForm>
						}
						<InfoTextForm>
							<InfoLeft>
								<label>
									생년월일
								</label>
								<CheckStar>
									*
								</CheckStar>
							</InfoLeft>
							<CenterField>
								<InfoCenter>
									<InputTextDiv type="text" placeholder='YYYY' maxLength={4} name='year' value={year} onChange={ChangeInput}>
									</InputTextDiv>
									<InputTextDiv type="text" placeholder='MM' maxLength={2} name='month' value={month} onChange={ChangeInput}>
									</InputTextDiv>
									<InputTextDiv type="text" placeholder='DD' maxLength={2} name='day' value={day} onChange={ChangeInput}>
									</InputTextDiv>
								</InfoCenter>
								<ErrorField>
									<ErrorText>
										{birthMessage}
									</ErrorText>
								</ErrorField>
							</CenterField>
						</InfoTextForm>
					</InfoForm>
					<Line/>
				</Form>
				<Form>
					<ButtonForm>
						<LeaveButton onClick={memberDrop}>
							<span>
								회원탈퇴
							</span>
						</LeaveButton>
						<UpdateButton onClick={memberUpdate}>
							<span>
								회원정보수정
							</span>
						</UpdateButton>
					</ButtonForm>	
					<Notice>
						회원을 탈퇴할 경우 사용자가 대한 모든 기록이 삭제됩니다.
					</Notice>
				</Form>
			</Layout>
		</>
	);
};

const Layout = styled.div`
	width: 700px;
	margin: 0px auto;
	padding: 7px 60px 7px 60px;
	border-top: 2px solid rgb(51, 51, 51);
	margin-top: 5px !important;
`;

const Form = styled.div`
	width: 640px;
  margin: 0 auto;
`;

const CheckStar = styled.span`
	color: rgb(238, 106, 123);
	margin-left: 2px;
`;

const InfoForm = styled.div`
	padding: 0px;
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
`;

const InputTextDiv = styled.input`
	width: 100px;
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
	margin-right: 20px;
	text-align: center;
`;

const InfoCheck = styled.button`
	height: 44px;
	border-radius: 3px;
	display: block;
	padding: 0px 10px;
	text-align: center;
	overflow: hidden;
	width: 120px;
	height: 44px;
	border-radius: 3px;
	color: rgb(95, 0, 128);
	background-color: rgb(255, 255, 255);
	border: 1px solid rgb(95, 0, 128);
	margin-left: 20px;
	cursor: pointer;
	font-size: 14px;

	:disabled {
  	border-color: rgb(221, 221, 221);
    color: rgb(221, 221, 221);
	}
`;

const Line = styled.div`
	padding: 10px 0px;
  border-bottom: 1px solid rgb(51, 51, 51);
`;

const ButtonForm = styled.div`
	display: flex;
	-webkit-box-pack: center;
	justify-content: center;
	padding: 30px 0px 25px 0px;
	margin-top: 0px;
`;

const UpdateButton = styled.button`
	display: block;
	padding: 0px 10px;
	text-align: center;
	overflow: hidden;
	width: 160px;
	height: 56px;
	border-radius: 3px;
	color: rgb(255, 255, 255);
	background-color: rgb(95, 0, 128);
	border: 0px none;
	cursor: pointer;
	margin-left: 20px;

	span {
		display: inline-block;
    font-size: 16px;
    font-weight: 500;
	}
`;

const LeaveButton = styled.button`
	display: block;
	padding: 0px 10px;
	text-align: center;
	overflow: hidden;
	width: 160px;
	height: 56px;
	border-radius: 3px;
	color: rgb(95, 0, 128);
	background-color: rgb(255, 255, 255);
	border: 1px solid rgb(95, 0, 128);
	cursor: pointer;

	span {
		display: inline-block;
    font-size: 16px;
    font-weight: 500;
	}
`;

const Notice = styled.span`
	display: block;
	line-height: 1.43;
	text-align: center;
	color: rgb(102,102,102);
`

const ErrorField = styled.div`
	box-sizing: border-box;
	margin: 0;
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

export default InfoModify;