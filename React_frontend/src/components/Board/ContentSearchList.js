/*
  23-05-22 게시물 페이지 수정(오병주)
*/
import React, { useState, useEffect, useCallback} from "react";
import styled from "styled-components";
import { SearchOutlined, CaretUpOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Pagination } from 'antd';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual} from "react-redux"
import { BOARD_SEARCH_REQUEST } from "../../reducer/R_board";
import * as date from "../../lib/date.js";

const selectList = [
	{name: "제목", tag: "title"}, 
	{name: "작성자", tag: "name"}
];

const ContentSearchList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { target, title, page } = useParams();

	// 필요한 리덕스 상태들
	const { BOARD_SEARCH_done, BOARD_SEARCH_LIST } = useSelector(
		state => ({
			BOARD_SEARCH_done: state.R_board.BOARD_SEARCH_done,
			BOARD_SEARCH_LIST: state.R_board.BOARD_SEARCH_LIST,
		}),
		shallowEqual
	);
    
	// 검색 분류 상태
	const [Selected, setSelected] = useState(target === "title" ? "title" : target === "name" ? "name" : "title");
	const handleSelect = useCallback((e) => {
		if (e.target.value === "title"){
			setSelected("title");
		}
		else if (e.target.value === "name"){
			setSelected("name");
		}
	}, []);

	// 검색할 내용 상태
	const [text, setText] = useState(title);
	const onChangeText = useCallback((e)=> {
		setText(e.target.value)
	}, []);

	// 검색 버튼 함수
	const onClickSearch = useCallback(()=>{
		// 예외처리
		if (text.trim() === '') {
			alert('검색어를 입력해주세요.');
			return;
		}
		navigate(`/Board/search/${Selected}/${text}/1`)
	}, [Selected, text, navigate]);

	// enter키를 눌렀을 때 검색이 되게하는 함수
  const handleOnKeyPress = (e) => {
		// 예외처리
		if (e.key === "Enter" && text.trim() === '') {
			alert('검색어를 입력해주세요.');
			return;
		}
    if (e.key === "Enter") {
			navigate(`/Board/search/${Selected}/${text}/1`);
		}
  };

	// 페이지네이션 변경 함수
	const handleChange = useCallback((page) => {
		navigate(`/Board/search/${target}/${title}/${page}`);
	}, [target, title, navigate]);
      
  // 페이지에 따른 검색결과요청 useEffect
	useEffect(() => {
		dispatch({
			type: BOARD_SEARCH_REQUEST,
			data: {
				category: target,
				title: title,
				page: page-1,
			}
		})
	}, [page, target, title, dispatch]);

	return (
		<>
			<SearchWrapper>
				<SearchHeader>
					<SearchTitle>
						<b>
							{title}
						</b> 
						<span>
						에 대한 검색 결과입니다.
						</span>
					</SearchTitle>
					<SearchOption>
						<SearchOptionItem>
							<label>
								<select onChange={handleSelect} defaultValue={Selected}>
									{selectList.map((data, index)=>
									<option key={index} value={data.tag}>
										{data.name}
									</option>)}
								</select>
							</label>
						</SearchOptionItem>              
						<SearchOptionItem style={{top: "0.5px"}}>
							<input type="text" placeholder="검색" value={text} onChange={onChangeText} onKeyUp={handleOnKeyPress}/>
							<button onClick={onClickSearch}>
								<SearchOutlined style={{fontSize:'20px'}}/>
							</button>
						</SearchOptionItem>
					</SearchOption>
				</SearchHeader>
			</SearchWrapper>
			<ContentWrapper>
				{BOARD_SEARCH_done && BOARD_SEARCH_LIST.content.length === 0 &&
				<NotFound>
					<InfoCircleOutlined style={{fontSize: "30px"}}/>
					<NotFoundMsg>
						검색된 게시물이 없습니다.
					</NotFoundMsg>
				</NotFound>}       
				{BOARD_SEARCH_LIST.content && BOARD_SEARCH_LIST.content.map((board)=>
				<Card key={board.bid}>
					<Number>
						<CaretUpOutlined style={{fontSize: "17px"}} twoToneColor="grey"/>
						<div>
							{board.likes - board.unlikes}
						</div>
					</Number>
					<Detail>
						<Link to={`/board/content/${board.bcategory === '자유 게시판' ? 'free' : board.bcategory === '영화 뉴스' ? 'news' : 'debate'}/${board.bid}/${board.btitle}`}>
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
						<Link to={`/board/content/${board.bcategory === '자유 게시판' ? 'free' : board.bcategory === '영화 뉴스' ? 'news' : 'debate'}/${board.bid}/${board.btitle}`} dangerouslySetInnerHTML={{__html:board.bthumbnail}}/>
					</Thumbnail>
				</Card>)}
				<CustomPagination current={parseInt(page)} total={BOARD_SEARCH_LIST.totalElements} defaultPageSize={20} showSizeChanger={false} hideOnSinglePage={true} onChange={handleChange}/>
			</ContentWrapper>
		</>
	);
};

const SearchWrapper = styled.div`
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .15);
	background: #fff;
`;

const SearchHeader = styled.div`
	margin-top: 0;
	padding-top: 25px;
	padding-bottom: 20px;
	padding-left: 25px;
	height: 83px;
	margin-bottom: 10px;
`;

const SearchTitle = styled.div`
	line-height: 23px;
	font-size: 18px;
	color: #7b858e;
	margin-left: 4px;

	b {
		vertical-align: -5px; 
		max-width: 470px;
		display: inline-block;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		color: #1e2022;
	}

	span {
		margin-left: 3px;
	}
`;

const SearchOption = styled.ul`
	margin-top: 18px;
	list-style-type: none;
`;

const SearchOptionItem = styled.li`
	margin-left: 0;
	position: relative;
	float: left;
	left: -40px;
	padding-right: 15px;

	select {
		width: 140px;
		box-sizing: border-box;
		border: 1px solid #dddfe4;
		border-radius: 4px;
		padding: 10px 38px 9px 15px;
		line-height: 19px;
		font-size: 16px;
		color: #1e2022;
		background: url(/img/down.png);
    background-size: 24px;
    background-position: top 6px right 7px;
    background-repeat: no-repeat;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

		&:focus {
			outline: none;
		}
	}

	input {
		float: left;
		border: none;
		width: 200px;
		box-sizing: border-box;
		padding: 10px 32px 9px 16px;
		border-radius: 2px;
		background-color: #ebeef1;
		line-height: 20px;
		font-size: 14px;

		&:focus {
			outline: none;
		}
	}
	button {
		float: left;
		position: absolute;
		top: 2px;
		right: 14px;
		margin-top: 6px;
		margin-right: 8px;
		border: none;
		padding-left: 0;
		cursor: pointer;
	}
`;

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

export default ContentSearchList;