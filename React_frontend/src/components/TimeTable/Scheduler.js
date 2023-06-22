import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { PicCenterOutlined, BankOutlined } from "@ant-design/icons";
import { TIMETABLE_MOVIE_LIST_REQUEST, TIMETABLE_MOVIE_SELECT, TIMETABLE_AREA_SELECT, TIMETABLE_THEATER_AREA_SELECT, TIMETABLE_SORT_SELECT, 
	TIMETABLE_KEY_SELECT,	TIMETABLE_THEATER_LIST_REQUEST, TIMETABLE_THEATER_SELECT } from "../../reducer/R_timetable";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import TimeTableLoading from "./TimeTableLoading";
import Time from "./Time";
import MovieSchedule from "./MovieSchedule";
import TheaterSchedule from "./TheaterSchedule";

const Scheduler = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	// 필요한 리덕스 상태들
	const { MOVIE_LIST_loading, MOVIE_LIST, MOVIE, AREA, THEATER_AREA, THEATER_LIST, THEATER, 
		TIMETABLE_KEY, MOVIE_BUTTON, THEATER_BUTTON } = useSelector(
		state => ({
			MOVIE_LIST_loading: state.R_timetable.MOVIE_LIST_loading,
			MOVIE_LIST: state.R_timetable.MOVIE_LIST,
			MOVIE: state.R_timetable.MOVIE,
			AREA: state.R_timetable.AREA,
			THEATER_AREA: state.R_timetable.THEATER_AREA,
			THEATER_LIST: state.R_timetable.THEATER_LIST,
			THEATER: state.R_timetable.THEATER,
			TIMETABLE_KEY: state.R_timetable.TIMETABLE_KEY,
			MOVIE_BUTTON: state.R_timetable.MOVIE_BUTTON,
			THEATER_BUTTON: state.R_timetable.THEATER_BUTTON,
		}),
		shallowEqual
	);

	// 모든 영화 및 극장 조회(초기화 포함) useEffect
  useEffect(() => {
		if (location.key !== TIMETABLE_KEY) {
			dispatch({
				type: TIMETABLE_MOVIE_LIST_REQUEST
			});
	
			dispatch({
				type: TIMETABLE_THEATER_LIST_REQUEST
			});

			dispatch({
				type: TIMETABLE_AREA_SELECT,
				data: "서울"
			});

			dispatch({
				type: TIMETABLE_THEATER_AREA_SELECT,
				data: "seoul"
			});

			dispatch({
				type: TIMETABLE_SORT_SELECT,
				data: {movie: true, theater: false}
			})
		}

		return () => {
      dispatch({
				type: TIMETABLE_KEY_SELECT,
				data: location.key
			});
    };
  }, [TIMETABLE_KEY, location.key, dispatch]);

	// 영화별 버튼 누를때
	const onMovie = useCallback(() => {
		dispatch({
			type: TIMETABLE_SORT_SELECT,
			data: {movie: true, theater: false}
		})
	}, [dispatch]);

	// 극장별 버튼 누를때
	const onTheater = useCallback(() => {
		dispatch({
			type: TIMETABLE_SORT_SELECT,
			data: {movie: false, theater: true}
		})
	}, [dispatch])

	// 영화 목록들 중 하나를 클릭할때
	const MovieClick = useCallback((movie) => {
		dispatch({
			type: TIMETABLE_MOVIE_SELECT,
			data: movie
		});
	}, [dispatch]);

	// 영화별 조회시 지역 버튼에 사용될 변수
	const movieArea = ["서울", "경기", "인천", "부산"];
	const onMovieArea = useCallback((name)=> {
		dispatch({
			type: TIMETABLE_AREA_SELECT,
			data: name
		});
	}, [dispatch]);

	// 극장에 있는 지역 누를때 함수
	const onTheaterArea = useCallback((name)=> {
		dispatch({
			type: TIMETABLE_THEATER_AREA_SELECT,
			data: name
		});
	}, [dispatch]);

	// 극장 관리 useState
	const [theater, setTheater] = useState({
		seoul: 0,
		gyeonggi: 0,
		incheon: 0,
		busan: 0
  });
	const { seoul, gyeonggi, incheon, busan } = theater;

	// 극장 목록들 중 하나를 클릭할때
	const TheaterClick = useCallback((theater) => {
		dispatch({
			type: TIMETABLE_THEATER_SELECT,
			data: theater
		})
	}, [dispatch])

	// 지역별 극장 개수 설정하는 useEffect
	useEffect(()=> {
		var temp_seoul = 0;
		var temp_gyeonggi = 0;
		var temp_incheon = 0;
		var temp_busan = 0;
	
		for (var i = 0; i < THEATER_LIST.length; i++) {
			if (THEATER_LIST[i].tarea === "서울") { temp_seoul++; }
			else if(THEATER_LIST[i].tarea === "경기") { temp_gyeonggi++; }
			else if(THEATER_LIST[i].tarea === "인천") { temp_incheon++; }
			else { temp_busan++; }
		}

		setTheater(t=> ({
			...t,
			seoul: temp_seoul,
			gyeonggi: temp_gyeonggi,
			incheon: temp_incheon,
			busan: temp_busan
		}));
	}, [THEATER_LIST]);
  
	return (
		<TimeTableWrapper>
			<TimeTablePage>
				<MovieAreaChoice>  
					<TabLeft>
						<ul>
							<li className={MOVIE_BUTTON ? "hover tab" : "tab"} onClick={onMovie}>
								<div>
									<i>
										<PicCenterOutlined/>
									</i>
									영화
								</div>
							</li>
							<li className={THEATER_BUTTON ? "hover tab" : "tab"} onClick={onTheater}>
								<div>
									<i>
										<BankOutlined/>
									</i>
									극장
								</div>
							</li>	
						</ul>
					</TabLeft> 
					<TabCenter>
					{MOVIE_BUTTON ? MOVIE_LIST_loading ? <TimeTableLoading/> :
						<MovieWrapper>
							<ListSection>
								<ScrollBar>
									<MovieContainer>
										<ul>
										{MOVIE_LIST.map((movie)=> 
											<Movies title={movie.mtitle} key={movie.mid} movie={movie.mid} movieData={MOVIE}>
												<button onClick={()=> MovieClick(movie)}>       
													{movie.mtitle}
												</button>
											</Movies>)}
										</ul>	
									</MovieContainer>
								</ScrollBar>
							</ListSection>
							<Poster>
								<Info> 
									<img src={`/${MOVIE.mimagepath}`} style={{width:"100%" ,height:"100%"}} alt ='Poster'/>
								</Info>
							</Poster>
						</MovieWrapper>	: 
						<TheaterWrapper>
							<Wrapper>
								<ListChoice>
									<ul>
										<li onClick={()=> onTheaterArea('seoul')} className={THEATER_AREA === 'seoul' ? "tab menu"  : ""}>
											서울 ({seoul})
										</li>
										<li onClick={()=> onTheaterArea('gyeonggi')} className={THEATER_AREA === 'gyeonggi' ? "tab menu"  : ""}>
											경기 ({gyeonggi})
										</li>
										<li onClick={()=> onTheaterArea('incheon')} className={THEATER_AREA === 'incheon' ? "tab menu"  : ""}>
											인천 ({incheon})
										</li>
										<li onClick={()=> onTheaterArea('busan')} className={THEATER_AREA === 'busan' ? "tab menu"  : ""}>
											부산 ({busan})
										</li>
									</ul>
								</ListChoice>
								<ListSectionT>
									<ScrollBarT>
										<TheaterContainer>
											<ul>
                       	{THEATER_AREA === 'seoul' ? THEATER_LIST.map((theater)=> 
												theater.tarea === '서울' ? <TheaterLi key={theater.tid} onClick={()=> TheaterClick(theater)} tName={theater.tid} theater={THEATER.tid}> {theater.tname} </TheaterLi> 
												: null) : null}

												{THEATER_AREA === 'gyeonggi' ? THEATER_LIST.map((theater)=> 
												theater.tarea === '경기' ? <TheaterLi  key={theater.tid} onClick={()=> TheaterClick(theater)} tName={theater.tid} theater={THEATER.tid}> {theater.tname} </TheaterLi> 
												: null) : null}

												{THEATER_AREA === 'incheon' ? THEATER_LIST.map((theater)=> 
												theater.tarea === '인천' ? <TheaterLi  key={theater.tid} onClick={()=> TheaterClick(theater)} tName={theater.tid} theater={THEATER.tid}> {theater.tname} </TheaterLi> 
												: null) : null}

												{THEATER_AREA === 'busan' ? THEATER_LIST.map((theater)=> 
												theater.tarea === '부산' ? <TheaterLi  key={theater.tid} onClick={()=> TheaterClick(theater)} tName={theater.tid} theater={THEATER.tid}> {theater.tname} </TheaterLi> 
												: null) : null}
							 				</ul>
										</TheaterContainer>
									</ScrollBarT>
								</ListSectionT>
							</Wrapper>
						</TheaterWrapper>}
					</TabCenter>
				</MovieAreaChoice>
				<Time/>
					{MOVIE_BUTTON ? <CityTab>   
						<ul>
						{movieArea.map((city, index)=> 
							<City key={index} city={city} selectArea={AREA} onClick={()=> onMovieArea(city)}> 
								<span>
									{city}
								</span>
							</City>)}
						</ul>
					</CityTab> : null}
					{MOVIE_BUTTON ? <MovieSchedule/> : <TheaterSchedule/>}
				</TimeTablePage>
		</TimeTableWrapper>
	);
};

