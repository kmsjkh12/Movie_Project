import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Table, Input } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { MANAGER_USER_LIST_REQUEST, MANAGER_USER_SEARCH_REQUEST, MANAGER_USER_DROP_REQUEST, MANAGER_USER_DROP_RESET } from '../../reducer/R_manager_user';
import { useNavigate } from "react-router-dom";
const { Search } = Input;

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 필요한 리덕스 상태들
  const { USER_LIST_loading, USER_DROP_loading, USER_LIST, USER_DROP_done, USER_DROP_error, LOGIN_STATUS_done, LOGIN_data } = useSelector(
    state => ({
      USER_LIST_loading: state.R_manager_user.USER_LIST_loading,
      USER_DROP_loading: state.R_manager_user.USER_DROP_loading,
      USER_LIST: state.R_manager_user.USER_LIST,
			USER_DROP_done: state.R_manager_user.USER_DROP_done,
			USER_DROP_error: state.R_manager_user.USER_DROP_error,
      LOGIN_STATUS_done: state.R_user_login.LOGIN_STATUS_done,
      LOGIN_data: state.R_user_login.LOGIN_data
    }),
    shallowEqual
  );

  // 모든 유저 조회 useEffect
  useEffect(()=> {
    // 관리자 이외의 계정은 접근 불가능
    if (LOGIN_STATUS_done && LOGIN_data.uid !== 'manager') {
      alert('관리자 계정만 사용 가능합니다. 관리자 계정으로 로그인 해주세요! (id : manager, pw: manager123456)');
      navigate('/');
    }

    // 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청
    if (LOGIN_data.uid === 'manager') {
      dispatch({
        type: MANAGER_USER_LIST_REQUEST
      });
    }
  }, [LOGIN_STATUS_done, LOGIN_data.uid, navigate, dispatch])

  // 검색칸 내용 변수
  const [search, setsearch] = useState('');
  const handleSearchChange = useCallback((e) => {
    setsearch(e.target.value);
  }, []);

  // 정렬 버튼 css 변수
	const [idbutton, setIdbutton] = useState(true);
	const [namebutton, setNamebutton] = useState(false);

	// 계정명 버튼을 누를 때 함수
	const clickId = useCallback(()=> {
		setIdbutton(true);
		setNamebutton(false);
	}, []);

	// 이름 버튼을 누를 때 함수
	const clickName = useCallback(()=> {
		setIdbutton(false);
		setNamebutton(true);
	}, []);

  // 검색 버튼 누를때 실행되는 함수
  const onSearch = useCallback(() => {
    dispatch({
      type: MANAGER_USER_SEARCH_REQUEST,
      data: {
        search: search,
        sort : idbutton ? 'id' : 'name'
      }
    });
  }, [idbutton, search, dispatch]);

  // 삭제 버튼 누를때 실행되는 함수
  const onDelete = useCallback((uid) => {
		if (uid === 'manager' || uid === 'temp1') {
			alert('관리자 및 temp1 계정은 삭제가 불가능합니다.');
			return;
		}

    if (!window.confirm("사용자를 삭제하시겠습니까?\n(삭제된 사용자는 복구되지 않습니다.)")) {
      return;
    };

    dispatch({
      type: MANAGER_USER_DROP_REQUEST,
      data: { 
        uid: uid
      }
    });
  }, [dispatch]);

	// 사용자 삭제 상태에 따른 useEffect
	useEffect(()=> {
		// 삭제 성공
		if (USER_DROP_done) {
			if (search.trim === '') {
				dispatch({
					type: MANAGER_USER_LIST_REQUEST
				});
			}
			else {
				onSearch();
			}
			dispatch({
				type: MANAGER_USER_DROP_RESET
			});
		}

		// 삭제 실패
		if (USER_DROP_error) {
			alert('사용자 삭제에 실패했습니다.');
			if (search.trim === '') {
				dispatch({
					type: MANAGER_USER_LIST_REQUEST
				});
			}
			else {
				onSearch();
			}

			dispatch({
				type: MANAGER_USER_DROP_RESET
			});
		}

	}, [USER_DROP_done, search, onSearch, USER_DROP_error, dispatch]);

  // antd css 설정
  const columns = [
    {
      title: '계정',
      width: 110,
      dataIndex: 'uid',
      fixed: 'left',
			sorter: (a, b) => a.uid.localeCompare(b.uid)
    },
    {
      title: '이름',
      width: 120,
      dataIndex: 'uname',
      fixed: 'left',
			sorter: (a, b) => a.uname.localeCompare(b.uname)
    },
    {
      title: '이메일',
      width: 210,
			ellipsis: true,
      dataIndex: 'uemail',
    },
    {
      title: '전화번호',
      width: 130,
      render: (text, row) => <div> {row["utel"].substring(0,3)}-{row["utel"].substring(3,7)}-{row["utel"].substring(7, 11)} </div>,
    },
    {
      title: '주소',
      width: 360,
			ellipsis: true,
      render: (text, row) => <div> {row["uaddr"]} {row["uaddrsecond"]} </div>,
    },
    {
      title: '생년월일',
      width: 110,
      dataIndex: 'ubirth',
    },
    {
      title: '가입일자',
      width: 110,
      dataIndex: 'ujoindate',
      fixed: 'right',
			sorter: (a, b) => new Date(a.ujoindate) - new Date(b.ujoindate)
    },
    {
      title: '관리자',
      fixed: 'right',
      width: 85,
      render: (text, row) => <TableButton onClick={()=> onDelete(row.uid)}>delete</TableButton>,
    },
  ];  

	return (
		<Container>
      <InnerWraps>
        <div className="titleMenu">
          <h1>
            회원관리
          </h1>
        </div>
        <div className="search">
          <p>
            {USER_LIST.length}명의 회원이 검색되었습니다.
          </p>
					<ButtonList>
						<ButtonWrap>
							<button className={"btn" + (idbutton ? " active" : "")} onClick={clickId}>
								계정명
							</button>
						</ButtonWrap>
						<ButtonWrap>
							<button className={"btn" + (namebutton ? " active" : "")} onClick={clickName}>
								이름
							</button>
						</ButtonWrap>
					</ButtonList>
					<div className="search_button">
						<SearchWarp
							placeholder="유저 검색"
							allowClear
							onSearch={onSearch}
							value={search}
							onChange={handleSearchChange}
							style={{
								width: 200,
								height: 10,
							}}
						/>
					</div>
				</div>	
				<TableWrap rowKey="uid"
					loading={USER_LIST_loading || USER_DROP_loading}
					columns={columns}
					dataSource={USER_LIST}
					scroll={{x: 1200}}
					locale={{ 
						triggerDesc: '내림차순 정렬하기',
						triggerAsc: '오름차순 정렬하기', 
						cancelSort: '정렬해제하기'
					}}
				/>
			</InnerWraps>
		</Container>
	);
};

const Container = styled.div`
  padding: 0;
  width: 1235px;
  margin : 0 auto;
  box-sizing: border-box; 
  margin-bottom: 0;
  min-height: 820px;
`;

const InnerWraps = styled.div`
  width: 100%;
  padding-left: 10px;

  .titleMenu {
    position: relative;
    top: 18px;
  }
  .search {
    position: relative;
    width: 100%;
    border-bottom: 3px solid #241d1e;
    padding-bottom: 5px;
    margin-top: 30px;

    p {
      font-weight: 1000;
      padding-top: 8px;
    }

    .search_button {
      position: absolute;
      top: 1.5px;
      right: 0;
    }
  }
`;

const ButtonList = styled.ul`
	position: absolute;
	margin-left: 5px !important;
	list-style: none;
	margin: 0;
	padding: 0;
  top: 16%;
  right: 18%;

	::after{
		content: '';
    display: block;
    position: absolute;
    left: 60px;
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

export default User;