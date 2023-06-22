/*
	23-04-18 ~ 19 영화 관리자 페이지 수정(오병주)
*/
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Table, Input, Select, Button, Modal, Form, DatePicker, ConfigProvider, Upload } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { 
	MANAGER_MOVIE_REQUEST,
	MANAGER_ACTOR_REQUEST, 
	MANAGER_MOVIE_INSERT_REQUEST,
	MANAGER_MOVIE_INSERT_RESET,
	MANAGER_MOVIE_DELETE_REQUEST, 
	MANAGER_MOVIE_DELETE_RESET,
	MANAGER_MOVIE_UPDATE_REQUEST, 
	MANAGER_MOVIE_UPDATE_RESET
} from '../../reducer/R_manager_movie';
import { useNavigate } from 'react-router-dom';
import locale from 'antd/lib/locale/ko_KR';
import dayjs from 'dayjs';
import "dayjs/locale/ko";
import EditStroy from './EditStory';
const { Option } = Select;

// 상영시간 input을 위한 css 설정
const NumericInput = (props) => {
	const { onChange } = props;
	const handleChange = (e) => {
		const { value: inputValue } = e.target;
		const reg = /^[0-9]+$/;
		if (reg.test(inputValue) || inputValue === '') {
			onChange(inputValue);
		}
	};

	return (
		<Input
			{...props}
			onChange={handleChange}
			placeholder="숫자만 입력해주세요"
			maxLength={3}
		/>
	);
};