const TimeTableWrapper = styled.div`
	padding: 0;
  width: 1235px;
  margin : 0 auto;
  box-sizing: border-box; 
  margin-bottom: 0;
  min-height: 820px;
`;

const TimeTablePage = styled.div`
 	width: 100%;
  padding-left: 10px;
	padding-top: 40px;
`;

const MovieAreaChoice = styled.div`
	overflow: hidden;
	position: relative;
	width: 100%;
	height: 300px;
	margin: 0;
	border: 3px solid #686571;
	border-radius: 10px;
	padding: 0;
	margin-bottom: 10px;
`;

const TabLeft = styled.div`
	float: left;
	width: 145px;
	height: 100%;

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;

		.hover {
			background-color: #fff;
			border-right: none;
		}

		li {
			cursor: pointer;
			display: block;
			text-align: center;
			width: 100%;
			height: 150px;
			line-height: 160px;
			border: 1px solid #d8d9db;
			border-width: 0 1px 1px 0;
			background-color: #f2f4f5;

			div	{
				display: block;
				color: #444;
				font-size: 1.2em;
				font-weight: 400;
				text-decoration: none;

				i	{
					width: 39px;
					height: 32px;
					overflow: hidden;
					display: inline-block;
					margin-bottom: 5px;
					margin-right: 5px;
					padding: 0;
					font-size: 32px;
					line-height: 0;
					vertical-align: middle;
					background-position: 0 0;
					background-repeat: no-repeat;
				}
			}
		}
	}
`;

