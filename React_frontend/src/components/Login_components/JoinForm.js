/* 
	23-01-02 ~ 23-01-04 회원가입 ui 수정 및 기능 추가(오병주)
	23-01-13 ~ 23-01-13 중복확인 기능 추가(오병주)
	23-01-18 회원가입 구현(오병주)
*/
import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import Post from './Post';
import TermofService from './TermofService';
import PrivacyofService from './PrivacyofService';
import { USER_ID_REQUEST, USER_ID_RESET, USER_JOIN_REQUEST, USER_EMAIL_REQUEST, USER_EMAIL_RESET } from '../../reducer/R_user_join';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import LoginLoading from './LoginLoading';

const JoinForm = () => {
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

	// 체크박스 체크 관리(이용약관)
	const [check1, setCheck1] = useState(false);
	const [check2, setCheck2] = useState(false);

	// 체크박스 true / false 변경
	const ClickCheck1 = (check1) => {
		setCheck1(!check1);
	}
	const ClickCheck2 = (check2) => {
		setCheck2(!check2);
	}

	// 사용자가 입력하는 input 관리
	const [inputs, setInputs] = useState({
    id: '',
		pw: '',
		pwConfirm: '',
    name: '',
		email: '',
		phone1: '',
		phone2: '',
		S_address: '',
		year: '',
		month: '',
		day: '',
  });

	const { id, 
					pw, 
					pwConfirm, 
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
			idMessage: '',
			pwMessage: '',
			pwConfirmMessage: '',
			nameMessage: '',
			emailMessage: '',
			phoneMessage: '',
			birthMessage: ''
	});

	const {idMessage, 
				 pwMessage,
				 pwConfirmMessage, 
				 nameMessage, 
				 emailMessage, 
				 phoneMessage,
				 birthMessage} = messages; // 비구조화 할당을 통해 값 추출

	// 유효성검사 상태저장
	const [checks, setChecks] = useState({
		isId: false,
		isPw: false,
		isPwConfirm: false,
		isName: false,
		isEmail: false,
		isPhone1: false,
		isPhone2: false,
		isM_Address: false,
		isS_Address: false,
		isYear: false,
		isMonth: false,
		isDay: false
	});

	const {isId, 
		     isPw, 
				 isPwConfirm, 
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

		// id가 변경될 때 실행
		if (name === 'id') {
			const idRegExp = /^(?=.*[a-z])(?=.*[0-9]).{4,12}$/;

			if (!idRegExp.test(value)) {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					idMessage: '4~12글자 사이 영어소문자와 숫자로 구성해주세요.' // idMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isId: false	 // isId 상태 변경
				});
				setIDButton(true);
			}
			else {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					idMessage: '' // idMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isId: true 	// isid 상태 변경
				});
				setIDButton(false);
			}
		}

		// 비밀번호가 변경될때 실행
		if (name === 'pw') {
			const pwRegExp = /^(?=.*[a-zA-z])(?=.*[0-9]).{8,99}$/;

			// 비밀번호 확인이랑 비밀번호랑 같으면서 비밀번호 확인이 빈칸이 아닌경우
			if (value === pwConfirm && pwConfirm !== '') {
				if (!pwRegExp.test(value)) {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						pwMessage: '영어와 숫자의 조합으로 8글자 이상 입력해주세요', // pwMessage의 값 변경
						pwConfirmMessage: '' // pwConfirmMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isPw: false,	 // isPw 상태 변경
						isPwConfirm: true 	// isConfirmPw 상태 변경
					});
				}
				else {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						pwMessage: '', // pwMessage의 값 변경
						pwConfirmMessage: '' // pwConfirmMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isPw: true, 	// isPw 상태 변경
						isPwConfirm: true 	// isConfirmPw 상태 변경
					});
				}
			}

			// 비밀번호 확인이랑 비밀번호랑 다르면서 비밀번호 확인이 빈칸이 아닌 경우
			if (value !== pwConfirm && pwConfirm !== '') {
				if (!pwRegExp.test(value)) {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						pwMessage: '영어와 숫자의 조합으로 8글자 이상 입력해주세요', // pwMessage의 값 변경
						pwConfirmMessage: '동일한 비밀번호를 입력해주세요' // pwConfirmMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isPw: false,	 // isPw 상태 변경
						isPwConfirm: false 	// isConfirmPw 상태 변경
					});
				}
				else {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						pwMessage: '', // pwMessage의 값 변경
						pwConfirmMessage: '동일한 비밀번호를 입력해주세요' // pwConfirmMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isPw: true, 	// isPw 상태 변경
						isPwConfirm: false 	// isConfirmPw 상태 변경
					});
				}
			}

			// 비밀번호 확인이 빈칸인 경우
			if (pwConfirm === '') {
				if (!pwRegExp.test(value)) {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						pwMessage: '영어와 숫자의 조합으로 8글자 이상 입력해주세요', // pwMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isPw: false,	 // isPw 상태 변경
					});
				}
				else {
					setMessages({
						...messages, // 기존의 message 객체를 복사한 뒤
						pwMessage: '', // pwMessage의 값 변경
					});
					setChecks({
						...checks,	// 기존의 check 객체를 복사한 뒤
						isPw: true, 	// isPw 상태 변경
					});
				}
			}
		}

		// 비밀번호 확인이 변경될때 실행
		if (name === 'pwConfirm') {
			if (value !== pw) {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					pwConfirmMessage: '동일한 비밀번호를 입력해주세요' // pwConfirmMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isPwConfirm: false	 // isPwConfirm 상태 변경
				});
			}
			else {
				setMessages({
					...messages, // 기존의 message 객체를 복사한 뒤
					pwConfirmMessage: '' // pwConfirmMessage의 값 변경
				});
				setChecks({
					...checks,	// 기존의 check 객체를 복사한 뒤
					isPwConfirm: true 	// isConfirmPw 상태 변경
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
					if (isMonth && isDay) {		// 만약에 다른 생년월일이 채워졌을경우
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

	// 로그인 상태확인용 리덕스 상태
	const dispatch = useDispatch();
  const { LOGIN_data } = useSelector((state) => state.R_user_login);
	
	// 로딩창 구현을 위한 리덕스 상태
	const { JOIN_loading } = useSelector((state) => state.R_user_join);

	// 페이지 이동을 위해 선언
	const location = useLocation();
	const navigate = useNavigate();	

	// 로그인이 되어있으면 회원가입 페이지에 진입못하게 하는 useEffect
	useEffect(() => {
    if (LOGIN_data.uname !== '') {
      alert("로그아웃 이후 사용 가능한 페이지입니다.");
			if (location.state === null) {
				navigate(`/`);
			}
			else {
				navigate(`${location.state.url}`);
			}
    }
  }, [LOGIN_data.uname, location.state, navigate, dispatch]);

	// ID 중복을 확인하기 위한 변수 및 리덕스 상태
	const { ID_status } = useSelector((state) => state.R_user_join);
	const [IDButton, setIDButton] = useState(false);
	const [IDText, setIDText] = useState(false);

	// Email 중복을 확인하기 위한 변수 및 리덕스 상태
	const { EMAIL_status } = useSelector((state) => state.R_user_join);
	const [emailButton, setemailButton] = useState(false);
	const [emailText, setemailText] = useState(false);

	// 회원가입 확인을 위한 리덕스 상태
	const { JOIN_status } = useSelector((state) => state.R_user_join);
	
	// 로그인 중복확인 누르면 실행되는 함수
	const IDcheck = useCallback(() => {
		if (id === '') {
			alert('아이디를 입력해주세요.');
			return;
		}

		dispatch({
      type: USER_ID_REQUEST,
			data: id
    });
	}, [dispatch, id]);

	// IDcheck를 호출해서 ID_status의 상태가 변경이 됐을 때 유효성 검사를 해주는 useEffect
	useEffect(() => {
		if (ID_status === 204) {
			alert("사용 가능한 아이디입니다.");
			dispatch({
				type: USER_ID_RESET
			});
			setIDButton(true);
			setIDText(true);
		}
		if (ID_status === 400) {
			alert("이미 사용중인 아이디입니다.");
			dispatch({
				type: USER_ID_RESET
			});
		}
	}, [dispatch, ID_status]);

	// 이메일 중복확인 누르면 실행되는 함수
	const Emailcheck = useCallback(() => {
		if (email === '') {
			alert('이메일을 입력해주세요.');
			return;
		}

		dispatch({
      type: USER_EMAIL_REQUEST,
			data: email
    });
	}, [dispatch, email]);

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

	// 회원가입 누를 시 실행되는 함수
	const SignUp = () => {
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
			uid: id,
			upw: pw,
			uname: name,
			uemail: email,
			utel: "010"+phone1+phone2,
			uaddr: M_address,
			uaddrsecond: S_address,
			ubirth: year+"-"+res_month+"-"+res_day,
		};
		
		// 모든칸에 입력이 다 되어있을 경우
		if (IDText && isId && isPw && isPwConfirm && isName && emailText && isEmail && 
			isPhone1 && isPhone2 && isM_Address && isS_Address && isYear && isMonth && isDay && check1 && check2) {
			dispatch({
				type: USER_JOIN_REQUEST,
				data: datas
			});
		}
		else {
			alert("모든 정보 입력 및 확인 그리고 약관에 동의해주세요.");
		}
	};

	// JOIN_status의 상태가 변경이 됐을 때 회원가입 성공 여부를 알려주는 useEffect
	useEffect(() => {
		if (JOIN_status === 204) {
			alert('회원가입이 완료 되었습니다.');
			window.location.assign('/');
		}

		if (JOIN_status === 400 || JOIN_status === 500) {
			alert('예기치 못한 오류가 발생하였습니다. 다시 회원가입 해주십시오.');
			window.location.assign('/');
		}
	}, [JOIN_status])

	return (
		<>
			{ JOIN_loading  ? <LoginLoading/> : null }
			<Layout>
				<Title>
					회원가입
				</Title>
				<Form>
					<CheckText>
						<CheckStar style={{marginRight: "5px"}}>
							*	
						</CheckStar>
						모든 정보는 필수입력입니다
					</CheckText>
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
									<InputText type="text" placeholder='아이디를 입력해주세요' maxLength={12} name="id" onChange={ChangeInput} value={id} disabled={IDText}>
									</InputText>
								</InfoCenter>
								<ErrorField>
									<ErrorText>
										{idMessage}
									</ErrorText>
								</ErrorField>
							</CenterField>
							<InfoCheck style={{marginRight: "22px"}} onClick={IDcheck} disabled={IDButton}>
								중복확인
							</InfoCheck>
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
									<InputText type="password" placeholder='비밀번호를 입력해주세요' maxLength={30} name="pw" onChange={ChangeInput} value={pw}>
									</InputText>
								</InfoCenter>
								<ErrorField>
									<ErrorText>
										{pwMessage}
									</ErrorText>
								</ErrorField>
							</CenterField>
						</InfoTextForm>
						<InfoTextForm>
							<InfoLeft>
								<label>
									비밀번호확인
								</label>
								<CheckStar>
								*
								</CheckStar>
							</InfoLeft>
							<CenterField>
								<InfoCenter>
									<InputText type="password" placeholder='비밀번호를 한번 더 입력해주세요' maxLength={30} name="pwConfirm" onChange={ChangeInput} value={pwConfirm}>
									</InputText>
								</InfoCenter>
								<ErrorField>
									<ErrorText>
										{pwConfirmMessage}
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
							<InfoCheck style={{marginRight: "22px"}} onClick={Emailcheck} disabled={emailButton}>
								중복확인
							</InfoCheck>
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
					<InfoServiceForm style={{paddingBottom:"8px"}}>
						<ServiceLeft>
							<label>
								약관동의
								<CheckStar style={{marginLeft: "5px"}}>
									*
								</CheckStar>
							</label>
						</ServiceLeft>
						<ServiceCenter style={{paddingTop:"5px"}}>
							<ServiceSector>
								<Checks>
									<input type="checkbox" name="agree1" id="agree1" value={check1} onClick={() => ClickCheck1(check1)}/>
									<label htmlFor="agree1">
										이용약관 동의
										<TextType>
											(필수)
										</TextType>
									</label>
								</Checks>
							</ServiceSector>
							<TermofService/>
						</ServiceCenter>
					</InfoServiceForm>			
					<InfoServiceForm style={{paddingTop:"0px"}}>
						<ServiceLeft>
						</ServiceLeft>
						<ServiceCenter>
							<ServiceSector>
								<Checks>
									<input type="checkbox" name="agree2" id="agree2" value={check2} onClick={() => ClickCheck2(check2)}/>
									<label htmlFor="agree2">
										개인정보 수집 및 이용 동의
										<TextType>
											(필수)
										</TextType>
									</label>
								</Checks>
							</ServiceSector>
							<PrivacyofService/>
						</ServiceCenter>
					</InfoServiceForm>
					<ButtonForm>
						<JoinButton onClick={SignUp}>
								<span>
									가입하기
								</span>
						</JoinButton>
					</ButtonForm>	
				</Form>
			</Layout>
		</>
	);
};

const Layout = styled.div`
	min-width: 1050px;
	margin-top: 50px;
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
	padding-bottom: 10px;
	border-bottom: 2px solid rgb(51, 51, 51);
	font-size: 13px;
	color: rgb(102, 102, 102);
	line-height: 17px;
	text-align: right;
`;

const CheckStar = styled.span`
	color: rgb(238, 106, 123);
	margin-left: 2px;
`;

const InfoForm = styled.div`
	padding: 0px;
	margin-top: 7px;
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

const InfoServiceForm = styled.div`
	display: inline-flex;
	width: 100%;
	padding: 10px 20px;
`;

const ServiceLeft = styled.div`
	width: 139px;
	padding-top: 12px;

	label{
		font-weight: 500;
    color: rgb(51, 51, 51);
    line-height: 20px;
		font-size: 15px;
	}
`;

const ServiceCenter = styled.div`
	flex: 1 1 0%;
`;

const ServiceSector = styled.div`
`;

const Checks = styled.div`
	position: relative;
	display: flex;
	padding: 8px 0px;
	padding-bottom: 15px;
	-webkit-box-pack: justify;
	justify-content: space-between;
	-webkit-box-align: center;
	align-items: center;

	input[type="checkbox"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    opacity: 0;
    outline: 0;
    z-index: -1;
    overflow: hidden;
	}

	label {
		font-size: 14px;
		color: #2d2f43;
		font-weight: 400;
		letter-spacing: -0.02em;
	}

	input[type="checkbox"] + label:before {
    content: "";
    display: block;
    position: absolute;
    top: 42%;
    right: 7.5%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
	}

	input[type="checkbox"]:checked + label:before {
    background: url(/img/login/chk.png) no-repeat 50% 50% #5f0080;
    border-color: #5f0080;
	}
`;

const TextType = styled.span`
	color: #e5433e;
	font-weight: 400;
	padding-left: 5px;
`;

const ButtonForm = styled.div`
	display: flex;
	-webkit-box-pack: center;
	justify-content: center;
	border-top: 1px solid rgb(0, 0, 0);
	padding: 40px 0px;
	margin-top: 40px;
`;

const JoinButton = styled.button`
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
	}
`;

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

export default JoinForm;