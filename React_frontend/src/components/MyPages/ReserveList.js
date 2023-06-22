/*
 23-03-10 마이페이지 css 구축(오병주)
 23-03-24 사용자가 예매한 영화 내역 조회 구현(오병주)
*/
import React, { useEffect }  from 'react';
import styled from 'styled-components';
import Reserve from './Reserve';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { USER_RESERVE_SEARCH_REQUEST } from '../../reducer/R_mypage_reserve';
import MyPageLoading from './MyPageLoading';
import { useLocation } from "react-router-dom";

const ReserveList = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	// 리덕스에 있는 예매내역 상태
	const { RESERVE_SEARCH, RESERVE_SEARCH_loading, RESERVE_SEARCH_Key } = useSelector(
		state => ({
			RESERVE_SEARCH: state.R_mypage_reserve.RESERVE_SEARCH,
      RESERVE_SEARCH_loading: state.R_mypage_reserve.RESERVE_SEARCH_loading,
      RESERVE_SEARCH_Key: state.R_mypage_reserve.RESERVE_SEARCH_Key,
		}),
		shallowEqual
	);

	// 로그인 상태 확인용 리덕스 상태
	const { LOGIN_data } = useSelector((state) => state.R_user_login);

	// 예매 내역 조회 useEffect
	useEffect(()=> {
		// 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청(뒤로가기시 리렌더링 안함)
		if (LOGIN_data.uid !== 'No_login' && RESERVE_SEARCH_Key !== location.key) {
			dispatch({
				type: USER_RESERVE_SEARCH_REQUEST,
				data: location.key
			});
		}
	}, [LOGIN_data.uid, RESERVE_SEARCH_Key, location, dispatch]);

	return (
		<Content>
			<ContentTitle>
				<ContentLeft>
					<h2>
						예매내역
					</h2>
					<span>
						최대 6개월까지의 예매 내역이 출력됩니다.
					</span>
				</ContentLeft>
			</ContentTitle>
			<ContentLine/>
			<ContentDetails>
				{LOGIN_data.uid === 'No_login' || RESERVE_SEARCH_loading ? <MyPageLoading/> : 
				RESERVE_SEARCH.length !== 0 ? RESERVE_SEARCH.map((reserve, index) => <Reserve reserve={reserve} key={index} />) : 
				<NoContent>
					<span>
						<InfoCircleOutlined/>
					</span>
						예매내역이 존재하지 않습니다.						
				</NoContent>}
			</ContentDetails>
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
	padding-bottom: 25px;
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

const NoContent = styled.div`
	display: flex;
	flex-direction: column;
	-webkit-box-align: center;
	align-items: center;
	font-size: 18px;
	font-weight: 400;
	color: rgb(181, 181, 181);
	text-align: center;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	padding-top: 180px;

	span {
		display: block;
    margin: 0px auto 16px;
    height: 28px;
		font-size: 30px;
	}
`;

export default ReserveList;