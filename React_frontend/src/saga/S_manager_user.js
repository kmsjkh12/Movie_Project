/*
 23-03-27 관리자 페이지 회원관리 구현(오병주)
 23-03-28 ~ 30 관리자 페이지 예매기록조회 구현(오병주)
 23-03-31 ~ 23-04-01 관리자 페이지 관람평 관리 구현(오병주)
*/
import { call, all, takeLatest, fork, put } from "redux-saga/effects";
import { 
	MANAGER_USER_LIST_REQUEST, MANAGER_USER_LIST_SUCCESS, MANAGER_USER_LIST_FAILURE,
	MANAGER_USER_SEARCH_REQUEST, MANAGER_USER_SEARCH_SUCCESS, MANAGER_USER_SEARCH_FAILURE,
	MANAGER_USER_DROP_REQUEST, MANAGER_USER_DROP_SUCCESS, MANAGER_USER_DROP_FAILURE,
  MANAGER_MOVIE_LIST_REQUEST, MANAGER_MOVIE_LIST_SUCCESS, MANAGER_MOVIE_LIST_FAILURE,
  MANAGER_THEATER_LIST_REQUEST, MANAGER_THEATER_LIST_SUCCESS, MANAGER_THEATER_LIST_FAILURE,
  MANAGER_RESERVE_MOVIE_LIST_REQUEST, MANAGER_RESERVE_MOVIE_LIST_SUCCESS, MANAGER_RESERVE_MOVIE_LIST_FAILURE,
  MANAGER_RESERVE_THEATER_LIST_REQUEST, MANAGER_RESERVE_THEATER_LIST_SUCCESS, MANAGER_RESERVE_THEATER_LIST_FAILURE,
  MANAGER_MOVIE_LIST_COMMENT_REQUEST, MANAGER_MOVIE_LIST_COMMENT_SUCCESS, MANAGER_MOVIE_LIST_COMMENT_FAILURE,
  MANAGER_MOVIE_COMMENT_LIST_REQUEST, MANAGER_MOVIE_COMMENT_LIST_SUCCESS, MANAGER_MOVIE_COMMENT_LIST_FAILURE,
  MANAGER_MOVIE_COMMENT_DELETE_REQUEST, MANAGER_MOVIE_COMMENT_DELETE_SUCCESS, MANAGER_MOVIE_COMMENT_DELETE_FAILURE 
} from "../reducer/R_manager_user";
import { http } from "../lib/http";

// 유저 조회 함수
function* AllUser() {
  const result = yield call(callAllUser);
  if (result.status === 200) {
    yield put({
      type: MANAGER_USER_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_USER_LIST_FAILURE
    });
  }
}

