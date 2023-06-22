import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PicCenterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { MANAGER_MOVIE_LIST_COMMENT_REQUEST, MANAGER_MOVIE_COMMENT_SELECT, MANAGER_MOVIE_COMMENT_LIST_REQUEST, } from '../../reducer/R_manager_user';
import DocumentMovieComment from './DocumentMovieComment';
import DocumentBoard from './DocumentBoard'
import ManagerLoading from './ManagerLoading';
import { useNavigate } from 'react-router-dom';

const DocumentLayout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// 필요한 리덕스 상태들
  const { LOGIN_data, LOGIN_STATUS_done, MOVIE_LIST_COMMENT_loading, 
		MOVIE_LIST_COMMENT, MOVIE_COMMENT, MOVIE_COMMENT_LIST } = useSelector(
    state => ({
      LOGIN_data: state.R_user_login.LOGIN_data,
			LOGIN_STATUS_done: state.R_user_login.LOGIN_STATUS_done,
			MOVIE_LIST_COMMENT_loading: state.R_manager_user.MOVIE_LIST_COMMENT_loading,
      MOVIE_LIST_COMMENT: state.R_manager_user.MOVIE_LIST_COMMENT,
      MOVIE_COMMENT: state.R_manager_user.MOVIE_COMMENT,
			MOVIE_COMMENT_LIST: state.R_manager_user.MOVIE_COMMENT_LIST
    }),
    shallowEqual
  );

	// 모든 영화 조회 useEffect
  useEffect(() => {
		// 관리자 이외의 계정은 접근 불가능
		if (LOGIN_STATUS_done && LOGIN_data.uid !== 'manager') {
			alert('관리자 계정만 사용 가능합니다. 관리자 계정으로 로그인 해주세요! (id : manager, pw: manager123456)');
			navigate('/');
		}

		 // 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청
		 if (LOGIN_data.uid === 'manager') {
      dispatch({
        type: MANAGER_MOVIE_LIST_COMMENT_REQUEST
      });
    }
  }, [LOGIN_data.uid, LOGIN_STATUS_done, navigate, dispatch]);

	// 예매기록 조회 useEffect (영화 선택)
  useEffect(()=> {
    // 영화 선택시 백엔드 호출
    if (MOVIE_COMMENT !== '') {
      dispatch({
        type: MANAGER_MOVIE_COMMENT_LIST_REQUEST,
        data: {
          mid: MOVIE_COMMENT.mid
        }
      });
    }
  }, [MOVIE_COMMENT, dispatch])

	// 영화 목록들 중 하나를 클릭할때
	const MovieClick = useCallback((movie) => {
		dispatch({
			type: MANAGER_MOVIE_COMMENT_SELECT,
			data: movie
		})
	}, [dispatch])

	// css를 위한 버튼 변수
	const [moviecommentbutton, setmoviecommentbutton] = useState(true);
	const [noticebutton, setnoticebutton] = useState(false);

	// 관람평 버튼 누를때
	const onMovieComment = useCallback(() => {
		setmoviecommentbutton(true);
		setnoticebutton(false);
	}, []);

	// 게시물 버튼 누를때
	const onNotice = useCallback(() => {
		setmoviecommentbutton(false);
		setnoticebutton(true);
	}, [])

	return (
		<Container>
      <InnerWraps>
        <div className="titleMenu">
          <button className={moviecommentbutton ? "hover" : "not_hover"} onClick={onMovieComment}>
            관람평관리
          </button>
					<button className={noticebutton ? "hover" : "not_hover"} onClick={onNotice}>
						게시판관리
					</button>
        </div>
				{moviecommentbutton ? <>
				<MovieAreaChoice>
					<TabLeft>
						<ul>
							<li className="hover tab">
								<div>
									<i>
										<PicCenterOutlined/>
									</i>
									영화
								</div>
							</li>
						</ul>
					</TabLeft>
					<TabCenter>
						{!LOGIN_STATUS_done || MOVIE_LIST_COMMENT_loading ? <ManagerLoading/> :
						<MovieWrapper>
              <ListSection>
								<ScrollBar>
									<MovieContainer>
										<ul>
										{MOVIE_LIST_COMMENT.map((movie)=> 
											<Movies title={movie.mtitle} key={movie.mid} movie={movie.mid} movieData={MOVIE_COMMENT}>
												<button onClick={()=> MovieClick(movie)}>       
													{movie.mtitle}
												</button>
											</Movies>)}
										</ul>
										</MovieContainer>
								</ScrollBar>
							</ListSection>
							<Poster>
								<Info> 
									<img src={`/${MOVIE_COMMENT.mimagepath}`} style={{width:"100%" ,height:"100%"}} alt ='Poster'/>
								</Info>
							</Poster>
						</MovieWrapper>}
					</TabCenter>
				</MovieAreaChoice>
				<Notice>
					* 검색결과 <strong>{MOVIE_COMMENT_LIST.length}</strong>건이 검색되었습니다. (더블 클릭시 관람평 전체내용 조회가능)
				</Notice>
				<DocumentMovieComment/></> : 
				<>
					<DocumentBoard/>
				</>}
      </InnerWraps>
     </Container>
	);
};

