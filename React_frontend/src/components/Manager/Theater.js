/*
	2023-03-30 극장 CRUD (강경목)
	23-04-17 영화관 관리자 페이지 수정(오병주)
*/
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Table, Input, Button, Modal, Form, Select } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
	MANAGER_THEATER_REQUEST, 
	MANAGER_THEATER_INSERT_REQUEST, 
	MANAGER_THEATER_INSERT_RESET,
	MANAGER_THEATER_DELETE_REQUEST, 
	MANAGER_THEATER_DELETE_RESET,
	MANAGER_THEATER_UPDATE_REQUEST, 
	MANAGER_THEATER_UPDATE_RESET
} from '../../reducer/R_manager_theater';
import { PlusOutlined } from '@ant-design/icons';

const Theater = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// 필요한 리덕스 상태들
  const { THEATER_loading, THEATER, THEATER_INSERT_done, THEATER_INSERT_error, THEATER_DELETE_done, THEATER_DELETE_error,
		THEATER_UPDATE_done, THEATER_UPDATE_error, LOGIN_STATUS_done, LOGIN_data } = useSelector(
    state => ({
      THEATER_loading: state.R_manager_theater.THEATER_loading,
      THEATER: state.R_manager_theater.THEATER,
			THEATER_INSERT_done: state.R_manager_theater.THEATER_INSERT_done,
			THEATER_INSERT_error: state.R_manager_theater.THEATER_INSERT_error,
			THEATER_DELETE_done: state.R_manager_theater.THEATER_DELETE_done,
			THEATER_DELETE_error: state.R_manager_theater.THEATER_DELETE_error,
			THEATER_UPDATE_done: state.R_manager_theater.THEATER_UPDATE_done,
			THEATER_UPDATE_error: state.R_manager_theater.THEATER_UPDATE_error,
			LOGIN_STATUS_done: state.R_user_login.LOGIN_STATUS_done,
      LOGIN_data: state.R_user_login.LOGIN_data
    }),
    shallowEqual
  );

	// 모든 극장 조회 useEffect
  useEffect(()=> {
    // 관리자 이외의 계정은 접근 불가능
    if (LOGIN_STATUS_done && LOGIN_data.uid !== 'manager') {
      alert('관리자 계정만 사용 가능합니다. 관리자 계정으로 로그인 해주세요! (id : manager, pw: manager123456)');
      navigate('/');
    }

    // 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청
    if (LOGIN_data.uid === 'manager') {
      dispatch({
        type: MANAGER_THEATER_REQUEST
      });
    }
  }, [LOGIN_STATUS_done, LOGIN_data.uid, navigate, dispatch]);

	// antd css 설정
	const columns = [
		{
      title: '영화관번호',
      width: 80,
      dataIndex: 'tid',
			sorter: (a, b) => a.tid - b.tid,
			sortDirections: ['descend']
    },
    {
      title: '지역',
      width: 70,
      dataIndex: 'tarea',
			sorter: (a, b) => a.tarea.localeCompare(b.tarea)
    },
    {
      title: '영화관명',
      width: 100,
      dataIndex: 'tname'
    },
    {
      title: '주소',
      width: 380,
      dataIndex: 'taddr'
    },
		{
      title: '보유 상영관',
      width: 80,
      render: (text, row) => <div> {row["cntCinema"]}개 </div>
    },
		{
      title: '관리자',
      width: 80,
      render: (text, row) => <TableButton onClick={()=> ClickRowModify(row)}>modify</TableButton>
    },
  ];  

	// 영화관명 useState
	const [name , setName] = useState('');
  const onChangeName = (e) =>{
    setName(e.target.value)
  }

	// 영화관 주소 useState
  const [addr, setAddr] = useState('');
  const onChangeAddr = (e) =>{
    setAddr(e.target.value)
  }

	// 지역 useState
	const [area, setArea] = useState([]);
	const handleChange = (value) => {
		setArea(value)
	};

	// 모달에 사용되는 useState
	const [isModalOpen, setIsModalOpen] = useState(false);
  const [theaterId, settheaterId] = useState();
  const [delState, setdelState] = useState(true);
	const [delState2, setdelState2] = useState(true);

	// + 버튼 누를때 실행되는 함수
	const ClickRowInsert = useCallback(()=> {
    setIsModalOpen(true);
		setdelState(true);
  }, [])

	// modify 버튼을 누를때 실행되는 함수
	const ClickRowModify = useCallback((data) => {

		// 삭제버튼 활성화 및 영화관 ID 설정
    setdelState(false);
		setdelState2(false);
    settheaterId(data.tid);

		// 보유 상영관 예외처리
		if (data.cntCinema !== 0) {
      alert('보유 상영관이 있는 경우 수정만 가능합니다.');
			setdelState2(true);
    }

    // 모달창에 정보 입력
    if (data.tarea === '서울') {
			setArea('seoul');
		}
		else if (data.tarea === '경기') {
      setArea('gyeonggi');
		}
		else if (data.tarea === '인천') {
      setArea('incheon');
		}
		else if (data.tarea === '부산') {
			setArea('busan');
		}

		setName(data.tname);
		setAddr(data.taddr);
    setIsModalOpen(true);
	}, []);

	// 추가 또는 수정 버튼을 누를때 실행되는 함수
  const onInsertORUpdate = useCallback(()=> {
		if (area === '' || name === '' || addr === '' ) {
			alert('모든 정보를 입력해주세요.');
			return;
		}

		var value = null;
      if (area === 'seoul') {
        value = '서울';
      }
      else if (area === 'gyeonggi') {
        value = '경기';
      }
      else if (area === 'incheon') {
        value = '인천';
      }
      else if (area === 'busan') {
        value = '부산';
      }

    // 영화관을 추가할 때
    if (delState) {
      if (!window.confirm('영화관을 추가하시겠습니까?')) {
        return;
      }
      dispatch({
				type: MANAGER_THEATER_INSERT_REQUEST,
				data: {
					tname: name,
					tarea: value,
					taddr: addr
				}
			});
    }
    // 영화관을 수정할 때
    else {
      if (!window.confirm('영화관을 수정하시겠습니까?')) {
        return;
      }
      dispatch({
				type: MANAGER_THEATER_UPDATE_REQUEST,
				data: {
					tname: name,
					tarea: value,
					taddr: addr,
					tid : theaterId
				}
			});
    }
  }, [area, name, addr, theaterId, delState, dispatch]);

	// 삭제 버튼 누를때 실행되는 함수
  const onDelete = useCallback(()=> {
    if (!window.confirm("영화관을 삭제하시겠습니까?\n(삭제한 정보는 복구되지 않습니다.)")) {
      return;
    };

    dispatch({
      type: MANAGER_THEATER_DELETE_REQUEST,
      data: {
        tid: theaterId
      }
    });

  }, [theaterId, dispatch]);

	// 모달창 닫을 시 초기화
	const handleCancel = useCallback(() => {
		setAddr('');
		setName('');
		setArea([]);
		setIsModalOpen(false);
	}, []);

	// 영화관 추가 성공여부에 따른 useEffect
  useEffect(()=> {
    // 추가 성공
    if (THEATER_INSERT_done) {
			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_THEATER_INSERT_RESET
      });

			dispatch({
        type: MANAGER_THEATER_REQUEST
      });
		}

    // 추가 실패
    if (THEATER_INSERT_error) {
      alert('영화관 추가에 실패했습니다.');
      dispatch({
        type: MANAGER_THEATER_INSERT_RESET
      });
    }
  }, [THEATER_INSERT_done, THEATER_INSERT_error, handleCancel, dispatch]);

	// 영화관 삭제 성공여부에 따른 useEffect
  useEffect(()=> {
    // 삭제 성공
    if (THEATER_DELETE_done) {
			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_THEATER_DELETE_RESET
      });

			dispatch({
        type: MANAGER_THEATER_REQUEST
      });
    }

    // 삭제 실패
    if (THEATER_DELETE_error) {
      alert('영화관 삭제에 실패했습니다.');

			// 모달 상태 초기화
			handleCancel();
			
			dispatch({
        type: MANAGER_THEATER_DELETE_RESET
      });

			dispatch({
        type: MANAGER_THEATER_REQUEST
      });
    }
  }, [THEATER_DELETE_done, THEATER_DELETE_error, handleCancel, dispatch]);

	// 영화관 수정 성공여부에 따른 useEffect
  useEffect(()=> {
    // 수정 성공
    if (THEATER_UPDATE_done) {

			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_THEATER_UPDATE_RESET
      });

			dispatch({
        type: MANAGER_THEATER_REQUEST
      });
		}

    // 수정 실패
    if (THEATER_UPDATE_error) {
      alert('영화관 수정에 실패했습니다.');

			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_THEATER_UPDATE_RESET
      });

			dispatch({
        type: MANAGER_THEATER_REQUEST
      });
    }
  }, [THEATER_UPDATE_done, THEATER_UPDATE_error, handleCancel, dispatch]);

	return(
		<>
			<div className="search">
				<p>
					{THEATER.length}개의 영화관이 검색되었습니다.
				</p>
				<div className="search_button">
					<Button type="primary" shape="circle" icon={<PlusOutlined />} size={"20"} onClick={ClickRowInsert}/>
				</div>
			</div>
			<TableWrap rowKey="tid"
				columns={columns}
				loading={THEATER_loading}
				dataSource={THEATER}
				scroll={{	x: 1200 }}
				locale={{ 
					triggerDesc: '내림차순 정렬하기',
					triggerAsc: '오름차순 정렬하기', 
					cancelSort: '정렬해제하기'
				}}
			/>
			<ModalWrap 
			keyboard={false}
			title={delState ? "영화관추가" : "영화관수정"}
			open={isModalOpen} 
			onOk={onInsertORUpdate}
			okText={delState ? "추가" : "수정"}
			cancelText="취소" 
			onCancel={handleCancel} destroyOnClose>
				<Form>
					<Form.Item label="지역">
						<Select
							placeholder='지역을 선택해주세요'
							onChange={handleChange}
							defaultValue={area}
							options={[
								{
									value: 'seoul',
									label: '서울',
								},
								{
									value: 'gyeonggi',
									label: '경기',
								},
								{
									value: 'incheon',
									label: '인천',
								},
								{
									value: 'busan',
									label: '부산',
								}
							]}>
						</Select>
					</Form.Item>  
					<Form.Item label="영화관명" onChange={onChangeName}>
						<Input placeholder='영화관명을 입력해주세요' value={name}/>
					</Form.Item>
					<Form.Item label="주소" onChange={onChangeAddr}>
						<Input placeholder='주소를 입력해주세요' value={addr}/>
					</Form.Item>
					<Form.Item style={{position:'relative', top:'57px'}}>
						<Button disabled={delState || delState2} onClick={onDelete} type="primary" danger>
              삭제
            </Button>       
					</Form.Item>
				</Form>
			</ModalWrap>    			
		</>
	);
};

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

const ModalWrap = styled(Modal)`
  .ant-modal-header {
    margin-bottom: 16px;
  }

  .ant-modal-footer {
    margin-top: 0;
  }
`;

export default Theater;