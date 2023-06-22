import React, { useEffect } from "react";
import styled from "styled-components";
import ContentPost from "../components/Board/ContentPost";
import ContentComment from "../components/Board/ContentComment";
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { useParams } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { BOARD_CONTENT_REQUEST } from "../reducer/R_board";

const BoardPost = () => {
	const dispatch = useDispatch();
	const { id } = useParams();

	// 필요한 리덕스 상태들
	const { LOGIN_STATUS_done, LOGIN_data, BOARD_CONTENT_loading, BOARD_CONTENT_done, BOARD_CONTENT_error } = useSelector(
		state => ({
			LOGIN_STATUS_done: state.R_user_login.LOGIN_STATUS_done,
			LOGIN_data: state.R_user_login.LOGIN_data,
			BOARD_CONTENT_loading: state.R_board.BOARD_CONTENT_loading,
			BOARD_CONTENT_done: state.R_board.BOARD_CONTENT_done,
			BOARD_CONTENT_error: state.R_board.BOARD_CONTENT_error
		}),
		shallowEqual
	);

	// 게시물 상세조회 useEffect
	useEffect(()=>{
		if (LOGIN_STATUS_done) {
			dispatch({
				type: BOARD_CONTENT_REQUEST,
				data: {
					bid: id,
					uid: LOGIN_data.uid
				}
			});
		}
	}, [LOGIN_STATUS_done, id, LOGIN_data.uid, dispatch]);

	return (
		<>
			{BOARD_CONTENT_loading && <LoadingWrapper/>}

			{BOARD_CONTENT_error && 
			<NoContent>
				<NotFound>
					<InfoCircleOutlined style={{fontSize: "30px"}}/>
					<NotFoundMsg>
						존재하지 않는 게시물입니다.
					</NotFoundMsg>
				</NotFound>
			</NoContent>}

			{BOARD_CONTENT_done &&
			<>
				<ContentPost/>
				<ContentComment/>
			</>}
		</>
	);
};

const LoadingWrapper = styled.div`
	position: relative;
	min-height: 600px;
`;

const NoContent = styled.div`
	float: right;
	box-sizing: border-box;
	width: 728px;
	border: 1px solid #ebeef1;
	background: #fff;
	box-shadow: 0 1px 2.5px 0 rgba(0, 0, 0, .15);
`;

const NotFound = styled.div`
	background: #fff;
	padding: 168px 0;
	text-align: center;
	color: #7b858e;
`;

const NotFoundMsg = styled.div`
	margin-top: 12px;
	line-height: 20px;
	font-size: 16px;
	color: #7b858e;
`;

export default BoardPost;