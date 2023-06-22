/*
 23-03-29 관리자 페이지 영화관 관련 crud (강경목)
 23-04-17 상영관, 영화관 관리자 페이지 CRUD 수정(오병주)
*/
import { call, all, takeLatest, fork, put } from "redux-saga/effects";
import { 
	MANAGER_THEATER_REQUEST, MANAGER_THEATER_SUCCESS, MANAGER_THEATER_FAILURE,
	MANAGER_THEATER_INSERT_REQUEST, MANAGER_THEATER_INSERT_SUCCESS, MANAGER_THEATER_INSERT_FAILURE,
	MANAGER_THEATER_DELETE_REQUEST, MANAGER_THEATER_DELETE_SUCCESS, MANAGER_THEATER_DELETE_FAILURE,
	MANAGER_THEATER_UPDATE_REQUEST, MANAGER_THEATER_UPDATE_SUCCESS, MANAGER_THEATER_UPDATE_FAILURE,
	MANAGER_CINEMA_REQUEST, MANAGER_CINEMA_SUCCESS, MANAGER_CINEMA_FAILURE,
	MANAGER_CINEMA_INSERT_REQUEST, MANAGER_CINEMA_INSERT_SUCCESS, MANAGER_CINEMA_INSERT_FAILURE,
	MANAGER_CINEMA_DELETE_REQUEST, MANAGER_CINEMA_DELETE_SUCCESS, MANAGER_CINEMA_DELETE_FAILURE,
	MANAGER_CINEMA_UPDATE_REQUEST, MANAGER_CINEMA_UPDATE_SUCCESS, MANAGER_CINEMA_UPDATE_FAILURE
 } from "../reducer/R_manager_theater";
import { http } from "../lib/http";

// 영화관 조회 함수
function* AllTheater() {
  const result = yield call(callAllTheater);
  if (result.status === 200) {
    yield put({
      type: MANAGER_THEATER_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_THEATER_FAILURE
    });
  }
}

// 영화관 조회 백엔드 호출
async function callAllTheater() {
  return await http.get("/Manager/auth/allTheater")
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 영화관 추가 함수
function* InsertTheater(action) {
  const result = yield call(callInsertTheater, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_THEATER_INSERT_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_THEATER_INSERT_FAILURE
    });
  }
}

// 영화관 추가 백엔드 호출
async function callInsertTheater(data) {
  return await http.post("/Manager/auth/insertTheater", data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 영화관 삭제 함수
function* DeleteTheater(action) {
  const result = yield call(callDeleteTheater, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_THEATER_DELETE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_THEATER_DELETE_FAILURE
    });
  }
}

// 영화관 삭제 백엔드 호출
async function callDeleteTheater(data) {
  return await http.delete("/Manager/auth/deleteTheater", {
    params: {
      tid: data.tid
    }
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 영화관 수정 함수
function* UpdateTheater(action) {
  const result = yield call(callUpdateTheater, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_THEATER_UPDATE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_THEATER_UPDATE_FAILURE
    });
  }
}

// 영화관 수정 백엔드 호출
async function callUpdateTheater(data) {
  return await http.patch("/Manager/auth/updateTheater", data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 상영관 조회 함수
function* AllCinema() {
  const result = yield call(callAllCinema);
  if (result.status === 200) {
    yield put({
      type: MANAGER_CINEMA_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_CINEMA_FAILURE
    });
  }
}

// 상영관 조회 백엔드 호출
async function callAllCinema() {
  return await http.get("/Manager/auth/allCinema")
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 상영관 추가 함수
function* InsertCinema(action) {
  const result = yield call(callInsertCinema, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_CINEMA_INSERT_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_CINEMA_INSERT_FAILURE
    });
  }
}

// 상영관 추가 백엔드 호출
async function callInsertCinema(data) {
  return await http.post("/Manager/auth/insertCinema", data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 상영관 삭제 함수
function* DeleteCinema(action) {
  const result = yield call(callDeleteCinema, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_CINEMA_DELETE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_CINEMA_DELETE_FAILURE
    });
  }
}

// 상영관 삭제 백엔드 호출
async function callDeleteCinema(data) {
  return await http.delete("/Manager/auth/deleteCinema", {
    params: {
      cid: data.cid
    }
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 상영관 수정 함수
function* UpdateCinema(action) {
  const result = yield call(callUpdateCinema, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_CINEMA_UPDATE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_CINEMA_UPDATE_FAILURE
    });
  }
}

// 상영관 수정 백엔드 호출
async function callUpdateCinema(data) {
  return await http.patch("/Manager/auth/updateCinema", data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

function* THEATER_LIST() {
	yield takeLatest(MANAGER_THEATER_REQUEST, AllTheater);
}

function* THEATER_INSERT() {
	yield takeLatest(MANAGER_THEATER_INSERT_REQUEST, InsertTheater);
}

function* THEATER_DELETE() {
	yield takeLatest(MANAGER_THEATER_DELETE_REQUEST, DeleteTheater);
}

function* THEATER_UPDATE() {
	yield takeLatest(MANAGER_THEATER_UPDATE_REQUEST, UpdateTheater);
}

function* CINEMA_LIST() {
	yield takeLatest(MANAGER_CINEMA_REQUEST, AllCinema);
}

function* CINEMA_INSERT() {
	yield takeLatest(MANAGER_CINEMA_INSERT_REQUEST, InsertCinema);
}

function* CINEMA_DELETE() {
	yield takeLatest(MANAGER_CINEMA_DELETE_REQUEST, DeleteCinema);
}

function* CINEMA_UPDATE() {
	yield takeLatest(MANAGER_CINEMA_UPDATE_REQUEST, UpdateCinema);
}

export default function* S_manager_theater() {
  yield all([fork(THEATER_LIST),
		fork(THEATER_INSERT),
		fork(THEATER_DELETE),
		fork(THEATER_UPDATE),
		fork(CINEMA_LIST),
		fork(CINEMA_INSERT),
		fork(CINEMA_DELETE),
		fork(CINEMA_UPDATE)
	]);
}