// 유저 조회 백엔드 호출
async function callAllUser() {
  return await http.get("/Manager/auth/allMember")
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 유저 검색 함수
function* SearchUser(action) {
  const result = yield call(callSearchUser, action.data);
  if (result.status === 200) { 
    yield put({
      type: MANAGER_USER_SEARCH_SUCCESS,
      data: result.data
    });
  } 
	else {
    yield put({
      type: MANAGER_USER_SEARCH_FAILURE
    });   
  }
}

// 유저 검색 백엔드 호출
async function callSearchUser(data) {
  return await http.get("/Manager/auth/memberSearch", {
    params: {
			search: data.search,
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

// 유저 추방 함수
function* DropUser(action) {
  const result = yield call(callDropUser, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_USER_DROP_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_USER_DROP_FAILURE
    });
  }
}

// 유저 추방 함수 백엔드 호출
async function callDropUser(data) {
  return await http.delete("/Manager/auth/memberDelete", {
    params: {
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

// 영화 조회 함수
function* AllMovie() {
  const result = yield call(callAllMovie);
  if (result.status === 200) {
    yield put({
      type: MANAGER_MOVIE_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIE_LIST_FAILURE
    });
  }
}

// 영화 조회 백엔드 호출
async function callAllMovie() {
  return await http.get("/Manager/auth/allMovie/Reservation")
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
      type: MANAGER_THEATER_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_THEATER_LIST_FAILURE
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

// 예매기록 조회 함수(영화 선택)
function* AllMovieReserve(action) {
  const result = yield call(callAllMovieReserve, action.data);
  if (result.status === 200) {
    yield put({
      type: MANAGER_RESERVE_MOVIE_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_RESERVE_MOVIE_LIST_FAILURE
    });
  }
}

// 예매기록 조회(영화 선택) 백엔드 호출
async function callAllMovieReserve(data) {
  return await http.get("/Manager/auth/allMovieReserve", {
    params: {
      mid: data.mid
    },
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 예매기록 조회 함수(극장 선택)
function* AllTheaterReserve(action) {
  const result = yield call(callAllTheaterReserve, action.data);
  if (result.status === 200) {
    yield put({
      type: MANAGER_RESERVE_THEATER_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_RESERVE_THEATER_LIST_FAILURE
    });
  }
}

// 예매기록 조회(극장 선택) 백엔드 호출
async function callAllTheaterReserve(data) {
  return await http.get("/Manager/auth/allTheaterReserve", {
    params: {
      tid: data.tid
    },
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 영화 조회 함수(관람평 페이지)
function* AllMovieListComment() {
  // 위에서 사용한 함수 재활용
  const result = yield call(callAllMovie);
  if (result.status === 200) {
    yield put({
      type: MANAGER_MOVIE_LIST_COMMENT_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIE_LIST_COMMENT_FAILURE
    });
  }
}

// 관람평 조회 함수
function* AllMovieComment(action) {
  const result = yield call(callAllMovieComment, action.data);
  if (result.status === 200) {
    yield put({
      type: MANAGER_MOVIE_COMMENT_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIE_COMMENT_LIST_FAILURE
    });
  }
}

// 관람평 조회 백엔드 호출
async function callAllMovieComment(data) {
  return await http.get("/Manager/auth/allMovieComment", {
    params: {
      mid: data.mid
    },
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 관람평 삭제 함수
function* MovieCommentDelete(action) {
  const result = yield call(callMovieCommentDelete, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_MOVIE_COMMENT_DELETE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_MOVIE_COMMENT_DELETE_FAILURE
    });
  }
}

// 관람평 삭제 함수 백엔드 호출
async function callMovieCommentDelete(data) {
  return await http.delete("/Manager/auth/MovieCommentDelete", {
    params: {
      umid: data.umid
    }
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

function* USER_LIST() {
  yield takeLatest(MANAGER_USER_LIST_REQUEST, AllUser);
}

function* USER_SEARCH() {
  yield takeLatest(MANAGER_USER_SEARCH_REQUEST, SearchUser);
}

function* USER_DROP() {
  yield takeLatest(MANAGER_USER_DROP_REQUEST, DropUser);
}

function* MOVIE_LIST() {
  yield takeLatest(MANAGER_MOVIE_LIST_REQUEST, AllMovie);
}

function* THEATER_LIST() {
  yield takeLatest(MANAGER_THEATER_LIST_REQUEST, AllTheater);
}

function* RESERVE_MOVIE_LIST() {
  yield takeLatest(MANAGER_RESERVE_MOVIE_LIST_REQUEST, AllMovieReserve);
}

function* RESERVE_THEATER_LIST() {
  yield takeLatest(MANAGER_RESERVE_THEATER_LIST_REQUEST, AllTheaterReserve);
}

function* MOVIE_LIST_COMMENT() {
  yield takeLatest(MANAGER_MOVIE_LIST_COMMENT_REQUEST, AllMovieListComment);
}

function* MOVIE_COMMENT_LIST() {
  yield takeLatest(MANAGER_MOVIE_COMMENT_LIST_REQUEST, AllMovieComment);
}

function* MOVIE_COMMENT_DELETE() {
  yield takeLatest(MANAGER_MOVIE_COMMENT_DELETE_REQUEST, MovieCommentDelete);
}

export default function* S_manager_user() {
  yield all([fork(USER_LIST),
		fork(USER_SEARCH),
    fork(USER_DROP),
    fork(MOVIE_LIST),
    fork(THEATER_LIST),
    fork(RESERVE_MOVIE_LIST),
    fork(RESERVE_THEATER_LIST),
    fork(MOVIE_LIST_COMMENT),
    fork(MOVIE_COMMENT_LIST),
    fork(MOVIE_COMMENT_DELETE)]);
}
