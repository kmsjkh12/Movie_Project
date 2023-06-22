import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import moment from "moment";
import "moment/locale/ko";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { TIMETABLE_DAY_LIST_REQUEST, TIMETABLE_DAY_SELECT } from "../../reducer/R_timetable";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

// 날짜 css에 쓰일 변수들
const Date_List = [];
const Day_List = [];

const today = moment().format("YYYY-MM-DD");
const tomorrow = moment().add(1, 'days').format("YYYY-MM-DD");
const currentMonth = moment().format("YYYY-MM");
const nextMonth = moment().add(1, 'month').format("YYYY-MM");
var monthLeft = 0;

for (var i = 0; i < 20; i++){
	Date_List[i] = moment().add(i, 'days').format("YYYY-MM-DD"); 
	Day_List[i] = moment().add(i, 'days').format('dddd');

	if (Date_List[i].substring(0, 7) === currentMonth) {
		monthLeft = monthLeft + 72;
	}
}

const Time = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	// 필요한 리덕스 상태들
	const { MOVIE, AREA, THEATER, DAY_LIST, DAY, TIMETABLE_KEY, MOVIE_BUTTON, THEATER_BUTTON, CHANGE_STATE } = useSelector(
		state => ({
			MOVIE: state.R_timetable.MOVIE,
			AREA: state.R_timetable.AREA,
			THEATER: state.R_timetable.THEATER,
			DAY_LIST: state.R_timetable.DAY_LIST,
			DAY: state.R_timetable.DAY,
			TIMETABLE_KEY: state.R_timetable.TIMETABLE_KEY,
			MOVIE_BUTTON: state.R_timetable.MOVIE_BUTTON,
			THEATER_BUTTON: state.R_timetable.THEATER_BUTTON,
			CHANGE_STATE: state.R_timetable.CHANGE_STATE
		}),
		shallowEqual
	);

	// 날짜 조회 useEffect
	useEffect(()=>{
		if (location.key !== TIMETABLE_KEY || CHANGE_STATE) {
			// 영화 선택 페이지시 영화 기준으로 날짜를 검색
			if (MOVIE_BUTTON && MOVIE !== '') {
				dispatch({
					type: TIMETABLE_DAY_LIST_REQUEST,
					data: {
						mid: MOVIE.mid,
						tarea: AREA
					}
				});
			}
			// 극장 선택 페이지시 극장을 기준으로 날짜를 검색
			if (THEATER_BUTTON && THEATER !== '') {
				dispatch({
					type: TIMETABLE_DAY_LIST_REQUEST,
					data: {
						tarea: THEATER.tarea,
						tid: THEATER.tid
					}
				});
			}
		}
	}, [location.key, TIMETABLE_KEY, CHANGE_STATE, MOVIE_BUTTON, THEATER_BUTTON, MOVIE, AREA, THEATER, dispatch]);

	// 날짜간 간격 useState
	const [marginleft, setMarginLeft] = useState(0);
	const [monthMargin, setmonthMargin] = useState(monthLeft);
	const [maxcnt, setMaxcnt] = useState(0);

	// 이전 버튼 누를때
	const onPreButton = useCallback(()=> {
		setMarginLeft(marginleft => +(marginleft+3.79).toFixed(12));
		
		if (maxcnt > 0) {
			setMaxcnt(maxcnt => maxcnt - 1);
		}
		else {
			setmonthMargin(monthMargin => monthMargin + 72);
		}
	}, [maxcnt]);

	// 다음 버튼 누를때
	const onNextButton = useCallback(()=> {
		setMarginLeft(marginleft => +(marginleft-3.79).toFixed(12));

		if (monthMargin === 0) {
			setMaxcnt(maxcnt => maxcnt + 1);
			return;
		}
		else {
			setmonthMargin(monthMargin => monthMargin - 72);
		}
	}, [monthMargin]);

	// 버튼 able, disable을 위한 useState, useEffect
	const [checkDate, setCheckDate] = useState([]);
	useEffect(()=> {
		const temp_array = [];
		
		for (var i = 0; i < DAY_LIST.length; i++) {
			temp_array.push(DAY_LIST[i].miday);
		}

		setCheckDate(temp_array);
	}, [DAY_LIST]);

	// 날짜 버튼 누를때
	const onDayButton = useCallback((day)=> {
		dispatch({
			type: TIMETABLE_DAY_SELECT,
			data: day
		});
	}, [dispatch]);

	return(
		<TimeSchedule>
			<Wrap>
				<button className="btn-pre" disabled={marginleft >= 0 ? "disabled": ""} onClick={onPreButton}>
					<LeftOutlined/>
				</button>
				<DateList>
					<MonthFix>
						{currentMonth}
					</MonthFix>
					<MonthFix style={{left: `${32 + monthMargin}px`}}>
						{nextMonth}
					</MonthFix>
					<DateMonthWrapper>
						<div className="overflow" style={{transform: `translate(${marginleft}%)`}}>
							{Date_List.map((date, index) =>
							<NextMonth key={index} date={date}>
								{date.substring(0, 7)}
							</NextMonth> )}
						</div>
					</DateMonthWrapper>	
					<DateArea>
						<DateWrapper>                              
							<Date style={{transform: `translate(${marginleft}%)`}}>
								{Date_List.map((date, index)=> 																				
								<DateButton key={index} onClick={()=>{onDayButton(date)}} date={date} day={DAY}
									disabled={checkDate.includes(date) ? "": "disabled"}
									className={!checkDate.includes(date) ? "disable": 
									Day_List[index] === "토요일" ? "blue day" : 
									Day_List[index] === "일요일" ? "red day" : 'able'}>
										<span className="date">
											{date}
										</span>
									<em>
										{date.substring(8,10)} <br/>
										{date === today ? 
										<span className="day">
											오늘
										</span> : date === tomorrow ?
										<span className="day">
											내일
										</span> :
										<span className="day">
											{Day_List[index].substring(0,1)}
										</span>}
									</em>
								</DateButton>)}
							</Date>
						</DateWrapper>
					</DateArea>
				</DateList>
				<button className="btn-next" disabled={marginleft === -11.37 ? "disabled" : ""} onClick={onNextButton}>
					<RightOutlined />
				</button>
			</Wrap>
		</TimeSchedule>
	)
}

