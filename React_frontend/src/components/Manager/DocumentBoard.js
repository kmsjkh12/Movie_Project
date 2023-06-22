/*
  23-05-30 관리자 게시물 페이지 수정(오병주)
*/
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector, shallowEqual} from "react-redux";
import { Table, Input, Modal } from 'antd';
import { 
	MANAGER_BOARD_LIST_REQUEST, 
	MANAGER_BOARD_SEARCH_REQUEST,
	MANAGER_BOARD_DELETE_REQUEST, 
	MANAGER_BOARD_DELETE_RESET
} from "../../reducer/R_manager_board";
import * as date from "../../lib/date.js";
import DocumentBoardDetail from "./DocumentBoardDetail";
const { Search } = Input;

const DocumentBoard = () => {
	const dispatch = useDispatch();

	// 게시물 조회 호출
	useEffect(() => {
		dispatch({
			type: MANAGER_BOARD_LIST_REQUEST
		})
	}, [dispatch]);

	// 필요한 리덕스 상태들
  const { MANAGER_BOARD_LIST_loading, MANAGER_BOARD_LIST, MANAGER_BOARD_SEARCH_loading, MANAGER_BOARD_DELETE_done, MANAGER_BOARD_DELETE_error } = useSelector(
    state => ({
      MANAGER_BOARD_LIST_loading: state.R_manager_board.MANAGER_BOARD_LIST_loading,
      MANAGER_BOARD_LIST: state.R_manager_board.MANAGER_BOARD_LIST,
			MANAGER_BOARD_SEARCH_loading:  state.R_manager_board.MANAGER_BOARD_SEARCH_loading,
			MANAGER_BOARD_DELETE_done: state.R_manager_board.MANAGER_BOARD_DELETE_done,
      MANAGER_BOARD_DELETE_error: state.R_manager_board.MANAGER_BOARD_DELETE_error
    }),
    shallowEqual
  );

	// 검색어 상태
	const [search, setsearch] = useState('');
	const handleSearchChange = useCallback((e) => {
		setsearch(e.target.value);
	}, []);

	// 정렬 버튼 css 변수
	const [titlebutton, setTitlebutton] = useState(true);
	const [writerbutton, setWriterbutton] = useState(false);

	// 검색 toggle 함수들
	const clickTitle = useCallback(() => {
		setTitlebutton(true);
		setWriterbutton(false);
	}, []);

	const clickWriter = useCallback(() => {
		setTitlebutton(false);
		setWriterbutton(true);
	}, []);

	// 검색 함수
	const onSearch = useCallback(() => {
		dispatch({
			type: MANAGER_BOARD_SEARCH_REQUEST,
			data: {
				category: titlebutton ? "title" : "writer",
				title: search
			}
		});
	}, [titlebutton, search, dispatch]);

	// antd css 설정
	const columns = [
		{
			title: '게시글번호',
			width: 4.2,
			dataIndex: 'bid',
			fixed: 'left',
			sorter: (a, b) => a.bid - b.bid,
			sortDirections: ['descend']
		},
		{
			title: '작성자',
			width: 4.1,
			dataIndex: 'uid',
			fixed: 'left',
		},
		{
			title: '제목',
			width: 12,
			dataIndex: 'btitle',
			ellipsis: true,
			fixed: 'left',
		},
		{
			title: '날짜',
			width: 6.5,
			render: (text, row) => <div> {row["bdate"].substr(0, 10)} ({date.getDayOfWeek(row["bdate"])}) {row["bdate"].substr(11)} </div>,
      sorter: (a, b) => new Date(a.bdate) - new Date(b.bdate)
		},
		{
			title: '조회수',
			width: 4,
			dataIndex: 'bclickindex',
			sorter: (a, b) => a.bclickindex - b.bclickindex
		},

		{
			title: '좋아요 수',
			width: 4,
			render: (text, row) => <div> {row["likes"] - row["unlikes"]} </div>,
			sorter: (a, b) => (a.likes - a.unlikes) - (b.likes - b.unlikes)
		},

		{
			title: '댓글수',
			width: 3.5,
			dataIndex: 'commentCounts',
			sorter: (a, b) => a.commentCounts - b.commentCounts
		},
		{
			title: '카테고리',
			width: 4.3,
			dataIndex: 'bcategory',
			fixed: 'right',
			filters: [
				{
					text: '자유 게시판',
					value: '자유 게시판'
				},
				{
					text: '영화 뉴스',
					value: '영화 뉴스',
				},
				{
					text: '영화 토론',
					value: '영화 토론',
				},
			],
			onFilter: (value, record) => record.bcategory.indexOf(value) === 0
		},
		{
			title: '관리자',
			fixed: 'right',
			width: 3.5,
			render: (text, row) => <TableButton onClick={()=>{onDelete(row.bid)}}>delete</TableButton>
		},
	];  

	// 게시글 삭제하는 함수
	const onDelete = useCallback((data) =>{
		if (!window.confirm("게시글을 삭제하시겠습니까?\n(삭제된 게시글은 복구되지 않습니다.)")) {
			return;
		};

		dispatch({
			type: MANAGER_BOARD_DELETE_REQUEST,
			data: {
				bid: data
			}
		})
	}, [dispatch]);

	// 게시글 삭제 상태에 따른 useEffect
	useEffect(()=> {
		// 삭제 성공
		if (MANAGER_BOARD_DELETE_done) {
			if (search.trim === '') {
				dispatch({
					type: MANAGER_BOARD_LIST_REQUEST
				});
			}
			else {
				onSearch();
			}
			dispatch({
				type: MANAGER_BOARD_DELETE_RESET
			});
		}

		// 삭제 실패
		if (MANAGER_BOARD_DELETE_error) {
			alert('게시글 삭제에 실패했습니다.');
			if (search.trim === '') {
				dispatch({
					type: MANAGER_BOARD_LIST_REQUEST
				});
			}
			else {
				onSearch();
			}

			dispatch({
				type: MANAGER_BOARD_DELETE_RESET
			});
		}

	}, [MANAGER_BOARD_DELETE_done, search, onSearch, MANAGER_BOARD_DELETE_error, dispatch]);

	// 상세 조회 useState
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [content, setContent] = useState();

	// 댓글 정렬 상태
	const [sort, setSort] = useState("like");

	// 모달 관련 함수
	const showModal = useCallback((data) => {
		setContent(data);
		setIsModalOpen(true);
	}, []);

	const handleOk = useCallback(() => {
		setIsModalOpen(false);
		setSort("like");
	}, []);

	const handleCancel = useCallback(() => {
		setIsModalOpen(false);
		setSort("like");
	}, []);

	return (
		<>
			<Layout>
				<Text>
					{MANAGER_BOARD_LIST.length}개의 게시글이 검색되었습니다. (더블클릭시 상세조회 및 댓글조회)
				</Text>
					<ButtonList>
						<ButtonWrap>
							<button className={"btn" + (titlebutton ? " active" : "")} onClick={clickTitle}>
								제목
							</button>
						</ButtonWrap>
						<ButtonWrap>
							<button className={"btn" + (writerbutton ? " active" : "")} onClick={clickWriter}>
								작성자
							</button>
						</ButtonWrap>
					</ButtonList>
					<SearchButton>
						<SearchWarp
							placeholder="게시글 검색"
							allowClear
							onSearch={onSearch}
							value={search}
							onChange={handleSearchChange}
							style={{
								width: 200,
								height: 10,
							}}
						/>
				</SearchButton>
			</Layout>
			<TableWrap rowKey="bid"
				columns={columns}
				loading={MANAGER_BOARD_LIST_loading || MANAGER_BOARD_SEARCH_loading}
				dataSource={MANAGER_BOARD_LIST}
				scroll={{x: 1350}}
				locale={{ 
					triggerDesc: '내림차순 정렬하기',
					triggerAsc: '오름차순 정렬하기', 
					cancelSort: '정렬해제하기',
					filterConfirm: '확인',
					filterReset: '초기화'
				}}
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: event => {                 
							showModal(record);
						}
					};
				}}
			/>
			<ModalWrapper 
				keyboard={false} 
				width={900} 
				title="게시물 상세조회" 
				okText="확인"
				cancelText="취소" 
				open={isModalOpen} 
				onOk={handleOk} 
				onCancel={handleCancel}>
				<DocumentBoardDetail content={content} sort={sort} setSort={setSort}/>
			</ModalWrapper>
		</>
  );
};

