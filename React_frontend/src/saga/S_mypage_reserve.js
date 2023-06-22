/*
 23-03-24 마이페이지 예매 함수들 구현(오병주)
*/
import { call, all, takeLatest, fork, put } from "redux-saga/effects";
import { 
	USER_RESERVE_SEARCH_REQUEST,
	USER_RESERVE_SEARCH_SUCCESS,
	USER_RESERVE_SEARCH_FAILURE,
	USER_RESERVE_DETAIL_REQUEST,
	USER_RESERVE_DETAIL_SUCCESS,
	USER_RESERVE_DETAIL_FAILURE,
  USER_RESERVE_DROP_REQUEST,
	USER_RESERVE_DROP_SUCCESS,
	USER_RESERVE_DROP_FAILURE,
  USER_RESERVE_CANCEL_SEARCH_REQUEST,
	USER_RESERVE_CANCEL_SEARCH_SUCCESS,
	USER_RESERVE_CANCEL_SEARCH_FAILURE,
  USER_RESERVE_CANCEL_DETAIL_REQUEST,
	USER_RESERVE_CANCEL_DETAIL_SUCCESS,
	USER_RESERVE_CANCEL_DETAIL_FAILURE,
  USER_RESERVE_FINISH_SEARCH_REQUEST,
	USER_RESERVE_FINISH_SEARCH_SUCCESS,
	USER_RESERVE_FINISH_SEARCH_FAILURE,
  USER_RESERVE_FINISH_DETAIL_REQUEST,
	USER_RESERVE_FINISH_DETAIL_SUCCESS,
	USER_RESERVE_FINISH_DETAIL_FAILURE
} from "../reducer/R_mypage_reserve";
import { http } from "../lib/http";

// 사용자의 예매내역 조회 함수
function* ReserveSearch() {
  const result = yield call(ReserveSearchCall);
  if (result.status === 200) {
    yield put({
      type: USER_RESERVE_SEARCH_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
      type: USER_RESERVE_SEARCH_FAILURE
    });
  }
}

// 사용자의 예매내역 조회 백엔드 호출
async function ReserveSearchCall() {
  return await http
    .get("/MyPageMovie/auth/reserve")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

// 사용자의 예매내역 상세 조회 함수
function* ReserveDetailSearch(action) {
  const result = yield call(ReserveDetailSearchCall, action.data);
  if (result.status === 200) {
    yield put({
      type: USER_RESERVE_DETAIL_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
      type: USER_RESERVE_DETAIL_FAILURE
    });
  }
}

// 사용자의 예매내역 상세 조회 백엔드 호출
async function ReserveDetailSearchCall(data) {
  return await http
    .get(`/MyPageMovie/auth${data.pathname}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

// 사용자의 예매취소 함수
function* ReserveDrop(action) {
  const result = yield call(ReserveDropCall, action.data);
  if (result.status === 204) {
    yield put({
      type: USER_RESERVE_DROP_SUCCESS,
      data: result.status
    });
  } 
  else {
    yield put({
      type: USER_RESERVE_DROP_FAILURE,
      data: result.status
    });
  }
}

// 사용자의 예매취소 백엔드 호출
async function ReserveDropCall(data) {
  return await http
    .patch(`/Payment/auth/cancel${data.pathname}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

// 사용자의 예매 취소내역 조회 함수
function* ReserveCancelSearch() {
  const result = yield call(ReserveCancelSearchCall);
  if (result.status === 200) {
    yield put({
      type: USER_RESERVE_CANCEL_SEARCH_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
      type: USER_RESERVE_CANCEL_SEARCH_FAILURE
    });
  }
}

// 사용자의 예매 취소내역 조회 백엔드 호출
async function ReserveCancelSearchCall() {
  return await http
    .get("/MyPageMovie/auth/reserve/cancel")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

// 사용자의 예매취소내역 상세 조회 함수
function* ReserveCancelDetailSearch(action) {
  const result = yield call(ReserveCancelDetailSearchCall, action.data);
  if (result.status === 200) {
    yield put({
      type: USER_RESERVE_CANCEL_DETAIL_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
      type: USER_RESERVE_CANCEL_DETAIL_FAILURE
    });
  }
}

// 사용자의 예매취소내역 상세 조회 백엔드 호출
async function ReserveCancelDetailSearchCall(data) {
  return await http
    .get(`/MyPageMovie/auth${data.pathname}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

// 사용자의 지난 관람내역 조회 함수
function* ReserveFinishSearch() {
  const result = yield call(ReserveFinishSearchCall);
  if (result.status === 200) {
    yield put({
      type: USER_RESERVE_FINISH_SEARCH_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
      type: USER_RESERVE_FINISH_SEARCH_FAILURE
    });
  }
}

// 사용자의 지난 관람내역 조회 백엔드 호출
async function ReserveFinishSearchCall() {
  return await http
    .get("/MyPageMovie/auth/reserve/finish")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

// 사용자의 지난 관람내역 상세 조회 함수
function* ReserveFinishDetailSearch(action) {
  const result = yield call(ReserveFinishDetailSearchCall, action.data);
  if (result.status === 200) {
    yield put({
      type: USER_RESERVE_FINISH_DETAIL_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
      type: USER_RESERVE_FINISH_DETAIL_FAILURE
    });
  }
}

// 사용자의 지난 관람내역 상세 조회 백엔드 호출
async function ReserveFinishDetailSearchCall(data) {
  return await http
    .get(`/MyPageMovie/auth${data.pathname}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

function* USER_RESERVE_SEARCH() {
  yield takeLatest(USER_RESERVE_SEARCH_REQUEST, ReserveSearch);
}

function* USER_RESERVE_DETAIL() {
  yield takeLatest(USER_RESERVE_DETAIL_REQUEST, ReserveDetailSearch);
}

function* USER_RESERVE_DROP() {
  yield takeLatest(USER_RESERVE_DROP_REQUEST, ReserveDrop);
}

function* USER_RESERVE_CANCEL_SEARCH() {
  yield takeLatest(USER_RESERVE_CANCEL_SEARCH_REQUEST, ReserveCancelSearch);
}

function* USER_RESERVE_CANCEL_DETAIL() {
  yield takeLatest(USER_RESERVE_CANCEL_DETAIL_REQUEST, ReserveCancelDetailSearch);
}

function* USER_RESERVE_FINISH_SEARCH() {
  yield takeLatest(USER_RESERVE_FINISH_SEARCH_REQUEST, ReserveFinishSearch);
}

function* USER_RESERVE_FINISH_DETAIL() {
  yield takeLatest(USER_RESERVE_FINISH_DETAIL_REQUEST, ReserveFinishDetailSearch);
}

export default function* S_mypage_reserve() {
  yield all([fork(USER_RESERVE_SEARCH), 
		fork(USER_RESERVE_DETAIL), 
		fork(USER_RESERVE_DROP),
		fork(USER_RESERVE_CANCEL_SEARCH), 
		fork(USER_RESERVE_CANCEL_DETAIL),
		fork(USER_RESERVE_FINISH_SEARCH),
		fork(USER_RESERVE_FINISH_DETAIL)]);
}
