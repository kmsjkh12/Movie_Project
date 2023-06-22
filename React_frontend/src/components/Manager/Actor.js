/*
	23-04-18 배우 페이지 추가(오병주)
*/
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Table, Input, Button, Modal, Form } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { 
	MANAGER_ACTOR_REQUEST,
	MANAGER_ACTOR_INSERT_REQUEST,
	MANAGER_ACTOR_INSERT_RESET,
	MANAGER_ACTOR_DELETE_REQUEST, 
	MANAGER_ACTOR_DELETE_RESET,
	MANAGER_ACTOR_UPDATE_REQUEST, 
	MANAGER_ACTOR_UPDATE_RESET
} from '../../reducer/R_manager_movie';
import { PlusOutlined } from '@ant-design/icons';

const Actor = () => {
	const dispatch = useDispatch();

	// 필요한 리덕스 상태들
  const { ACTOR_loading, ACTOR, ACTOR_INSERT_done, ACTOR_INSERT_error, ACTOR_DELETE_done, ACTOR_DELETE_error,
		ACTOR_UPDATE_done, ACTOR_UPDATE_error } = useSelector(
    state => ({
      ACTOR_loading: state.R_manager_movie.ACTOR_loading,
      ACTOR: state.R_manager_movie.ACTOR,
			ACTOR_INSERT_done: state.R_manager_movie.ACTOR_INSERT_done,
			ACTOR_INSERT_error: state.R_manager_movie.ACTOR_INSERT_error,
			ACTOR_DELETE_done: state.R_manager_movie.ACTOR_DELETE_done,
			ACTOR_DELETE_error: state.R_manager_movie.ACTOR_DELETE_error,
			ACTOR_UPDATE_done: state.R_manager_movie.ACTOR_UPDATE_done,
			ACTOR_UPDATE_error: state.R_manager_movie.ACTOR_UPDATE_error
    }),
    shallowEqual
  );

	// antd css 설정
	const columns = [
		{
      title: '배우번호',
      width: 80,
      dataIndex: 'aid',
			sorter: (a, b) => a.aid - b.aid,
			sortDirections: ['descend']
    },
    {
      title: '이름',
      width: 180,
      dataIndex: 'aname'
    },
    {
      title: '출생지',
      width: 100,
      dataIndex: 'abirthplace'
    },
		{
      title: '영화출연횟수',
      width: 100,
      dataIndex: 'cntMovie'
    },
		{
      title: '관리자',
      width: 80,
      render: (text, row) => <TableButton onClick={()=> ClickRowModify(row)}>modify</TableButton>
    },
  ];  

	// 배우명 useState
	const [name , setName] = useState('');
  const onChangeName = (e) =>{
    setName(e.target.value)
  }

	// 배우 출생지 useState
  const [place, setPlace] = useState('');
  const onChangePlace = (e) =>{
    setPlace(e.target.value)
  }

	// 모달에 사용되는 useState
	const [isModalOpen, setIsModalOpen] = useState(false);
  const [ActorId, setActorId] = useState();
  const [delState, setdelState] = useState(true);

	// + 버튼 누를때 실행되는 함수
	const ClickRowInsert = useCallback(()=> {
    setIsModalOpen(true);
		setdelState(true);
  }, [])

	// modify 버튼을 누를때 실행되는 함수
	const ClickRowModify = useCallback((data) => {

    // 삭제버튼 활성화 및 배우 ID 설정
		setIsModalOpen(true);
    setdelState(false);
    setActorId(data.aid);
		setName(data.aname);
		setPlace(data.abirthplace);
	}, []);

	// 추가 또는 수정 버튼을 누를때 실행되는 함수
  const onInsertORUpdate = useCallback(()=> {
		if (name === '' || place === '' ) {
			alert('모든 정보를 입력해주세요.');
			return;
		}

    // 배우를 추가할 때
    if (delState) {
      if (!window.confirm('배우 정보를 추가하시겠습니까?')) {
        return;
      }
      dispatch({
				type: MANAGER_ACTOR_INSERT_REQUEST,
				data: {
					aname: name,
					abirthplace: place
				}
			});
    }
    // 배우를 수정할 때
    else {
      if (!window.confirm('배우 정보를 수정하시겠습니까?')) {
        return;
      }
      dispatch({
				type: MANAGER_ACTOR_UPDATE_REQUEST,
				data: {
					aname: name,
					abirthplace: place,
					aid: ActorId
				}
			});
    }
  }, [name, place, ActorId, delState, dispatch]);

	// 삭제 버튼 누를때 실행되는 함수
  const onDelete = useCallback(()=> {
    if (!window.confirm("배우 정보를 삭제하시겠습니까?\n(삭제한 정보는 복구되지 않습니다.)")) {
      return;
    };

    dispatch({
      type: MANAGER_ACTOR_DELETE_REQUEST,
      data: {
        aid: ActorId
      }
    });

  }, [ActorId, dispatch]);

	// 모달창 닫을 시 초기화
	const handleCancel = useCallback(() => {
		setName('');
		setPlace('');
		setIsModalOpen(false);
	}, []);

	// 배우 추가 성공여부에 따른 useEffect
  useEffect(()=> {
    // 추가 성공
    if (ACTOR_INSERT_done) {
			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_ACTOR_INSERT_RESET
      });

			dispatch({
        type: MANAGER_ACTOR_REQUEST
      });
		}

    // 추가 실패
    if (ACTOR_INSERT_error) {
      alert('배우 정보 추가에 실패했습니다.');
      dispatch({
        type: MANAGER_ACTOR_INSERT_RESET
      });
    }
  }, [ACTOR_INSERT_done, ACTOR_INSERT_error, handleCancel, dispatch]);

	// 배우 삭제 성공여부에 따른 useEffect
  useEffect(()=> {
    // 삭제 성공
    if (ACTOR_DELETE_done) {
			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_ACTOR_DELETE_RESET
      });

			dispatch({
        type: MANAGER_ACTOR_REQUEST
      });
    }

    // 삭제 실패
    if (ACTOR_DELETE_error) {
      alert('배우 정보 삭제에 실패했습니다.');

			// 모달 상태 초기화
			handleCancel();
			
			dispatch({
        type: MANAGER_ACTOR_DELETE_RESET
      });

			dispatch({
        type: MANAGER_ACTOR_REQUEST
      });
    }
  }, [ACTOR_DELETE_done, ACTOR_DELETE_error, handleCancel, dispatch]);

	// 배우 수정 성공여부에 따른 useEffect
  useEffect(()=> {
    // 수정 성공
    if (ACTOR_UPDATE_done) {
			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_ACTOR_UPDATE_RESET
      });

			dispatch({
        type: MANAGER_ACTOR_REQUEST
      });
		}

    // 수정 실패
    if (ACTOR_UPDATE_error) {
      alert('배우 정보 수정에 실패했습니다.');

			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_ACTOR_UPDATE_RESET
      });

			dispatch({
        type: MANAGER_ACTOR_REQUEST
      });
    }
  }, [ACTOR_UPDATE_done, ACTOR_UPDATE_error, handleCancel, dispatch]);

	return(
		<>
			<div className="search">
				<p>
					{ACTOR.length}명의 배우가 검색되었습니다.
				</p>
				<div className="search_button">
					<Button type="primary" shape="circle" icon={<PlusOutlined />} size={"20"} onClick={ClickRowInsert}/>
				</div>
			</div>
			<TableWrap rowKey="aid"
				columns={columns}
				loading={ACTOR_loading}
				dataSource={ACTOR}
				scroll={{	x: 1200 }}
				locale={{ 
					triggerDesc: '내림차순 정렬하기',
					triggerAsc: '오름차순 정렬하기', 
					cancelSort: '정렬해제하기'
				}}
			/>
			<ModalWrap 
			keyboard={false}
			title={delState ? "배우추가" : "배우수정"}
			open={isModalOpen} 
			onOk={onInsertORUpdate}
			okText={delState ? "추가" : "수정"}
			cancelText="취소" 
			onCancel={handleCancel} destroyOnClose>
				<Form>
					<Form.Item label="이름" onChange={onChangeName}>
						<Input placeholder='배우 이름을 입력해주세요' value={name}/>
					</Form.Item>
					<Form.Item label="출생지" onChange={onChangePlace}>
						<Input placeholder='배우 출생지를 입력해주세요' value={place}/>
					</Form.Item>
					<Form.Item style={{position:'relative', top:'57px'}}>
						<Button disabled={delState} onClick={onDelete} type="primary" danger>
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

export default Actor;