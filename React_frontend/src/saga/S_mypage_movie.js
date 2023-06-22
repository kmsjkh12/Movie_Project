/*
 23-03-17 마이페이지 영화 함수들 구현(오병주)
*/
import { call, all, takeLatest, fork, put } from "redux-saga/effects";
import { 
	USER_MOVIE_POSSIBLE_REQUEST,
	USER_MOVIE_POSSIBLE_SUCCESS,
	USER_MOVIE_POSSIBLE_FAILURE,
  USER_MY_COMMENT_WRITE_REQUEST,
	USER_MY_COMMENT_WRITE_SUCCESS,
	USER_MY_COMMENT_WRITE_FAILURE,
  USER_MY_COMMENT_SEARCH_REQUEST,
	USER_MY_COMMENT_SEARCH_SUCCESS,
	USER_MY_COMMENT_SEARCH_FAILURE,
  USER_MY_COMMENT_LIKE_REQUEST,
  USER_MY_COMMENT_LIKE_SUCCESS,
  USER_MY_COMMENT_LIKE_FAILURE,
  USER_MY_COMMENT_DELETE_REQUEST,
  USER_MY_COMMENT_DELETE_SUCCESS,
  USER_MY_COMMENT_DELETE_FAILURE
} from "../reducer/R_mypage_movie";
import { http } from "../lib/http";

// 관람평 작성가능 영화 조회 함수
function* Possible_movie() {
  const result = yield call(Possible_movie_call);
  if (result.status === 200) {
    yield put({
      type: USER_MOVIE_POSSIBLE_SUCCESS,
      data: result.data,
    });
  } 
  else {
    yield put({
      type: USER_MOVIE_POSSIBLE_FAILURE
    });
  }
}

// 관람평 작성가능 영화 조회 백엔드 호출
async function Possible_movie_call() {
  return await http
    .get("/MyPageMovie/auth/moviePossible")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

// 마이페이지 관람평 작성 함수
function* CommentInsert(action) {
  const result = yield call(CallCommentInsert, action.data);
  if (result.status === 204) {
    yield put({
      type: USER_MY_COMMENT_WRITE_SUCCESS,
      data: result.status
    });
  } 
  else {
    yield put({
      type: USER_MY_COMMENT_WRITE_FAILURE,
      data: result.status
    });
  }
}

// 관람평 내용을 전달한 뒤 저장(백엔드 연결)
async function CallCommentInsert(data) {
  return await http.post("/MovieMember/auth/InsertComment", data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

// 작성한 관람평 조회 함수
function* CommentSearch() {
  const result = yield call(CallCommentSearch);
  if (result.status === 200) {
    yield put({
      type: USER_MY_COMMENT_SEARCH_SUCCESS,
      data: result.data,
    });
  } 
  else {
    yield put({
      type: USER_MY_COMMENT_SEARCH_FAILURE
    });
  }
}

// 작성한 관람평 조회 백엔드 호출
async function CallCommentSearch() {
  return await http
    .get("/MyPageMovie/auth/GetComment")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

// 관람평 좋아요 toggle 함수
function* CommentLike(action) {
  const result = yield call(CallCommentLike, action.data);
  if (result.status === 200) {
    yield put({
      type: USER_MY_COMMENT_LIKE_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
      type: USER_MY_COMMENT_LIKE_FAILURE,
      data: action.data
    });
  }
}

// 유저 정보를 전달한 뒤 관람평 좋아요 기록 변경(백엔드 연결)
async function CallCommentLike(data) {
  return await http.post("/MovieMember/auth/CommentLikeToggle", data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

// 관람평 삭제 함수
function* CommentDelete(action) {
  const result = yield call(CallCommentDelete, action.data);
  if (result.status === 204) {
    yield put({
      type: USER_MY_COMMENT_DELETE_SUCCESS,
      data: action.data
    });
  } 
  else {
    yield put({
      type: USER_MY_COMMENT_DELETE_FAILURE,
      data: action.data
    });
  }
}

// 관람평 정보를 전달한 뒤 관람평 제거(백엔드 연결)
async function CallCommentDelete(data) {
  return await http.delete("/MovieMember/auth/CommentDelete",{
    params: {
      umid: data
    }
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

function* USER_POSSIBLE() {
  yield takeLatest(USER_MOVIE_POSSIBLE_REQUEST, Possible_movie);
}

function* USER_WRITE() {
  yield takeLatest(USER_MY_COMMENT_WRITE_REQUEST, CommentInsert);
}

function* USER_SEARCH() {
  yield takeLatest(USER_MY_COMMENT_SEARCH_REQUEST, CommentSearch);
}

function* USER_LIKE() {
  yield takeLatest(USER_MY_COMMENT_LIKE_REQUEST, CommentLike);
}

function* USER_DELETE() {
  yield takeLatest(USER_MY_COMMENT_DELETE_REQUEST, CommentDelete);
}

export default function* S_mypage_movie() {
  yield all([fork(USER_POSSIBLE), 
		fork(USER_WRITE), 
		fork(USER_SEARCH), 
		fork(USER_LIKE), 
		fork(USER_DELETE)]);
}
