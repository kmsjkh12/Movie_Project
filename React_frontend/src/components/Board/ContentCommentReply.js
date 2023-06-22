/*
  23-05-26 게시물 페이지 수정(오병주)
*/
import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import ContentReplyWriting from "./ContentReplyWriting";
import { MessageOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BOARD_REPLY_KEY_SETTING, BOARD_COMMENT_REPLY_DELETE_REQUEST, BOARD_COMMENT_REPLY_DELETE_RESET } from "../../reducer/R_board";
import * as date from "../../lib/date.js";

const ContentCommentReply = ({ child }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { category, title, id } = useParams();

	// 필요한 리덕스 상태들
	const { LOGIN_data, BOARD_Reply_Id, BOARD_COMMENT_REPLY_DELETE_done, BOARD_COMMENT_REPLY_DELETE_error } = useSelector(
		state => ({
			LOGIN_data: state.R_user_login.LOGIN_data,
			BOARD_Reply_Id: state.R_board.BOARD_Reply_Id,
			BOARD_COMMENT_REPLY_DELETE_done: state.R_board.BOARD_COMMENT_REPLY_DELETE_done,
			BOARD_COMMENT_REPLY_DELETE_error: state.R_board.BOARD_COMMENT_REPLY_DELETE_error
		}),
		shallowEqual
	);

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

	// 답글 삭제하는 함수
	const onDelete = useCallback((bcid)=> {
		if (!window.confirm("답글을 삭제하시겠습니까?")) {
			return;
		} 
		else {
			dispatch({
				type: BOARD_COMMENT_REPLY_DELETE_REQUEST,
				data: {
					bcid: bcid,
				}
			});
		}
	}, [dispatch]);

	// 답글 삭제 성공여부에 따른 useEffect
	useEffect(()=> {
		// 삭제 성공
		if (BOARD_COMMENT_REPLY_DELETE_done) {
			dispatch({
				type: BOARD_COMMENT_REPLY_DELETE_RESET
			});
		}

		// 삭제 실패
		if (BOARD_COMMENT_REPLY_DELETE_error) {
			alert('답글 삭제에 실패했습니다.');
			window.location.replace(`/Board/content/${category}/${id}/${title}`);
		}
	}, [BOARD_COMMENT_REPLY_DELETE_done, BOARD_COMMENT_REPLY_DELETE_error, category, id, title, dispatch]);

	return (
		<>
			{child.map((comment)=>
			<CommentReply key={comment.bcid}>
				<div className="reply">
					<div className="reply_name">
						<span className="reply_id">
							{comment.uid}
						</span>
						<span className="reply_time" title={comment.bcdate}>
							{date.detailDate(new Date(comment.bcdate))}
						</span>
					</div>
					<div className="comment_reply">
						<p>
							{comment.parentUid ? 
							<strong>
								{comment.parentUid}
							</strong> : null}
							{comment.bccomment}
						</p>
					</div>
				</div>
				<ReplyButtons>
					<ButtonReply onClick={()=> onReply(comment.bcid)}>
						<MessageOutlined style={{paddingRight:"3px"}}/> 답글쓰기
					</ButtonReply>
					{comment.uid === LOGIN_data.uid ? 
					<ButtonDel onClick={()=> onDelete(comment.bcid)}>
						<DeleteOutlined style={{paddingRight:"2px"}}/> 삭제하기
					</ButtonDel> : null}
				</ReplyButtons>
				{BOARD_Reply_Id === comment.bcid ? <ContentReplyWriting bcroot={comment.bcroot} bcid={comment.bcid} margin={true}/> : null} 
			</CommentReply>)}                               
		</>
	);
};

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

const ButtonReply = styled.button`
	border: none;
	background: #f8f9fa;
	color: #7b858e;
	padding: 0;
	margin-right: 20px;
	vertical-align: middle;
	cursor: pointer;
`;

const ButtonDel = styled.button`
	color: red;
	border: none;
	background: #f8f9fa;
	padding: 0;
	vertical-align: middle;
	cursor: pointer;
`;

export default ContentCommentReply;
