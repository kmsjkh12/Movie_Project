/*
	사용자가 선택한 영화 및 정보를 표시해주는 컴포넌트 2023-02-13 수정완(강경목)
	23-04-29 예매 페이지 상태 컴포넌트 수정(오병주)
*/
import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { useSelector, useDispatch,shallowEqual } from "react-redux";
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import { SEAT_PAGE_RESET } from "../../reducer/R_seat";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";

const TicketState = ({ seatPage, setSeatPage }) => {
	const dispatch = useDispatch();
  const navigate = useNavigate();

	// 필요한 리덕스 상태들
	const { MOVIE, THEATER, AREA, DAY, MOVIEINFO, RESERVE_SORT, LIKE_SORT, LOGIN_data, Kid, Teenager, Adult, Price, ChoiceSeat } = useSelector(
		state => ({
			MOVIE: state.R_ticket.MOVIE,
			THEATER: state.R_ticket.THEATER,
			AREA: state.R_ticket.AREA,
			DAY: state.R_ticket.DAY,
			MOVIEINFO: state.R_ticket.MOVIEINFO,
			RESERVE_SORT: state.R_ticket.RESERVE_SORT,
			LIKE_SORT: state.R_ticket.LIKE_SORT,
			LOGIN_data: state.R_user_login.LOGIN_data,
			Kid: state.R_seat.Kid,
			Teenager: state.R_seat.Teenager,
			Adult: state.R_seat.Adult,
			Price: state.R_seat.Price,
			ChoiceSeat: state.R_seat.ChoiceSeat
		}),
		shallowEqual
	);

	// 좌석선택 버튼 누를경우 실행되는 함수
	const goSeat = useCallback(()=> {
		// 상영정보를 선택 안했을경우
		if (MOVIEINFO === '') {
			alert('상영시간을 선택해주세요.');
			return;
		}

		// 현재 시간에서 30분을 더한 값과 영화 시작시간 값
		var now = new Date();
		now.setMinutes(now.getMinutes() + 30);
		const starttime = new Date(MOVIEINFO.mistarttime);

		// 현재 시간에 30분을 더한값이 영화 시작시간보다 클경우 예매를 막는 if문
		if (now > starttime) {
			alert("영화 시작 30분전까지 예매가 가능합니다.");
			return;
		}

		// 남은 좌석이 없을경우
		if (MOVIEINFO.cntSeatAll - MOVIEINFO.cntSeatInfo === 0) {
			alert('남은 좌석이 없습니다.');
			return;
		}

		// 로그인 여부에 따라 페이지 이동
		if (LOGIN_data.uid === "No_login") {
				// alert 취소
				if (!window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
					return;
				}
				// alert 확인(현재 정보를 전달해줌)
				else {
					navigate(`/UserLogin`, {
						state: {
							url: '/Reserve',
							MOVIE: MOVIE,
							THEATER: THEATER,
							AREA: AREA,
							DAY: DAY,
							MOVIEINFO: MOVIEINFO,
							RESERVE_SORT: RESERVE_SORT,
							LIKE_SORT: LIKE_SORT
						},
					});
				}
			} 
		else {
			setSeatPage(true);
		}
	}, [AREA, DAY, LOGIN_data.uid, MOVIE, MOVIEINFO, THEATER, RESERVE_SORT, LIKE_SORT, navigate, setSeatPage]);

  // 영화 선택으로 넘어갈때 실행되는 함수
	const backMovie = useCallback(() => {
		if (!window.confirm('영화 선택화면으로 가시겠습니까? \n(선택한 좌석정보는 초기화 됩니다.)')) {
			return;
		}
		setSeatPage(false);
		dispatch({
			type: SEAT_PAGE_RESET
		})
	}, [setSeatPage, dispatch]);

	// 결제 모달 useState
  const [isOpen, setIsOpen] = useState(false);
  const openModalHandler = () => {
    setIsOpen(!isOpen);
  };

	// 결제하기 버튼 누를때 실행되는 함수
	const goPayment = useCallback(()=> {
		if (Kid + Teenager + Adult > ChoiceSeat.length ) {
			alert("관람인원과 선택 좌석수가 동일하지 않습니다.");
			return;
		} 
		else if( Kid + Teenager + Adult === 0){
			alert('인원 및 좌석을 선택해주세요')
		}
		else {
			setIsOpen(!isOpen);
		}
	}, [Kid, Teenager, Adult, ChoiceSeat, isOpen]);

  return (
    <TicketWrapper>
      <TicketStep>
				<BackButton>
					{seatPage && <MovieChoice onClick={backMovie}>
						<LeftCircleFilled style={{ fontSize: "60px", top: "10px", left: "23px", position: "absolute"}}/>
						<p>
							영화선택
						</p>
					</MovieChoice>}
				</BackButton>
				<MoviePoster>
					<Poster>
						{MOVIE &&
						<Img
							className="imggg"
							src={`${MOVIE.mimagepath}`}
							alt="영화"
						/>}
					</Poster>
					<Title>
						{MOVIE &&
						<span>
							{MOVIE.mtitle}
						</span>}
					</Title>
					<Title>
						{MOVIE && MOVIE.mrating === '0' ? '전체 이용가' : MOVIE && MOVIE.mrating === '18' ? '청소년 관람불가' : MOVIE && MOVIE.mrating + '세 이용가'}
					</Title>
				</MoviePoster>
        <MovieTheater>
					<Name>
						<span>
							극장
						</span>
						{THEATER &&
						<span className="value">
							{THEATER.tarea}-{THEATER.tname}점
						</span>}
					</Name>
          <Time>
            <span>
							일시
						</span>
						{DAY &&
            <span className="value">
							{DAY.miday}
						</span>}
          </Time>
					<Screen>
						<span>
							상영관
						</span>
						{MOVIEINFO &&
						<span className="value">
							{MOVIEINFO.cname}({MOVIEINFO.ctype})
						</span>}
					</Screen>
        </MovieTheater>
        <SeatMore>
          <Seat>
            좌석 :&nbsp;
            {ChoiceSeat.map((seat, index) =>
              <span key={index}>
								&nbsp;{seat.location}{index === ChoiceSeat.length - 1 ? null : ','}
							</span>
            )}
          </Seat>
          <PriceTag>
						총금액 :&nbsp; {Price === 0 ? '' : Price + '원'}
					</PriceTag>
        </SeatMore>
				<GoButton>
					{seatPage ?
					<>
						<MovieSeat onClick={goPayment}>
							<RightCircleFilled style={{ fontSize: "60px", top: "10px", left: "23px", position: "absolute"}}/>
							<p>
								결제하기
							</p>
						</MovieSeat>
						{isOpen && <PaymentModal closeModal={openModalHandler}/>}
					</> : 
					<MovieSeat onClick={goSeat}>
						<RightCircleFilled style={{ fontSize: "60px", top: "10px", left: "23px", position: "absolute"}}/>
						<p>
							좌석선택
						</p>
					</MovieSeat>}
				</GoButton>
			</TicketStep>
    </TicketWrapper>
  );
};

const TicketWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 128px;
  background-color: #1d1d1c;
  color: white;
`;

const TicketStep = styled.div`
  margin: 0 auto;
  width: 1025px;
	padding-left: 5px;
  height: 108px;
  padding-top: 10px;
  position: relative;
`;

const BackButton = styled.div`
	width: 149px;
  float: left;
  height: 108px;
  padding-left: 20px;
  position: relative;
  font-weight: bold;
	border-right: 1px solid grey;
`;

const MovieChoice = styled.div`
  overflow: hidden;
  position: absolute;
  left: 23px;
  width: 106px;
  height: 108px;
  cursor: pointer;

  p {
    position: absolute;
    bottom: -10px;
    left: 23px;
    font-weight: bold;
  }
`;

const MoviePoster = styled.div`
  width: 209px;
  float: left;
  height: 108px;
  padding-left: 20px;
  position: relative;
  color: #cccccc;
  font-size: 12.5px;
  font-weight: bold;
  border-right: 1px solid grey;
`;

const Poster = styled.span`
  float: left;
  width: 74px;
  height: 108px;
  line-height: 108px;
  margin-right: 11px;
  overflow: hidden;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  display: inline;
`;

const Title = styled.div`
  margin-top: 14px;
  color: white;
`;

const MovieTheater = styled.div`
  width: 169px;
  float: left;
  height: 108px;
  padding-left: 20px;
  border-right: 1px solid grey;
  font-weight: bold;
  position: relative;
  color: #cccccc;
  font-size: 12.5px;

	.value {
		margin-left: 10px;
	}
`;

const Name = styled.div`
  display: block;
  margin-top: 14px;
  height: 10px;
  line-height: 20px;
`;

const Time = styled.div`
  display: block;
  margin-top: 14px;
  height: 10px;
  line-height: 20px;
`;

const Screen = styled.div`
  display: block;
  margin-top: 14px;
  height: 10px;
  line-height: 20px;
`;

const SeatMore = styled.div`
  width: 244px;
	padding-left: 20px;
  float: left;
  height: 108px;
  border-right: 1px solid grey;
  font-weight: bold;
  position: relative;
  color: #cccccc;
  font-size: 12.5px;
`;

const Seat = styled.div`
  display: block;
  margin-top: 14px;
  height: 10px;
  line-height: 20px;
`;

const PriceTag = styled.div`
  display: block;
  margin-top: 14px;
  height: 10px;
  line-height: 20px;
`;

const GoButton = styled.div`
	width: 150px;
  float: left;
  height: 108px;
  padding-left: 20px;
  position: relative;
  font-weight: bold;
`;

const MovieSeat = styled.div`
  overflow: hidden;
  position: absolute;
  width: 106px;
	left: 40px;
  height: 108px;
  cursor: pointer;

  p {
    position: absolute;
    bottom: -10px;
    left: 23px;
    font-weight: bold;
  }
`;

export default TicketState;