const TabCenter = styled.div`
	height: 300px;
`;

const MovieWrapper = styled.div`
	position: absolute;
	left: 180px;
	top: 0;
	display: block;
	width: calc(100% - 180px);
	height: 300px;
	padding: 0;
`;

const ListSection = styled.div`
	overflow: hidden;
	width: 800px;
	height: 240px;
	padding: 20px 0;
`;

const ScrollBar = styled.div`
	height: 200px;
	position: relative;
	overflow: hidden;
	height: 100%;
	max-width: 100%;
	outline: 0;
	direction: ltr;   
	max-height: none;
`;

const MovieContainer = styled.div`
	position: relative;
	top: 0;
	left: 0;
	overflow:auto;
	height:100%;

	ul {
		overflow: hidden;
		position: relative;
		display: block;
		min-height: 145px;
		list-style-type: none;
		margin: 0;
		padding: 0;
  }
`;

const Movies = styled.li`
	float: left;
	width: 25%;
	padding: 0;
	background-color: ${(props) => props.movieData.mid === props.movie ? "#E2E2E2" : "white"};

	button {
    display: block;
    width: 100%;
    height: 50px;
    margin: 0;
    padding: 0 28px 0 10px;
    color: #444;
    border: 0;
    text-align: left;
    background-color: transparent;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    letter-spacing: -.5px;
    font-weight: 500;
		font-size: 15px;
	}
`;

