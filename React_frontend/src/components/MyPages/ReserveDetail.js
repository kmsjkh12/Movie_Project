/*
 23-03-10 마이페이지 css 구축(오병주)
 23-03-24 사용자가 예매한 영화 상세내역 조회 구현(오병주)
*/
import React, { useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { USER_RESERVE_DETAIL_REQUEST, USER_RESERVE_DROP_REQUEST } from '../../reducer/R_mypage_reserve';
import * as date from "../../lib/date.js";
import MyPageLoading from './MyPageLoading';

const ReserveDetail = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	// 리덕스에 있는 예매내역 상태
	const { RESERVE_DETAIL, RESERVE_DETAIL_loading, RESERVE_DETAIL_error, RESERVE_DROP_status } = useSelector(
		state => ({
			RESERVE_DETAIL: state.R_mypage_reserve.RESERVE_DETAIL,
			RESERVE_DETAIL_loading: state.R_mypage_reserve.RESERVE_DETAIL_loading,
      RESERVE_DETAIL_error: state.R_mypage_reserve.RESERVE_DETAIL_error,
      RESERVE_DROP_status: state.R_mypage_reserve.RESERVE_DROP_status,
		}),
		shallowEqual
	);

	// 리덕스 로그인 상태 정보
  const { LOGIN_data } = useSelector((state) => state.R_user_login);

	// 예매내역 상세 조회 useEffect
	useEffect(()=> {
		// 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청
		if (LOGIN_data.uid !== 'No_login') {
			dispatch({
				type: USER_RESERVE_DETAIL_REQUEST,
				data: {
					pathname: location.pathname.substring(7)
				}
			});
		}
	}, [LOGIN_data.uid, location.pathname, dispatch]);

	// 현재 시간에서 30분을 더한 값
	var now = new Date();
	now.setMinutes(now.getMinutes() + 30);
	
	// 영화 시작시간과 종료시간을 date형으로 변경
	const starttime = useMemo(() => new Date(RESERVE_DETAIL.mistarttime), [RESERVE_DETAIL.mistarttime]);
	const endtime = useMemo(() => new Date(RESERVE_DETAIL.miendtime), [RESERVE_DETAIL.miendtime])

	// 예매 상태를 다시 확인하는 useEffect
	useEffect(()=> {
		// 예매기록이 존재하지 않을 경우
		if (RESERVE_DETAIL_error) {
			alert("존재하지 않는 예매입니다.");
			window.location.assign('/Mypage/Reserve');
			return;
		}
		
		// 이미 취소된 예매를 조회할 때
		if (RESERVE_DETAIL.rstate !== undefined && !RESERVE_DETAIL.rstate) {
			alert("이미 취소된 예매입니다.")
			window.location.assign('/Mypage/Reserve');
			return;
		}

		// 관람이 끝난 영화 예매를 조회할 경우
		if (endtime <= new Date()) {
			alert("이미 관람이 끝난 영화입니다.")
			window.location.assign('/Mypage/Reserve');
		}

	}, [RESERVE_DETAIL_error, RESERVE_DETAIL.rstate, endtime]);
	
	// 결제취소 버튼을 누를 경우
	const onCancel = useCallback(() => {
		// 결제 취소 버튼을 누르는 시점의 시간에서 30분을 더한 값
		var nowCancel = new Date();
		nowCancel.setMinutes(nowCancel.getMinutes() + 30);

		// 현재 시간에 30분을 더한값이 영화 시작시간보다 클경우 예매취소를 막는 if문
		if (nowCancel > starttime) {
			alert("결제취소 가능 시간이 지났습니다!")
			window.location.replace(location.pathname);
			return;
		}

		if (!window.confirm("예매를 취소하시겠습니까?\n(취소하신 예매는 복구가 되지 않습니다.)")) {
      return;
    };

		// 예매 취소 요청
		dispatch({
			type: USER_RESERVE_DROP_REQUEST,
			data: {
				pathname: location.pathname.substring(7)
			}
		});

	}, [location.pathname, starttime, dispatch]);

	// 예매취소 상태에 따른 alert
	useEffect(()=> {
		if (RESERVE_DROP_status === 204) {
			alert('예매가 취소되었습니다.');
			window.location.assign('/Mypage/Cancel');
			return;
		}

		if (RESERVE_DROP_status === 400 || RESERVE_DROP_status === 500) {
			alert('예기치 못한 오류가 발생했습니다.');
			window.location.assign('/Mypage/Reserve');
		}
	}, [RESERVE_DROP_status])

	return (
		<Content>
			<ContentTitle>
				<ContentLeft>
					<h2>
						예매내역 상세
					</h2>
				</ContentLeft>
			</ContentTitle>
			{RESERVE_DETAIL_error || (RESERVE_DETAIL.rstate !== undefined && !RESERVE_DETAIL.rstate) || endtime <= new Date() ||
			RESERVE_DETAIL_loading || LOGIN_data.uid === 'No_login' ? <MyPageLoading/> : <>
			<ContentDetailTop>
				<h3>
					예매번호 
					<span>
						{RESERVE_DETAIL.rid}
					</span>
				</h3>
				<Link to={`/Moviedetail/${RESERVE_DETAIL.mid}`}>
					영화 상세정보 보기
				</Link>
			</ContentDetailTop>
			<ContentLine/>
			<ContentDetails>
				<ContentDetailMiddleInfos>
				<Poster src={`/${RESERVE_DETAIL.mimagepath}`} alt="Poster" />
					<ContentDetailMiddleInfo>
						<dl>
							<dt>
								영화명
							</dt>
							<dd>
								{RESERVE_DETAIL.mtitle}
							</dd>
						</dl>
						<dl>
							<dt>
								관람극장
							</dt>
							<dd>
								{RESERVE_DETAIL.tarea}-{RESERVE_DETAIL.tname}점 {RESERVE_DETAIL.cname}
							</dd>
						</dl>
						<dl>
							<dt>
								영화시작시간
							</dt>
							<dd>
								{RESERVE_DETAIL.mistarttime && RESERVE_DETAIL.mistarttime.substr(0, 10)} 
								&nbsp;({RESERVE_DETAIL.mistarttime && date.getDayOfWeek(RESERVE_DETAIL.mistarttime)})  
								{RESERVE_DETAIL.mistarttime && RESERVE_DETAIL.mistarttime.substr(10, 6)}
							</dd>
						</dl>
						<dl>
							<dt>
								영화종료시간
							</dt>
							<dd>
								{RESERVE_DETAIL.miendtime && RESERVE_DETAIL.miendtime.substr(0, 10)} 
								&nbsp;({RESERVE_DETAIL.miendtime && date.getDayOfWeek(RESERVE_DETAIL.miendtime)}) 
								{RESERVE_DETAIL.miendtime && RESERVE_DETAIL.miendtime.substr(10, 6)}
							</dd>
						</dl>
						<dl>
							<dt>
								상영등급
							</dt>
							<dd>
								{RESERVE_DETAIL.mrating === '0' ? "전체 이용가" : RESERVE_DETAIL.mrating === '18' ? '청소년 관람불가' : RESERVE_DETAIL.mrating+"세 이용가"}
							</dd>
						</dl>
						<dl>
							<dt>
								관람좌석
							</dt>
							{RESERVE_DETAIL.seats && RESERVE_DETAIL.seats.map((seat) => (<dd key={seat}> {seat} </dd>))}
						</dl>
						<dl>
							<dt>
								관람인원
							</dt>
							<dd>
								{RESERVE_DETAIL.rpeople}
							</dd>
						</dl>
					</ContentDetailMiddleInfo>
				</ContentDetailMiddleInfos>
				<ContentTitle style={{marginTop: "25px"}}>
					<h3>
						결제정보
					</h3>
				</ContentTitle>
				<ContentList>
					<ContentListElement>
						<span className='title'>
							티켓매수
						</span>
						<span className='content'>
							{RESERVE_DETAIL.rticket} 매
						</span>
					</ContentListElement>
					<ContentListElement>
						<span className='title'>
							결제일시
						</span>
						<span className='content'>
							{RESERVE_DETAIL.rdate}
						</span>
					</ContentListElement>
					<ContentListElement>
						<span className='title'>
							결제유형
						</span>
						<span className='content'>
							{RESERVE_DETAIL.rpaytype}
						</span>
					</ContentListElement>
					<ContentListElement>
						<span className='title'>
							결제금액
						</span>
						<span className='content'>
							{RESERVE_DETAIL.rprice}원
						</span>
					</ContentListElement>
				</ContentList>
				<ContentTitle>
					<h3>
						회원정보
					</h3>
				</ContentTitle>
				<ContentList>
					<ContentListElement>
						<span className='title'>
							성함
						</span>
						<span className='content'>
							{LOGIN_data.uname}
						</span>
					</ContentListElement>
					<ContentListElement>
						<span className='title'>
							이메일
						</span>
						<span className='content'>
							{LOGIN_data.uemail}
						</span>
					</ContentListElement>
					<ContentListElement>
						<span className='title'>
							휴대전화
						</span>
						<span className='content'>
							010-{LOGIN_data.utel && LOGIN_data.utel.substr(3, 4)}-{LOGIN_data.utel && LOGIN_data.utel.substr(7, 4)}
						</span>
					</ContentListElement>
				</ContentList>
			</ContentDetails>
			<ButtonList>
				<Link to="/Mypage/Reserve">
					<Button check={false}>
						<span>
							예매내역조회
						</span>
					</Button>
				</Link>
				{/* 현재 시간에 30분을 더한값이 영화 시작시간보다 크면 disable */}
				<Button onClick={onCancel} disabled={now > starttime} check={now > starttime}>
					<span>
						예매취소하기
					</span>
				</Button>
			</ButtonList>
			<Notice>
				예매취소는 영화 시작 30분전까지 가능하며 환불이 가능할경우 환불금이 반환됩니다.
				<div>
					(결제 라이브러리에서 이미 환불이 되었거나 결제유형이 테스트인 경우 예매 취소만 진행)
				</div>
			</Notice></>}
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
	flex-direction: row;
	width: 100%;
	padding-bottom: 20px;
	-webkit-box-pack: justify;
	justify-content: space-between;

	h3 {
		font-weight: 500;
    font-size: 20px;
    color: rgb(51, 51, 51);
    letter-spacing: -0.43px;
		margin:0;
	}
`;

const ContentDetailTop = styled.div`
	display: flex;
	padding: 0px 0px 13px;
	-webkit-box-pack: justify;
	justify-content: space-between;
	box-sizing: border-box;
  margin: 0;

	h3 {
		font-weight: 500;
    font-size: 20px;
    color: rgb(51, 51, 51);
    letter-spacing: -0.43px;
		margin:0;
		
		span {
		font-size: 20px;
    font-weight: 500;
    color: rgb(0, 0, 0);
		margin-left: 10px;
		}
	}

	a {
		align-self: center;
    padding-right: 10px;
    line-height: 1.9;
    font-size: 12px;
    color: #aaacac;
		cursor: pointer;
		text-decoration: none;
	}
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

	span {
		padding-left: 13px;
    font-size: 14px;
    letter-spacing: -0.3px;
    color: rgb(153, 153, 153);
    line-height: 30px;
	}
`;

const ContentLine = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	-webkit-box-align: center;
	align-items: center;
	box-sizing: border-box;
	margin: 0;
	border-bottom: 2px solid rgb(51, 51, 51);
`;

const ContentDetails = styled.div`
	position: relative;
	min-height : 400px;
`;

const ContentDetailMiddleInfos = styled.div`
	display: flex;
	flex-direction: row;
	-webkit-box-align: center;
	align-items: center;
	margin-top: 10px;
`;

const Poster = styled.img`
  width: 205px;
	height: 290px;
	margin-right: 30px;
	background-color: rgb(245, 245, 245);
`;

const ContentDetailMiddleInfo = styled.div`
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	padding-bottom: 20px !important;

	dl {
		display: flex;
    padding-top: 20px !important;
    flex-direction: row;
    color: rgb(0, 0, 0);
    line-height: 20px;
		margin: 0;
		padding: 0;
		box-sizing: border-box;

		dt {
			width: 80px;
			margin-right: 30px !important;
			font-size: 12px;
			color: #99a0a6;
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			margin-top: 2px;
		}

		dd:not(:first-of-type) {
 		 margin-left: 6px;
		}

		dd {
			display: flex;
			font-weight: 550;
			color: rgb(51, 51, 51);
			line-height: 1.36;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			letter-spacing: 0.9px;
		}
	}
`;

const ContentList = styled.ul`
	list-style-type: none;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	border-top: 2px solid rgb(51, 51, 51);

	li {
    &:first-child {
      padding-top: 24px;
    }

		&:last-child {
			padding-bottom: 28px;
			margin-bottom: 40px;
			border-bottom: 1px solid rgb(221, 223, 225);
		}
	}
`;

const ContentListElement = styled.li`
	display: flex;
	-webkit-box-pack: justify;
	justify-content: space-between;
	padding-bottom: 24px !important;
	font-size: 17px;
	box-sizing: border-box;
	margin: 0;
	padding: 0;

	.title {
		flex: 1 1 0%;
    color: rgb(102, 102, 102);
	}

	.content {
		font-weight: 500;
    color: rgb(51, 51, 51);
	}
`;

const ButtonList = styled.div`
	display: flex;
	-webkit-box-pack: center;
	justify-content: center;
	margin: 40px 0px 30px 0px;

	a + button {
		margin-left: 20px;
	}
`;

const Button = styled.button`
	display: block;
	padding: 0px 10px;
	text-align: center;
	overflow: hidden;
	width: 200px;
	height: 56px;
	border-radius: 3px;
	border: 1px solid #5F0080;
	background: #fff;
	border-color: ${props => props.check ? '#cccccc' : '#5F0080;'};
	color: ${props => props.check ? '#cccccc' : '#5F0080;'};
  cursor: ${props => props.check ? 'default' : 'pointer'};

	span {
		display: inline-block;
    font-size: 16px;
    font-weight: 550;
	}
`;

const Notice = styled.span`
	display: block;
	line-height: 1.43;
	text-align: center;
	color: rgb(102, 102, 102);
`;

export default ReserveDetail;