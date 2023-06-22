/*
  23-05-18 게시물 페이지 수정(오병주)
*/
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { SyncOutlined, LoadingOutlined, CaretUpOutlined, CaretDownOutlined, MessageOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { 
	BOARD_COMMENT_LIST_REQUEST, 
	BOARD_COMMENT_WRITE_REQUEST, 
	BOARD_COMMENT_WRITE_RESET,
	BOARD_COMMENT_DELETE_REQUEST,
	BOARD_COMMENT_DELETE_RESET,
	BOARD_COMMENT_LIKE_REQUEST,
	BOARD_REPLY_KEY_SETTING,
 } from "../../reducer/R_board";
import ContentReplyWriting from "./ContentReplyWriting";
import ContentCommentReply from "./ContentCommentReply";
import * as date from "../../lib/date.js";

const menu = [
	{name: "인기순", sort: "like"}, 
	{name: "최신순", sort: "new"}
];

const ContentComment = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { category, id, title } = useParams();

	// 필요한 리덕스 상태들
	const { LOGIN_data, BOARD_COMMENT_LIST_loading, BOARD_COMMENT_LIST, BOARD_COMMENT_WRITE_done, BOARD_COMMENT_WRITE_error, 
		BOARD_COMMENT_DELETE_done, BOARD_COMMENT_DELETE_error, BOARD_COMMENT_LIKE_error, BOARD_Reply_Id, BOARD_COMMENT_REPLY_WRITE_done,
		BOARD_COMMENT_REPLY_DELETE_done } = useSelector(
		state => ({
			LOGIN_data: state.R_user_login.LOGIN_data,
			BOARD_COMMENT_LIST_loading: state.R_board.BOARD_COMMENT_LIST_loading,
			BOARD_COMMENT_LIST: state.R_board.BOARD_COMMENT_LIST,
			BOARD_COMMENT_WRITE_done: state.R_board.BOARD_COMMENT_WRITE_done,
			BOARD_COMMENT_WRITE_error: state.R_board.BOARD_COMMENT_WRITE_error,
			BOARD_COMMENT_DELETE_done: state.R_board.BOARD_COMMENT_DELETE_done,
			BOARD_COMMENT_DELETE_error: state.R_board.BOARD_COMMENT_DELETE_error,
			BOARD_COMMENT_LIKE_error: state.R_board.BOARD_COMMENT_LIKE_error,
			BOARD_Reply_Id: state.R_board.BOARD_Reply_Id,
			BOARD_COMMENT_REPLY_WRITE_done: state.R_board.BOARD_COMMENT_REPLY_WRITE_done,
			BOARD_COMMENT_REPLY_DELETE_done: state.R_board.BOARD_COMMENT_REPLY_DELETE_done
		}),
		shallowEqual
	);

	// 댓글 정렬 상태
	const [sort, setSort] = useState("like");
	const onClickMenu = useCallback((data)=> {
		setSort(data);
	}, []);

	// 댓글 요청 useEffect
	useEffect(()=>{
		dispatch({
			type: BOARD_COMMENT_LIST_REQUEST,
			data: {
				bid: id,
				sort: sort,
				uid: LOGIN_data.uid
			}
		});
	}, [id, sort, LOGIN_data.uid, dispatch]);

	// 댓글 내용 상태
	const [text, setText] = useState("");
	const onChangeText = useCallback((e)=>{
		setText(e.target.value);
	}, []);

	// 새로고침 함수
	const onClickRefresh = useCallback(()=> {
		dispatch ({
			type: BOARD_COMMENT_LIST_REQUEST,
			data: {
				bid: id,
				sort: sort,
				uid: LOGIN_data.uid
			}
		});
	}, [id, sort, LOGIN_data.uid, dispatch]);

	// 댓글 작성하는 함수
	const onClickComment = useCallback(() => {
		// 댓글이 빈칸일경우
		if (text.trim() === '') {
			alert('댓글을 작성해주세요.');
			return;
		}

		if (!window.confirm("댓글을 작성하시겠습니까?")) {
			return;
		} 

		dispatch({
			type: BOARD_COMMENT_WRITE_REQUEST,
			data: {
				comment: text,
				bid: id
			}
		});
	}, [dispatch, text, id]);
       
	// 댓글 작성 성공여부에 따른 useEffect
	useEffect(()=> {
		// 작성 성공
		if (BOARD_COMMENT_WRITE_done) {
			setSort('new');
			setText('');
			onClickRefresh();
			dispatch({
				type: BOARD_COMMENT_WRITE_RESET
			});
		}

		// 작성 실패
		if (BOARD_COMMENT_WRITE_error) {
			alert('댓글 작성에 실패했습니다.');
			window.location.replace(`/Board/content/${category}/${id}/${title}`);
		}
	}, [BOARD_COMMENT_WRITE_done, BOARD_COMMENT_WRITE_error, category, id, title, onClickRefresh, dispatch]);

	// 댓글 좋아요 함수
	const onClickUp = useCallback((data)=> {
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
				type: BOARD_COMMENT_LIKE_REQUEST,
				data: {
					bid: id,
					bcid: data.bcid,
					state: 'like'
				}
			});
		}
	}, [LOGIN_data.uid, category, id, title, navigate, dispatch]);

	// 댓글 싫어요 함수
	const onClickDown = useCallback((data) => {
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
				type: BOARD_COMMENT_LIKE_REQUEST,
				data: {
					bid: id,
					bcid: data.bcid,
					state: 'unlike'
				}
			});
		}
	}, [LOGIN_data.uid, category, id, title, navigate, dispatch]);

	// 댓글 좋아요, 싫어요 실패시 useEffect
	useEffect(()=> {
		if (BOARD_COMMENT_LIKE_error) {
			alert('댓글 공감에 실패했습니다.');
			window.location.replace(`/Board/content/${category}/${id}/${title}`);
		}
	}, [BOARD_COMMENT_LIKE_error, category, id, title]);

	// 답글 입력칸 띄어주는 함수
	const onReply = useCallback((bcid)=> {
		if (LOGIN_data.uid === "No_login") {
			if (!window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
				return;
			} 
			else {
				navigate(`/UserLogin`, {state: {url: `/Board/content/${category}/${id}/${title}`}});
			}
		}
		else {
			if (BOARD_Reply_Id === bcid) {
				dispatch({
					type: BOARD_REPLY_KEY_SETTING,
					data: ''
				})
			}
			else {
				dispatch({
					type: BOARD_REPLY_KEY_SETTING,
					data: bcid
				})
			}
		}
	}, [LOGIN_data.uid, category, id, title, BOARD_Reply_Id, dispatch, navigate]);

	// 답글 작성 성공시 새로고침 useEffect
	useEffect(()=> {
		if (BOARD_COMMENT_REPLY_WRITE_done) {
			onClickRefresh();
		}
	}, [BOARD_COMMENT_REPLY_WRITE_done, onClickRefresh, dispatch]);

	// 페이지 탈출시 답글 입력칸 ID 초기화를 위한 useEffect
  useEffect(() => {
    return () => {
      dispatch({
				type: BOARD_REPLY_KEY_SETTING,
				data: ''
			})
    };
  }, [dispatch]);

	// 댓글 삭제하는 함수
	const onDelete = useCallback((bcid)=> {
		if (!window.confirm("댓글을 삭제하시겠습니까?")) {
			return;
		} 
		else {
			dispatch({
				type: BOARD_COMMENT_DELETE_REQUEST,
				data: {
					bcid: bcid,
				}
			});
		}
	}, [dispatch]);

	// 댓글 삭제 성공여부에 따른 useEffect
	useEffect(()=> {
		// 삭제 성공
		if (BOARD_COMMENT_DELETE_done) {
			onClickRefresh();
			dispatch({
				type: BOARD_COMMENT_DELETE_RESET
			});
		}

		// 삭제 실패
		if (BOARD_COMMENT_DELETE_error) {
			alert('댓글 삭제에 실패했습니다.');
			window.location.replace(`/Board/content/${category}/${id}/${title}`);
		}
	}, [BOARD_COMMENT_DELETE_done, BOARD_COMMENT_DELETE_error, category, id, title, onClickRefresh, dispatch]);

	// 답글 삭제 성공시 새로고침 useEffect
	useEffect(()=> {
		if (BOARD_COMMENT_REPLY_DELETE_done) {
			onClickRefresh();
		}
	}, [BOARD_COMMENT_REPLY_DELETE_done, onClickRefresh, dispatch]);

	return (
		<Comment>
			<CommentHeader>
				<Left>
					<h2>
						댓글
					</h2>
					<span>
						총 {BOARD_COMMENT_LIST.count}개
					</span>
				</Left>
				<Right>
					<button>
						<span className="icon">
							{BOARD_COMMENT_LIST_loading ? <LoadingOutlined/> : <SyncOutlined/>} 
						</span>
						<span onClick={onClickRefresh}>
							새로고침
						</span>
					</button>
				</Right>
			</CommentHeader>
			{LOGIN_data.uid !== "No_login" ? 
			<CommnetWrite>
				<div className="form">
					<div className="text">
						<textarea placeholder="댓글을 작성해주세요." maxLength={99} value={text} onChange={onChangeText}/>
					</div>
					<div className="info">
						<div className="number">
							{text.length} / 100
						</div>
						<div className="writebutton">
							<button className="write" onClick={onClickComment}>
								작성하기
							</button>
						</div>
					</div>
				</div>
			</CommnetWrite> : null}
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
			{BOARD_COMMENT_LIST.content && BOARD_COMMENT_LIST.content.length === 0 &&
			<NotFound>
				<InfoCircleOutlined style={{fontSize: "30px"}}/>
				<NotFoundMsg>
					등록된 댓글이 없습니다.
				</NotFoundMsg>
			</NotFound>}
			<CommentData>
				{BOARD_COMMENT_LIST.content && BOARD_COMMENT_LIST.content.map((comment)=>
				<li key={comment.bcid}>
					<div className="comment">
						<div className="number">
							<div className={comment.like ? "colorup ": "up"} onClick={()=> onClickUp(comment)}>
								<CaretUpOutlined style={{cursor:'pointer'}}/>
							</div>
							<div className="num">
								{comment.likes - comment.unlikes}
							</div>
							<div className={comment.unlike? "colordown": "down"} onClick={()=> onClickDown(comment)}>
								<CaretDownOutlined style={{cursor:'pointer'}}/>
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
						<ButtonReply onClick={()=> onReply(comment.bcid)}>
							<MessageOutlined style={{paddingRight:"3px"}}/> 답글쓰기
						</ButtonReply>
						{comment.uid === LOGIN_data.uid ? 
						<ButtonDel onClick={()=> onDelete(comment.bcid)}>
							<DeleteOutlined style={{paddingRight:"2px"}}/> 삭제하기
						</ButtonDel> : null}
					</CommentButtons>
					{BOARD_Reply_Id === comment.bcid ? <ContentReplyWriting bcroot={comment.bcroot} bcid={comment.bcid} margin={false}/> : null}
					<ContentCommentReply child={comment.child}/> 
				</li>)}
			</CommentData>
		</Comment>
	);
};