const TimeSchedule = styled.div`
	width: 100%;
	padding-top: 20px;
	overflow-x: hidden;
`;

const Wrap = styled.div`
	height: 90px;
	border: 1px solid #d8d9db;
	border-right: 0;
	border-left: 0;
	position: relative;
	left: 10px;

	.btn-pre {
		width: 20px;
		height: 80px;
		border: 0 !important;
		background-color: transparent !important;
		float: left;
		cursor: pointer;
	}
	.btn-next {
		width: 40px;
		height: 73px;
		border: 0!important;
		background-color: transparent!important;
		float: left;
		cursor: pointer;
	}
`;

const DateList = styled.div`
	width: 1162px;
	float: left;
	height: 90px;
	overflow: hidden;
`;

const DateArea = styled.div`
	position: relative;
	width: 100%;
	border: none;
	left: -0px;
`;

const MonthFix = styled.div`
	position: absolute;
	top: 0;
	font-size: .8667em;
	width: 68px;
	height: 29px;
	line-height: 28px;
	margin-top: -14px;
	border: 1px solid #d8d9db;
	border-radius: 15px;
	text-align: center;
	background-color: #fff;
	font-weight: 400;
	transition: 0.6s ease-out;
	left: 32px;
	opacity: 1;
`;

const DateMonthWrapper = styled.div`
	width: 100%;
	float: left;
	left: -38px;
	top: -13px;
	padding-left: 40px;
	position: relative;
	transition: 0.6s ease-out;
	overflow: hidden;

	.overflow{
    width: 2100px;
    hegiht: 35px;
    float: left;
    transition: 0.6s ease-out;
    position: relative;
    top: 0;
	}	
`;

const NextMonth = styled.div`
	font-size: .8667em;
	position: relative;
	width: 68px;
	line-height: 29px;
	border: 1px solid #d8d9db;
	border-radius: 15px;
	text-align: center;
	background-color: #fff;
	font-weight: 400;
	float: left;
	opacity: 0;
`;

const DateWrapper = styled.div`
	position: relative;
	width: 100%;
	overflow: hidden;
	border: none;
	left: 10px;
	top: -14px;
`;

const Date = styled.div`
	position: relative;
	width: 1900px;
	border: none;
	transition: 0.6s ease-out;
	left: 0px;
    
	.blue {
		color:blue;
	}
	.red {
		color:red;
	}
	.disable {
		border-bottom: none;
		cursor: default;
	}
	.disable:hover {
		border-bottom: none;
	}
`;

const DateButton = styled.button`
	width: 72px;
  height: 74px;
	border: 0;
	background-color: transparent;
	float: left;
	border-bottom: 3px solid transparent;
	font-weight: 400;
	font-size: 14px;
	cursor: pointer;
	background-color: ${(props) => props.day === props.date ? "#E2E2E2" : "white"};
  border-bottom: ${(props) => props.day === props.date ? "3px solid #503396" : "white"};
        
  &:hover {  
		border-bottom: 3px solid #503396;
	}

	.date {
		text-indent: -9999px;
		position: fixed;
		top: -9999px;
		font-size: 1px;
		width: 1px;
		height: 1px;
		opacity: 0;
	}

	em {
		display: block;
		font-size: 1.2em;
		line-height: 1.1;
		padding: 5px 0;
		font-weight: 500;
		font-style: normal;
	}

	.day {
		vertical-align: bottom;
		line-height: 1.1;
	}
`;

export default Time;
