/*
	23-04-27 ~ 28 예매 페이지 수정(오병주)
	23-05-02 결제 페이지 수정(오병주)
*/
import { all, takeLatest, fork, put, call } from "redux-saga/effects";
import { 
	TICKET_MOVIE_LIST_REQUEST, TICKET_MOVIE_LIST_SUCCESS, TICKET_MOVIE_LIST_FAILURE,
	TICKET_THEATER_LIST_REQUEST, TICKET_THEATER_LIST_SUCCESS, TICKET_THEATER_LIST_FAILURE,
	TICKET_DAY_LIST_REQUEST, TICKET_DAY_LIST_SUCCESS, TICKET_DAY_LIST_FAILURE,
	TICKET_MOVIEINFO_LIST_REQUEST, TICKET_MOVIEINFO_LIST_SUCCESS, TICKET_MOVIEINFO_LIST_FAILURE,
	TICKET_PAYMENT_REQUEST, TICKET_PAYMENT_SUCCESS, TICKET_PAYMENT_FAILURE,
} from "../reducer/R_ticket";
import { http } from "../lib/http";

// 영화 조회 함수
function* MovieSearch(action) {
  const result = yield call(callMovieSearch, action.data);
  if (result.status === 200) {
    yield put({
      type: TICKET_MOVIE_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: TICKET_MOVIE_LIST_FAILURE
    });
  }
}

// 영화 조회 백엔드 호출
async function callMovieSearch(data) {
  return await http.get("/Movie/normal/Ticket", {
    params: {
			miday: data.miday,
      tid: data.tid,
			sort: data.sort
		}
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 극장 조회 함수
function* TheaterSearch(action) {
  const result = yield call(callTheaterSearch, action.data);
  if (result.status === 200) {
    yield put({
      type: TICKET_THEATER_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: TICKET_THEATER_LIST_FAILURE
    });
  }
}

// 극장 조회 백엔드 호출
async function callTheaterSearch(data) {
  return await http.get("/Theater/normal/Ticket", {
    params: {
			miday: data.miday,
      mid: data.mid
		}
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 날짜 조회 함수
function* DaySearch(action) {
  const result = yield call(callDaySearch, action.data);
  if (result.status === 200) {
    yield put({
      type: TICKET_DAY_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: TICKET_DAY_LIST_FAILURE
    });
  }
}

// 날짜 조회 백엔드 호출
async function callDaySearch(data) {
  return await http.get("/MovieInfo/normal/Ticket", {
    params: {
			tid: data.tid,
      mid: data.mid
		}
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 상영정보 조회 함수
function* MovieInfoSearch(action) {
  const result = yield call(callMovieInfoSearch, action.data);
  if (result.status === 200) {
    yield put({
      type: TICKET_MOVIEINFO_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: TICKET_MOVIEINFO_LIST_FAILURE
    });
  }
}

// 상영정보 조회 백엔드 호출
async function callMovieInfoSearch(data) {
  return await http.get("/MovieInfo/normal/Schedule", {
    params: {
			miday: data.miday,
			mid: data.mid,
			tid: data.tid,
			uid: data.uid
		}
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 결제 검증 요청 함수
function* Payment(action) {
  const result = yield call(callPayment, action.data);
  if (result.status === 200) {
    yield put({
      type: TICKET_PAYMENT_SUCCESS,
			data: result.data
    });
  } 
  else {
    yield put({
			type: TICKET_PAYMENT_FAILURE,
			data: result.data
    });
  }
}

// 결제 검증 요청 백엔드 호출
async function callPayment(data) {
  return await http.post("/Payment/auth/Check", data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

function* MOVIE_LIST() {
  yield takeLatest(TICKET_MOVIE_LIST_REQUEST, MovieSearch);
}

function* THEATER_LIST() {
  yield takeLatest(TICKET_THEATER_LIST_REQUEST, TheaterSearch);
}

function* DAY_LIST() {
  yield takeLatest(TICKET_DAY_LIST_REQUEST, DaySearch);
}

function* MOVIEINFO_LIST() {
  yield takeLatest(TICKET_MOVIEINFO_LIST_REQUEST, MovieInfoSearch);
}

function* PAYMENT() {
  yield takeLatest(TICKET_PAYMENT_REQUEST, Payment);
}

export default function* S_ticket() {
  yield all([fork(MOVIE_LIST),
		fork(THEATER_LIST),
		fork(DAY_LIST),
		fork(MOVIEINFO_LIST),
		fork(PAYMENT)
  ]);
}
