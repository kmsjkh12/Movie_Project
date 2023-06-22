/*eslint-disable*/
/*
 23-03-11 마이페이지 css 구축(오병주)
*/
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import CommentMovie from './CommentMovie';
import CommentReview from './CommentReview';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { USER_MOVIE_POSSIBLE_REQUEST, USER_MY_COMMENT_SEARCH_REQUEST, USER_MY_COMMENT_SETTING } from '../../reducer/R_mypage_movie';
import MyPageLoading from './MyPageLoading';
import { useLocation } from 'react-router-dom';

const CommentList = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	 // 리덕스에 있는 관람평 상태들
	 const { possibleMovie, MY_COMMENT_List, Possiblebuttonstate, Reviewbuttonstate, 
		MOVIE_POSSIBLE_loading, MY_COMMENT_SEARCH_loading, Comment_key } = useSelector(
    state => ({
      possibleMovie: state.R_mypage_movie.possibleMovie,
			MY_COMMENT_List: state.R_mypage_movie.MY_COMMENT_List,
			Possiblebuttonstate: state.R_mypage_movie.Possiblebuttonstate,
			Reviewbuttonstate: state.R_mypage_movie.Reviewbuttonstate,
			MOVIE_POSSIBLE_loading: state.R_mypage_movie.MOVIE_POSSIBLE_loading,
			MY_COMMENT_SEARCH_loading: state.R_mypage_movie.MY_COMMENT_SEARCH_loading,
			Comment_key: state.R_mypage_movie.Comment_key
    }),
    shallowEqual
  );

	// 리덕스 로그인 상태 정보
  const { LOGIN_data } = useSelector((state) => state.R_user_login);

	// 메뉴 버튼 변수
	const [possiblebutton, setpossiblebutton] = useState(Possiblebuttonstate);
	const [reviewbutton, setreviewbutton] = useState(Reviewbuttonstate);

	// 리덕스에 저장된 버튼 상태에 따른 요청 (첫 렌더링에만 작용)
  useEffect(() => {
		// 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청(뒤로가기시 리렌더링 안됨)
		if (LOGIN_data.uid !== 'No_login' && Comment_key !== location.key) {
			// 작성 가능 영화 요청
			if (Possiblebuttonstate) {
				dispatch({
					type: USER_MOVIE_POSSIBLE_REQUEST
				});
			}
			// 작성한 관람평 요청
			else {
				dispatch({
					type: USER_MY_COMMENT_SEARCH_REQUEST
				});
			}   
		}
  }, [LOGIN_data.uid]);

	// 페이지를 탈출할 때 현재 페이지의 버튼 정보를 저장
	useEffect(()=> {
    return () => {
      dispatch({
        type: USER_MY_COMMENT_SETTING,
        data: {
          possible: possiblebutton,
					review: reviewbutton,
					key: location.key
				}
      });
		};
	}, [possiblebutton, reviewbutton, location, dispatch]);

	// 작성 가능 영화 버튼 누를 때
	const clickpossible = useCallback(()=> {
		dispatch({
      type: USER_MOVIE_POSSIBLE_REQUEST
    });

		setpossiblebutton(true);
		setreviewbutton(false);
	}, [dispatch]);

	// 작성한 관람평 버튼 누를 때
	const clickreview = useCallback(()=> {
		dispatch({
      type: USER_MY_COMMENT_SEARCH_REQUEST
    });

		setpossiblebutton(false);
		setreviewbutton(true);
	}, [dispatch]);

	return (
		<Content>
			<ContentTitle>
				<ContentLeft>
					<h2>
						관람평 내역
					</h2>
				</ContentLeft>
			</ContentTitle>
			<ButtonList>
				<button className={"btn" + (possiblebutton ? " active" : "")} onClick={clickpossible}>
					작성 가능 영화
				</button>
				<button className={"btn" + (reviewbutton ? " active" : "")} onClick={clickreview}>
					작성한 관람평
				</button>
			</ButtonList>
			{/* 여기서 버튼에 따라 렌더링이 다름(작성 가능 영화, 작성한 관람평)*/}
			{possiblebutton ? 
			<ContentDetails> 
				{LOGIN_data.uid === 'No_login' || MOVIE_POSSIBLE_loading || MY_COMMENT_SEARCH_loading ? <MyPageLoading/> : <>
				<span className='total'>
					총 {possibleMovie.length}개
				</span>
				{possibleMovie.length !== 0 ? possibleMovie.map((movie, index) => <CommentMovie movie={movie} key={index} />) : 
				<NoContent>
					<span className='None'>
						<InfoCircleOutlined/>
					</span>
						작성 가능한 영화가 존재하지 않습니다.						
					</NoContent>} 
				</>}
			</ContentDetails> :
			<ContentDetails>
				{LOGIN_data.uid === 'No_login' || MOVIE_POSSIBLE_loading || MY_COMMENT_SEARCH_loading ? <MyPageLoading/> : <>
				<span className='total'>
					총 {MY_COMMENT_List.length}개
				</span>
				{MY_COMMENT_List.length !== 0 ? MY_COMMENT_List.map((comment, index) => <CommentReview comment={comment} key={index} />) : 
				<NoContent>
					<span className='None'>
						<InfoCircleOutlined/>
					</span>
					작성한 관람평이 존재하지 않습니다.						
				</NoContent>}
				</>}
			</ContentDetails>}
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

const ButtonList = styled.div`
	display: flex;
	flex-wrap: nowrap;
	width: 100%;
	height: 60px;

	.btn {
		flex: 1 1 0%;
		border: 1px solid rgb(240, 240, 240);
		font-weight: 600;
		font-size: 17px;
		line-height: 21px;
		background-color: rgb(248, 249, 251);
		cursor: pointer;

		&.active {
      background-color: #fff;
    }
	}
`;

const ContentDetails = styled.div`
	position: relative;
	min-height : 350px;
	margin-top: 65px;
	border-top: 1px solid rgb(51, 51, 51);

	.total {
		position: absolute;
    top: -32px;
    left: 0px;
    font-size: 14px;
    font-weight: 550;
    line-height: 17px;
	}
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

	.None {
    margin: 0px auto 16px;
    height: 28px;
		font-size: 30px;
	}
`;

export default CommentList;