/*
  23-05-03 결제 페이지 수정(오병주)
*/
import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";

const PaymentComplete = () => {
	// 필요한 리덕스 상태들
	const { MOVIE, THEATER, MOVIEINFO, Kid, Teenager, Adult, Price, ChoiceSeat, PAYMENT } = useSelector(
		state => ({
			MOVIE: state.R_ticket.MOVIE,
			THEATER: state.R_ticket.THEATER,
			DAY: state.R_ticket.DAY,
			MOVIEINFO: state.R_ticket.MOVIEINFO,
			Kid: state.R_seat.Kid,
			Teenager: state.R_seat.Teenager,
			Adult: state.R_seat.Adult,
			Price: state.R_seat.Price,
			ChoiceSeat: state.R_seat.ChoiceSeat,
			PAYMENT: state.R_ticket.PAYMENT,
		}),
		shallowEqual
	);

	// 스크롤 제일위로 올리는 useEffect
	useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
	
  return (
		<CompleteWrapper>
			<Complete>
				<Title>
					예매완료
        </Title>
        <Content>
					<h5>
						예매가 완료 되었습니다.
					</h5>
					<Poster>
						<img src={`${MOVIE.mimagepath}`} alt='Poster'/>
					</Poster>
					<Table>
						<tbody>
							<tr>
								<th>
									예매번호
								</th>
								<td style={{color: 'red'}}>
									{PAYMENT.rid}
								</td> 
							</tr>
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
									관람극장
								</th>
								<td>
									{THEATER.tarea}-{THEATER.tname}점 {MOVIEINFO.cname}
								</td>
							</tr>
							<tr>
								<th>
									관람일시
								</th>
								<td>
									{MOVIEINFO.miday}&nbsp;&nbsp;{MOVIEINFO.mistarttime.substring(11, 16)} ~ {MOVIEINFO.miendtime.substring(11,16)}
								</td>
							</tr>
							<tr>
								<th>
									관람인원
								</th>
								<td>
									{Kid === 0 ? null : (Teenager !== 0 || Adult !== 0) ? <>아이 {Kid}명,&nbsp;</> : <>아이 {Kid}명&nbsp;</>}
									{Teenager === 0 ? null : (Adult !== 0) ? <>학생 {Teenager}명,&nbsp;</> : <>학생 {Teenager}명&nbsp; </> }
									{Adult === 0 ? "" : <>성인 {Adult}명 </>}
								</td>
							</tr>
							<tr>
								<th>
									관람좌석
								</th>
								<td>
									{ChoiceSeat.map((seat, index) => 
										<span key={index}>
											{seat.location}{index === ChoiceSeat.length - 1 ? null : ','}
										</span>
									)}
								</td>
							</tr>
							<tr>
								<th>
									결제금액
								</th>
								<td>
									<span style={{color: 'red'}}>
										{Price} 원
									</span>
								</td>
							</tr>
						</tbody>
					</Table>
					<Link to="/Mypage/Reserve" style={{marginRight: "25px"}}>
						<Check>
							예매확인 / 취소
						</Check>
					</Link>
					<Link to="/">
						<Reserve>
							메인 페이지
						</Reserve>
					</Link>
					<Agreement>
						<PaymentAgreement>
							<span>
								예매 유의사항
							</span>
							<p>
								결제 취소는 영화 시작 30분전까지 가능합니다.<br/><br/>
								모든 결제는 테스트로 진행되며 결제일 기준으로 3일이내 결제금액이 환불됩니다.<br/><br/>
								결제 내역은 마이페이지에서 확인 가능합니다.
							</p>
						</PaymentAgreement>
					</Agreement>
				</Content>
			</Complete>
		</CompleteWrapper>
	);
};

const CompleteWrapper = styled.div`
  width: 1045px;
  height: 100%;
  padding-left: 5px;
	margin : 0 auto;
  min-height: 650px;
`;

const Complete = styled.div`
  width: 100%;
  min-height: 625px;
  position: relative;
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

const Content = styled.div`
	width: 900px;
  height: 590px;
  float: left;
  padding-left: 70px;
  font-size: 13px;
	overflow: hidden;

  h5 {
    font-size: 25px;
    text-align: center;
		margin-top: 30px;
		margin-bottom: 30px;
	}
`;

const Poster = styled.div`
  float: left;
  width: 160px;
  height: 240px;
  line-height: 240px;
  margin-right: 25px;
  overflow: hidden;

  img {
    width: 160px;
    height: 240px;
  }
`;

const Table = styled.table`
  border: none;
  table-layout: fixed;

  tr {
    height: 31px;
    line-height: 31px;

    th {
      width: 75px;
      font-weight: normal;
      text-align: left;
    }

    td {
      width: 280px;
      font-weight: bold;
      height: inherit;
      line-height: inherit;
      background: none;
			font-size: 14px;

			span {
				&:first-child {
					padding-left: 0;
				}
				padding-left: 6px;
  		}
    }
  }
`;

const Reserve = styled.button`
  position: relative;
  cursor: pointer;
  border: none;
  display: inline-block;
  color: white;
	width: 10rem;
	height: 3rem;
  border-radius: 5px;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
  background-color: #392f31;
`;

const Check = styled.button`
	position: relative;
	cursor: pointer;
	border: none;
	display: inline-block;
	width: 10rem;
	height: 3rem;
	border-radius: 5px;
	box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2);
	text-decoration: none;
	font-weight: 600;
	transition: 0.25s;
	background-color: #800000;
	color: white;
	margin-top: 28px;
`;

const Agreement = styled.div`
  border-top: 1px solid rgb(204, 204, 204);
  padding-top: 20px;
  float: left;
  width: 100%;
  margin-top: 30px;
  padding-bottom: 19px;
  height: 90px;
  line-height: 13px;
  text-align: center;
  text-align: left;
`;

const PaymentAgreement = styled.div`
  float: left;
  width: 100%;
  height: 100%;
  padding-left: 5px;
  text-align: left;
	
	span {
		font-size: 14px;
		font-weight: bold;
	}
`;

export default PaymentComplete;