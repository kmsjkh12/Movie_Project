/*
	영화 스케쥴을 표시해주는 컴포넌트 2023-02-13 수정완(강경목)
	23-04-29 예매 페이지 스케줄 컴포넌트 수정(오병주)
*/
import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import styled from "styled-components";
import { TICKET_MOVIEINFO_LIST_REQUEST, TICKET_MOVIEINFO_SELECT } from "../../reducer/R_ticket";

const TicketSchedule = () => {
  const dispatch = useDispatch();

	// 필요한 리덕스 상태들
	const { MOVIE, THEATER, DAY, MOVIEINFO, MOVIEINFO_LIST, LOGIN_data } = useSelector(
		state => ({
			MOVIE: state.R_ticket.MOVIE,
			THEATER: state.R_ticket.THEATER,
			DAY: state.R_ticket.DAY,
			MOVIEINFO: state.R_ticket.MOVIEINFO,
			MOVIEINFO_LIST: state.R_ticket.MOVIEINFO_LIST,
			LOGIN_data: state.R_user_login.LOGIN_data
		}),
		shallowEqual
	);

	// 상영정보 조회 useEffect
  useEffect(() => {
		// 영화, 극장, 날짜를 선택했을경우 조회
		if (MOVIE !== "" && THEATER !== "" && DAY !== "") { 
			dispatch({
				type: TICKET_MOVIEINFO_LIST_REQUEST,
				data: {
					miday: DAY.miday,
					mid: MOVIE.mid,
					tid: THEATER.tid,
					uid: LOGIN_data.uid
				}
			});
		}
  }, [MOVIE, DAY, THEATER, LOGIN_data, dispatch]);

	// 상영정보를 선택하는 함수
  const onClickMovieInfo = useCallback((movieInfo) => {
		// 남은 좌석이 존재하지 않을경우
		if (movieInfo.cntSeatAll - movieInfo.cntSeatInfo === 0) {
			alert('남은 좌석이 없습니다.');
		}
		else {
			dispatch({
				type: TICKET_MOVIEINFO_SELECT,
				data: movieInfo,
			});
		}
  }, [dispatch]);

  return (
		<Schedule>
      <ScheduleTitle>
        <p>
					시간
				</p>
      </ScheduleTitle>
      <ScheduleList>
        <Result>
          <TimeList>
					{MOVIE && THEATER && DAY && MOVIEINFO_LIST.map((movieInfo) => 
						<Time key={movieInfo.miid} select_schedule={MOVIEINFO.miid} schedule={movieInfo.miid}>
              <Button onClick={() => onClickMovieInfo(movieInfo)}>
								<WhiteSpace/>
								<InfoTimes>
									<StartTime>
										{movieInfo.mistarttime.substring(11, 16)}
									</StartTime>
									<EndTime>
										{movieInfo.miendtime.substring(11, 16)}
									</EndTime>
								</InfoTimes>
								<Title>
									<Name>
										{MOVIE.mtitle}
										<Genre>{MOVIE.mgenre}</Genre>
									</Name>
								</Title>
								<Info>
									<Theater>
										{THEATER.tarea} {THEATER.tname}점
										<br />
										{movieInfo.ctype} {movieInfo.cname}
									</Theater>
									<Seat>
										<Now>
											{movieInfo.cntSeatAll - movieInfo.cntSeatInfo} /
										</Now>
										<All>
											{movieInfo.cntSeatAll}
										</All>
									</Seat>
								</Info>
              </Button>
            </Time>
          )}
          </TimeList>
        </Result>
      </ScheduleList>
    </Schedule>
  );
};

const Schedule = styled.div`
  display: flex;
  flex-direction: column;
  width: 362px;
  border-right: 1px solid #d8d9db;
	border-left: 1px solid #d8d9db;
	margin-left: 1px;
  background-color: #f2f0e5;
`;

const ScheduleTitle = styled.div`
  color: #222;
  position: relative;
  height: 33px;
  line-height: 33px;
  text-align: center;
  font-size: 20px;
  padding: 15px 0 15px 10px;
  font-weight: bold;
  top: -12px;

  p {
		margin-top: 14px;
    display: block;
    position: relative;
    left: -3px;
  }
`;

const ScheduleList = styled.div`
  overflow: hidden;
  margin-top: 5px;
  height: 462px;
`;

const Result = styled.div`
  height: 100%;
  padding: 0;
  text-align: center;
  position: relative;
  top: 0px;
  left: 0px;
`;

const TimeList = styled.ul`
  height: 100%;
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
`;

const Time = styled.li`
  background-color: ${(props) => props.select_schedule === props.schedule ? "gainsboro" : "#f2f0e5"};
`;

const Button = styled.button`
  overflow: hidden;
  display: table;
  table-layout: fixed;
  width: 100%;
  padding: 0;
  margin: 0;
  padding: 0;
  border: 0;
  letter-spacing: -1px;
  background-color: transparent;
  cursor: pointer;
  letter-spacing: -0.5px;
  font-weight: 400;
`;

const WhiteSpace= styled.div`
  display: table-cell;
  width: 25px;
  height: 66px;
  padding: 10px 0 0 0;
  vertical-align: top;
`;

const InfoTimes = styled.span`
  display: table-cell;
  width: 60px;
  padding: 10px 0;
  text-align: left;
  vertical-align: top;
  font-weight: 300;
`;

const StartTime = styled.strong`
  display: block;
  font-size: 1.25em;
  font-weight: 700;
`;

const EndTime = styled.em`
  display: block;
  padding: 3px 0 0 0;
  font-size: 0.9em;
  font-weight: 300;
  font-style: normal;
`;

const Title = styled.span`
  display: table-cell;
  width: 275px;
  padding: 10px 0;
	padding-left: 5px;
  text-align: left;
`;

const Name = styled.strong`
  display: block;
  padding: 0 5px 0 0;
  line-height: 1.4;
  font-weight: 700;
	font-size: 14px;
`;

const Genre = styled.strong`
  display: block;
  padding-top: 3px;
  font-size: 0.85em;
`;

const Info = styled.div`
  display: table-cell;
  width: 110px;
  padding: 0 10px 0 0;
  font-size: 0.85em;
  vertical-align: middle;
  text-align: right;
`;

const Theater = styled.span`
  overflow: hidden;
  display: block;
  padding: 0;
  line-height: 1.7;
`;

const Seat = styled.span`
  overflow: hidden;
  display: inline-block;
  width: 62px;
  height: 20px;
  padding: 0;
  text-align: center;
`;

const Now = styled.strong`
  display: inline-block;
  color: #01738b;
  line-height: 20px;
  vertical-align: middle;
  font-weight: 700;
  padding-left: 30px;
  padding-right: 3px;
`;

const All = styled.span`
  display: inline-block;
  color: #666;
  line-height: 20px;
  vertical-align: middle;
`;

export default TicketSchedule;
