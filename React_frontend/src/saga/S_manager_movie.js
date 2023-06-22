/*
	23-04-18 ~ 19 영화 관리자 페이지 수정(오병주)
*/
import { call, all, takeLatest, fork, put } from "redux-saga/effects";
import { 
	MANAGER_MOVIE_REQUEST, MANAGER_MOVIE_SUCCESS, MANAGER_MOVIE_FAILURE,
	MANAGER_MOVIE_INSERT_REQUEST, MANAGER_MOVIE_INSERT_SUCCESS, MANAGER_MOVIE_INSERT_FAILURE,
	MANAGER_MOVIE_DELETE_REQUEST, MANAGER_MOVIE_DELETE_SUCCESS, MANAGER_MOVIE_DELETE_FAILURE,
	MANAGER_MOVIE_UPDATE_REQUEST, MANAGER_MOVIE_UPDATE_SUCCESS, MANAGER_MOVIE_UPDATE_FAILURE,
	MANAGER_ACTOR_REQUEST, MANAGER_ACTOR_SUCCESS, MANAGER_ACTOR_FAILURE,
	MANAGER_ACTOR_INSERT_REQUEST, MANAGER_ACTOR_INSERT_SUCCESS, MANAGER_ACTOR_INSERT_FAILURE,
	MANAGER_ACTOR_DELETE_REQUEST, MANAGER_ACTOR_DELETE_SUCCESS, MANAGER_ACTOR_DELETE_FAILURE,
	MANAGER_ACTOR_UPDATE_REQUEST, MANAGER_ACTOR_UPDATE_SUCCESS, MANAGER_ACTOR_UPDATE_FAILURE
 } from "../reducer/R_manager_movie";
import { http } from "../lib/http";

// 영화 조회 함수
function* AllMovie() {
  const result = yield call(callAllMovie);
  if (result.status === 200) {
    yield put({
      type: MANAGER_MOVIE_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIE_FAILURE
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

// 영화 추가 함수
function* InsertMovie(action) {
  const result = yield call(callInsertMovie, action);
  if (result.status === 204) {
    yield put({
      type: MANAGER_MOVIE_INSERT_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIE_INSERT_FAILURE
    });
  }
}

// 영화 추가 백엔드 호출
async function callInsertMovie(data) {
  return await http.post("/Manager/auth/insertMovie", data.Fdata)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 영화 삭제 함수
function* DeleteMovie(action) {
  const result = yield call(callDeleteMovie, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_MOVIE_DELETE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIE_DELETE_FAILURE
    });
  }
}

// 영화 삭제 백엔드 호출
async function callDeleteMovie(data) {
  return await http.delete("/Manager/auth/deleteMovie", {
    params: {
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

// 영화 수정 함수
function* UpdateMovie(action) {
  const result = yield call(callUpdateMovie, action);
  if (result.status === 204) {
    yield put({
      type: MANAGER_MOVIE_UPDATE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIE_UPDATE_FAILURE
    });
  }
}

// 영화 수정 백엔드 호출
async function callUpdateMovie(data) {
  return await http.patch("/Manager/auth/updateMovie", data.Fdata)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 배우 조회 함수
function* AllActor() {
  const result = yield call(callAllActor);
  if (result.status === 200) {
    yield put({
      type: MANAGER_ACTOR_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_ACTOR_FAILURE
    });
  }
}

// 배우 조회 백엔드 호출
async function callAllActor() {
  return await http.get("/Manager/auth/allActor")
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 배우 추가 함수
function* InsertActor(action) {
  const result = yield call(callInsertActor, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_ACTOR_INSERT_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_ACTOR_INSERT_FAILURE
    });
  }
}

// 배우 추가 백엔드 호출
async function callInsertActor(data) {
  return await http.post("/Manager/auth/insertActor", data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 배우 삭제 함수
function* DeleteActor(action) {
  const result = yield call(callDeleteActor, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_ACTOR_DELETE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_ACTOR_DELETE_FAILURE
    });
  }
}

// 배우 삭제 백엔드 호출
async function callDeleteActor(data) {
  return await http.delete("/Manager/auth/deleteActor", {
    params: {
      aid: data.aid
    }
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 배우 수정 함수
function* UpdateActor(action) {
  const result = yield call(callUpdateActor, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_ACTOR_UPDATE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_ACTOR_UPDATE_FAILURE
    });
  }
}

// 배우 수정 백엔드 호출
async function callUpdateActor(data) {
  return await http.patch("/Manager/auth/updateActor", data)
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

function* MOVIE_LIST() {
	yield takeLatest(MANAGER_MOVIE_REQUEST, AllMovie);
}

function* MOVIE_INSERT() {
	yield takeLatest(MANAGER_MOVIE_INSERT_REQUEST, InsertMovie);
}

function* MOVIE_DELETE() {
	yield takeLatest(MANAGER_MOVIE_DELETE_REQUEST, DeleteMovie);
}

function* MOVIE_UPDATE() {
	yield takeLatest(MANAGER_MOVIE_UPDATE_REQUEST, UpdateMovie);
}

function* ACTOR_LIST() {
	yield takeLatest(MANAGER_ACTOR_REQUEST, AllActor);
}

function* ACTOR_INSERT() {
	yield takeLatest(MANAGER_ACTOR_INSERT_REQUEST, InsertActor);
}

function* ACTOR_DELETE() {
	yield takeLatest(MANAGER_ACTOR_DELETE_REQUEST, DeleteActor);
}

function* ACTOR_UPDATE() {
	yield takeLatest(MANAGER_ACTOR_UPDATE_REQUEST, UpdateActor);
}

export default function* S_manager_movie() {
  yield all([fork(MOVIE_LIST), 
		fork(MOVIE_INSERT),
		fork(MOVIE_DELETE),
		fork(MOVIE_UPDATE),
		fork(ACTOR_LIST),
		fork(ACTOR_INSERT),
		fork(ACTOR_DELETE),
		fork(ACTOR_UPDATE)]);
}
