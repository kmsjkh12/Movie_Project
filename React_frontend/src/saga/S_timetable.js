/*
	23-04-22 ~ 24 상영시간표 페이지 수정(오병주)
*/
import { call, all, takeLatest, fork, put } from "redux-saga/effects";
import { 
	TIMETABLE_MOVIE_LIST_REQUEST, TIMETABLE_MOVIE_LIST_SUCCESS, TIMETABLE_MOVIE_LIST_FAILURE,
	TIMETABLE_THEATER_LIST_REQUEST, TIMETABLE_THEATER_LIST_SUCCESS, TIMETABLE_THEATER_LIST_FAILURE,
	TIMETABLE_DAY_LIST_REQUEST, TIMETABLE_DAY_LIST_SUCCESS, TIMETABLE_DAY_LIST_FAILURE,
	TIMETABLE_MOVIEINFO_LIST_MOVIE_REQUEST, TIMETABLE_MOVIEINFO_LIST_MOVIE_SUCCESS, TIMETABLE_MOVIEINFO_LIST_MOVIE_FAILURE,
	TIMETABLE_MOVIEINFO_LIST_THEATER_REQUEST, TIMETABLE_MOVIEINFO_LIST_THEATER_SUCCESS, TIMETABLE_MOVIEINFO_LIST_THEATER_FAILURE
} from "../reducer/R_timetable";
import { http } from "../lib/http";

// 예매 가능한 영화 조회 함수
function* MovieSearch() {
  const result = yield call(callMovieSearch);
  if (result.status === 200) {
    yield put({
      type: TIMETABLE_MOVIE_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: TIMETABLE_MOVIE_LIST_FAILURE
    });
  }
}

// 예매 가능한 영화 조회 백엔드 호출
async function callMovieSearch() {
  return await http.get("/Movie/normal/ReservePossibleDESC")
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 예매 가능한 극장 조회 함수
function* TheaterSearch() {
  const result = yield call(callTheaterSearch);
  if (result.status === 200) {
    yield put({
      type: TIMETABLE_THEATER_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: TIMETABLE_THEATER_LIST_FAILURE
    });
  }
}

// 예매 가능한 극장 조회 백엔드 호출
async function callTheaterSearch() {
  return await http.get("/Theater/normal/ReservePossible")
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
      type: TIMETABLE_DAY_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: TIMETABLE_DAY_LIST_FAILURE
    });
  }
}

// 날짜 조회 백엔드 호출
async function callDaySearch(data) {
  return await http.get("/MovieInfo/normal/findDay", {
    params: {
      mid: data.mid,
      tarea: data.tarea,
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

// 상영정보 조회(영화선택) 함수
function* MovieInfoByMovieSearch(action) {
  const result = yield call(callMovieInfoByMovieSearch, action.data);
  if (result.status === 200) {
    yield put({
      type: TIMETABLE_MOVIEINFO_LIST_MOVIE_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: TIMETABLE_MOVIEINFO_LIST_MOVIE_FAILURE
    });
  }
}

// 상영정보 조회(영화선택) 백엔드 호출
async function callMovieInfoByMovieSearch(data) {
  return await http.get("/MovieInfo/normal/timeTableByMovie", {
    params: {
      mid: data.mid,
			miday: data.miday,
      tarea: data.tarea,
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

// 상영정보 조회(극장선택) 함수
function* MovieInfoByTheaterSearch(action) {
  const result = yield call(callMovieInfoByTheaterSearch, action.data);
  if (result.status === 200) {
    yield put({
      type: TIMETABLE_MOVIEINFO_LIST_THEATER_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: TIMETABLE_MOVIEINFO_LIST_THEATER_FAILURE
    });
  }
}

// 상영정보 조회(극장선택) 백엔드 호출
async function callMovieInfoByTheaterSearch(data) {
  return await http.get("/MovieInfo/normal/timeTableByTheater", {
    params: {
      tid: data.tid,
			miday: data.miday,
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

function* MOVIE_LIST() {
  yield takeLatest(TIMETABLE_MOVIE_LIST_REQUEST, MovieSearch);
}

function* THEATER_LIST() {
  yield takeLatest(TIMETABLE_THEATER_LIST_REQUEST, TheaterSearch);
}

function* DAY_LIST() {
  yield takeLatest(TIMETABLE_DAY_LIST_REQUEST, DaySearch);
}

function* MOVIEINFO_LIST_MOVIE() {
  yield takeLatest(TIMETABLE_MOVIEINFO_LIST_MOVIE_REQUEST, MovieInfoByMovieSearch);
}

function* MOVIEINFO_LIST_THEATER() {
  yield takeLatest(TIMETABLE_MOVIEINFO_LIST_THEATER_REQUEST, MovieInfoByTheaterSearch);
}

export default function* S_timetable() {
	yield all([fork(MOVIE_LIST),
		fork(THEATER_LIST),
		fork(DAY_LIST),
		fork(MOVIEINFO_LIST_MOVIE),
		fork(MOVIEINFO_LIST_THEATER)]);
}
