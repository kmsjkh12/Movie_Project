/*
  23-05-16 게시물 페이지 수정(오병주)
*/
import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import { CaretUpOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Pagination } from 'antd';
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { BOARD_LIST_REQUEST } from "../../reducer/R_board";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as date from "../../lib/date.js";

const ContentList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { category, sort, page } = useParams();

	// 필요한 리덕스 상태들
	const { LOGIN_data, BOARD_LIST_done, BOARD_LIST } = useSelector(
		state => ({
			LOGIN_data: state.R_user_login.LOGIN_data,
			BOARD_LIST_done: state.R_board.BOARD_LIST_done,
			BOARD_LIST: state.R_board.BOARD_LIST,
		}),
		shallowEqual
	);

	// 페이지네이션 변경 함수
	const handleChange = useCallback((page) => {
		navigate(`/Board/list/${category}/${sort}/${page}`);
	}, [category, sort, navigate]);

	// 페이지에 따른 게시물 요청 useEffect
	useEffect(()=>{
		dispatch({
			type: BOARD_LIST_REQUEST,
			data: {
				category: category,
				sort: sort,
				uid: LOGIN_data.uid,
				page: page-1
			}
		});
	}, [page, category, sort, LOGIN_data.uid, dispatch]);

	return (
		<ContentWrapper>
		{BOARD_LIST_done && BOARD_LIST.content.length === 0 &&
		<NotFound>
			<InfoCircleOutlined style={{fontSize: "30px"}}/>
			<NotFoundMsg>
				게시글이 존재하지 않습니다.
			</NotFoundMsg>
		</NotFound>}
		{BOARD_LIST.content && BOARD_LIST.content.map((board)=>
			<Card key={board.bid}>
				<Number>
					<CaretUpOutlined style={{fontSize: "17px"}} twoToneColor="grey"/>
					<div>
						{board.likes - board.unlikes}
					</div>
				</Number>
				<Detail>
					<Link to={`/Board/content/${category}/${board.bid}/${board.btitle}`}>
						<div>
							<span>
								{board.btitle}
								<em>
									[{board.commentCounts}]
								</em>
							</span>
						</div>
					</Link>
				</Detail>
				<Item>
					<div className="category">
						{board.bcategory}
					</div>
					<div className="date">
						<span title={board.bdate}>
							{date.detailDate(new Date(board.bdate))}
						</span>
					</div>
					<div className="name">
						{board.uid}
					</div>
				</Item>
				<Thumbnail>
					<Link to={`/Board/content/${category}/${board.bid}/${board.btitle}`} dangerouslySetInnerHTML={{__html:board.bthumbnail}}/>
				</Thumbnail>
			</Card>)}
			<CustomPagination current={parseInt(page)} total={BOARD_LIST.totalElements} defaultPageSize={20} showSizeChanger={false} hideOnSinglePage={true} onChange={handleChange}/>
		</ContentWrapper>
	);
};

const ContentWrapper = styled.div`
	width: 728px;
	margin-top: 0;
	border-top: 1px solid #ebeef1;
	background: #f8f9fa;
	margin-top: 8px;
	line-height: 18px;
	font-size: 14px;
	color: #7b858e;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .15);
`;

const NotFound = styled.div`
	background: #fff;
	padding: 100px 0;
	text-align: center;
	color: #7b858e;
`;

const NotFoundMsg = styled.div`
	margin-top: 12px;
	line-height: 20px;
	font-size: 16px;
	color: #7b858e;
`;

const Card = styled.div`
	position: relative;
	display: table;
	table-layout: fixed;
	width: 100%;
	height: 78px;
	box-sizing: border-box;
	border-top: 1px solid #ebeef1;
	background-color: #fff;
	padding: 8px 0;

	&:hover {
		background-color: #f8f9fb;
	}
`;

const Number = styled.div`
	width: 72px;
	vertical-align: middle;
	display: table-cell;
	text-align: center;
`;

const Detail = styled.div`
	vertical-align: middle;
	padding-top: 10px;
	color: inherit;

	a {
		text-decoration: none;
	}

	div {
		display: flex;
		overflow: auto;
		vertical-align: top;
		line-height: 16px;
		font-size: 14px;
		color: #1e2022;
		word-break: break-all;

    span {
			display: block;
			max-width: 80%;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			padding-right: 5px;

			em {
				padding-left: 5px;
				color: #16ae81;
				font: inherit;
				vertical-align: top;
				line-height: 14px;
			}
  	}
  }
`;

const Item = styled.div`
	margin-top: 5px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-top: 5px;

	.category {
		float: left;
		display: inline-block;
		font-size: 14px;
		color: #98a0a7; 
		height: 16px;
		line-height: 12px;
		padding-right: 15px;
		border-right: 1px solid #98a0a7;
	}

	.date {
		float: left;
		display: inline-block;
		font-size: 14px;
		color: #98a0a7;
		padding-right: 15px;
		padding-left: 15px;
		height: 16px;
		padding-right: 15px;
		line-height: 12px;
		border-right: 1px solid #98a0a7;
	}

	.name {
		float:left;
		display: inline-block;
		font-size: 14px;
		color: #98a0a7;
		padding-right: 15px;
		padding-left: 15px;
		height: 16px;
		padding-right: 15px;
		line-height: 12px;
	}
`;

const Thumbnail = styled.div`
	display: table-cell;
	padding-right: 20px;
	width: 85px;
	vertical-align: middle;

	img {
		display: block;
		width: 85px !important;
		height: 62px !important;
		-o-object-fit: cover;
		object-fit: cover;
		font-family: "object-fit: cover;";
		cursor: pointer !important;
	}
`;

const CustomPagination = styled(Pagination)`
	position: relative;
	text-align: center;
	border-top: 1px solid #ebeef1;
	height: 60px;
	line-height: 55px;
`;

export default ContentList;