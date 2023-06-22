/*
	극장을 표시해주는 컴포넌트 2023-02-13 수정완(강경목)
	23-04-28 예매 페이지 극장 컴포넌트 수정(오병주)
*/
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import styled from "styled-components";
import { TICKET_THEATER_LIST_REQUEST, TICKET_THEATER_SELECT, TICKET_AREA_SELECT, TICKET_THEATER_RESET } from "../../reducer/R_ticket";

const TicketTheaterList = () => {
  const dispatch = useDispatch();

	// 필요한 리덕스 상태들
	const { THEATER_LIST, MOVIE, THEATER, AREA, DAY } = useSelector(
		state => ({
			THEATER_LIST: state.R_ticket.THEATER_LIST,
			MOVIE: state.R_ticket.MOVIE,
			THEATER: state.R_ticket.THEATER,
			AREA: state.R_ticket.AREA,
			DAY: state.R_ticket.DAY
		}),
		shallowEqual
	);

	// 극장 조회 useEffect
  useEffect(() => {
		dispatch({
			type: TICKET_THEATER_LIST_REQUEST,
			data: {
				miday: DAY.miday,
				mid: MOVIE.mid
			}
		});
  }, [DAY, MOVIE, dispatch]);

	// 극장 관리 useState
	const [theater, setTheater] = useState({
		seoul: 0,
		gyeonggi: 0,
		incheon: 0,
		busan: 0
  });
	const { seoul, gyeonggi, incheon, busan } = theater;

	// 지역별 극장 개수 설정하는 useEffect
	useEffect(()=> {
		var temp_seoul = 0;
		var temp_gyeonggi = 0;
		var temp_incheon = 0;
		var temp_busan = 0;
	
		for (var i = 0; i < THEATER_LIST.length; i++) {
			if (THEATER_LIST[i].tarea === "서울" && THEATER_LIST[i].reserve) { temp_seoul++; }
			else if(THEATER_LIST[i].tarea === "경기" && THEATER_LIST[i].reserve) { temp_gyeonggi++; }
			else if(THEATER_LIST[i].tarea === "인천" && THEATER_LIST[i].reserve) { temp_incheon++; }
			else if(THEATER_LIST[i].tarea === "부산" && THEATER_LIST[i].reserve) { temp_busan++; }
		}

		setTheater(t=> ({
			...t,
			seoul: temp_seoul,
			gyeonggi: temp_gyeonggi,
			incheon: temp_incheon,
			busan: temp_busan
		}));
	}, [THEATER_LIST]);

	// 지역을 선택하는 함수
	const onClickArea = useCallback((area) => {
		dispatch({
			type: TICKET_AREA_SELECT,
			data: area
		});
	}, [dispatch]);

	// 극장을 선택하는 함수
  const onClickTheater = useCallback((theater) => {
		// 상영스케줄이 존재할 경우
		if (theater.reserve) {
			dispatch({
				type: TICKET_THEATER_SELECT,
				data: theater
			});
		}
		// 상영스케줄이 없을경우
		else {
			if (!window.confirm("선택한 극장에 원하시는 상영스케줄이 없습니다.\n계속하겠습니까? (선택한 영화 및 날짜가 해제됩니다.)")) {
				return;
			}
			else {
				dispatch({
					type: TICKET_THEATER_RESET,
					data: theater
				});
			}
		}
  }, [dispatch]);

  return (
    <TheaterWrapper>
      <TheaterTitle>
        <p>
					극장
				</p>
      </TheaterTitle>
      <TheaterSelector>
        <TheaterSelectorText>
					전체
				</TheaterSelectorText>
      </TheaterSelector>
      <TheaterListWrapper>
				<TheaterAreaList>
					<TheaterArea onClick={()=> onClickArea('seoul')} tab={AREA === 'seoul'} >
						서울 ({seoul})
					</TheaterArea>
					<TheaterArea onClick={()=> onClickArea('gyeonggi')} tab={AREA === 'gyeonggi'}>
						경기 ({gyeonggi})
					</TheaterArea>
					<TheaterArea onClick={()=> onClickArea('incheon')} tab={AREA === 'incheon'}>
						인천 ({incheon})
					</TheaterArea>
					<TheaterArea onClick={()=> onClickArea('busan')} tab={AREA === 'busan'}>
						부산 ({busan})
					</TheaterArea>
				</TheaterAreaList>
				<TheaterNameList>
					<ul>
						{AREA === 'seoul' ? THEATER_LIST.map((theater)=> 
						theater.tarea === '서울' ? <TheaterLi className={theater.reserve ? "" : "disable"} key={theater.tid} onClick={()=> onClickTheater(theater)} select_theater={THEATER.tid} theater={theater.tid}> 
						{theater.tname} </TheaterLi> : null) : null}

						{AREA === 'gyeonggi' ? THEATER_LIST.map((theater)=> 
						theater.tarea === '경기' ? <TheaterLi className={theater.reserve ? "" : "disable"} key={theater.tid} onClick={()=> onClickTheater(theater)} select_theater={THEATER.tid} theater={theater.tid}> 
						{theater.tname} </TheaterLi> : null) : null}

						{AREA === 'incheon' ? THEATER_LIST.map((theater)=> 
						theater.tarea === '인천' ? <TheaterLi className={theater.reserve ? "" : "disable"} key={theater.tid} onClick={()=> onClickTheater(theater)} select_theater={THEATER.tid} theater={theater.tid}> 
						{theater.tname} </TheaterLi> : null) : null}

						{AREA === 'busan' ? THEATER_LIST.map((theater)=> 
						theater.tarea === '부산' ? <TheaterLi className={theater.reserve ? "" : "disable"} key={theater.tid} onClick={()=> onClickTheater(theater)} select_theater={THEATER.tid} theater={theater.tid}> 
						{theater.tname} </TheaterLi> : null) : null}
					</ul>
				</TheaterNameList>
      </TheaterListWrapper>
    </TheaterWrapper>
  );
};