const Movie = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// 필요한 리덕스 상태들
  const { MOVIE_loading, MOVIE, ACTOR, MOVIE_INSERT_done, MOVIE_INSERT_error, MOVIE_DELETE_done, MOVIE_DELETE_error,
		MOVIE_UPDATE_done, MOVIE_UPDATE_error, LOGIN_STATUS_done, LOGIN_data } = useSelector(
    state => ({
      MOVIE_loading: state.R_manager_movie.MOVIE_loading,
      MOVIE: state.R_manager_movie.MOVIE,
			ACTOR: state.R_manager_movie.ACTOR,
			MOVIE_INSERT_done: state.R_manager_movie.MOVIE_INSERT_done,
			MOVIE_INSERT_error: state.R_manager_movie.MOVIE_INSERT_error,
			MOVIE_DELETE_done: state.R_manager_movie.MOVIE_DELETE_done,
			MOVIE_DELETE_error: state.R_manager_movie.MOVIE_DELETE_error,
			MOVIE_UPDATE_done: state.R_manager_movie.MOVIE_UPDATE_done,
			MOVIE_UPDATE_error: state.R_manager_movie.MOVIE_UPDATE_error,
			LOGIN_STATUS_done: state.R_user_login.LOGIN_STATUS_done,
      LOGIN_data: state.R_user_login.LOGIN_data
    }),
    shallowEqual
  );

	// 모든 영화 및 배우 조회 useEffect
	useEffect(()=> {
		// 관리자 이외의 계정은 접근 불가능
		if (LOGIN_STATUS_done && LOGIN_data.uid !== 'manager') {
			alert('관리자 계정만 사용 가능합니다. 관리자 계정으로 로그인 해주세요! (id : manager, pw: manager123456)');
			navigate('/');
		}

		// 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청
		if (LOGIN_data.uid === 'manager') {
			dispatch({
				type: MANAGER_MOVIE_REQUEST
			});

			dispatch({
				type: MANAGER_ACTOR_REQUEST
			});
		}
	}, [LOGIN_STATUS_done, LOGIN_data.uid, navigate, dispatch]);

	// antd css 설정
	const columns = [
		{
      title: '영화번호',
      width: 7.6,
      dataIndex: 'mid',
      fixed: 'left',
			sorter: (a, b) => a.mid - b.mid,
			sortDirections: ['descend']
    },
    {
      title: '영화명',
      width: 9.8,
      dataIndex: 'mtitle',
			ellipsis: true,
      fixed: 'left'
    },
    {
      title: '감독',
      width: 9,
      dataIndex: 'mdir',
			ellipsis: true,
      fixed: 'left'
    },
		{
      title: '상영시간',
      width: 6.4,
			ellipsis: true,
			render: (text, row) => <div> {row["mtime"]}분 </div>
    },
		{
      title: '장르',
      width: 7.4,
			ellipsis: true,
      dataIndex: 'mgenre',
    },
		{
      title: '관람등급',
      width: 9.7,
			ellipsis: true,
			render: (text, row) => <div> {row["mrating"] === '0' ? '전체 이용가' : row["mrating"] === '18' ? '청소년 관람불가' : row["mrating"] + '세 이용가'} </div>
    },
    {
      title: '주연',
      width: 12,
      dataIndex: 'mainactor',
			ellipsis: true,
      render: (mainactor) => mainactor.map(main => main).join(', '),
    },
    {
      title: '조연',
      width: 12,
      dataIndex: 'subactor',
			ellipsis: true,
      render: (subactor) => subactor.map(sub => sub).join(', '),

    },
    {
      title: '성우',
      width: 12,
      dataIndex: 'voiceactor',
			ellipsis: true,
      render: (voiceactor) => voiceactor.map(voice => voice).join(', '),

    },
    {
      title: '개봉일',
      width: 7.7,
			fixed: 'right',
      dataIndex: 'mdate'
    },
		{
			title: '보유상영정보',
			width: 8.5,
			render: (text, row) => <div> {row["cntMovieInfo"]}개 </div>,
			fixed: 'right'
		},
		{
      title: '관리자',
      width: 5.5,
			fixed: 'right',
      render: (text, row) => <TableButton onClick={()=> ClickRowModify(row)}>modify</TableButton>
    },
  ]; 

	// 영화명 useState
	const [name, setName] = useState('');
	const onChangeName = (e) =>{
		setName(e.target.value);
	}
	
	// 감독 useState
	const [dir, setDir] = useState('');
	const onChangeDir = (e) =>{
		setDir(e.target.value);
	}

	// 상영시간 useState
	const [time, setTime] = useState('');

	// 장르 useState
	const [genre, setGenre] = useState('');
	const onChangeGenre = (e) =>{
		setGenre(e.target.value);
	}

	// 관람등급 useState
	const [rating, setRating] = useState([]);
	const onChangeRating = (value) =>{
		setRating(value);
	}

	// 개봉일 useState
	const [date, setDate] = useState(null);
	const onChangeDate = (value) =>{
		setDate(value);
	}
	
	// 주연 배우 useState
	const [mainActor, setMainActor] = useState([]);

	// 조연 배우 useState
	const [subActor, setSubActor] = useState([]);

	// 성우 useState
	const [voiceActor, setVoiceActor] = useState([]);

	// 포스터 useState
	const [file, setFile] = useState(null);
	const [filechange, setFileChange] = useState(false);
			
	// 기존에 설정된 포스터 useState
	const [fileList, setFileList] = useState([]);
	
	// 포스터 갱신에 대한 함수
	const normFile = (e) => {
		const regType = /^[a-zA-Z0-9.]*$/;	

		setFileChange(true);
		if (!regType.test(e.file.name) || (e.file.size / 1024) >= 1024) {
			alert('이미지명과 용량을 확인해주세요!');
			setFile(null);
			return null;
		}

		if (e.fileList.length === 0) {
			setFile(null);
		}
		else {
			setFile(e);
		}

    var fileList = e.fileList.slice(-1);
    if (Array.isArray(e)) {
      return e;
    }
    return e && fileList;
  };

	// 줄거리 및 수정 모달에 사용되는 useState
	const [story, setStory] = useState('');
	const [openStory, setOpenStory] = useState(false);

	// 모달에 사용되는 useState
	const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieId, setmovieId] = useState();
  const [delState, setdelState] = useState(true);
	const [modify, setModify] = useState(false);

	// + 버튼 누를때 실행되는 함수
	const ClickRowInsert = useCallback(()=> {
    setIsModalOpen(true);
		setdelState(true);
  }, []);

	// modify 버튼을 누를때 실행되는 함수
	const ClickRowModify = useCallback((data) => {
		// 모달창에 정보 입력
		setmovieId(data.mid);
		setName(data.mtitle);
 		setDir(data.mdir);
	  setTime(data.mtime);
 		setGenre(data.mgenre);
	 	setRating(data.mrating);
		setDate(data.mdate);
		setMainActor(data.mainactorId);
		setSubActor(data.subactorId);
		setVoiceActor(data.voiceactorId);
    setFileList([{
      uid: '-1',
      name: data.mimagepath.substr(12),
      status: 'done',
      url: `/${data.mimagepath}`
		}])
		setStory(data.mstory);
    setIsModalOpen(true);
		setdelState(false);

		// 보유 상영정보가 존재할경우
		if (data.cntMovieInfo !== 0) {
			setModify(true);
      alert('상영정보가 있을경우 일부 정보만 수정 가능합니다.');
    }
	}, []);

	// 창 닫을 시 초기화
  const handleCancel = useCallback(() => {
    setName('');
 		setDir('');
	  setTime('');
 		setGenre('');
	 	setRating(null);
		setDate(null);
		setMainActor([]);
		setSubActor([]);
		setVoiceActor([]);
		setFile(null);
		setFileChange(false);
    setFileList([]);
		setStory('');
		setdelState(true);
    setIsModalOpen(false);
		setModify(false);
  }, []);

	// 추가 또는 수정 버튼을 누를때 실행되는 함수
  const onInsertORUpdate = useCallback(()=> {
		// 추가 버튼 누를때
		if (delState) {
			if (file === null || name === '' || dir === '' || time === '' || genre === '' || rating.length === 0 || date === null || story === '') {
				alert('배우를 제외한 모든 정보를 입력해주세요.');
				return;
			}
		}
		// 수정 버튼 누를때
		else {
			if ((filechange && file === null) || name === '' || dir === '' || time === '' || genre === '' || rating.length === 0 || date === null || story === '') {
				alert('배우를 제외한 모든 정보를 입력해주세요.');
				return;
			}
		}
		
		// 입력한 정보 FormData로 매핑
		const Fdata = new FormData();
		if (file) {
			Fdata.append("multipartFiles", file.file);
		}

		const data = {
			mid: movieId,
			mtitle: name,
    	mdir: dir,
			mtime: time,
    	mgenre: genre,
			mrating: rating,
    	mdate: date,
     	mstory: story,
    	mainactorId: mainActor,
   		subactorId: subActor,
			voiceactorId: voiceActor
		}	

		Fdata.append("data", new Blob([JSON.stringify(data)], {
      type: "application/json"
    }))

    // 영화를 추가할 때
    if (delState) {
      if (!window.confirm('영화를 추가하시겠습니까?')) {
        return;
      }
      dispatch({
				type: MANAGER_MOVIE_INSERT_REQUEST,
				Fdata
			});
    }
    // 영화를 수정할 때
    else {
      if (!window.confirm('영화를 수정하시겠습니까?')) {
        return;
      }
      dispatch({
				type: MANAGER_MOVIE_UPDATE_REQUEST,
				Fdata
			});
    }
  }, [delState, file, filechange, movieId, name, dir, time, genre, rating, date, story, mainActor, subActor, voiceActor, dispatch]);

	// 삭제 버튼 누를때 실행되는 함수
  const onDelete = useCallback(()=> {
    if (!window.confirm("영화를 삭제하시겠습니까?\n(삭제한 정보는 복구되지 않습니다)")) {
      return;
    };

    dispatch({
      type: MANAGER_MOVIE_DELETE_REQUEST,
      data: {
        mid: movieId
      }
    });

  }, [movieId, dispatch]);

	// 영화 추가 성공여부에 따른 useEffect
  useEffect(()=> {
    // 추가 성공
    if (MOVIE_INSERT_done) {
			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_MOVIE_INSERT_RESET
      });

			dispatch({
        type: MANAGER_MOVIE_REQUEST
      });
		}

    // 추가 실패
    if (MOVIE_INSERT_error) {
      alert('영화 추가에 실패했습니다.');
      dispatch({
        type: MANAGER_MOVIE_INSERT_RESET
      });
    }
  }, [MOVIE_INSERT_done, MOVIE_INSERT_error, handleCancel, dispatch]);

	// 영화 삭제 성공여부에 따른 useEffect
  useEffect(()=> {
    // 삭제 성공
    if (MOVIE_DELETE_done) {
			// 모달 상태 초기화
			handleCancel();

      dispatch({
        type: MANAGER_MOVIE_DELETE_RESET
      });

			dispatch({
        type: MANAGER_MOVIE_REQUEST
      });
    }

    // 삭제 실패
    if (MOVIE_DELETE_error) {
      alert('영화 삭제에 실패했습니다.');

			// 모달 상태 초기화
			handleCancel();
		
			dispatch({
        type: MANAGER_MOVIE_DELETE_RESET
      });

			dispatch({
        type: MANAGER_MOVIE_REQUEST
      });
    }
  }, [MOVIE_DELETE_done, MOVIE_DELETE_error, handleCancel, dispatch]);

	// 영화 수정 성공여부에 따른 useEffect
	useEffect(()=> {
		// 수정 성공
		if (MOVIE_UPDATE_done) {
			// 모달 상태 초기화
			handleCancel();

			dispatch({
				type: MANAGER_MOVIE_UPDATE_RESET
			});

			dispatch({
				type: MANAGER_MOVIE_REQUEST
			});
		}

		// 수정 실패
		if (MOVIE_UPDATE_error) {
			alert('영화 수정에 실패했습니다.');

			// 모달 상태 초기화
			handleCancel();

			dispatch({
				type: MANAGER_MOVIE_UPDATE_RESET
			});

			dispatch({
				type: MANAGER_MOVIE_REQUEST
			});
		}
	}, [MOVIE_UPDATE_done, MOVIE_UPDATE_error, handleCancel, dispatch]);

	return(
		<>
			<div className="search">
				<p>
					{MOVIE.length}개의 영화가 검색되었습니다.
				</p>
				<div className="search_button">
					<Button type="primary" shape="circle" icon={<PlusOutlined/>} size={"20"} onClick={ClickRowInsert}/>
				</div>
			</div>
			<TableWrap rowKey="mid"
				loading={MOVIE_loading}
				dataSource={MOVIE}
				columns={columns}
				scroll={{x: 1500}}
				locale={{ 
					triggerDesc: '내림차순 정렬하기',
					triggerAsc: '오름차순 정렬하기', 
					cancelSort: '정렬해제하기'
				}}
			/>
			<ModalWrap
			keyboard={false}
			width={835}
			title={delState ? "영화추가" : "영화수정"}
			open={isModalOpen}
			okText={delState ? "추가" : "수정"}
			cancelText="취소" 
			onOk={onInsertORUpdate} 
			onCancel={handleCancel} destroyOnClose>
				<Form>
					<Form.Item label="영화명" onChange={onChangeName} style={{width: "100%"}}>
						<Input placeholder='영화명을 입력해주세요' value={name}/>
					</Form.Item>  
					<Form.Item label="감독&nbsp;&nbsp;&nbsp;" onChange={onChangeDir} style={{width: "100%"}}>
						<Input placeholder='감독을 입력해주세요' value={dir}/>
					</Form.Item>
					<Form.Item label="상영시간">
						<NumericInput
							disabled={modify}
      				style={{width: 155}}
      				value={time}
      				onChange={setTime}
    				/> 분
					</Form.Item>
					<Form.Item label="장르&nbsp;&nbsp;&nbsp;" onChange={onChangeGenre} style={{width: "100%"}}>
						<Input placeholder='장르를 입력해주세요' value={genre}/>
					</Form.Item>
					<Form.Item label="관람등급" >
						<Select 
						style={{width: "100%"}}
						disabled={modify}
						onChange={onChangeRating}
						defaultValue={rating}
						placeholder='관람 등급을 선택해주세요'
						options={[
							{
								value: '0',
								label: '전체 이용가',
							},
							{
								value: '12',
								label: '12세 이용가',
							},
							{
								value: '15',
								label: '15세 이용가',
							},
							{
								value: '18',
								label: '청소년 관람불가',
							}
						]}/> 
					</Form.Item>
					<Form.Item label="개봉일">
						<ConfigProvider locale={locale}>
							<DatePicker 
								disabled={modify}
								onChange={onChangeDate} 
								allowClear={false} 
								value={date !== null ? dayjs(date, 'YYYY-MM-DD') : ""}
							/>
						</ConfigProvider>
					</Form.Item>
					<Form.Item label="주연&nbsp;&nbsp;&nbsp;">
						<Select 
							showArrow
							allowClear
							placeholder='주연 배우를 선택해주세요'
							mode='multiple'
							style={{width: "100%"}}
							value={mainActor}
							onChange={(newValue) => {setMainActor(newValue);}}
							filterOption={(input, option) =>  
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 
							}
							maxTagCount='responsive'
						>
							{ACTOR.map(actor => <Option key={actor.aid}>{actor.aname}</Option>)}
						</Select>
					</Form.Item>
					<Form.Item label="조연&nbsp;&nbsp;&nbsp;">
						<Select 
							showArrow
							allowClear
							placeholder='조연 배우를 선택해주세요'
							mode='multiple'
							style={{width: "100%"}}
							value={subActor}
							onChange={(newValue) => {setSubActor(newValue);}}
							filterOption={(input, option) =>  
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 
							}
							maxTagCount='responsive'
						>
							{ACTOR.map(actor => <Option key={actor.aid}>{actor.aname}</Option>)}
						</Select>
					</Form.Item> 
					<Form.Item label="성우&nbsp;&nbsp;&nbsp;">
						<Select 
							showArrow
							allowClear
							placeholder='성우를 선택해주세요'
							mode='multiple'
							style={{width: "100%"}}
							value={voiceActor}
							onChange={(newValue) => {setVoiceActor(newValue);}}
							filterOption={(input, option) =>  
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 
							}
							maxTagCount='responsive'
						>
							{ACTOR.map(actor => <Option key={actor.aid}>{actor.aname}</Option>)}
						</Select>
					</Form.Item> 
					<Form.Item
						style={{width: "100%"}}
      			name="upload"
      			label="포스터"
      			valuePropName="fileList"
      			getValueFromEvent={normFile}
      			extra="이미지는 최대 한개만 업로드됩니다. (1MB 미만 + 파일명이 영어와 숫자의 조합)"
    			>
						<Upload name="logo" beforeUpload={(file, fileList) => false} defaultFileList={fileList ? fileList : null} listType="picture">
							<Button icon={<UploadOutlined />}>이미지 업로드</Button>
						</Upload>
					</Form.Item>
					<Form.Item label="줄거리&nbsp;">
						<MovieStory dangerouslySetInnerHTML={{__html: story}}/>
						{openStory ? <EditStroy 
							setOpenStory={setOpenStory}
							story={story}
							setStory={setStory}/> : null}
						<Button type="primary" onClick={()=> setOpenStory(true)}>
							줄거리 수정
						</Button>
					</Form.Item>
					<Form.Item style={{position:'relative', top:'57px'}}>
						<Button disabled={delState || modify} type="primary" danger onClick={onDelete}>
							삭제
						</Button>      
					</Form.Item>
				</Form>
			</ModalWrap> 
		</>
	)
}

const MovieStory = styled.div`
  position: relative;
  top: -16px;
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

const ModalWrap = styled(Modal)`
  .ant-modal-header {
    margin-bottom: 16px;
  }

  .ant-modal-footer {
    margin-top: 0;
  }
`;

export default Movie;