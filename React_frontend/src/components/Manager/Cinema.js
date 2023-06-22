/*
	23-04-17 상영관 관리자 페이지 수정(오병주)
*/
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Table, Input ,Button, Modal, Form, Select } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { 
	MANAGER_CINEMA_REQUEST,
	MANAGER_CINEMA_INSERT_REQUEST,
	MANAGER_CINEMA_INSERT_RESET,
	MANAGER_CINEMA_DELETE_REQUEST, 
	MANAGER_CINEMA_DELETE_RESET,
	MANAGER_CINEMA_UPDATE_REQUEST, 
	MANAGER_CINEMA_UPDATE_RESET
} from '../../reducer/R_manager_theater';

const Cinema = () =>{
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// 필요한 리덕스 상태들
  const { THEATER, CINEMA_loading, CINEMA, CINEMA_INSERT_done, CINEMA_INSERT_error, CINEMA_DELETE_done, CINEMA_DELETE_error,
		CINEMA_UPDATE_done, CINEMA_UPDATE_error, LOGIN_STATUS_done, LOGIN_data } = useSelector(
    state => ({
			THEATER: state.R_manager_theater.THEATER,
      CINEMA_loading: state.R_manager_theater.CINEMA_loading,
      CINEMA: state.R_manager_theater.CINEMA,
			CINEMA_INSERT_done: state.R_manager_theater.CINEMA_INSERT_done,
			CINEMA_INSERT_error: state.R_manager_theater.CINEMA_INSERT_error,
			CINEMA_DELETE_done: state.R_manager_theater.CINEMA_DELETE_done,
			CINEMA_DELETE_error: state.R_manager_theater.CINEMA_DELETE_error,
			CINEMA_UPDATE_done: state.R_manager_theater.CINEMA_UPDATE_done,
			CINEMA_UPDATE_error: state.R_manager_theater.CINEMA_UPDATE_error,
			LOGIN_STATUS_done: state.R_user_login.LOGIN_STATUS_done,
      LOGIN_data: state.R_user_login.LOGIN_data
    }),
    shallowEqual
  );

	// 모든 상영관 조회 useEffect
  useEffect(()=> {
    // 관리자 이외의 계정은 접근 불가능
    if (LOGIN_STATUS_done && LOGIN_data.uid !== 'manager') {
      alert('관리자 계정만 사용 가능합니다. 관리자 계정으로 로그인 해주세요! (id : manager, pw: manager123456)');
      navigate('/');
    }

    // 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청
    if (LOGIN_data.uid === 'manager') {
      dispatch({
        type: MANAGER_CINEMA_REQUEST
      });
    }
  }, [LOGIN_STATUS_done, LOGIN_data.uid, navigate, dispatch]);

	// antd css 설정
	const columns = [
		{
			title: '상영관번호',
			width: 80,
			dataIndex: 'cid',
			sorter: (a, b) => a.cid - b.cid,
			sortDirections: ['descend']
		},
		{
			title: '영화관명',
			width: 80,
			dataIndex: 'tname',
			sorter: (a, b) => a.tname.localeCompare(b.tname)
		},
		{
			title: '상영관명',
			width: 80,
			dataIndex: 'cname'
		},
		{
			title: '타입',
			width: 80,
			dataIndex: 'ctype'
		},
		{
			title: '좌석수',
			width: 80,
			render: (text, row) => <div> {row["cseat"]}좌석 </div>
		},
		{
			title: '보유상영정보',
			width: 80,
			render: (text, row) => <div> {row["cntMovieInfo"]}개 </div>
		},
		{
      title: '관리자',
      width: 80,
      render: (text, row) => <TableButton onClick={()=> ClickRowModify(row)}>modify</TableButton>
    },
	];  

	// 영화관명 useState
	const [tname, setTname] = useState([]);
	const onChangeTname = (value) => {
		setTname(value)
	};

	// 상영관명 useState
  const [name, setName] = useState('');
  const onChangeName = (e) =>{
    setName(e.target.value)
  }

  // 상영관 타입 useState
  const [type, setType] = useState('');
  const onChangeAddr = (e) =>{
    setType(e.target.value)
  }

  // 상영관 좌석수 useState
  const [seat, setSeat] = useState([]);
  const onChangeSeat = (value) => {
    setSeat(value)
  }

	// 모달에 사용되는 useState
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [CinemaId, setCinemaId] = useState();
	const [delState, setdelState] = useState(true);
	const [delState2, setdelState2] = useState(true);

	// + 버튼 누를때 실행되는 함수
	const ClickRowInsert = useCallback(()=> {
    setIsModalOpen(true);
		setdelState(true);
		setdelState2(false);
  }, []);

	// modify 버튼을 누를때 실행되는 함수
	const ClickRowModify = useCallback((data) => {
   
    // 삭제버튼 활성화 및 상영관 ID 설정
    setdelState(false);
		setdelState2(false);
    setCinemaId(data.cid);

		// 보유 상영정보 예외처리
		if (data.cntMovieInfo !== 0) {
      alert('보유 상영정보가 있는 경우 일부만 수정이 가능합니다.');
			setdelState2(true);
    }
    
    // 모달창에 정보 입력
		setTname(data.tid);
		setName(data.cname);
		setType(data.ctype);
		setSeat(data.cseat);
    setIsModalOpen(true);
	}, []);

	// 추가 또는 수정 버튼을 누를때 실행되는 함수
  const onInsertORUpdate = useCallback(()=> {
		if (tname === '' || name === '' || type === '' || seat === '') {
			alert('모든 정보를 입력해주세요.');
			return;
		}

    // 상영관을 추가할 때
    if (delState) {
      if (!window.confirm('상영관을 추가하시겠습니까?')) {
        return;
      }
      dispatch({
				type: MANAGER_CINEMA_INSERT_REQUEST,
				data: {
					tid: tname,
					cname: name,
					ctype: type,
					cseat: seat
				}
			});
    }
    // 상영관을 수정할 때
    else {
      if (!window.confirm('상영관을 수정하시겠습니까?')) {
        return;
      }
      dispatch({
				type: MANAGER_CINEMA_UPDATE_REQUEST,
				data: {
					tid: tname,
					cname: name,
					ctype: type,
					cseat: seat,
					cid: CinemaId
				}
			});
    }
  }, [tname, name, type, seat, CinemaId, delState, dispatch]);

	// 삭제 버튼 누를때 실행되는 함수
  const onDelete = useCallback(()=> {
    if (!window.confirm("상영관을 삭제하시겠습니까?\n(삭제한 정보는 복구되지 않습니다.)")) {
      return;
    };

    dispatch({
      type: MANAGER_CINEMA_DELETE_REQUEST,
      data: {
        cid: CinemaId
      }
    });

  }, [CinemaId, dispatch]);

	// 모달창 닫을 시 초기화
	const handleCancel = useCallback(() => {
		setTname([]);
		setName('');
		setType('');
		setSeat([]);
		setIsModalOpen(false);
	}, []);

	// 상영관 추가 성공여부에 따른 useEffect
  useEffect(()=> {
    // 추가 성공
    if (CINEMA_INSERT_done) {
			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_CINEMA_INSERT_RESET
      });

			dispatch({
        type: MANAGER_CINEMA_REQUEST
      });
		}

    // 추가 실패
    if (CINEMA_INSERT_error) {
      alert('상영관 추가에 실패했습니다.');
      dispatch({
        type: MANAGER_CINEMA_INSERT_RESET
      });
    }
  }, [CINEMA_INSERT_done, CINEMA_INSERT_error, handleCancel, dispatch]);

	// 상영관 삭제 성공여부에 따른 useEffect
  useEffect(()=> {
    // 삭제 성공
    if (CINEMA_DELETE_done) {
			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_CINEMA_DELETE_RESET
      });

			dispatch({
        type: MANAGER_CINEMA_REQUEST
      });
    }

    // 삭제 실패
    if (CINEMA_DELETE_error) {
      alert('상영관 삭제에 실패했습니다.');

			// 모달 상태 초기화
			handleCancel();
			
			dispatch({
        type: MANAGER_CINEMA_DELETE_RESET
      });

			dispatch({
        type: MANAGER_CINEMA_REQUEST
      });
    }
  }, [CINEMA_DELETE_done, CINEMA_DELETE_error, handleCancel, dispatch]);

	// 상영관 수정 성공여부에 따른 useEffect
  useEffect(()=> {
    // 수정 성공
    if (CINEMA_UPDATE_done) {
    
			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_CINEMA_UPDATE_RESET
      });

			dispatch({
        type: MANAGER_CINEMA_REQUEST
      });
		}

    // 수정 실패
    if (CINEMA_UPDATE_error) {
      alert('상영관 수정에 실패했습니다.');

			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_CINEMA_UPDATE_RESET
      });

			dispatch({
        type: MANAGER_CINEMA_REQUEST
      });
    }
  }, [CINEMA_UPDATE_done, CINEMA_UPDATE_error, handleCancel, dispatch]);

	return(
		<>
			<div className="search">
				<p>
					{CINEMA.length}개의 상영관이 검색되었습니다.
				</p>
				<div className="search_button">
					<Button type="primary" shape="circle" icon={<PlusOutlined/>} size={"20"} onClick={ClickRowInsert}/>
				</div>
			</div>
			<TableWrap rowKey="cid"
				columns={columns}
				loading={CINEMA_loading}
				dataSource={CINEMA}
				scroll={{x: 1200}}
				locale={{ 
					triggerDesc: '내림차순 정렬하기',
					triggerAsc: '오름차순 정렬하기', 
					cancelSort: '정렬해제하기'
				}}
			/>
			<ModalWrap 
			keyboard={false}
			title={delState ? "상영관추가" : "상영관수정"}
			open={isModalOpen} 
			onOk={onInsertORUpdate} 
			okText={delState ? "추가" : "수정"}
			cancelText="취소"
			onCancel={handleCancel} destroyOnClose>
				<Form>
					<Form.Item label="영화관명">
						<Select 
							placeholder='영화관을 선택해주세요'
							disabled={delState2}
							onChange={onChangeTname}
							value={tname}
							options={THEATER.map((theater) => ({
									value: theater.tid,
									label: theater.tname,
								}))}
						/>  
					</Form.Item>  
					<Form.Item label="상영관명" onChange={onChangeName}>
						<Input placeholder='상영관명을 입력해주세요' value={name}/>
					</Form.Item>
					<Form.Item label="타입" onChange={onChangeAddr}>
						<Input placeholder='상영관 타입을 입력해주세요' value={type}/>
					</Form.Item>
					<Form.Item label="좌석수" >
						<Select 
						placeholder='좌석수를 선택해주세요'
						disabled={delState2}
						onChange={onChangeSeat}
						defaultValue={seat}
						options={[
							{
								value: '30',
								label: '30',
							},
							{
								value: '50',
								label: '50',
							},
							{
								value: '70',
								label: '70',
							}
						]}/> 
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

export default Cinema;