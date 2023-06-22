/*
 23-03-11 마이페이지 css 구축(오병주)
 23-03-24 사용자가 예매취소한 영화 상세내역 조회 구현(오병주)
*/
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { USER_RESERVE_CANCEL_DETAIL_REQUEST } from '../../reducer/R_mypage_reserve';
import * as date from "../../lib/date.js";
import MyPageLoading from './MyPageLoading';

const CancelDetail = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	// 리덕스에 있는 예매취소내역 상태
	const { RESERVE_CANCEL_DETAIL, RESERVE_CANCEL_DETAIL_loading, RESERVE_CANCEL_DETAIL_error } = useSelector(
		state => ({
			RESERVE_CANCEL_DETAIL: state.R_mypage_reserve.RESERVE_CANCEL_DETAIL,
			RESERVE_CANCEL_DETAIL_loading: state.R_mypage_reserve.RESERVE_CANCEL_DETAIL_loading,
      RESERVE_CANCEL_DETAIL_error: state.R_mypage_reserve.RESERVE_CANCEL_DETAIL_error,
		}),
		shallowEqual
	);

	// 리덕스 로그인 상태 정보
  const { LOGIN_data } = useSelector((state) => state.R_user_login)

	// 예매취소내역 상세 조회 useEffect
	useEffect(()=> {
		// 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청
		if (LOGIN_data.uid !== 'No_login') {
			dispatch({
				type: USER_RESERVE_CANCEL_DETAIL_REQUEST,
				data: {
					pathname: location.pathname.substring(7)
				}
			});
		}
	}, [LOGIN_data.uid, location.pathname, dispatch])

	// 예매 상태를 다시 확인하는 useEffect
	useEffect(()=> {
		// 예매기록이 존재하지 않을 경우
		if (RESERVE_CANCEL_DETAIL_error) {
			alert("존재하지 않는 취소내역 입니다.");
			window.location.assign('/Mypage/Cancel');
			return;
		}

		// 취소되지 않은 예매를 조회하는 경우
		if (RESERVE_CANCEL_DETAIL.rstate !== undefined && RESERVE_CANCEL_DETAIL.rstate) {
			alert("존재하지 않는 취소내역 입니다.")
			window.location.assign('/Mypage/Cancel');
		}
	}, [RESERVE_CANCEL_DETAIL_error, RESERVE_CANCEL_DETAIL.rstate])

	return (
		<Content>
			<ContentTitle>
				<ContentLeft>
					<h2>
						취소내역상세
					</h2>
				</ContentLeft>
			</ContentTitle>
			{(RESERVE_CANCEL_DETAIL.rstate !== undefined && RESERVE_CANCEL_DETAIL.rstate) || RESERVE_CANCEL_DETAIL_loading ||
			 RESERVE_CANCEL_DETAIL_error || LOGIN_data.uid === 'No_login' ? <MyPageLoading/> : <>
			<ContentDetailTop>
				<h3>
					예매번호 
					<span>
						{RESERVE_CANCEL_DETAIL.rid}
					</span>
				</h3>
			</ContentDetailTop>
			<ContentLine/>
			<ContentDetails>
				<ContentDetailMiddleInfos>
				<Poster src={`/${RESERVE_CANCEL_DETAIL.mimagepath}`} alt="Poster" />
					<ContentDetailMiddleInfo>
						<dl>
							<dt>
								영화명
							</dt>
							<dd>
								{RESERVE_CANCEL_DETAIL.mtitle}
							</dd>
						</dl>
						<dl>
							<dt>
								관람극장
							</dt>
							<dd>
								{RESERVE_CANCEL_DETAIL.tarea}-{RESERVE_CANCEL_DETAIL.tname}점 {RESERVE_CANCEL_DETAIL.cname}
							</dd>
						</dl>
						<dl>
							<dt>
								영화시작시간
							</dt>
							<dd>
								{RESERVE_CANCEL_DETAIL.mistarttime && RESERVE_CANCEL_DETAIL.mistarttime.substr(0, 10)} 
								&nbsp;({RESERVE_CANCEL_DETAIL.mistarttime && date.getDayOfWeek(RESERVE_CANCEL_DETAIL.mistarttime)})  
								{RESERVE_CANCEL_DETAIL.mistarttime && RESERVE_CANCEL_DETAIL.mistarttime.substr(10, 6)}
							</dd>
						</dl>
						<dl>
							<dt>
								영화종료시간
							</dt>
							<dd>
								{RESERVE_CANCEL_DETAIL.miendtime && RESERVE_CANCEL_DETAIL.miendtime.substr(0, 10)} 
								&nbsp;({RESERVE_CANCEL_DETAIL.miendtime && date.getDayOfWeek(RESERVE_CANCEL_DETAIL.miendtime)}) 
								{RESERVE_CANCEL_DETAIL.miendtime && RESERVE_CANCEL_DETAIL.miendtime.substr(10, 6)}
							</dd>
						</dl>
						<dl>
							<dt>
								관람등급
							</dt>
							<dd>
								{RESERVE_CANCEL_DETAIL.mrating === '0' ? "전체 이용가" : RESERVE_CANCEL_DETAIL.mrating === '18' ? '청소년 관람불가' : RESERVE_CANCEL_DETAIL.mrating+"세 이용가"}
							</dd>
						</dl>
						<dl>
							<dt>
								관람좌석
							</dt>
							<dd>
								취소된 결제는 관람좌석이 표시되지 않습니다.
							</dd>
						</dl>
						<dl>
							<dt>
								관람인원
							</dt>
							<dd>
								{RESERVE_CANCEL_DETAIL.rpeople}
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
							{RESERVE_CANCEL_DETAIL.rticket} 매
						</span>
					</ContentListElement>
					<ContentListElement>
						<span className='title'>
							결제일시
						</span>
						<span className='content'>
							{RESERVE_CANCEL_DETAIL.rdate}
						</span>
					</ContentListElement>
					<ContentListElement>
						<span className='title'>
							결제유형
						</span>
						<span className='content'>
							{RESERVE_CANCEL_DETAIL.rpaytype}
						</span>
					</ContentListElement>
					<ContentListElement>
						<span className='title'>
							결제금액
						</span>
						<span className='content'>
							{RESERVE_CANCEL_DETAIL.rprice}원
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
				<ContentTitle>
					<h3>
						결제취소정보
					</h3>
				</ContentTitle>
				<ContentList>
					<ContentListElement>
						<span className='title'>
							취소일시
						</span>
						<span className='content'>
							{RESERVE_CANCEL_DETAIL.rcanceldate}
						</span>
					</ContentListElement>
					<ContentListElement>
						<span className='title'>
							환불유형
						</span>
						<span className='content'>
							{RESERVE_CANCEL_DETAIL.rpaytype}
						</span>
					</ContentListElement>
					<ContentListElement>
						<span className='title'>
							환불금액
						</span>
						<span className='content'>
							{RESERVE_CANCEL_DETAIL.rprice}원
						</span>
					</ContentListElement>
				</ContentList>
			</ContentDetails></>}
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

export default CancelDetail;