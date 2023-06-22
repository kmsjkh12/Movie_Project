/*
  23-06-01 관리자 게시물 페이지 수정(오병주)
*/
import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import { LikeOutlined, DislikeOutlined, EyeOutlined, InfoCircleOutlined, CaretUpOutlined, CaretDownOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { MANAGER_BOARD_COMMENT_LIST_REQUEST, 
	MANAGER_BOARD_COMMENT_DELETE_REQUEST, 
	MANAGER_BOARD_COMMENT_DELETE_RESET, 
	MANAGER_BOARD_COMMENT_REPLY_DELETE_REQUEST,
	MANAGER_BOARD_COMMENT_REPLY_DELETE_RESET } from "../../reducer/R_manager_board.js";
import * as date from "../../lib/date.js";

const menu = [
	{name: "인기순", sort: "like"}, 
	{name: "최신순", sort: "new"}
];

const DocumentBoardDetail = ({ content, sort, setSort }) => {
	const dispatch = useDispatch();

	// 필요한 리덕스 상태들
	const { MANAGER_BOARD_COMMENT_LIST, MANAGER_BOARD_COMMENT_DELETE_done, MANAGER_BOARD_COMMENT_DELETE_error, 
		MANAGER_BOARD_COMMENT_REPLY_DELETE_done, MANAGER_BOARD_COMMENT_REPLY_DELETE_error } = useSelector (
		state => ({
			MANAGER_BOARD_COMMENT_LIST: state.R_manager_board.MANAGER_BOARD_COMMENT_LIST,
			MANAGER_BOARD_COMMENT_DELETE_done: state.R_manager_board.MANAGER_BOARD_COMMENT_DELETE_done,
			MANAGER_BOARD_COMMENT_DELETE_error: state.R_manager_board.MANAGER_BOARD_COMMENT_DELETE_error,
			MANAGER_BOARD_COMMENT_REPLY_DELETE_done: state.R_manager_board.MANAGER_BOARD_COMMENT_REPLY_DELETE_done,
			MANAGER_BOARD_COMMENT_REPLY_DELETE_error: state.R_manager_board.MANAGER_BOARD_COMMENT_REPLY_DELETE_error
		}),
		shallowEqual
	);

	// 댓글 정렬 상태 변경
	const onClickMenu = useCallback((data)=> {
		setSort(data);
	}, [setSort]);

	// 댓글 요청 useEffect
	useEffect(()=>{
		dispatch({
			type: MANAGER_BOARD_COMMENT_LIST_REQUEST,
			data: {
				bid: content.bid,
				sort: sort,
			}
		});
	}, [content.bid, sort, dispatch]);

	// 댓글 삭제하는 함수
	const onDeleteComment = useCallback((bcid)=> {
		if (!window.confirm("댓글을 삭제하시겠습니까?")) {
			return;
		} 
		else {
			dispatch({
				type: MANAGER_BOARD_COMMENT_DELETE_REQUEST,
				data: {
					bcid: bcid,
				}
			});
		}
	}, [dispatch]);

	// 댓글 삭제 성공여부에 따른 useEffect
	useEffect(()=> {
		// 삭제 성공
		if (MANAGER_BOARD_COMMENT_DELETE_done) {
			dispatch({
				type: MANAGER_BOARD_COMMENT_LIST_REQUEST,
				data: {
					bid: content.bid,
					sort: sort,
				}
			});

			dispatch({
				type: MANAGER_BOARD_COMMENT_DELETE_RESET
			});
		}

		// 삭제 실패
		if (MANAGER_BOARD_COMMENT_DELETE_error) {
			alert('댓글 삭제에 실패했습니다.');

			dispatch({
				type: MANAGER_BOARD_COMMENT_LIST_REQUEST,
				data: {
					bid: content.bid,
					sort: sort,
				}
			});

			dispatch({
				type: MANAGER_BOARD_COMMENT_DELETE_RESET
			});
		}
	}, [MANAGER_BOARD_COMMENT_DELETE_done, MANAGER_BOARD_COMMENT_DELETE_error, content.bid, sort, dispatch]);

	// 답글 삭제하는 함수
	const onDeleteReply = useCallback((bcid)=> {
		if (!window.confirm("답글을 삭제하시겠습니까?")) {
			return;
		} 
		else {
			dispatch({
				type: MANAGER_BOARD_COMMENT_REPLY_DELETE_REQUEST,
				data: {
					bcid: bcid,
				}
			});
		}
	}, [dispatch]);

	// 답글 삭제 성공여부에 따른 useEffect
	useEffect(()=> {
		// 삭제 성공
		if (MANAGER_BOARD_COMMENT_REPLY_DELETE_done) {
			dispatch({
				type: MANAGER_BOARD_COMMENT_LIST_REQUEST,
				data: {
					bid: content.bid,
					sort: sort,
				}
			});

			dispatch({
				type: MANAGER_BOARD_COMMENT_REPLY_DELETE_RESET
			});
		}

		// 삭제 실패
		if (MANAGER_BOARD_COMMENT_REPLY_DELETE_error) {
			alert('답글 삭제에 실패했습니다.');
			
			dispatch({
				type: MANAGER_BOARD_COMMENT_LIST_REQUEST,
				data: {
					bid: content.bid,
					sort: sort,
				}
			});

			dispatch({
				type: MANAGER_BOARD_COMMENT_REPLY_DELETE_RESET
			});
		}
	}, [MANAGER_BOARD_COMMENT_REPLY_DELETE_done, MANAGER_BOARD_COMMENT_REPLY_DELETE_error, content.bid, sort, dispatch]);
	
	return (
		<>
			<Content>
				<Aricle>
					<Header>
						<Title>
							{content.btitle}
						</Title>
						<SubTitle>
							<MetaListLeft>
								<div className="category">
									{content.bcategory}
								</div>
								<div className="time">
									<span title={content.bdate}>
										{date.detailDate(new Date(content.bdate))}
									</span>
								</div>
								<div className="name">
									{content.uid}
								</div>
							</MetaListLeft>
							<MetaListRight>
								<div className="inq">
									<EyeOutlined style={{position:'relative', top:'-2px', paddingRight: "6px"}}/>
									<span>
										{content.bclickindex}
									</span>
								</div>
								<div className="comment">
									댓글 {content.commentCounts}
								</div>
								<div className="top">
									추천 {content.likes - content.unlikes}
								</div>
							</MetaListRight>
						</SubTitle>
					</Header>   
					<ContentWrapper>
						<ArticleContent dangerouslySetInnerHTML={{__html:content.bdetail}}/>
						<AricleBox>
							<Vote>
								<ArticleVote>
									<button className="up">
										<span className="like">
											<LikeOutlined style={{fontSize:"15px"}}/>
										</span>
										<span className="number">
											{content.likes}
										</span>
									</button>
									<button className="down">
										<span className="like">
											<DislikeOutlined style={{fontSize:"15px"}}/>
										</span>
										<span className="number">
											{content.unlikes}
										</span>
									</button>
								</ArticleVote>
							</Vote>
						</AricleBox>
					</ContentWrapper>				
				</Aricle>
			</Content>
			<Comment>
				<CommentHeader>
					<Left>
						<h2>
							댓글
						</h2>
						<span>
							총 {MANAGER_BOARD_COMMENT_LIST.count}개
						</span>
					</Left>
				</CommentHeader>
				<CommentList>
					<Sort>
						<ul>
							{menu.map((data, index)=>
							<li key={index}>
								<SortButton category={data.sort} sort={sort} onClick={() => {onClickMenu(data.sort)}}>
									{data.name}
								</SortButton>
							</li>)}				
						</ul>
					</Sort>
				</CommentList>
				{MANAGER_BOARD_COMMENT_LIST.content && MANAGER_BOARD_COMMENT_LIST.content.length === 0 &&
				<NotFound>
					<InfoCircleOutlined style={{fontSize: "30px"}}/>
					<NotFoundMsg>
						등록된 댓글이 없습니다.
					</NotFoundMsg>
				</NotFound>}
				<CommentData>
				{MANAGER_BOARD_COMMENT_LIST.content && MANAGER_BOARD_COMMENT_LIST.content.map((comment)=>
					<li key={comment.bcid}>
						<div className="comment">
							<div className="number">
								<div className="up">
									<CaretUpOutlined/>
								</div>
								<div className="num">
									{comment.likes - comment.unlikes}
								</div>
								<div className="down">
									<CaretDownOutlined/>
								</div>
							</div>
							<div className="name">
								<span className="id">
									{comment.uid}
								</span>
								<span className="time" title={comment.bcdate}>
									{date.detailDate(new Date(comment.bcdate))}
								</span>
							</div>
							<div className="comment-content">
								<p>
									{comment.bccomment}
								</p>
							</div>
						</div>
						<CommentButtons>
							<ButtonDel onClick={()=> onDeleteComment(comment.bcid)}>
								<DeleteOutlined style={{paddingRight:"2px"}}/> 삭제하기
							</ButtonDel>
						</CommentButtons>
						{comment.child.map((comment_child)=>
						<CommentReply key={comment_child.bcid}>
							<div className="reply">
								<div className="reply_name">
									<span className="reply_id">
										{comment_child.uid}
									</span>
									<span className="reply_time" title={comment_child.bcdate}>
										{date.detailDate(new Date(comment_child.bcdate))}
									</span>
								</div>
								<div className="comment_reply">
									<p>
										{comment_child.parentUid ? 
										<strong>
											{comment_child.parentUid}
										</strong> : null}
										{comment_child.bccomment}
									</p>
								</div>
							</div>
							<ReplyButtons>
								<ReplyButtonDel onClick={()=> onDeleteReply(comment_child.bcid)}>
									<DeleteOutlined style={{paddingRight:"2px"}}/> 삭제하기
								</ReplyButtonDel>
							</ReplyButtons>
						</CommentReply>)}            
					</li>)}
				</CommentData>
			</Comment>
		</>
	);
};

const Content = styled.div`
	box-sizing: border-box;
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

const Comment = styled.div`
	box-sizing: border-box;
	margin-top: 40px;
	background-color: #fff;
	box-shadow: 0 1px 2.5px 0 rgba(0, 0, 0, .15);
	border: 1px solid #ebeef1;
`;

const CommentHeader= styled.div`
	z-index: auto;
	position: relative;
	top: 0px;
	padding: 18px;
	display: flex;
	justify-content: space-between;
`;

const Left = styled.div`
	h2 {
		display: inline;
		line-height: 21px;
		font-size: 18px;
		color: #1e2022;
	}

	span {
		margin-left: 7px;
		line-height: 18px;
		font-size: 14px;
		color: #7b858e;
	}   
`;

const CommentList = styled.div`
	height: 48px;
	border-bottom: 1px solid #dddfe4;
`;

const Sort = styled.div`
	ul {
		list-style: none;	
		padding-left: 20px;

		li {
			float: left;	

			&:first-child {
      margin-right: 10px;
    	}
		}
	}
`;

const SortButton = styled.button`
	padding: 15px 16px 12px;
	line-height: 19px;
	font-size: 16px;
	color: #1e2022;
	border-bottom: 3px solid transparent;
	background: none;
	font-family: inherit;
	border-right: 0;  
	border-left: 0;                
	border-top: 0; 
	color: ${(props) => props.category === props.sort ? "#16ae81" : ""};
	border-color: ${(props) => props.category === props.sort ? "#46cfa7" : ""};
	cursor: pointer;
`;

const NotFound = styled.div`
	background: #fff;
	padding: 70px 0;
	text-align: center;
	color: #7b858e;
`;

const NotFoundMsg = styled.div`
	margin-top: 12px;
	line-height: 20px;
	font-size: 16px;
	color: #7b858e;
`;

const CommentData = styled.ul`
	list-style-type: none;
	position: relative;
	margin: 0;
	padding-left: 0;
	width: 100%;

	li {
    width: 100%;
    position: relative;
    border-top: 1px solid #dddfe4;

		&:first-child {
			border-top: none;
    }

		.comment {
			position: relative;
			padding: 12px 12px 12px 64px;

			.number {
				position: absolute;
				left: 25px;
				top: 23px;
				text-align: center;

				.colorup {
					color: #46cea6;
				}

				.colordown{
					color: #f95a53;
				}
			}

			.name {
				line-height: 17px;
				font-size: 14px;
				margin-top: 5px;
				color: #7b858e;

				.id {
					display: inline-block;
					font-weight: 700;
					color: #1e2022;
					word-wrap: break-word;
					word-break: break-all;
					padding-right: 14px;
					line-height: 10px;
					height: 12px;
					border-right: 1px solid #98a0a7;
				}

				.time{
						padding-left: 14px;
				}
			}
    }
		.comment-content{
			line-height: 25px;
			font-size: 15px;
			color: #1e2022;
			word-wrap: break-word;
			word-break: break-all;
			overflow: auto;
			max-height: 400px;
		}
	}
`;

const CommentButtons = styled.div`
	position:relative;
	top: -20px;
	left: 65px;
	color: #7b858e;
	margin-top: 5px;
	line-height: 20px;
	font-size: 14px;
	word-wrap: break-word;
	word-break: break-all;
	max-height: 400px;
`;

const ButtonDel = styled.button`
	color: red;
	border: none;
	background: white;
	padding: 0;
	vertical-align: middle;
	cursor: pointer;
`;

const CommentReply = styled.div`
	background: #f8f9fa;
	position: relative;
	padding: 13px 12px 10px 66px;
	border-top: 1px solid #ebeef1;

	::before {
		position: absolute;
		top: 12px;
		left: 60px;
		content: "";
		width: 12px;
		height: 12px;
		border-left: 1px solid #c5cbd0;
    border-bottom: 1px solid #c5cbd0;
	}

	.reply {
		position: relative;
		padding-left: 20px;
		font-size: 14px;
		color: #7b858e;

		.reply_id {
			display: inline-block;
			font-weight: 700;
			color: #1e2022;
			word-wrap: break-word;
			word-break: break-all;
			padding-right: 14px;
			line-height: 10px;
			height: 12px;
			border-right: 1px solid #98a0a7;
		}

		.reply_time{
			padding-left: 14px;
		}
		
		.comment_reply {
			line-height: 25px;
			font-size: 15px;
			color: #1e2022;
			word-wrap: break-word;
			word-break: break-all;
			overflow: auto;
			max-height: 400px;

			p {
				margin-top: 12px;

				strong {
					display: inline-block;
					font-weight: 400;
					padding: 0 2px;
					margin-right: 5px;
					background: #d1f2e8;
					color: #16ae81;
				}
			}
		}
	}
`;

const ReplyButtons = styled.div`
	position: relative;
	top: -10px;
	left: 20px;
	color: #7b858e;
	margin-top: 5px;
	line-height: 20px;
	font-size: 14px;
	word-wrap: break-word;
	word-break: break-all;
	max-height: 400px;
`;

const ReplyButtonDel = styled.button`
	color: red;
	border: none;
	background: #f8f9fa;
	padding: 0;
	vertical-align: middle;
	cursor: pointer;
`;

export default DocumentBoardDetail