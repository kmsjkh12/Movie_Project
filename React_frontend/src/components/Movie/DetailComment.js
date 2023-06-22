/*
	23-02-18 영화 상세정보 관람평 분리(오병주)
	23-02-23 영화 상세정보 관람평 백엔드 연결(오병주)
*/
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Rate } from 'antd';
import { SmileFilled, MehFilled, FrownFilled, DeleteOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { USER_COMMENT_LIKE_REQUEST } from '../../reducer/R_movie';
import { USER_COMMENT_DELETE_REQUEST } from '../../reducer/R_user_movie';
import { USER_MY_COMMENT_LIKE_UPDATE } from '../../reducer/R_mypage_movie';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const DetailComment = ({ comment }) => {
	const dispatch = useDispatch();
	const location = useLocation(); 
	const navigate = useNavigate();

	// 필요한 리덕스 상태들
  const { LOGIN_data, COMMENT_LIKE_error, COMMENT_LIKE_result } = useSelector(
    state => ({
			LOGIN_data: state.R_user_login.LOGIN_data,
      COMMENT_LIKE_error: state.R_movie.COMMENT_LIKE_error,
      COMMENT_LIKE_result: state.R_movie.COMMENT_LIKE_result
    }),
    shallowEqual
  );

	// 사용자가 관람평의 좋아요를 누를 때 호출되는 함수
  const LikeChange = useCallback(() => {
    if (LOGIN_data.uid === "No_login") {
			if (!window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
				return;
			} 
			else {
				navigate(`/UserLogin`, {state: {url: location.pathname}});
			}
		}
		else {
			dispatch({
				type: USER_COMMENT_LIKE_REQUEST,
				data: {
					umid: comment.umid
				},
			});
		}
  }, [LOGIN_data.uid, comment.umid, location.pathname, navigate, dispatch]);

	// 관람평 삭제 버튼 누르면 실행되는 함수
	const CommentDelete = useCallback(() => {
		if (!window.confirm("관람평을 삭제하시겠습니까?")) {
      return;
    };

		dispatch({
      type: USER_COMMENT_DELETE_REQUEST,
			data: comment.umid
    });
	}, [dispatch, comment.umid]);

	// UI에는 변경되지 않았지만 삭제된 관람평을 좋아요 누를 경우
	useEffect(()=> {
		if (COMMENT_LIKE_error === comment.umid) {
			alert("존재하지 않는 관람평입니다.");
			window.location.replace(location.pathname);
		}
	}, [COMMENT_LIKE_error, comment.umid, location.pathname]);

	// 자신의 관람평을 좋아요 눌렀을경우 마이페이지 ui 수정
	useEffect(()=> {
		if (COMMENT_LIKE_result && COMMENT_LIKE_result.umid === comment.umid) {
			dispatch({
				type: USER_MY_COMMENT_LIKE_UPDATE,
				data: COMMENT_LIKE_result
			});
		}
	}, [COMMENT_LIKE_result, comment.umid, dispatch]);

	return (
		<>
			<CommentElement>
				<span className='img'>
					{comment.umscore > 6 ? <SmileFilled style={{fontSize: "40px", color: "#4a4321"}}/> 
					: comment.umscore > 3 ? <MehFilled style={{fontSize: "40px", color: "#4a4321"}} /> : <FrownFilled style={{fontSize: "40px", color: "#4a4321"}}/>}
				</span>
				<div className='top'>
					<span className='name'>
						{comment.uid}
					</span>
					<span className='score'>
						<RateCustom allowHalf value={comment.umscore/2}/> 
						<span className='score_num'>
							{comment.umscore}
						</span>
					</span>
					<span className='date'>
						{comment.umcommenttime}
					</span>
				</div>
				<div className='middle'>
					{comment.umcomment}
				</div>
				<div className='bottom'>
					{/* 공백을 넣어줘서 간격을 벌림 */}
					<span>
						&nbsp;
					</span>
					<ButtonCustom style={{paddingLeft: "1px"}} onClick={LikeChange}>
						<span className='cnt'>
							{comment.upcnt}
						</span>
						{comment.like ? <LikeFilled style={{color: "#e61919"}}/> : <LikeOutlined/>}
					</ButtonCustom>			
					{comment.uid === LOGIN_data.uid && <ButtonCustom style={{marginLeft: "2px"}} onClick={CommentDelete}>
						<DeleteOutlined/>
					</ButtonCustom>}
				</div>
			</CommentElement>
		</>
	);
};

const CommentElement = styled.li`
	position: relative;
	padding: 22px 0 17px 68px;
	border-top: 1px solid #eee;
	list-style: none;

	.img {
		display: block;
    position: absolute;
    top: 25px;
    left: 10px;
    width: 42px;
    height: 42px;
	}

	.top {
		position: relative;
    margin-bottom: 10px;

		.name {
			display: block;
			font-size: 14px;
			margin-bottom: 1px;
			font-weight: 600;
		}

		.score {
			position: relative;
			font-size: 14px;
    	margin-right: 11px;

			.score_num {
				margin-left: 5px;
				font-weight: 600;
				vertical-align: bottom;
			}
		}

		.date {
			position: absolute;
			top: 0;
			right: 10px;
			font-family: "Roboto";
			font-size: 14px;
			color: #999;
		}
	}

	.middle {
		margin-bottom: 0;
    line-height: 20px;
		font-size: 13px;
		letter-spacing: 0.2px;
		word-spacing: 1.1px;
	}

	.bottom {
		margin-top: 12px;
		margin-bottom: 0;
    line-height: 20px;
    font-size: 13px;

		.cnt {
			float: right;
			vertical-align: top;
			line-height: 16px;
			margin-left: 8px;
		}
	}
`;

const RateCustom = styled(Rate)`
	pointer-events: none;
	color: #fea408;
	font-size: 16px;

	.ant-rate-star{
		margin-inline-end: 2px !important;
	}
`;

const ButtonCustom = styled.button`
	float: right;
  content: "";
  cursor: pointer;
  background-color: white;
  border: 0;
	padding: 0;
	margin-right: 12px;
`;

export default DetailComment;