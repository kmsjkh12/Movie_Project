/*eslint-disable*/
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TicketMovieList from "../components/Ticket/TicketMovieList";
import TicketTheaterList from "../components/Ticket/TicketTheaterList";
import TicketDayList from "../components/Ticket/TicketDayList";
import TicketSchedule from "../components/Ticket/TicketSchedule";
import TicketState from "../components/Ticket/TicketState";
import TopButton from "../components/Ticket/TopButton";
import Seat from "../components/Ticket/Seat";
import PaymentComplete from "../components/Ticket/PaymentComplete";
import { TICKET_PAGE_RESET } from "../reducer/R_ticket";
import { SEAT_PAGE_RESET } from "../reducer/R_seat";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";

const Reserve = () => {
  const dispatch = useDispatch();
	const location = useLocation();

	// 필요한 리덕스 상태들
	const { TICKET_KEY, MOVIE, MOVIEINFO, PAYMENT_done } = useSelector(
		state => ({
			TICKET_KEY: state.R_ticket.TICKET_KEY,
			MOVIE: state.R_ticket.MOVIE,
			MOVIEINFO:  state.R_ticket.MOVIEINFO,
			PAYMENT_done: state.R_ticket.PAYMENT_done
		}),
		shallowEqual
	);

	// 예매 페이지 초기값 설정이 필요한 경우 useEffect
	useEffect(()=> {
		if (location.key !== TICKET_KEY  && MOVIEINFO !== '' && !location.state) {
			dispatch({
				type: TICKET_PAGE_RESET,
				data: location.key
			});
			return;
		}

		if (MOVIE !== '') {
			window.scrollTo({
				top: 100,
				behavior: "smooth"});
		}
	}, []);

  // 예매 페이지 탈출 시 리덕스 초기화를 위한 useEffect
  useEffect(() => {
    return () => {
      dispatch({
				type: TICKET_PAGE_RESET,
				data: location.key
			});

			dispatch({
				type: SEAT_PAGE_RESET
			});
    };
  }, []);

  // 좌석 컴포넌트로 바꾸는 useState
  const [seatPage, setSeatPage] = useState(false);

  return (
    <Container>
      <TopButton/>
      {PAYMENT_done ? <PaymentComplete /> : seatPage ? <Seat/> : 
        <BookinWrapper>
          <TicketMovieList />
          <TicketTheaterList/>
          <TicketDayList />
          <TicketSchedule />
        </BookinWrapper> 
      }
      {PAYMENT_done ? null : <TicketState seatPage={seatPage} setSeatPage={setSeatPage}/>}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  background: #fff;
`;

const BookinWrapper = styled.div`
  display: flex;
	padding: 0;
  width: 1050px;
  margin : 0 auto;
  box-sizing: border-box; 
	padding-left: 5px;
`;

export default Reserve;
