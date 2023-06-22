/*
  23-05-18 게시물 페이지 수정(오병주)
*/
import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import { LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled, EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { BOARD_LIKE_REQUEST, BOARD_DELETE_REQUEST } from "../../reducer/R_board";
import * as date from "../../lib/date.js";

const ContentPost = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { category, id, title } = useParams();

	// 필요한 리덕스 상태들
	const { LOGIN_data, BOARD_CONTENT, BOARD_DELETE_done, BOARD_DELETE_error, BOARD_LIKE_error } = useSelector(
		state => ({
			LOGIN_data: state.R_user_login.LOGIN_data,
			BOARD_CONTENT: state.R_board.BOARD_CONTENT,
			BOARD_DELETE_done: state.R_board.BOARD_DELETE_done,
			BOARD_DELETE_error: state.R_board.BOARD_DELETE_error,
			BOARD_LIKE_error: state.R_board.BOARD_LIKE_error
		}),
		shallowEqual
	);

	// 좋아요 버튼 누를때 함수
	const onClickLike = useCallback(() => {
		if (LOGIN_data.uid === "No_login") {
			if (!window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
				return;
			} 
			else {
				navigate(`/UserLogin`, {state: {url: `/Board/content/${category}/${id}/${title}`}});
			}
		}
		else {
			dispatch({
				type: BOARD_LIKE_REQUEST,
				data: {
					bid: BOARD_CONTENT.bid,
					state: 'like'
				}
			});
		}
	}, [BOARD_CONTENT.bid, LOGIN_data.uid, category, id, title, navigate, dispatch]);

	// 싫어요 버튼 누를때 함수
	const onClickUnLike = useCallback(() => {
		if (LOGIN_data.uid === "No_login") {
			if (!window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
				return;
			} 
			else {
				navigate(`/UserLogin`, {state: {url: `/Board/content/${category}/${id}/${title}`}});
			}
		}
		else {
			dispatch({
				type: BOARD_LIKE_REQUEST,
				data: {
					bid: BOARD_CONTENT.bid,
					state: 'unlike'
				}
			});
		}
	}, [BOARD_CONTENT.bid, LOGIN_data.uid, category, id, title, navigate, dispatch]);

	// 게시글 좋아요, 싫어요 실패시 useEffect
	useEffect(()=> {
		if (BOARD_LIKE_error) {
			alert('게시글 공감에 실패했습니다.');
			window.location.replace(`/Board/content/${category}/${id}/${title}`);
		}
	}, [BOARD_LIKE_error, category, id, title]);

	// 게시글 수정 페이지로 넘어가는 함수
	const onClickEdit = useCallback(()=> {
		navigate(`/Board/content/${id}/${title}/edit`, {state: {
			id: BOARD_CONTENT.bid,
			title: BOARD_CONTENT.btitle,
			content: BOARD_CONTENT.bdetail,
			category: BOARD_CONTENT.bcategory
		}});
	}, [id, title, BOARD_CONTENT.bid, BOARD_CONTENT.btitle, BOARD_CONTENT.bdetail, BOARD_CONTENT.bcategory, navigate]);

	// 게시글을 삭제하는 함수
	const onClickDelete = useCallback(()=> {
		if (!window.confirm("게시글을 삭제하시겠습니까?")) {
			return;
		} 

		dispatch({
			type: BOARD_DELETE_REQUEST,
			data: {
				bid: BOARD_CONTENT.bid
			}
		})
	}, [BOARD_CONTENT.bid, dispatch]);

	// 게시글 삭제 성공 여부에 따른 useEffect
	useEffect(()=> {
		if (BOARD_DELETE_done) {
			window.location.assign(`/Board/list/${category}/all/1`);
		}

		if (BOARD_DELETE_error) {
			alert('게시글 삭제에 실패했습니다.');
			window.location.assign(`/Board/list/${category}/all/1`);
		}
	}, [BOARD_DELETE_done, BOARD_DELETE_error, category]);
	
	return (
		<Content>
			<Aricle>
				<Header>
					<Title>
						{BOARD_CONTENT.btitle}
					</Title>
					<SubTitle>
						<MetaListLeft>
							<div className="category">
								{BOARD_CONTENT.bcategory}
							</div>
							<div className="time">
								<span title={BOARD_CONTENT.bdate}>
									{date.detailDate(new Date(BOARD_CONTENT.bdate))}
								</span>
							</div>
							<div className="name">
								{BOARD_CONTENT.uid}
							</div>
						</MetaListLeft>
						<MetaListRight>
							<div className="inq">
								<EyeOutlined style={{position:'relative', top:'-2px', paddingRight: "6px"}}/>
								<span>
									{BOARD_CONTENT.bclickindex}
								</span>
							</div>
							<div className="comment">
								댓글 {BOARD_CONTENT.commentCounts}
							</div>
							<div className="top">
								추천 {BOARD_CONTENT.likes - BOARD_CONTENT.unlikes}
							</div>
						</MetaListRight>
					</SubTitle>
				</Header>   
				<ContentWrapper>
					<ArticleContent dangerouslySetInnerHTML={{__html:BOARD_CONTENT.bdetail}}/>
					<AricleBox>
						<Vote>
							<ArticleVote>
								<button className="up" onClick={onClickLike}>
									<span className="like">
										{BOARD_CONTENT.like ? <LikeFilled style={{fontSize:"15px", color:"#46cea6"}}/> : <LikeOutlined style={{fontSize:"15px"}}/>}
									</span>
									<span className="number">
										{BOARD_CONTENT.likes}
									</span>
								</button>
								<button className="down" onClick={onClickUnLike}>
									<span className="like">
										{BOARD_CONTENT.unlike ? <DislikeFilled style={{fontSize:"15px", color:"#f95a53"}}/> : <DislikeOutlined style={{fontSize:"15px"}}/>}
									</span>
									<span className="number">
										{BOARD_CONTENT.unlikes}
									</span>
								</button>
								{LOGIN_data.uid === BOARD_CONTENT.uid ?
								<>
									<div className="delete" onClick={onClickDelete}>
										<DeleteOutlined/>
										<span>
											&nbsp;삭제하기
										</span>
									</div>
									<div className="edit" onClick={onClickEdit}>
                  	<EditOutlined/>
										<span>	
											&nbsp;수정하기
										</span>
                	</div>
								</> : null}
              </ArticleVote>
						</Vote>
					</AricleBox>
				</ContentWrapper>				
			</Aricle>
		</Content>
	);
};

