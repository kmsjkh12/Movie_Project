/*
	23-04-28 예매 페이지 날짜 컴포넌트 수정(오병주)
*/
import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import { TICKET_DAY_LIST_REQUEST, TICKET_DAY_SELECT, TICKET_DAY_RESET } from "../../reducer/R_ticket";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

// 날짜를 위한 변수
const weekday = ["일", "월", "화", "수", "목", "금", "토"];

const TicketDayList = () => {
	const dispatch = useDispatch();

	// 필요한 리덕스 상태들
	const { DAY_LIST, MOVIE, THEATER, DAY } = useSelector(
		state => ({
			DAY_LIST: state.R_ticket.DAY_LIST,
			MOVIE: state.R_ticket.MOVIE,
			THEATER: state.R_ticket.THEATER,
			DAY: state.R_ticket.DAY
		}),
		shallowEqual
	);

	// 날짜 조회 useEffect
  useEffect(() => {
		dispatch({
			type: TICKET_DAY_LIST_REQUEST,
			data: {
				tid: THEATER.tid,
				mid: MOVIE.mid
			}
		});
  }, [THEATER, MOVIE, dispatch]);


  // 날짜를 선택하는 함수
  const onClickDay = useCallback((day) => {
		// 상영스케줄이 존재할 경우
		if (day.reserve) {
			dispatch({
				type: TICKET_DAY_SELECT,
				data: day
			});
		}
		// 상영스케줄이 없을경우
		else {
			if (!window.confirm("선택한 날짜에 원하시는 상영스케줄이 없습니다.\n계속하겠습니까? (선택한 영화 및 극장이 해제됩니다.)")) {
				return;
			}
			else {
				dispatch({
					type: TICKET_DAY_RESET,
					data: day
				});
			}
		}
  }, [dispatch]);

  return (
    <Calender>
      <Header>
				<p>
					날짜
				</p>
			</Header>
			<DayList>
			{DAY_LIST.map((list, index) => 
				<div key={index}>
					<YearMonthList>    
						<Year>
							{list.yearMonth.substring(0, 4)}
						</Year>
						<Month>
							{list.yearMonth.substring(5, 7)}
						</Month>
					</YearMonthList>
					<DaylistSector>
						{list.movieInfos.map((day) => 
							<Day key={day.miday} onClick={()=> onClickDay(day)} className={day.reserve ? "" : "disable"}  select_day={DAY.miday} day={day.miday} >
								<Week className={weekday[new Date(day.miday).getDay()] === "토" ? "Sat" : weekday[new Date(day.miday).getDay()] === "일" ? "Sun" : "week"}>
									{weekday[new Date(day.miday).getDay()]}
								</Week>
								<div className="day">
									{day.miday.substring(8, 10)}
								</div>
							</Day>
						)}
					</DaylistSector>
				</div>
			)}
			</DayList>
    </Calender>
  );
};

const Calender = styled.div`
  display: flex;
  flex-direction: column;
  height: 536px;
  width: 108px;
  border-left: 1px solid #d8d9db;
  background-color: #f2f0e5;
	margin-left: 1px;
`;

const Header = styled.div`
  color: #222;
  position: relative;
  height: 33px;
  line-height: 33px;
  text-align: center;
  font-size: 20px;
  padding: 15px 8px 0px 0px;
  font-weight: bold;
  top: -12px;

	p {
		margin-top: 14px;
    display: block;
    position: relative;
  }
`;

const DayList = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  color: #005096;
  float: left;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: auto;
	margin-top: 10px;
`;

const YearMonthList = styled.div`
	font-weight: 500;
  color: #1864ab;
	padding-left: 5px;
`;

const Year = styled.div`
  font-size: 15px;
`;

const Month = styled.div`
  font-size: 30px;
	line-height: 30px;
	margin-bottom: 10px;
`;

const DaylistSector = styled.ul`
  position: relative;
  padding: 0;
	margin: 0;
  cursor: pointer;
  list-style-type: none;
	overflow-x: scroll;
  overflow-x: hidden;

  .Sun {
    color: red !important;
		font-size: 0.8em;
    align-items: center; 
    justify-content: center;
    color: black;
    text-align: center;
  }

  .Sat {
    color: blue !important;
		font-size: 0.8em;
    align-items: center; 
    justify-content: center;
    color: black;
    text-align: center;
  }

  .week {
    font-size: 0.8em;
    align-items: center; 
    justify-content: center;
    color: black;
    text-align: center;
  }

  .day {
    font-weight: bold;
		margin-left: 3px;
  }

  .disable {
    div {
      cursor: default;
      opacity: 0.5;
    }
  }
`;

const Day = styled.li`
	padding-left: 5px;
  padding-bottom: 10px;
  width: 86px;
  display: flex;
  float: left;
  background-color: ${(props) => props.select_day === props.day ? "gainsboro" : "#f2f0e5"};
`;

const Week = styled.div`
  padding-left: 20px;
  padding-right: 5px;
  position: relative;
  top: 3px;
`;

export default TicketDayList;
