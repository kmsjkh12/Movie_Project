import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Select, Space } from 'antd';
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { MANAGER_MOVIEINFO_MOVIE_LIST_REQUEST, MANAGER_MOVIEINFO_THEATER_LIST_REQUEST,
	MANAGER_MOVIEINFO_THEATER_LIST_RESET, MANAGER_MOVIEINFO_CINEMA_LIST_REQUEST, MANAGER_MOVIEINFO_LIST_REQUEST } from '../../reducer/R_manager_movieinfo';
import MovieInfoTable from './MovieInfoTable';
import locale from 'antd/lib/locale/ko_KR';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import "dayjs/locale/ko";
import * as date from "../../lib/date.js";
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
const { RangePicker } = DatePicker;

const MovieInfo = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// 필요한 리덕스 상태들
  const { LOGIN_data, LOGIN_STATUS_done, MOVIEINFO_MOVIE_LIST, MOVIEINFO_THEATER_LIST } = useSelector(
    state => ({
      LOGIN_data: state.R_user_login.LOGIN_data,
			LOGIN_STATUS_done: state.R_user_login.LOGIN_STATUS_done,
      MOVIEINFO_MOVIE_LIST: state.R_manager_movieinfo.MOVIEINFO_MOVIE_LIST,
			MOVIEINFO_THEATER_LIST: state.R_manager_movieinfo.MOVIEINFO_THEATER_LIST
    }),
    shallowEqual
  );

	// 모든 영화 및 상영관 조회 useEffect
  useEffect(() => {
		// 관리자 이외의 계정은 접근 불가능
		if (LOGIN_STATUS_done && LOGIN_data.uid !== 'manager') {
			alert('관리자 계정만 사용 가능합니다. 관리자 계정으로 로그인 해주세요! (id : manager, pw: manager123456)');
			navigate('/');
		}

		// 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청(검색에 필요한 정보)
		if (LOGIN_data.uid === 'manager') {
		 	dispatch({
			 	type: MANAGER_MOVIEINFO_MOVIE_LIST_REQUEST
		 	});
		 	dispatch({
			 	type: MANAGER_MOVIEINFO_THEATER_LIST_REQUEST
		 	});
			dispatch({
				type: MANAGER_MOVIEINFO_CINEMA_LIST_REQUEST
			});
	 	}

		// 백엔드로 부터 로그인 기록을 받아온 다음 백엔드 요청(상영정보)
		if (LOGIN_data.uid === 'manager') {
			dispatch({
				type: MANAGER_MOVIEINFO_LIST_REQUEST,
				data: {
					mid: null,
					tarea: null,
					tid: null,
					startDay: null,
					endDay: null
				}
			});
		}

		// 페이지 탈출할때 극장 목록은 리셋
		return () => {
      dispatch({
				type: MANAGER_MOVIEINFO_THEATER_LIST_RESET
			});
    };
 	}, [LOGIN_data.uid, LOGIN_STATUS_done, dispatch, navigate]);

	// 분리된 극장들 변수
	const [seoulTheater, setseoulTheater] = useState('');
	const [gyeonggiTheater, setgyeonggiTheater] = useState('');
	const [incheonTheater, setincheonTheater] = useState('');
	const [busanTheater, setbusanTheater] = useState('');

	// 받아온 극장 분리하는 useEffect
	useEffect(()=> {
		for (var i = 0; i < MOVIEINFO_THEATER_LIST.length; i++) {
			if (MOVIEINFO_THEATER_LIST[i].tarea === "서울") {
				const theater = {
					tid: MOVIEINFO_THEATER_LIST[i].tid,
					tname: MOVIEINFO_THEATER_LIST[i].tname
				};
				setseoulTheater(t=> ([...t, theater]));
			}
			else if(MOVIEINFO_THEATER_LIST[i].tarea === "경기") {
				const theater = {
					tid: MOVIEINFO_THEATER_LIST[i].tid,
					tname: MOVIEINFO_THEATER_LIST[i].tname
				};
				setgyeonggiTheater(t=> ([...t, theater]));
			}
			else if(MOVIEINFO_THEATER_LIST[i].tarea === "인천") {
				const theater = {
					tid: MOVIEINFO_THEATER_LIST[i].tid,
					tname: MOVIEINFO_THEATER_LIST[i].tname
				};
				setincheonTheater(t=> ([...t, theater]));
			}
			else { 
				const theater = {
					tid: MOVIEINFO_THEATER_LIST[i].tid,
					tname: MOVIEINFO_THEATER_LIST[i].tname
				};
				setbusanTheater(t=> ([...t, theater]));
			}
		}
	}, [MOVIEINFO_THEATER_LIST]);

	// 선택된 영화, 지역, 극장, 날짜버튼 useState
	const [selectMovie, setselectMovie] = useState();
	const [selectArea, setselectArea] = useState();
	const [selectTheater, setselectTheater] = useState();
	const [days, setDays] = useState(null);

	// 영화 교체할 때
	const handleMovieChange = useCallback((value) => {
		setselectMovie(value);
	}, []);

	// 지역 교체할 때
	const handleAreaChange = useCallback((value) => {
		setselectArea(value);
		setselectTheater(null);
	}, []);

	// 극장 교체할 때
	const handleTheaterChange = useCallback((value) => {
		setselectTheater(value);
	}, []);

	// 날짜 형변환 해주는 함수
	const returnDayjsRange = useCallback((start, finish) => {
		if (start === null) {
			return [null, dayjs(finish, "YYYY-MM-DD")];
		}

		if (finish === null) {
			return [dayjs(start, "YYYY-MM-DD"), null];
		}
		return [dayjs(start, "YYYY-MM-DD"), dayjs(finish, "YYYY-MM-DD")];
  }, []);

	// 날짜 선택할 때
	const handleCalendarChange = useCallback((dateRange) => {
		if (dateRange) {
			setDays(returnDayjsRange(dateRange[0], dateRange[1]));
		}
		else {
			setDays(null);
		}
	}, [returnDayjsRange]);

	// 검색 버튼을 누를때 함수
	const onSearch = useCallback(() => {
		// 사용자가 고른 날짜가 있을경우 처리
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

		// 사용자가 고른 지역이 있을경우 처리
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
	}, [selectMovie, selectArea, selectTheater, days, dispatch])
	
	return (
		<Container>
      <InnerWraps>
        <div className="titleMenu">
          <h1>
            상영정보관리
          </h1>
        </div>
				<MovieAreaChoice>
					<SearchTitle>
						<p>
							상영정보검색
						</p>
					</SearchTitle>
					<SpaceWrap wrap> 
						<SelectTitle>
							영화제목 :
						</SelectTitle>
						<Select
							value={selectMovie}
							placeholder="영화선택"
							style={{width: 210}}
							allowClear={true}
							onChange={handleMovieChange}
							options={MOVIEINFO_MOVIE_LIST.map((movie) => ({
								value: movie.mid,
								label: movie.mtitle
							}))}
						/>
						<SelectTitle>
							지역 :
						</SelectTitle>
						<Select
							value={selectArea}
							placeholder="지역선택"
							style={{width: 120}}
							onChange={handleAreaChange}
							allowClear={true}
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
						<SelectTitle>
							극장 : 
						</SelectTitle>
						<Select
							placeholder="극장선택"
							value={selectArea ? selectTheater : null}
							style={{width: 120}}
							disabled={!selectArea}
							allowClear={true}
							onChange={handleTheaterChange}
							options={seoulTheater && selectArea === 'seoul' ? seoulTheater.map((theater) => ({
								value: theater.tid,
								label: theater.tname
							})) : gyeonggiTheater && selectArea === 'gyeonggi' ? gyeonggiTheater.map((theater) => ({
								value: theater.tid,
								label: theater.tname
							})) : incheonTheater && selectArea === 'incheon' ? incheonTheater.map((theater) => ({
								value: theater.tid,
								label: theater.tname
							})) : busanTheater && busanTheater.map((theater) => ({
								value: theater.tid,
								label: theater.tname
							}))}
						/>
						<SelectTitle>
							날짜 :
						</SelectTitle>
						<ConfigProvider locale={locale}>
							<RangePicker picker="date" value={days !== "" ? days : ""} onCalendarChange={handleCalendarChange} style={{width: "240px", marginRight: "7px"}}/>
						</ConfigProvider>
						<Button icon={<SearchOutlined/>} onClick={onSearch}>
							검색
						</Button>
					</SpaceWrap>
				</MovieAreaChoice>
				<MovieInfoTable 
					selectMovie={selectMovie} 
					selectArea={selectArea} 
					selectTheater={selectTheater} 
					days={days}
					setselectMovie={setselectMovie}
					setselectArea={setselectArea}
					setselectTheater={setselectTheater}
					setDays={setDays}
					seoulTheater={seoulTheater}
					gyeonggiTheater={gyeonggiTheater}
					incheonTheater={incheonTheater}
					busanTheater={busanTheater}
				/>
      </InnerWraps>
    </Container>
	);
};

const Container = styled.div`
  padding: 0;
  width: 1235px;
  margin: 0 auto;
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
		margin-bottom: 35px;
  }
`;

const MovieAreaChoice = styled.div`
	overflow: hidden;
	position: relative;
	width: 100%;
	height: 145px;
	margin: 0;
	border: 3px solid #686571;
	border-radius: 10px;
	padding: 0;
	margin-bottom: 50px;
`;

const SearchTitle = styled.div`
	margin-bottom: 25px;
	p {
		text-align: center;
		font-size: 20px;
		font-weight: 600;
	}
`;

const SelectTitle = styled.span`
	font-size: 16px;
	margin-left: 10px;
`;

const SpaceWrap = styled(Space)`
	margin-left: 75px;
`;

export default MovieInfo;