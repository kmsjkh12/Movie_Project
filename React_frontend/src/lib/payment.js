/*
	23-05-02 결제 페이지 수정(오병주)
*/
import { TICKET_PAYMENT_REQUEST } from "../reducer/R_ticket";

// 주문번호 만들기
const CreateOrderNum = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  var orderNum = year + month + day;
  for (var i = 0; i < 10; i++) {
    orderNum += Math.floor(Math.random() * 8);
  }
  return orderNum;
}

// 결제 요청 함수
export const PaymentCall = (MOVIE, LOGIN_data, Price, Kid, Teenager, Adult, ChoiceSeat, MOVIEINFO, dispatch) => {
	// 아임포트 선언
  const { IMP } = window;
  IMP.init("imp05125381");
	
	// 결제 요청할 데이터
	const data = {
		pg: "html5_inicis", // pg사(이니시스)
		merchant_uid: CreateOrderNum(), // 주문번호
		amount: Price, // 결제금액
		name: MOVIE.mtitle, // 상품(영화)이름
		buyer_name: LOGIN_data.uname, // 구매자 이름
		buyer_tel: LOGIN_data.utel, // 구매자 전화번호
		buyer_email: '', // 구매자 이메일
		buyer_addr: LOGIN_data.uaddr + " " + LOGIN_data.uaddrsecond // 구매자 주소
	};

	// 결제 요청 및 콜백 함수 실행
	IMP.request_pay(data, function(response) {
		// 결제 성공시 로직
		if (response.success) {
			// 사용자가 선택한 관람 인원 String으로 변환
			var people = "";
			if (Kid !==0) {
				people += "아이 " + Object.values({Kid})+"명, "
			}
			if (Teenager !==0) {
				people += "학생 " + Object.values({Teenager})+"명, "
			}
			if (Adult !==0 ) {
				people += "성인 "+Object.values({Adult})+"명, "
			}

			// 사용자가 선택한 좌석번호 String으로 변환
			var seatnumber = "";
			ChoiceSeat.map((seat) => (seatnumber += seat.seat_id + ",")); 
			seatnumber = seatnumber.slice(0, -1);

			// 백엔드로 전달할 데이터(유효성 검사)
			const data = {
				rpayid: response.imp_uid,
				miid: MOVIEINFO.miid,
				price: Price,
				temp_people: people,
				temp_seat: seatnumber,
				rticket: Kid + Teenager + Adult
			}

			// 백엔드 요청
			dispatch ({
				type: TICKET_PAYMENT_REQUEST,
				data: data
			});
		}
	});
}