const Container = styled.div`
  padding: 0;
  width: 1235px;
  margin : 0 auto;
  box-sizing: border-box; 
  margin-bottom: 0;
  min-height: 820px;
`;

const InnerWraps = styled.div`
  width: 100%;
  padding-left: 10px;

  .titleMenu {
    position: relative;
    top: 18px;

		.not_hover {
			color: #999;
		}

		button:first-child {
			margin-left: 0;
			::before {
				display: none;
			}
		}

		button {
			position: relative;
			font-size: 2em;
			margin-block-start: 0.67em;
			margin-block-end: 0.67em;
			margin-inline-start: 0px;
			margin-inline-end: 0px;
			font-weight: bold;
			border: none;
			background-color: white;
			padding: 0;
			cursor: pointer;
			margin-left: 30px;
			margin-bottom: 14.2px;

			::before {
				position: absolute;
				top: 5px;
				left: -14px;
				height: 37px;
				vertical-align: middle;
				content: "";
				border-left: 2px solid #dddfe4;
			}
		}
  }
`;

const MovieAreaChoice = styled.div`
	overflow: hidden;
	position: relative;
	width: 100%;
	height: 300px;
	margin: 0;
	border: 3px solid #686571;
	border-radius: 10px;
	padding: 0;
	margin-bottom: 50px;
	margin-top: 21.2px;
`;

const TabLeft = styled.div`
	float: left;
	width: 145px;
	height: 100%;

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;

		.hover {
		background-color: #fff;
		border-right: none;
		}

    li {
			cursor:pointer;
			display: block;
			text-align: center;
			width: 100%;
			height: 300px;
			line-height: 300px;
			background-color: #f2f4f5;

			div {
				display: block;
				color: #444;
				font-size: 1.2em;
				font-weight: 400;
				text-decoration: none;

				i	{
					width: 39px;
					height: 32px;
					overflow: hidden;
					display: inline-block;
					margin-bottom: 5px;
					margin-right: 5px;
					padding: 0;
					font-size: 32px;
					line-height: 0;
					vertical-align: middle;
					background-position: 0 0;
					background-repeat: no-repeat;
				}
			}
    }
  }
`;

const TabCenter = styled.div`
`;

const MovieWrapper = styled.div`
	position: absolute;
	left: 180px;
	top: 0;
	display: block;
	width: calc(100% - 180px);
	height: 300px;
	padding: 0;
`;

const ListSection = styled.div`
	overflow: hidden;
	width: 800px;
	height: 240px;
	padding: 20px 0;
`;

const ScrollBar = styled.div`
	height: 200px;
	position: relative;
	overflow: hidden;
	height: 100%;
	max-width: 100%;
	outline: 0;
	direction: ltr;   
	max-height: none;
`;

const MovieContainer = styled.div`
	position: relative;
	top: 0;
	left: 0;
	overflow:auto;
	height:100%;

	ul {
		overflow: hidden;
		position: relative;
		display: block;
		min-height: 145px;
		list-style-type: none;
		margin: 0;
		padding: 0;
  }
`;

const Movies = styled.li`
	float: left;
	width: 25%;
	padding: 0;
	background-color: ${(props) => props.movieData.mid === props.movie ? "#E2E2E2" : "white"};

	button {
    display: block;
    width: 100%;
    height: 50px;
    margin: 0;
    padding: 0 28px 0 10px;
    color: #444;
    border: 0;
    text-align: left;
    background-color: transparent;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    letter-spacing: -.5px;
    font-weight: 400;
		font-size: 15px;
	}
`;

const Poster = styled.div`
	position: absolute;
	right: 0;
	top: 0;
	width: 206px;
	height: 100%;
`;

const Info = styled.div`
	display: block;
	width: 100%;
	height: 100%;
`

const Notice = styled.div`
	float: right;
	margin-bottom: 8px;
	font-size: 17px;
`;

export default DocumentLayout;