const TheaterWrapper = styled.div`
  width: 280px;
  position: relative;
  float: left;
  height: 536px;
  margin-left: 1px;
  background-color: #f2f0e5;
  overflow: hidden;
`;

const TheaterTitle = styled.div`
  color: #222;
  position: relative;
  height: 33px;
  line-height: 33px;
  text-align: center;
  font-size: 20px;
  padding: 15px 0 15px 8px;
  font-weight: bold;
  top: -12px;

  p {
		margin-top: 14px;
    display: block;
    position: relative;
  }
`;

const TheaterSelector = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const TheaterSelectorText = styled.div`
  border: 1px solid #d8d9db;
  border-bottom: none;
  height: 35px;
  margin-left: 20px;
	margin-right: 20px;
  font-size: 16px;
  text-align: center;
  padding-top: 5px;
`;

const TheaterListWrapper = styled.div`
  display: flex;
	position: relative;
  float: left;
  width: 100%;
  height: 403px;
	padding-bottom: 10px;
`;

const TheaterAreaList = styled.ul`
	padding-left: 20px;
	padding-top: 10px;
  position: relative;
  float: left;
  width: 100%;
  height: 350px;
  margin-top: 5px;
`;

const TheaterArea = styled.li`
	padding-left: 5px;
  clear: both;
  overflow: hidden;
  float: left;
  width: 104px;
  cursor: pointer;
  height: 31px;
  font-size: 14px;
  line-height: 31px;
  margin-bottom: 1px;
  background-color: ${(props) => props.tab === true ? "gainsboro" : "#f2f0e5"};
`;

const TheaterNameList = styled.div`
  position: absolute;
  font-size: 14px;
  line-height: 31px;
	margin-top: 5px;
	padding-top: 10px;
	padding-right: 8px;
  left: 92px;
  cursor: pointer;
  width: 168px;
  height: 100%;
  font-weight: bold;
	overflow-x: scroll;
  overflow-x: hidden;
  flex-direction: column;

	ul {
		list-style-type: none;
		margin: 0;

		.disable {
    	cursor: default;
    	opacity: 0.5;
  	}
	}
`;

const TheaterLi = styled.li`
	padding-left: 6px;
	margin-bottom: 1px;
	width: 118px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
  background-color: ${(props) => props.select_theater === props.theater  ? "#333333" : "#f2f0e5"};
  color: ${(props) => props.select_theater === props.theater ? "white" : "black"};
`;

export default TicketTheaterList;
