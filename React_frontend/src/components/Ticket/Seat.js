/*
  23-04-30 ~ 23-05-01 예매 좌석 페이지 수정(오병주)
*/
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { SEAT_LIST_REQUEST, USER_CHOICE, USER_REMOVE } from "../../reducer/R_seat";
import SeatButton from "./SeatButton";
const ButtonGroup = Button.Group;

const Seat = () => {
	const dispatch = useDispatch();

	// 필요한 리덕스 상태들
	const { MOVIE, MOVIEINFO, SEAT_LIST, LOGIN_data, Kid, Teenager, Adult, Total, ChoiceSeat, SEAT_CHECK_error, PAYMENT } = useSelector(
		state => ({
			MOVIE: state.R_ticket.MOVIE,
			MOVIEINFO: state.R_ticket.MOVIEINFO,
			SEAT_LIST: state.R_seat.SEAT_LIST,
			LOGIN_data: state.R_user_login.LOGIN_data,
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

	// 좌석 조회 useEffect
	useEffect(() => {
    if (LOGIN_data.uname !== '' && MOVIEINFO !== '') {
			// 스크롤 위치조정
			window.scrollTo({
				top: 100,
				behavior: "smooth"});

      dispatch ({
        type: SEAT_LIST_REQUEST,
        data: { 
					cid: MOVIEINFO.cid, 
					miid: MOVIEINFO.miid 
				},
      });
    }
  }, [LOGIN_data, MOVIEINFO, dispatch]);

	// 점유좌석에 대한 오류가 생겼을경우 초기화 해주는 useEffect
	useEffect(() => {
		if (SEAT_CHECK_error || PAYMENT.status === 406) {
			setNumKid(0);
			setNumTeenager(0);
			setNumAdult(0);
		}
	}, [SEAT_CHECK_error, PAYMENT.status, dispatch]);

	// 버튼 useState
	const [numKid, setNumKid] = useState(0); // 아이
	const [numTeenager, setNumTeenager] = useState(0); // 학생
  const [numAdult, setNumAdult] = useState(0); // 성인

	// 아이 인원 늘릴때
  const plusHandlerKid = useCallback(() => {
    if (Total < 8) {
      setNumKid((prev) => prev + 1);
      dispatch({
        type: USER_CHOICE,
        data: {
					type: "아이",
					price: 100
				}
      });
    }
		else {
			alert('1회 최대 8명까지 예약가능합니다.');
		}
  }, [Total, dispatch]);

  // 아이 인원 줄일때
  const minusHandlerKid = useCallback(() => {
		if (Total <= ChoiceSeat.length) {
      alert("선택한 좌석이 예매 인원 보다 많습니다.");
    } 
    else if (numKid) {
      setNumKid((prev) => prev - 1);
      dispatch({
        type: USER_REMOVE,
        data: {
					type: "아이",
					price: 100
				}
      });
    }
  }, [Total, ChoiceSeat, numKid, dispatch]);
  
	// 학생 인원 늘릴때
  const plusHandlerTeenager = useCallback(() => {
    if (Total < 8) {
      setNumTeenager((prev) => prev + 1);
      dispatch({
        type: USER_CHOICE,
				data: {
					type: "학생",
					price: 150
				}
      });
    }
		else {
			alert('1회 최대 8명까지 예약가능합니다.');
		}
  }, [Total, dispatch]);

	// 학생 인원 줄일때
	const minusHandlerTeenager = useCallback(() => {
    if (Total <= ChoiceSeat.length) {
      alert("선택한 좌석이 예매 인원 보다 많습니다.");
    } 
    else if (numTeenager) {
      setNumTeenager((prev) => prev - 1);
      dispatch({
        type: USER_REMOVE,
        data: {
					type: "학생",
					price: 150
				}
      });
    }
  }, [Total, ChoiceSeat, numTeenager, dispatch]);

	// 성인 인원 늘릴때
  const plusHandlerAdult = useCallback(() => {
    if (Total < 8) {
      setNumAdult((prev) => prev + 1);
      dispatch({
        type: USER_CHOICE,
				data: {
					type: "성인",
					price: 200
				}
      });
    }
		else {
			alert('1회 최대 8명까지 예약가능합니다.');
		}
  }, [Total, dispatch]);

	// 성인 인원 줄일때
	const minusHandlerAdult = useCallback(() => {
    if (Total <= ChoiceSeat.length) {
      alert("선택한 좌석이 예매 인원 보다 많습니다.");
    } 
    else if (numAdult) {
      setNumAdult((prev) => prev - 1);
      dispatch({
        type: USER_REMOVE,
				data: {
					type: "성인",
					price: 200
				}
      });
    }
  }, [Total, numAdult, ChoiceSeat, dispatch]);
	
  return (
    <SeatWrapper>
      <SeatContent>
        <Title>
          인원 / 좌석
        </Title>
        <PersonScreen>
          <NumberOfPeople>
            <NumberContainer>
              <People>
                <span>
									아이
								</span>
                <ButtonGroup style={{ marginLeft: "10px" }}>
                  <Button onClick={minusHandlerKid} disabled={Kid === 0? true : false} icon={<MinusOutlined />} style={{ width: "32px", height: "32px" }}/>
                  <Button value={numKid} style={{ width: "52px", paddingLeft: "18px" }}>
                    {numKid}
                  </Button>
                  <Button disabled={MOVIE.mrating !== '0'} onClick={plusHandlerKid} icon={<PlusOutlined />} style={{ width: "32px", height: "32px" }}/>
                </ButtonGroup>
              </People>
              <People>
                <span>
									학생
								</span>
                <ButtonGroup style={{ marginLeft: "10px" }}>
                  <Button onClick={minusHandlerTeenager} disabled={Teenager === 0? true : false} icon={<MinusOutlined />} style={{ width: "32px", height: "32px" }}/>
                  <Button value={numTeenager} style={{ width: "52px", paddingLeft: "18px" }}>
                    {numTeenager}
                  </Button>
                  <Button disabled={MOVIE.mrating === '18'} onClick={plusHandlerTeenager} icon={<PlusOutlined />} style={{ width: "32px", height: "32px" }}/>
                </ButtonGroup>
              </People>
              <People>
                <span>
									성인
								</span>
                <ButtonGroup style={{ marginLeft: "10px" }}>
                  <Button onClick={minusHandlerAdult} disabled={Adult === 0? true : false} icon={<MinusOutlined />} style={{ width: "32px", height: "32px" }}/>
                  <Button value={numAdult} style={{ width: "52px", paddingLeft: "18px" }}>
                    {numAdult}
                  </Button>
                  <Button onClick={plusHandlerAdult} icon={<PlusOutlined />} style={{ width: "32px", height: "32px" }}/>
                </ButtonGroup>
              </People>
            </NumberContainer>
          </NumberOfPeople>
        </PersonScreen>
        <ScreenSelect>
          <Screen>
						<ScreenImg src="img/screen.png" alt='screen'/>
					</Screen>
          <SeatReserve>
            {SEAT_LIST.map((seat) => 
                <div key={seat.sid}>
                  <SeatButton seat={seat}/>
                </div>
            )}
          </SeatReserve>
					<SeatInfo>
						<SeatInfoUl>
							<SeatInfoLi>
								<div className="possibleSeat">
								</div>
								<em>
									예매가능
								</em>
							</SeatInfoLi>
							<SeatInfoLi>
								<div className="selSeat">
								</div>
								<em>
									선택좌석
								</em>
							</SeatInfoLi>
							<SeatInfoLi>
								<div className="useSeat">
								</div>
								<em>
									예매불가
								</em>
							</SeatInfoLi>
						</SeatInfoUl>
					</SeatInfo>
        </ScreenSelect>
      </SeatContent>
    </SeatWrapper>
  );
};

const SeatWrapper = styled.div`
  display: flex;
  width: 1045px;
  height: 100%;
  padding-left: 5px;
	margin : 0 auto;
`;

const SeatContent = styled.div`
  width: 100%;
  position: relative;
  float: left;
  height: 100%;
  background-color: #f2f0e5;
  overflow: hidden;
`;

const Title = styled.div`
  position: relative;
  height: 34px;
  line-height: 34px;
  text-align: center;
  background-color: #333333;
  color: white;
  font-weight: bold;
`;

const PersonScreen = styled.div`
  position: relative;
  border-bottom: 2px solid #d4d3c9;
  display: inline-block;
  width: 100%;
`;

const NumberOfPeople = styled.div`
  width: 100%;
`;

const NumberContainer = styled.div`
  min-height: 45px;
  padding: 10px 0 10px 20px;
  background-color: #f2f4f5;
  border: 1px solid #d8d9db;
`;

const People = styled.div`
  display: block;
  float: left;
  position: relative;
  left: 208px;
  top: 6px;
  padding-right: 52px;
`;

const ScreenSelect = styled.div`
  display: flex;
  min-height: 430px;
  width: 100%;
`;

const Screen = styled.div`
	background: #fff;
  position: absolute;
  margin-top: 17px;
  left: 53%;
	transform: translate(-53%, 0);
  width: 610px;
  height: 52px;
`;

const ScreenImg = styled.img`
	width: 610px;
	height: 27px;
	border: 0;
	text-align: center; 
	padding-top: 13px;
`;

const SeatReserve = styled.div`
  width: 460px;
  position: absolute;
	top: 198px;
	left: 51%;
	transform: translate(-51%, 0);
`;

const SeatInfo = styled.div`
	width: 80px;
	position: absolute;
	top: 29%;
	left: 97%;
	transform: translate(-97%, 29%);
`;

const SeatInfoUl = styled.ul`
	list-style-type: none;
	margin: 0;
	padding: 0;
`;

const SeatInfoLi = styled.li`
	box-sizing: border-box;
	margin-top: 10px;
	margin-left: 4px;
	margin-bottom: 10px;

	div {
		overflow: hidden;
    display: inline-block;
    width: 18px;
    height: 18px;
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: middle;
    background-position: 0 0;
    background-repeat: no-repeat;
		margin-right: 6px;
	}

	.possibleSeat {
		background-color: lightblue;
	}

	.selSeat {
		background-color: white;
	}

	.useSeat {
		background-color: grey;
	}

	em {
		color: black;
    font-size: 12px;
		font-style: normal;
	}
`;

export default Seat;
