/*
  23-05-26 게시물 페이지 수정(오병주)
*/
import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { BOARD_COMMENT_REPLY_WRITE_REQUEST, BOARD_REPLY_KEY_SETTING, BOARD_COMMENT_REPLY_WRITE_RESET } from "../../reducer/R_board";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

const ContentReplyWriting = ({ bcroot, bcid, margin }) => {
	const dispatch = useDispatch();
	const { category, id, title } = useParams();

	// 필요한 리덕스 상태들
	const { BOARD_COMMENT_REPLY_WRITE_done, BOARD_COMMENT_REPLY_WRITE_error, BOARD_COMMENT_LIST_done } = useSelector(
		state => ({
			BOARD_COMMENT_REPLY_WRITE_done: state.R_board.BOARD_COMMENT_REPLY_WRITE_done,
			BOARD_COMMENT_REPLY_WRITE_error: state.R_board.BOARD_COMMENT_REPLY_WRITE_error,
			BOARD_COMMENT_LIST_done: state.R_board.BOARD_COMMENT_LIST_done
		}),
		shallowEqual
	);

	// 답글 내용 상태
	const [text, setText] = useState("");
	const onChangeText = useCallback((e)=>{
		setText(e.target.value)
	}, []);
    
	// 답글 작성하는 함수
	const onClickReply = useCallback(()=>{
		// 답글이 빈칸일경우
		if (text.trim() === '') {
			alert('답글을 작성해주세요.');
			return;
		}
		
		if (!window.confirm("답글을 작성하시겠습니까?")) {
			return;
		} 
		
		dispatch({
			type: BOARD_COMMENT_REPLY_WRITE_REQUEST,
			data: {
				comment: text,
				bid: id,
				bcroot: (bcroot !== null ? bcroot : bcid),
				bcparent: bcid
			}
		})
	}, [text, id, bcroot, bcid, dispatch]);

	// 답글 작성 성공여부에 따른 useEffect
	useEffect(()=> {
		// 작성 성공
		if (BOARD_COMMENT_REPLY_WRITE_done) {
			dispatch({
				type: BOARD_COMMENT_REPLY_WRITE_RESET
			});
		}

		// 작성 실패
		if (BOARD_COMMENT_REPLY_WRITE_error) {
			alert('답글 작성에 실패했습니다.');
			window.location.replace(`/Board/content/${category}/${id}/${title}`);
		}
	}, [BOARD_COMMENT_REPLY_WRITE_done, BOARD_COMMENT_REPLY_WRITE_error, category, id, title, dispatch]);

	// 답글 작성을 성공했을때 댓글 리스트를 먼저 갱신하고 답글 입력칸을 닫아줌(페이지 밀림 방지)
	useEffect(()=> {
		if (BOARD_COMMENT_LIST_done) {
			dispatch({
				type: BOARD_REPLY_KEY_SETTING,
				data: ''
			});
		}
	}, [BOARD_COMMENT_LIST_done, dispatch])

	return (
		<ReplyWrite margin={margin}>
      <ReplyForm margin={margin}>
	      <div className="text">
          <textarea placeholder="답글을 작성해주세요." maxLength={99} value={text} onChange={onChangeText}/>
      	</div>
      	<div className="info">
          <div className="number">
           {text.length} / 100
          </div>
          <div className="writebutton">
          	<button className="write" onClick={onClickReply}>
							작성하기
						</button>
          </div>
      	</div>
      </ReplyForm>
		</ReplyWrite>   
  );
};

const ReplyWrite = styled.div`
	padding: ${(props) => props.margin ? "8px 16px" : "20px 16px"};
	background: #f8f9fa;
`;

const ReplyForm = styled.div`
	background-color: #fff;
	border: 1px solid #dddfe4;
	width: 590px;
	margin-left: ${(props) => props.margin ? "" : "70px"};

	.text {
		margin: 8px 16px 0;
		padding-bottom: 16px;

		textarea {
			overflow: hidden;
			overflow-wrap: break-word;
			height: 50px;
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
			font-family: Helvetica, Arial, Malgun Gothic, sans-serif;
		}
	}

	.info {
		position: relative;
		border-top: 1px solid #dddfe4;
		min-height: 42px;
		box-sizing: border-box;
		padding-right: 102px;

		.number {
			line-height: 40px;
			font-size: 14px;
			color: #7b858e;
			float: right;
		}

		.writebutton {
			position: absolute;
			right: 0;
			bottom: 0;

			.write {
				width: 92px;
				padding: 10px 9px;
				line-height: 20px;
				font-size: 16px;
				border-radius: 0;
				border-color: #46cfa7;
				background-color: #46cfa7;
				color: #fff;
				border: 1px solid #dddfe4;
				cursor: pointer;
			}
		}
	}
`;

export default ContentReplyWriting;