const Layout = styled.div`
	position: relative;
	width: 100%;
	border-bottom: 3px solid #241d1e;
	padding-bottom: 5px;
`;

const Text = styled.p`
	font-weight: 1000;
	padding-top: 8px;
`;

const ButtonList = styled.ul`
	position: absolute;
	margin-left: 5px !important;
	list-style: none;
	margin: 0;
	padding: 0;
	top: 16%;
	right: 18%;

	::after {
		content: '';
    display: block;
    position: absolute;
    left: 45px;
    top: 3px;
    width: 1px;
    height: 16px;
    background-color: #ccc;
	}
	
	li:first-child {
		margin-left: 0px;
	}
`;

const ButtonWrap = styled.li`
	margin-left: 23px;
	list-style: none;
	display: list-item;
	float: left;

	.btn {
		content: "";
		cursor: pointer;
		background-color: white;
		display: block;
		position: relative;
		color: #999;
		font-size: 16px;
		border: 0;
		padding: 0;

		&.active {
      color: #000;
    }
	}
`;

const SearchButton = styled.div`
	position: absolute;
	top: 1.5px;
	right: 0;
`;

const SearchWarp = styled(Search)`
  span {
    .ant-input-clear-icon {
      display: none;
    }
    .ant-input-affix-wrapper {
      border-color: #a0a0a0;
    }
    .ant-input-group-addon {
      border-color: #a0a0a0;
    }
    .ant-btn {
      border-color: #a0a0a0;
    }
    .ant-input::placeholder {
      color: #a0a0a0;
    }
  }
`;

const TableWrap = styled(Table)`
  padding-bottom: 20px;

  .ant-table-placeholder {
    .ant-table-expanded-row-fixed{
      min-height: 603px !important;
    }
    .css-dev-only-do-not-override-acm2ia {
      position:absolute;
      top: 45%;
      left: 50%;
      transform:translate(-50%, -45%); /* translate(x축,y축) */
    }
  }
`;

const TableButton = styled.button`
  color: #1677ff;
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
  border: none;
`;

const ModalWrapper = styled(Modal)`
	.ant-modal-title {
		font-size: 24px;
	}
`;

export default DocumentBoard;