const Comment = styled.div`
	float: right;
	box-sizing: border-box;
	width: 728px;
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

const Right = styled.div`
	button {
		background: none;
		line-height: 17px;
		font-size: 14px;
		color: #7b858e;
		background: none;
		cursor: pointer;
		font-family: inherit;
		border: 0;
		padding: 0;
		border-radius: 0; 
		-webkit-border-radius: 0;

		span {
			vertical-align: middle;
		}

		.icon {
			padding-right: 7px;
		}
	}
`;

const CommnetWrite = styled.div`
	padding: 24px 16px;
	background: #f8f9fa;

	.form {
		background-color: #fff;
		border: 1px solid #dddfe4;

		.text {
			margin: 8px 12px 0;
			padding-bottom: 16px;

			textarea {
				overflow: hidden;
				overflow-wrap: break-word;
				height: 70px;
				display: block;
				width: 100%;
				min-height: 40px;
				line-height: 20px;
				font-size: 14px;
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
				resize: none;
				border: none;
				outline: none;
				font-family: Helvetica,Arial, Malgun Gothic,sans-serif;
			}
    }

		.info {
			position: relative;
			border-top: 1px solid #dddfe4;
			min-height: 42px;
			box-sizing: border-box;
			padding-right: 186px;

			.number {
				font-size: 14px;
				line-height: 17px;
				color: #7b858e;
				position: absolute;
				right: 100px;
				bottom: 12px;
			}

			.writebutton {
				position: absolute;
				right: 0;
				bottom: 0;

				.write {
					cursor: pointer;
					width: 92px;
					padding: 10px 9px;
					line-height: 20px;
					font-size: 16px;
					border-radius: 0;
					border-color: #46cfa7;
					background-color: #46cfa7;
					color: #fff;
					border: 1px solid #dddfe4;
				}
			}
		}
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

const ButtonReply = styled.button`
	border: none;
	background: white;
	color: #7b858e;
	padding: 0;
	margin-right: 20px;
	vertical-align: middle;
	cursor: pointer;
`;

const ButtonDel = styled.button`
	color: red;
	border: none;
	background: white;
	padding: 0;
	vertical-align: middle;
	cursor: pointer;
`;

export default ContentComment;