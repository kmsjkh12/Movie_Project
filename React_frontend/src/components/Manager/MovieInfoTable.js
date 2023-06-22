import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { 
  MANAGER_MOVIEINFO_LIST_REQUEST, 
  MANAGER_MOVIEINFO_INSERT_REQUEST, 
  MANAGER_MOVIEINFO_INSERT_RESET,
  MANAGER_MOVIEINFO_DELETE_REQUEST,
  MANAGER_MOVIEINFO_DELETE_RESET,
  MANAGER_MOVIEINFO_UPDATE_REQUEST,
  MANAGER_MOVIEINFO_UPDATE_RESET
} from '../../reducer/R_manager_movieinfo';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import * as date from "../../lib/date.js";
import { PlusOutlined } from '@ant-design/icons';
import { Table, Modal, Button, Form, Select, DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import "dayjs/locale/ko";
import locale from 'antd/lib/locale/ko_KR';
import moment from 'moment';
import 'moment/locale/ko';

const MovieInfoTable = ({ selectMovie, selectArea, selectTheater, days, setselectMovie, setselectArea, setselectTheater, setDays, seoulTheater, gyeonggiTheater, incheonTheater, busanTheater }) => {
  const dispatch = useDispatch();

  // 필요한 리덕스 상태들
  const { MOVIEINFO_LIST_loading, MOVIEINFO_LIST, MOVIEINFO_MOVIE_LIST, MOVIEINFO_CINEMA_LIST, MOVIEINFO_INSERT_state, MOVIEINFO_DELETE_state, MOVIEINFO_UPDATE_state} = useSelector(
    state => ({
      MOVIEINFO_LIST_loading: state.R_manager_movieinfo.MOVIEINFO_LIST_loading,
      MOVIEINFO_LIST: state.R_manager_movieinfo.MOVIEINFO_LIST,
      MOVIEINFO_MOVIE_LIST: state.R_manager_movieinfo.MOVIEINFO_MOVIE_LIST,
      MOVIEINFO_CINEMA_LIST: state.R_manager_movieinfo.MOVIEINFO_CINEMA_LIST,
      MOVIEINFO_INSERT_state: state.R_manager_movieinfo.MOVIEINFO_INSERT_state,
      MOVIEINFO_DELETE_state: state.R_manager_movieinfo.MOVIEINFO_DELETE_state,
      MOVIEINFO_UPDATE_state: state.R_manager_movieinfo.MOVIEINFO_UPDATE_state
    }),
    shallowEqual
  );

  // antd css 설정
  const columns = [
    {
      title: '상영번호',
      width: 90,
      dataIndex: 'miid',
      fixed: 'left'
    },
    {
      title: '영화이름',
      width: 160,
      dataIndex: 'mtitle',
      ellipsis: true,
      fixed: 'left',
			sorter: (a, b) => a.mtitle.localeCompare(b.mtitle)
    },
    {
      title: '상영극장',
      width: 180,
      render: (text, row) => <div> {row["tarea"]}-{row["tname"]}점 {row["cname"]}</div>,
    },
		{
      title: '상영날짜',
      width: 150,
      render: (text, row) => <div> {row["miday"].substr(0, 10)} ({date.getDayOfWeek(row["miday"])}) </div>,
      sorter: (a, b) => new Date(a.miday) - new Date(b.miday)
    },
		{
      title: '상영시작시간',
      width: 180,
      render: (text, row) => <div> {row["mistarttime"].substr(0, 10)} ({date.getDayOfWeek(row["mistarttime"])}) {row["mistarttime"].substr(10, 6)} </div>,
      sorter: (a, b) => new Date(a.mistarttime) - new Date(b.mistarttime)
    },
		{
      title: '상영종료시간',
      width: 180,
      dataIndex: 'miid',
			render: (text, row) => <div> {row["miendtime"].substr(0, 10)} ({date.getDayOfWeek(row["miendtime"])}) {row["miendtime"].substr(10, 6)} </div>,
      sorter: (a, b) => new Date(a.miendtime) - new Date(b.miendtime)
    },
		{
      title: '상영상태',
      width: 90,
			render: (text, row) => <div> {movieState(row["mistarttime"], row["miendtime"])} </div>,
    },
		{
      title: '예매현황',
      width: 100,
      render: (text, row) => <div> &nbsp; {row["cntSeatInfo"]} / {row["cntSeatAll"]}</div>,
    },
    {
      title: '관리자',
      fixed: 'right',
      width: 90,
      render: (text, row) => <TableButton onClick={()=> ClickRowModify(row)}>modify</TableButton>
    },
  ];  

  // 상영상태 표현하는 함수
  const movieState = useCallback((mistarttime, miendtime) => {
    var now = new Date();
    var start = new Date(mistarttime);
    var end = new Date(miendtime);

    if (start > now) {
      return '상영예정';
    }

    if (start <= now && now < end) {
      return '상영중';
    }

    if (end <= now) {
      return '상영종료';
    }
  }, []);

  // 모달 내용 및 상태관리
	const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setdelState(true);
  }, []);

  // 상영정보 CRUD를 위한 useState
  const [infoId, setinfoId] = useState();
  const [infoState, setinfoState] = useState(false);
  const [delState, setdelState] = useState(true);
  const [openDay, setopenDay] = useState();

  // 선택된 영화, 지역, 극장, 상영관, 날짜버튼 useState
	const [selectMovieModal, setselectMovieModal] = useState();
	const [selectAreaModal, setselectAreaModal] = useState();
	const [selectTheaterModal, setselectTheaterModal] = useState();
  const [selectCinemaModal, setselectCinemaModal] = useState();
	const [dayStartModal, setdayStartModal] = useState();
  const [dayEndModal, setdayEndModal] = useState();

  // + 버튼을 누를때 실행되는 함수
  const ClickRowInsert = useCallback(()=> {
    setIsModalOpen(true);
    setinfoState(false);
    setdelState(true);

    // 현재 시간에 90분 더한 값
    var now = new Date();
    now.setMinutes(now.getMinutes() + 90);

    // 모달창에 정보 초기화(영화와 시간을 임의로 지정해줌)
    setselectMovieModal(1);
		setselectAreaModal('seoul');
    setselectTheaterModal(1);
    setselectCinemaModal(1);
    setdayStartModal(date.DateToString2(now));
    setdayEndModal(date.DateCal(now, 180));
    setopenDay(date.DateToString(new Date()));
    setIsModalOpen(true);
  }, [])

  // modify 버튼을 누를때 실행되는 함수
	const ClickRowModify = useCallback((data) => {
    if (data.cntSeatInfo !== 0) {
      alert('예매가 없는 상영정보만 수정이 가능합니다.');
      return;
    }

    // 상영이 종료되었거나 상영중인 영화는 내용 수정이 불가능하게 만듬
    if (movieState(data.mistarttime, data.miendtime) === '상영종료' || movieState(data.mistarttime, data.miendtime) === '상영중') {
      setinfoState(true);
    }
    else {
      setinfoState(false);
    }

    // 영화 개봉일에 따라 disable 지정
    var now = new Date();
    var mdate = new Date(MOVIEINFO_MOVIE_LIST.filter(movie => movie.mid === data.mid)[0].mdate);
    if (mdate > now) {
      setopenDay(date.DateToString(mdate));
    }
    else {
      setopenDay(date.DateToString(now));
    }  

    // 삭제버튼 활성화 및 무비인포 ID 설정
    setdelState(false);
    setinfoId(data.miid);
    
    // 모달창에 정보 입력
    setselectMovieModal(data.mid);
    if (data.tarea === '서울') {
			setselectAreaModal('seoul');
		}
		else if (data.tarea === '경기') {
      setselectAreaModal('gyeonggi');
		}
		else if (data.tarea === '인천') {
      setselectAreaModal('incheon');
		}
		else if (data.tarea === '부산') {
			setselectAreaModal('busan');
		}
    setselectTheaterModal(data.tid);
    setselectCinemaModal(data.cid);
    setdayStartModal(date.DateToString2(new Date(data.mistarttime)));
    setdayEndModal(date.DateToString2(new Date(data.miendtime)));
    setIsModalOpen(true);

	}, [MOVIEINFO_MOVIE_LIST, movieState]);

  // 모달창 영화 교체할 때
	const handleMovieChangeModal = useCallback((value) => {
		setselectMovieModal(value);

    // 영화 개봉일에 따라 disable 및 날짜 지정 수정
    var now = new Date();
    var mdate = new Date(MOVIEINFO_MOVIE_LIST.filter(movie => movie.mid === value)[0].mdate);

    if (mdate > now) {
      setopenDay(date.DateToString(mdate));
      setdayStartModal(date.DateCal(mdate, 60));
      setdayEndModal(date.DateCal(mdate, 60 + MOVIEINFO_MOVIE_LIST.filter(movie => movie.mid === value)[0].mtime));
    }
    else {
      now.setMinutes(now.getMinutes() + 90);
      setopenDay(date.DateToString(now));
      setdayStartModal(date.DateToString2(now));
      setdayEndModal(date.DateCal(now, MOVIEINFO_MOVIE_LIST.filter(movie => movie.mid === value)[0].mtime));
    }   
	}, [MOVIEINFO_MOVIE_LIST]);
  
  // 모달창 지역 교체할 때
	const handleAreaChangeModal = (value) => {
		setselectAreaModal(value);

    if (value === 'seoul') {
			setselectTheaterModal(seoulTheater[0].tid);
      setselectCinemaModal(MOVIEINFO_CINEMA_LIST.filter(cinema => cinema.tid === seoulTheater[0].tid)[0].cid);
		}
		else if (value === 'gyeonggi') {
			setselectTheaterModal(gyeonggiTheater[0].tid);
      setselectCinemaModal(MOVIEINFO_CINEMA_LIST.filter(cinema => cinema.tid === gyeonggiTheater[0].tid)[0].cid);
		}
		else if (value === 'incheon') {
			setselectTheaterModal(incheonTheater[0].tid);
      setselectCinemaModal(MOVIEINFO_CINEMA_LIST.filter(cinema => cinema.tid === incheonTheater[0].tid)[0].cid);
		}
		else if (value === 'busan') {
			setselectTheaterModal(busanTheater[0].tid);
      setselectCinemaModal(MOVIEINFO_CINEMA_LIST.filter(cinema => cinema.tid === busanTheater[0].tid)[0].cid);
		}
	};

  // 모달창 극장 교체할 때
	const handleTheaterChangeModal = useCallback((value) => {
		setselectTheaterModal(value);

		if (MOVIEINFO_CINEMA_LIST.filter(cinema => cinema.tid === value).length !== 0) {
			setselectCinemaModal(MOVIEINFO_CINEMA_LIST.filter(cinema => cinema.tid === value)[0].cid);
		}
		else {
			setselectCinemaModal(null);
		}
	}, [MOVIEINFO_CINEMA_LIST]);

  // 모달창 상영관 교체할 때
	const handleCinemaChangeModal = useCallback((value) => {
		setselectCinemaModal(value);
	}, []);

  // 모달창 날짜 교체할 때
	const handleDayChangeModal = useCallback((value) => {
    setdayStartModal(date.DateToString2(value.$d));
    setdayEndModal(date.DateCal(value.$d, MOVIEINFO_MOVIE_LIST.filter(movie => movie.mid === selectMovieModal)[0].mtime));
	}, [MOVIEINFO_MOVIE_LIST, selectMovieModal, setdayStartModal]);

  // 추가 또는 수정 버튼을 누를때 실행되는 함수
  const onInsertORUpdate = useCallback(()=> {

    // 상영시작시간이 현재시간 기준으로 한시간 이후가 아닐경우 예외
    var now = new Date();
    now.setMinutes(now.getMinutes() + 59);
    if (now > new Date(dayStartModal)) {
      alert('상영시작시간을 확인해주십시오.');
      return;
    }

		// 상영관이 없는 영화관을 선택할경우 예외처리
		if (selectCinemaModal === null) {
			alert('모든 정보를 입력해주세요.');
			return;
		}

    // 상영정보를 추가할 때
    if (delState) {
      if (!window.confirm('상영정보를 추가하시겠습니까?')) {
        return;
      }
      dispatch({
				type: MANAGER_MOVIEINFO_INSERT_REQUEST,
				data: {
					mid: selectMovieModal,
          cid: selectCinemaModal,
          insertStartDay: dayStartModal,
          insertEndDay: dayEndModal
				}
			});
    }
    // 상영정보를 수정할 때
    else {
      if (!window.confirm('상영정보를 수정하시겠습니까?')) {
        return;
      }
      dispatch({
				type: MANAGER_MOVIEINFO_UPDATE_REQUEST,
				data: {
          miid: infoId,
					mid: selectMovieModal,
          cid: selectCinemaModal,
          updateStartDay: dayStartModal,
          updateEndDay: dayEndModal
				}
			});
    }
  }, [delState, infoId, selectMovieModal, selectCinemaModal, dayStartModal, dayEndModal, dispatch])

  // 삭제 버튼 누를때 실행되는 함수
  const onDelete = useCallback(()=> {
    if (!window.confirm("상영정보를 삭제하시겠습니까?\n(삭제한 정보는 복구되지 않습니다.)")) {
      return;
    };

    dispatch({
      type: MANAGER_MOVIEINFO_DELETE_REQUEST,
      data: {
        miid: infoId
      }
    });

  }, [infoId, dispatch]);

  // 상영정보 추가 성공여부에 따른 useEffect
  useEffect(()=> {
    // 추가 성공
    if (MOVIEINFO_INSERT_state === 204) {
      dispatch({
        type: MANAGER_MOVIEINFO_INSERT_RESET
      });

      setIsModalOpen(false);
      setdelState(true);

      var area = null;
      if (selectAreaModal === 'seoul') {
        area = '서울';
      }
      else if (selectAreaModal === 'gyeonggi') {
        area = '경기';
      }
      else if (selectAreaModal === 'incheon') {
        area = '인천';
      }
      else if (selectAreaModal === 'busan') {
        area = '부산';
      }

      setselectMovie(selectMovieModal);
      setselectArea(selectAreaModal);
      setselectTheater(selectTheaterModal);
      setDays(null);

      // 상영정보를 새롭게 요청
      dispatch({
        type: MANAGER_MOVIEINFO_LIST_REQUEST,
        data: {
          mid: selectMovieModal,
          tarea: area,
          tid: selectTheaterModal,
          startDay: null,
          endDay: null
        }
      });
    }

    // 추가 실패
    if(MOVIEINFO_INSERT_state === 400 || MOVIEINFO_INSERT_state === 500) {
      alert('상영정보 추가에 실패했습니다.');
      dispatch({
        type: MANAGER_MOVIEINFO_INSERT_RESET
      });
    }
  }, [MOVIEINFO_INSERT_state, selectMovieModal, selectAreaModal, selectTheaterModal, setselectMovie, setselectArea, setselectTheater, setDays, dispatch]);

  // 상영정보 삭제 성공여부에 따른 useEffect
  useEffect(()=> {
    // 삭제 성공
    if (MOVIEINFO_DELETE_state === 204) {
      dispatch({
        type: MANAGER_MOVIEINFO_DELETE_RESET
      });

      setIsModalOpen(false);
      setdelState(true);

      var start = null;
      var end = null;
      if (days) {
        if (days[0]) {
					start = date.DateToString(days[0].$d);
				}
	
				if (days[1]) {
					end = date.DateToString(days[1].$d);
				}
      }

      var area = null;
      if (selectArea === 'seoul') {
        area = '서울';
      }
      else if (selectArea === 'gyeonggi') {
        area = '경기';
      }
      else if (selectArea === 'incheon') {
        area = '인천';
      }
      else if (selectArea === 'busan') {
        area = '부산';
      }

      // 상영정보를 새롭게 요청
      dispatch({
        type: MANAGER_MOVIEINFO_LIST_REQUEST,
        data: {
          mid: selectMovie,
          tarea: area,
          tid: selectTheater,
          startDay: start,
          endDay: end
        }
      });
    }

    // 삭제 실패
    if (MOVIEINFO_DELETE_state === 400 || MOVIEINFO_DELETE_state === 500) {
      alert('상영정보 삭제에 실패했습니다.');
      dispatch({
        type: MANAGER_MOVIEINFO_DELETE_RESET
      });

      setIsModalOpen(false);
      setdelState(true);

      var start2 = null;
      var end2 = null;
      if (days) {
				if (days[0]) {
					start2 = date.DateToString(days[0].$d);
				}
	
				if (days[1]) {
					end2 = date.DateToString(days[1].$d)
				}
      }

      var area2 = null;
      if (selectArea === 'seoul') {
        area2 = '서울';
      }
      else if (selectArea === 'gyeonggi') {
        area2 = '경기';
      }
      else if (selectArea === 'incheon') {
        area2 = '인천';
      }
      else if (selectArea === 'busan') {
        area2 = '부산';
      }

      // 상영정보를 새롭게 요청
      dispatch({
        type: MANAGER_MOVIEINFO_LIST_REQUEST,
        data: {
          mid: selectMovie,
          tarea: area2,
          tid: selectTheater,
          startDay: start2,
          endDay: end2
        }
      });
    }
  }, [MOVIEINFO_DELETE_state, days, selectArea, selectMovie, selectTheater, MOVIEINFO_LIST, dispatch]);

  // 상영정보 수정 성공여부에 따른 useEffect
  useEffect(()=> {
    // 수정 성공
    if (MOVIEINFO_UPDATE_state === 204) {
      dispatch({
        type: MANAGER_MOVIEINFO_UPDATE_RESET
      });

      setIsModalOpen(false);
      setdelState(true);

      var area = null;
      if (selectAreaModal === 'seoul') {
        area = '서울';
      }
      else if (selectAreaModal === 'gyeonggi') {
        area = '경기';
      }
      else if (selectAreaModal === 'incheon') {
        area = '인천';
      }
      else if (selectAreaModal === 'busan') {
        area = '부산';
      }

      setselectMovie(selectMovieModal);
      setselectArea(selectAreaModal);
      setselectTheater(selectTheaterModal);
      setDays(null);

      // 상영정보를 새롭게 요청
      dispatch({
        type: MANAGER_MOVIEINFO_LIST_REQUEST,
        data: {
          mid: selectMovieModal,
          tarea: area,
          tid: selectTheaterModal,
          startDay: null,
          endDay: null
        }
      });
    }

    // 수정 실패
    if(MOVIEINFO_UPDATE_state === 400 || MOVIEINFO_UPDATE_state === 500) {
      alert('상영정보 수정에 실패했습니다.');
      dispatch({
        type: MANAGER_MOVIEINFO_UPDATE_RESET
      });
    }
  }, [MOVIEINFO_UPDATE_state, selectMovieModal, selectAreaModal, selectTheaterModal, setselectMovie, setselectArea, setselectTheater, setDays, dispatch]);

	return (
		<>
      <Notice>
				* 검색결과 <strong>{MOVIEINFO_LIST.length}</strong>건이 검색되었습니다.
				<Button onClick={ClickRowInsert} style={{marginLeft:"7px"}} type="primary" shape="circle" icon={<PlusOutlined />}></Button>
			</Notice> 
			<TableWrap rowKey="miid"
        loading={MOVIEINFO_LIST_loading}
        columns={columns}
        dataSource={MOVIEINFO_LIST}
				scroll={{x: 550}}
				locale={{ 
          triggerDesc: '내림차순 정렬하기',
          triggerAsc: '오름차순 정렬하기', 
          cancelSort: '정렬해제하기'
      	}}
      />
			<ModalWrap title={delState ? "상영정보추가" : "상영정보수정"}
			keyboard={false} 
      open={isModalOpen} 
      okButtonProps={{ disabled: infoState}} 
      onOk={onInsertORUpdate} 
      okText={delState ? "추가" : "수정"} 
      cancelText="취소" 
      onCancel={handleCancel} destroyOnClose>
        <Form>
          <Form.Item label="영화">
            <Select 
            disabled={infoState}
            defaultValue={selectMovieModal}
            onChange={handleMovieChangeModal} 
            options={MOVIEINFO_MOVIE_LIST.map((movie) => ({
              value: movie.mid,
              label: movie.mtitle + " (상영시간 : " + movie.mtime + "분, 개봉일 : " + movie.mdate + ")"
            }))}
            />
          </Form.Item>  
          <Form.Item label="지역">
            <Select 
            disabled={infoState}
            defaultValue={selectAreaModal}
            onChange={handleAreaChangeModal} 
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
            ]}
            />
          </Form.Item> 
          <Form.Item label="극장">
            <Select 
            disabled={infoState}
            value={selectAreaModal ? selectTheaterModal : null}
            onChange={handleTheaterChangeModal}
            options={seoulTheater && selectAreaModal === 'seoul' ? seoulTheater.map((theater) => ({
              value: theater.tid,
              label: theater.tname
            })) : gyeonggiTheater && selectAreaModal === 'gyeonggi' ? gyeonggiTheater.map((theater) => ({
              value: theater.tid,
              label: theater.tname
            })) : incheonTheater && selectAreaModal === 'incheon' ? incheonTheater.map((theater) => ({
              value: theater.tid,
              label: theater.tname
            })) : busanTheater && busanTheater.map((theater) => ({
              value: theater.tid,
              label: theater.tname
            }))}
            />
          </Form.Item>
          <Form.Item label="상영관">
            <Select
            disabled={infoState}
            value={selectCinemaModal}
            onChange={handleCinemaChangeModal}
            options={MOVIEINFO_CINEMA_LIST.filter(cinema => cinema.tid === selectTheaterModal).map((cinema) => ({
              value: cinema.cid,
              label: cinema.cname + " (" + cinema.ctype + ", " + cinema.cseat + "좌석)"
            }))}
            />
          </Form.Item>
          <Form.Item label="상영시작시간" extra="현재시간 기준으로 1시간 이후부터 설정하십시오." style={{marginBottom: "10px"}}>
            <ConfigProvider locale={locale}>
              <DatePicker 
              disabled={infoState}
							showNow={false}
              disabledDate={(current) => {
                return current && current < moment(openDay, "YYYY-MM-DD");
              }} 
              onChange={handleDayChangeModal}
              allowClear={false} 
              showTime format="YYYY-MM-DD HH:mm" 
              value={dayjs(dayStartModal, 'YYYY-MM-DD HH:mm')}/>
						</ConfigProvider>
          </Form.Item>
          <Form.Item label="상영종료시간">
            <ConfigProvider locale={locale}>
              <DatePicker disabled 
              showTime format="YYYY-MM-DD HH:mm" 
              value={dayjs(dayEndModal, 'YYYY-MM-DD HH:mm')}/>
						</ConfigProvider>
          </Form.Item>
          {infoState ? '* 상영상태가 상영종료 및 상영중인 경우 상영정보 삭제만 가능합니다.' : '* 상영정보 추가, 수정시 상영관의 상영정보간 여유시간 30분이 필요합니다.'}
          <Form.Item style={{position:'relative', top:'57px'}}>
            <Button disabled={delState} type="primary" danger onClick={onDelete}>
              삭제
            </Button>      
          </Form.Item>
        </Form>
      </ModalWrap>
		</>
	);
};

const Notice = styled.div`
	float: right;
	margin-bottom: 8px;
	font-size: 17px;
`;

const TableWrap = styled(Table)`
  padding-bottom: 20px;
  min-height: 693px;

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

export default MovieInfoTable;