const Content = styled.div`
	float: right;
	box-sizing: border-box;
	width: 728px;
	border: 1px solid #ebeef1;
`;

const Aricle = styled.div`
	background: #fff;
	box-shadow: 0 1px 2.5px 0 rgba(0, 0, 0, .15);
`;

const Header = styled.div`
	padding: 24px;
	padding-bottom: 40px;
	border-bottom: 1px solid #ebeef1;
`;

const Title = styled.div`
	line-height: 36px;
	font-size: 25px;
	color: #1e2022;
	word-wrap: break-word;
	word-break: break-all;
	overflow: auto;
`;

const SubTitle = styled.div`
	margin-top: 10px;
	line-height: 17px;
	font-size: 14px;
	color: #7b858e;
`;

const MetaListLeft = styled.div`
	float: left;
	margin-top: 0;

	.category {
		display: inline-block;
		font-size: 14px;
		height: 13px;
		padding-right: 14px;
		line-height: 12px;
		border-right: 1px solid #98a0a7;
	}

	.time {
		display: inline-block;
		font-size: 14px;
		height: 13px;
		padding-right: 14px;
		padding-left: 14px;
		line-height: 12px;
		border-right: 1px solid #98a0a7;
	}        

	.name {
		display: inline-block;
		font-size: 14px;
		height: 13px;
		padding-left: 14px;
		line-height: 12px;
	}
`;

const MetaListRight = styled.div`
	float: right;

	.inq {
		margin-left: 0;
		padding-left: 0;
		display: inline-block;
		vertical-align: middle;
		position: relative;
		height: 13px;
		border-right: 1px solid #98a0a7;

		span {
			position: relative;
			top: -3px;
			padding-right: 14px;
		}
  }

	.comment {
		display: inline-block;
		vertical-align: middle;
		position: relative;
		padding-left: 14px;
		padding-right: 14px;
		height: 13px;
		line-height: 12px;
		border-right: 1px solid #98a0a7;
	}

	.top {
		display: inline-block;
		vertical-align: middle;
		position: relative;
		padding-left: 14px;
		height: 13px;
		line-height: 12px;
	}
`;

const ContentWrapper = styled.div`
	overflow: auto;
`;

const ArticleContent = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 24px 20px;
	line-height: 24px;
	font-size: 16px;
	color: #1e2022;
	word-wrap: break-word;
	word-break: break-word;

	img {
		cursor: pointer !important;
	}
`;

const AricleBox = styled.div`
	border-top: 1px solid #ebeef1;
	text-align: center;
`;

const Vote = styled.div`
	padding: 12px 0;
	text-align: center;
`;

const ArticleVote = styled.div`
	position: relative;

	button {
		border-radius: 4px;
		background-color: #fff;
		border: 1px solid #dddfe4;
		cursor: pointer;
	}

	.up {
		padding: 12px;
		min-width: 88px;
		line-height: 17px;
		font-size: 14px;
		height: 43px;
		color: #1e2022;

		.like {
			height: 16px;
			background-size: 16px;
			vertical-align: top;
			overflow: hidden;
			display: inline-block;
			transition: all .5s;
			padding-right: 5px;
		}

		.number {
			display: inline-block;
			transition: all .3s;
		}
  }

	.down {
		padding: 12px;
		min-width: 88px;
		line-height: 17px;
		font-size: 14px;
		height: 43px;
		color: #1e2022;
		margin-left: 8px;
		cursor: pointer;

		.like {
			height: 16px;
			background-size: 16px;
			vertical-align: top;
			overflow: hidden;
			display: inline-block;
			transition: all .5s;
			padding-right: 5px;
		}
		.number {
			display: inline-block;
			transition: all .3s;
		}
  }

	.delete {
		position: absolute;
		top: 20px;
		right: 14px;
		color: #7b858e;
		font-size: 13px;
		cursor: pointer;
	}

  .edit {
		position: absolute;
		top: 20px;
		right: 94px;
		color: #7b858e;
		font-size: 13px;
		cursor: pointer;
	}
`;

export default ContentPost