const Poster = styled.div`
	position: absolute;
	right: 0;
	top: 0;
	width: 206px;
	height: 100%;
`;

const Info = styled.div`
	display: block;
	width: 100%;
	height: 100%;
`;

const TheaterWrapper = styled.div`
	position: absolute;
	left: 180px;
	top: 0;
	display: block;
	width: calc(100% - 180px);
	height: 300px;
	padding: 0;
`;

const Wrapper = styled.div`
	float: left;
	position: relative;
	width: 100%;
	height: 100%;
`;

const ListSectionT = styled.div`
	overflow: hidden;
	height: 240px;
	padding: 20px 0;
`;

const ScrollBarT = styled.div`
	height: 200px;
	position: relative;
	overflow: hidden;
	height: 100%;
	max-width: 100%;
	outline: 0;
	direction: ltr;   
	max-height: none;
`;

const TheaterContainer = styled.div`
	position: relative;
	top: 0;
	left: 0;
	overflow: auto;
	height: 100%;

	ul {
		overflow: hidden;
		position: relative;
		display: block;
		min-height: 138px;
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
`;

const ListChoice = styled.div`
	width: 100%;
	height: 54px;
	border-bottom: 1px solid #d8d9db;

	ul {
    position: relative;
    right: 39px;
    list-style-type: none;
    padding-top: 24px;

    .menu {
			border-bottom: 2px solid #555;
    }

    li {
			cursor: pointer;
			float: left;
			font-size: .9333em;
			margin-right: 20px;
			text-decoration: none;
			color: #555;
			padding-bottom: 9px;
			letter-spacing: -0.5px;
    }
	}
`;

const TheaterLi = styled.li`
	background-color: ${(props) => props.tName ===  props.theater? "#E2E2E2" : "white"};
	float: left;
	width: 25%;
	padding: 0;
	font-size: 20px;
	line-height: 30px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	cursor: pointer;

	button {
		display: block;
		width: 100%;
		height: 50px;
		margin: 0;
		padding: 0 28px 0 10px;
		color: #444;
		border: 0;
		text-align: left;
		background-color: transparent;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		cursor: pointer;
		letter-spacing: -.5px;
		font-weight: 400;
	}
`;

const CityTab = styled.div`
	position: relative;
	right: 40px;
	width: 100%;
	border-bottom: 30px !important;
	height: 36px;
	padding-bottom: 40px;

	ul {
    list-style-type: none;
    width: 100%;
		margin-top: 24px;

    .hover {
			background-color: grey;
			border-right: none;
		}
	}
`;

const City = styled.li`
	cursor: pointer;
	float: left;
	width: 137px;
	height: 34px;
	border: 1px solid #d8d9db;
	background-color: ${(props) => props.selectArea ===  props.city? "#E2E2E2" : "white"};

	span {
		display: block;
		width: 100%:
		height: 34px;
		margin: 0;
		padding: 0;
		border: 0;
		line-height: 36px;
		text-align: center;
		text-decoration: none;
	}
`;

export default Scheduler;