/*
  23-04-30 ~ 23-05-01 예매 좌석 페이지 수정(오병주)
*/
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useSelector, useDispatch ,shallowEqual } from "react-redux";
import { SEAT_CHOICE, SEAT_REMOVE } from "../../reducer/R_seat";

const SeatButton = ({ seat }) => {
	const dispatch = useDispatch();

	// 필요한 리덕스 상태들
	const { Kid, Teenager, Adult, Total, ChoiceSeat, SEAT_CHECK_error, PAYMENT } = useSelector(
		state => ({
			Kid: state.R_seat.Kid,
			Teenager: state.R_seat.Teenager,
			Adult: state.R_seat.Adult,
			Total: state.R_seat.Total,
			ChoiceSeat: state.R_seat.ChoiceSeat,
			SEAT_CHECK_error: state.R_seat.SEAT_CHECK_error,
			PAYMENT: state.R_ticket.PAYMENT
		}),
		shallowEqual
	);

	// 버튼에 대한 useState
  const [isChecked, setIschecked] = useState(true);

	// 점유좌석에 대한 오류가 생겼을경우 초기화 해주는 useEffect
	useEffect(() => {
		if (SEAT_CHECK_error || PAYMENT.status === 406) {
			setIschecked(true);
		}
	}, [SEAT_CHECK_error, PAYMENT.status]);

	// 좌석 추가하는 함수
	const addSeats = useCallback((seat) => {
		if (Total > ChoiceSeat.length) {
			dispatch({
				type: SEAT_CHOICE,
				data: {
					seat_id: seat.sid,
					location: seat.sname,
				},
			});
		}
	}, [ChoiceSeat, Total, dispatch]);

	// 좌석 제거하는 함수
	const removeSeats = useCallback((seat) => {
		dispatch({
			type: SEAT_REMOVE,
			data: seat,
		});
	}, [dispatch]);

	// 좌석 선택할때 실행되는 함수
  const checkedSeat = useCallback(() => {
    if (Kid + Teenager + Adult > ChoiceSeat.length && isChecked) {
      setIschecked((prev) => !prev);
    } 
		else if (!isChecked) {
      setIschecked((prev) => !prev);
    }
  }, [Kid, Teenager, Adult, ChoiceSeat, isChecked]);

  return (
    <>
      <SeatNumber
        reserve={seat.reserve}
        isChecked={isChecked}
        sid={seat.sid}
        onClick={() => {
          checkedSeat();
          isChecked && !seat.reserve
            ? addSeats(seat)
            : removeSeats(seat.sid);
        }}
      >
        {seat.sname}
      </SeatNumber>
    </>
  );
};

const SeatNumber = styled.button`
  width: 45px;
  height: 30px;
  margin-bottom: 18px;
	margin-right: 1px;
  color: black;
  float: left;
	border: none;
  background-color: ${(props) => props.reserve  ? "grey" : props.isChecked ? "lightblue" : "white"};
  cursor: ${(props) => (props.reserve ? "default" : "pointer")};
`;

export default SeatButton;
