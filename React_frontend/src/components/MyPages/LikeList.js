/*
 23-03-11 마이페이지 css 구축(오병주)
*/
import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Like from './Like';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { USER_MY_MOVIE_SEARCH_REQUEST } from '../../reducer/R_movie';
import MyPageLoading from './MyPageLoading';
import { useLocation } from "react-router-dom";

const LikeList = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	// 필요한 리덕스 상태들
  const { LOGIN_data, likeMovie, MY_MOVIE_loading, MY_MOVIE_key } = useSelector(
    state => ({
			LOGIN_data: state.R_user_login.LOGIN_data,
      likeMovie: state.R_movie.likeMovie,
      MY_MOVIE_loading: state.R_movie.MY_MOVIE_loading,
			MY_MOVIE_key: state.R_movie.MY_MOVIE_key
    }),
    shallowEqual
  );

	// 찜한 영화 요청
  useEffect(() => {
		// 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청(뒤로가기시 리렌더링 안함)
		if (LOGIN_data.uid !== 'No_login' && MY_MOVIE_key !== location.key) {
			dispatch({
				type: USER_MY_MOVIE_SEARCH_REQUEST,
				data: location.key
			});
		}
  }, [LOGIN_data.uid, MY_MOVIE_key, location, dispatch]);

	// 좋아요 누른 영화 개수
	const movie_length = useMemo(() => likeMovie.filter(movie => movie.mlike).length, [likeMovie]);

	return (
		<Content>
			<ContentTitle>
				<ContentLeft>
					<h2>
						찜한 영화 ({movie_length})
					</h2>
				</ContentLeft>
			</ContentTitle>
			<ContentLine/>
			<ContentDetails>
				{LOGIN_data.uid === 'No_login' || MY_MOVIE_loading ? <MyPageLoading/> : 
				likeMovie.length !== 0 ? likeMovie.map((movie, index) => movie.mlike && <Like movie={movie} key={index}/>) : 
				<NoContent>
					<span>
						<InfoCircleOutlined/>
					</span>
						찜한 영화가 존재하지 않습니다.						
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

export default LikeList;