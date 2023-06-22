/*
  23-05-02 결제 페이지 수정(오병주)
*/
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as Payment from "../../lib/payment.js";
import { SEAT_CHECK_REQUEST, SEAT_CHECK_RESET, SEAT_LIST_REQUEST, SEAT_PAGE_RESET } from "../../reducer/R_seat";
import { TICKET_PAYMENT_RESET } from "../../reducer/R_ticket.js";

const PaymentModal = ({ closeModal }) => {
  const dispatch = useDispatch();

	// 필요한 리덕스 상태들
	const { MOVIE, THEATER, MOVIEINFO, LOGIN_data, Kid, Teenager, Adult, 
		Price, ChoiceSeat, SEAT_CHECK_done, SEAT_CHECK_error, PAYMENT_error, PAYMENT } = useSelector(
		state => ({
			MOVIE: state.R_ticket.MOVIE,
			THEATER: state.R_ticket.THEATER,
			MOVIEINFO: state.R_ticket.MOVIEINFO,
			LOGIN_data: state.R_user_login.LOGIN_data,
			Kid: state.R_seat.Kid,
			Teenager: state.R_seat.Teenager,
			Adult: state.R_seat.Adult,
			Price: state.R_seat.Price,
			ChoiceSeat: state.R_seat.ChoiceSeat,
			SEAT_CHECK_done: state.R_seat.SEAT_CHECK_done,
			SEAT_CHECK_error: state.R_seat.SEAT_CHECK_error,
			PAYMENT_error: state.R_ticket.PAYMENT_error,
			PAYMENT: state.R_ticket.PAYMENT,
		}),
		shallowEqual
	);

	// 모달창 스크롤 막는 useEffect
	useEffect(() => {
		document.body.style.cssText = `
			position: fixed; 
			top: -${window.scrollY}px;
			overflow-y: scroll;
			width: 100%;`;
		return () => {
			const scrollY = document.body.style.top;
			document.body.style.cssText = '';
			window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
		};
	}, []);

	// 약관 동의 버튼 및 disable useState
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);

	// 결제 버튼 누를때 실행되는 함수
	const onClickPayment = useCallback(() => {
		// 모든 약관에 동의했을경우
		if (check1 && check2 && check3) {
			// 사용자가 선택한 좌석번호 String으로 변환
			var seatnumber = "";
			ChoiceSeat.map((seat) => (seatnumber += seat.seat_id + ",")); 
			seatnumber = seatnumber.slice(0, -1);

			// 좌석 점유 여부 백엔드요청
			dispatch({
				type: SEAT_CHECK_REQUEST,
				data: {
					temp_seat: seatnumber,
        	miid: MOVIEINFO.miid
				},
			});
		}
		else {
			alert('모든 약관에 동의해주세요.');
		}
	}, [check1, check2, check3, ChoiceSeat, MOVIEINFO, dispatch]);

	// 점유좌석 조회 여부에 따른 useEffect
	useEffect(()=> {
		// 성공 케이스(결제 요청 및 리덕스 초기화)
		if (SEAT_CHECK_done) {
			Payment.PaymentCall(MOVIE, LOGIN_data, Price, Kid, Teenager, Adult, ChoiceSeat, MOVIEINFO, dispatch);	
			dispatch({
				type: SEAT_CHECK_RESET
			});
		}
		// 실패 케이스(모달 닫고 리덕스 상태 초기화)
		if (SEAT_CHECK_error) {
			alert('점유된 좌석을 선택하셨습니다. 좌석을 다시 선택해주세요.');
			closeModal();
			dispatch({
				type: SEAT_CHECK_RESET
			});
			dispatch ({
        type: SEAT_LIST_REQUEST,
        data: { 
					cid: MOVIEINFO.cid, 
					miid: MOVIEINFO.miid 
				},
      });
			dispatch({
				type: SEAT_PAGE_RESET
			});
		}
	}, [SEAT_CHECK_done, SEAT_CHECK_error, MOVIE, LOGIN_data, Price, Kid, Teenager, Adult, MOVIEINFO, ChoiceSeat, closeModal, dispatch]);

	// 결제 실패에 따른 useEffect
	useEffect(()=> {
		if (PAYMENT_error) {
			// 이미 점유된 좌석을 예매한 경우
			if (PAYMENT.status === 406) {
				alert('이미 점유된 좌석입니다. 다시 예매해주세요!');
				// 모달 닫고 리덕스 상태 초기화
				closeModal();
				dispatch({
					type: SEAT_CHECK_RESET
				});
				dispatch ({
					type: SEAT_LIST_REQUEST,
					data: { 
						cid: MOVIEINFO.cid, 
						miid: MOVIEINFO.miid 
					},
				});
				dispatch({
					type: SEAT_PAGE_RESET
				});
			}
			// 스크립트 조작 또는 서버 문제일경우
			if (PAYMENT.status === 400 || PAYMENT.status === 500) {
				alert('결제에 실패했습니다. 다시 결제해주세요!');
			}
			// 결제 검증 상태 초기화
			dispatch({
				type: TICKET_PAYMENT_RESET
			});
		}
	}, [PAYMENT_error, PAYMENT, closeModal, MOVIEINFO, dispatch]);

  return (
    <Container>
      <Background>
        <ModalBlock>
          <HeadModal>
            <TitleArea>
              <h4>
								예매정보 확인
							</h4>
            </TitleArea>
          </HeadModal>
          <BodyModal>
            <ReserveInfo>
              <h5>
                예매정보
                <span>
									결제하시기 전 예매정보를 다시 한번 확인해주세요.
								</span>
              </h5>
              <Content>
                <Poster>
                  <img src={`${MOVIE.mimagepath}`} alt='Poster'/>
                </Poster>
                <Table>
                  <caption>
										예매정보
									</caption>
                  <tbody>
                    <tr>
                      <th>
												영화명
											</th>
                      <td>
												{MOVIE.mtitle}
											</td>
                    </tr>
                    <tr>
                      <th>
												극장
											</th>
                      <td>
                        {THEATER.tarea} - {THEATER.tname}점
                      </td>
                    </tr>
                    <tr>
                      <th>
												상영관
											</th>
                      <td>
                        {MOVIEINFO.cname} ({MOVIEINFO.ctype})
                      </td>
                    </tr>
                    <tr>
                      <th>
												일시
											</th>
                      <td>
                        {MOVIEINFO.miday}&nbsp;&nbsp;{MOVIEINFO.mistarttime.substring(11, 16)} ~ {MOVIEINFO.miendtime.substring(11,16)}
                      </td>
                    </tr>
                    <tr>
                      <th>
												인원
											</th>
                      <td>
                        {Kid === 0 ? null : (Teenager !== 0 || Adult !== 0) ? <>아이 {Kid}명,&nbsp;</> : <>아이 {Kid}명&nbsp;</>}
                        {Teenager === 0 ? null : (Adult !== 0) ? <>학생 {Teenager}명,&nbsp;</> : <>학생 {Teenager}명&nbsp; </> }
                        {Adult === 0 ? "" : <>성인 {Adult}명 </>}
                      </td>
                    </tr>
                    <tr>
                      <th>
												좌석
											</th>
                      <td>
                        {ChoiceSeat.map((seat, index) => 
                          <span key={index}>
														{seat.location}{index === ChoiceSeat.length - 1 ? null : ','}
													</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Content>
            </ReserveInfo>
            <PaymentInfo>
              <h5>
                결제정보
                <span>
									결제하기 버튼을 클릭하시면 결제 화면이 나옵니다.
								</span>
              </h5>
              <InfoTable>
                <caption>
									결제정보
								</caption>
                <tbody>
                  <tr>
                    <th>
											결제금액
										</th>
                    <td>
                    	{Price}원
                    </td>
                  </tr>
                  <tr>
                    <th>
											결제수단 
										</th>
                    <td>
											인터넷 결제 (자동환불)
                  	</td>
                  </tr>
									<tr>
										<th>
											환불시기
										</th>
										<td>
											결제일 기준 3일이내
										</td>
									</tr>
                </tbody>
              </InfoTable>
            </PaymentInfo>
            <Agreement>
              <PaymentAgreement>
                <CheckLayout>
                  <input type="checkbox" name="agree1" id="agree1" value={check1} onClick={() => setCheck1(!check1)}/>
                  <label htmlFor="agree1">
                    결제대행서비스 약관 동의
                  </label>
                </CheckLayout>
                <CheckLayout>
                  <input type="checkbox" name="agree2" id="agree2" value={check2} onClick={() => setCheck2(!check2)}/>
                  <label htmlFor="agree2">
										전자금융거래 이용약관 동의
									</label>
                </CheckLayout>
              </PaymentAgreement>
              <PaymentAgreement2>
                <CheckLayout>
                  <input type="checkbox" name="agree3" id="agree3" value={check3} onClick={() => setCheck3(!check3)}/>
                  <label htmlFor="agree3">
										결제 정보를 모두 확인했습니다.
									</label>
                </CheckLayout>
              </PaymentAgreement2>
            </Agreement>
            <Reserve onClick={onClickPayment}>
							결제하기
						</Reserve>
            <Cancel onClick={()=> closeModal()}>
							취소
						</Cancel>
          </BodyModal>
        </ModalBlock>
      </Background>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
`;

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
`;

const ModalBlock = styled.div`
  position: absolute;
  top: 50%;
	left: 50%;
	transform: translate(-50%, -50%); /* translate(x축,y축) */
  background-color: white;
  color: black;
  width: 68rem;
  height: 36.5rem;
  box-shadow: 1px 1px 1px 1px gray;
`;

const HeadModal = styled.div`
  position: relative;
  bottom: 29px;
  width: 100%;
  border-bottom: 4px solid #333;
  height: 3.2rem !important;
  background-color: #333 !important;
  padding-top: 0 !important;
  padding-left: 0 !important;
  margin-bottom: 0 !important;
`;

const TitleArea = styled.div`
  display: block;

  h4 {
    float: none !important;
    width: auto !important;
    margin-right: 0 !important;
    background: none !important;
    color: #f2f0e5;
    border: 1px solid #707070;
    height: 35px !important;
    padding-top: 14px;
    padding-left: 20px;
    font-size: 22px;
    line-height: 22px;
    letter-spacing: -1px;
  }
`;

const BodyModal = styled.div`
  position: relative;
  margin: 0 auto;
  bottom: 2rem;
  padding: 40px 40px 18.5px 40px;
  overflow: hidden;
  background-color: #f6f6f4;
  height: 81%;
`;

const ReserveInfo = styled.div`
  width: 502px;
  height: 278px;
  float: left;
  overflow: hidden;
  border-top: solid 2px #bebebd;

  h5 {
    display: block;
    height: 42px;
    line-height: 42px;
    margin: 0 0;
    font-size: 20px;
    padding: 0 0;
    padding-left: 20px;
    border-bottom: solid 1px #bebebd;
  }

  span {
    font-size: 13.5px;
    padding-left: 20px;
  }
`;

const Content = styled.div`
  padding: 20px 0px 40px 7px;
  overflow: hidden;
`;

const Poster = styled.div`
  float: left;
  width: 125px;
  height: 190px;
  line-height: 190px;
  margin-right: 20px;
	margin-top: 3px;
  overflow: hidden;

  img {
    width: 125px;
    height: 190px;
  }
`;

const Table = styled.table`
  border: none;
  table-layout: fixed;

  caption {
    overflow: hidden;
    visibility: hidden;
    width: 0;
    height: 0;
    line-height: 0;
    font-size: 0;
  }

  tr {
    height: 28px;
    line-height: 28px;

    th {
      width: 55px;
      font-weight: normal;
      text-align: left;
			font-size: 13px;
    }

    td {
      width: 279px;
      font-weight: bold;
      height: inherit;
      line-height: inherit;
      background: none;
			font-size: 14px;

			span {
				&:first-child {
					padding-left: 0;
				}
				font-size: 14px;
				padding-left: 7px;
  		}
    }
  }
`;

const PaymentInfo = styled.div`
  width: 502px;
  height: 278px;
  float: left;
  overflow: hidden;
  border-left: solid 1px #bebebd;
  border-top: solid 2px #bebebd;

  h5 {
    display: block;
    height: 42px;
    line-height: 42px;
    margin: 0 0;
    padding: 0 0;
    padding-left: 20px;
    border-bottom: solid 1px #bebebd;
    font-size: 20px;
  }
  span {
    font-size: 13.5px;
    padding-left: 20px;
  }
`;

const InfoTable = styled.table`
  margin-top: 20px;
  margin-left: 20px;
  width: 434px;
  border: none;

  caption {
    overflow: hidden;
    visibility: hidden;
    width: 0;
    height: 0;
    line-height: 0;
    font-size: 0;
  }

  tr {
    height: 28px;
    line-height: 28px;
    vertical-align: top;

    th {
      width: 58px;
      font-weight: normal;
			font-size: 13px;
    }

    td {
			font-size: 14px;
      width: 376px;
			padding-left: 15px;
      height: inherit;
      line-height: inherit;        
      font-weight: bold;
      background: none;
    }
  }
`;

const Agreement = styled.div`
  border-top: 1px solid rgb(204, 204, 204);
  padding-top: 15px;
  float: left;
  width: 100%;
  margin-top: 15px;
  padding-bottom: 15px;
  height: 70px;
  line-height: 13px;
  text-align: center;
  text-align: left;
`;

const PaymentAgreement = styled.div`
  float: left;
  width: 482px;
  height: 100%;
  padding-left: 20px;
  border-right: 1px solid rgb(204, 204, 204);
  text-align: left;
	font-size: 13px;

	input {
		margin-right: 6px;
	}

	label {
		position: relative;
		top: -1.5px;
	}
`;

const PaymentAgreement2 = styled.div`
  float: left;
  width: 482px;
  height: 100%;
  padding-left: 20px;
  text-align: left;
	font-size: 13px;

	input {
		margin-right: 6px;
	}

	label {
		position: relative;
		top: -1.5px;
	}
`;

const CheckLayout = styled.span`
  display: block;
  width: 410px;
  min-height: 15px;
  margin: 0px 0px 10px;
`;

const Reserve = styled.button`
  position: relative;
  left: 23.4rem;
  top: 1rem;
  cursor: pointer;
  border: none;
  display: inline-block;
  padding: 15px 30px;
  border-radius: 15px;
  font-family: "paybooc-Light", sans-serif;
	box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
  background-color: #f8e6e0;
  color: #6e6e6e;
`;

const Cancel = styled.button`
  position: relative;
  left: 25.4rem;
  top: 1rem;
  cursor: pointer;
  border: none;
  display: inline-block;
  padding: 15px 30px;
  border-radius: 15px;
  font-family: "paybooc-Light", sans-serif;
	box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
  color: #6e6e6e;
`;

export default PaymentModal;