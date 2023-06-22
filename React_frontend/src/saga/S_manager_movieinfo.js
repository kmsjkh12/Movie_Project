/*
	23-04-03 ~ 23-04-05 관리자 페이지 상영정보관리 구현(오병주)
*/
import { call, all, takeLatest, fork, put } from "redux-saga/effects";
import { 
	MANAGER_MOVIEINFO_MOVIE_LIST_REQUEST, MANAGER_MOVIEINFO_MOVIE_LIST_SUCCESS,  MANAGER_MOVIEINFO_MOVIE_LIST_FAILURE,
	MANAGER_MOVIEINFO_THEATER_LIST_REQUEST, MANAGER_MOVIEINFO_THEATER_LIST_SUCCESS,  MANAGER_MOVIEINFO_THEATER_LIST_FAILURE,
  MANAGER_MOVIEINFO_CINEMA_LIST_REQUEST, MANAGER_MOVIEINFO_CINEMA_LIST_SUCCESS,  MANAGER_MOVIEINFO_CINEMA_LIST_FAILURE,
	MANAGER_MOVIEINFO_LIST_REQUEST, MANAGER_MOVIEINFO_LIST_SUCCESS,  MANAGER_MOVIEINFO_LIST_FAILURE,
  MANAGER_MOVIEINFO_INSERT_REQUEST, MANAGER_MOVIEINFO_INSERT_SUCCESS,  MANAGER_MOVIEINFO_INSERT_FAILURE,
  MANAGER_MOVIEINFO_DELETE_REQUEST, MANAGER_MOVIEINFO_DELETE_SUCCESS,  MANAGER_MOVIEINFO_DELETE_FAILURE,
  MANAGER_MOVIEINFO_UPDATE_REQUEST, MANAGER_MOVIEINFO_UPDATE_SUCCESS,  MANAGER_MOVIEINFO_UPDATE_FAILURE
} from "../reducer/R_manager_movieinfo";
import { http } from "../lib/http";

// 영화 조회 함수
function* AllMovie() {
  const result = yield call(callAllMovie);
  if (result.status === 200) {
    yield put({
      type: MANAGER_MOVIEINFO_MOVIE_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIEINFO_MOVIE_LIST_FAILURE
    });
  }
}

// 영화 조회 백엔드 호출
async function callAllMovie() {
  return await http.get("/Manager/auth/allMovie")
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 극장 조회 함수
function* AllTheater() {
  const result = yield call(callAllTheater);
  if (result.status === 200) {
    yield put({
      type: MANAGER_MOVIEINFO_THEATER_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIEINFO_THEATER_LIST_FAILURE
    });
  }
}

// 극장 조회 백엔드 호출
async function callAllTheater() {
  return await http.get("/Manager/auth/allTheater")
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
      type: MANAGER_MOVIEINFO_CINEMA_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIEINFO_CINEMA_LIST_FAILURE
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

// 상영정보 조회 함수
function* MovieInfoSearch(action) {
  const result = yield call(callMovieInfoSearch, action.data);
  if (result.status === 200) {
    yield put({
      type: MANAGER_MOVIEINFO_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIEINFO_LIST_FAILURE
    });
  }
}

// 상영정보 조회 백엔드 호출
async function callMovieInfoSearch(data) {
  return await http.get("/Manager/auth/allMovieInfo", {
    params: {
      mid: data.mid,
      tarea: data.tarea,
			tid: data.tid,
      startDay: data.startDay,
      endDay: data.endDay
    },
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 상영정보 추가 함수
function* MovieInfoInsert(action) {
  const result = yield call(callMovieInfoInsert, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_MOVIEINFO_INSERT_SUCCESS,
      data: result.status
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIEINFO_INSERT_FAILURE,
      data: result.status
    });
  }
}

// 상영정보 추가 백엔드 호출
async function callMovieInfoInsert(data) {
  return await http.post("/Manager/auth/insertMovieInfo", data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 상영정보 삭제 함수
function* MovieInfoDelete(action) {
  const result = yield call(callMovieInfoDelete, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_MOVIEINFO_DELETE_SUCCESS,
      data: result.status
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIEINFO_DELETE_FAILURE,
      data: result.status
    });
  }
}

// 상영정보 삭제 백엔드 호출
async function callMovieInfoDelete(data) {
  return await http.delete("/Manager/auth/deleteMovieInfo", {
    params: {
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

// 상영정보 수정 함수
function* MovieInfoUpdate(action) {
  const result = yield call(callMovieInfoUpdate, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_MOVIEINFO_UPDATE_SUCCESS,
      data: result.status
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIEINFO_UPDATE_FAILURE,
      data: result.status
    });
  }
}

// 상영정보 수정 백엔드 호출
async function callMovieInfoUpdate(data) {
  return await http.patch("/Manager/auth/updateMovieInfo", data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

function* MOVIE_LIST() {
  yield takeLatest(MANAGER_MOVIEINFO_MOVIE_LIST_REQUEST, AllMovie);
}

function* THEATER_LIST() {
  yield takeLatest(MANAGER_MOVIEINFO_THEATER_LIST_REQUEST, AllTheater);
}

function* CINEMA_LIST() {
  yield takeLatest(MANAGER_MOVIEINFO_CINEMA_LIST_REQUEST, AllCinema);
}

function* MOVIEINFO_LIST() {
  yield takeLatest(MANAGER_MOVIEINFO_LIST_REQUEST, MovieInfoSearch);
}

function* MOVIEINFO_INSERT() {
  yield takeLatest(MANAGER_MOVIEINFO_INSERT_REQUEST, MovieInfoInsert);
}

function* MOVIEINFO_DELETE() {
  yield takeLatest(MANAGER_MOVIEINFO_DELETE_REQUEST, MovieInfoDelete);
}

function* MOVIEINFO_UPDATE() {
  yield takeLatest(MANAGER_MOVIEINFO_UPDATE_REQUEST, MovieInfoUpdate);
}

export default function* S_manager_movieinfo() {
  yield all([
    fork(MOVIE_LIST),
    fork(THEATER_LIST),
    fork(CINEMA_LIST),
		fork(MOVIEINFO_LIST),
    fork(MOVIEINFO_INSERT),
    fork(MOVIEINFO_DELETE),
    fork(MOVIEINFO_UPDATE)
	]);
}
