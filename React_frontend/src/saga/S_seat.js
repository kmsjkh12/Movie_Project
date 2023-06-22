/*
  23-04-30 ~ 23-05-01 예매 좌석 페이지 수정(오병주)
*/
import {
	SEAT_LIST_REQUEST, SEAT_LIST_SUCCESS, SEAT_LIST_FAILURE,
	SEAT_CHECK_REQUEST, SEAT_CHECK_SUCCESS, SEAT_CHECK_FAILURE
} from "../reducer/R_seat";
import { all, takeLatest, fork, put, call } from "redux-saga/effects";
import { http } from "../lib/http";

// 좌석 조회 함수
function* SeatSearch(action) {
  const result = yield call(callSeatSearch, action.data);
  if (result.status === 200) {
    yield put({
      type: SEAT_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: SEAT_LIST_FAILURE
    });
  }
}

// 좌석 조회 백엔드 호출
async function callSeatSearch(data) {
  return await http.get("/Seat/auth/MovieInfo", {
    params: {
			cid: data.cid,
			miid: data.miid
		}
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 좌석 점유여부 조회 함수
function* SeatCheck(action) {
  const result = yield call(callSeatCheck, action.data);
  if (result.status === 204) {
    yield put({
      type: SEAT_CHECK_SUCCESS
    });
  } 
  else {
    yield put({
			type: SEAT_CHECK_FAILURE
    });
  }
}

// 좌석 점유여부 조회 백엔드 호출
async function callSeatCheck(data) {
  return await http.post("/Seat/auth/Check", data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

function* SEAT_LIST() {
  yield takeLatest(SEAT_LIST_REQUEST, SeatSearch);
}

function* SEAT_CHECK() {
  yield takeLatest(SEAT_CHECK_REQUEST, SeatCheck);
}

export default function* S_seat() {
  yield all([fork(SEAT_LIST), fork(SEAT_CHECK)]);
}
