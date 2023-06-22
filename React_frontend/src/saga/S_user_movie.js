/*
 23-02-12 유저 관람평 작성 구현(오병주)
 23-02-25 유저 관람평 작성 수정(오병주)
*/
import { call, all, takeLatest, fork, put } from "redux-saga/effects";
import {
  USER_COMMENT_WRITE_REQUEST,
  USER_COMMENT_WRITE_SUCCESS,
  USER_COMMENT_WRITE_FAILURE,
  USER_COMMENT_DELETE_REQUEST,
  USER_COMMENT_DELETE_SUCCESS,
  USER_COMMENT_DELETE_FAILURE
} from "../reducer/R_user_movie";
import { http } from "../lib/http";

// 관람평 작성 함수
function* CommentInsert(action) {
  const result = yield call(CallCommentInsert, action.data);
  if (result.status === 204) {
    yield put({
      type: USER_COMMENT_WRITE_SUCCESS,
      data: result.status
    });
  } 
  else {
    yield put({
      type: USER_COMMENT_WRITE_FAILURE,
      data: result.data.code
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

// 관람평 삭제 함수
function* CommentDelete(action) {
  const result = yield call(CallCommentDelete, action.data);
  if (result.status === 204) {
    yield put({
      type: USER_COMMENT_DELETE_SUCCESS,
    });
  } 
  else {
    yield put({
      type: USER_COMMENT_DELETE_FAILURE,
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

function* USER_COMMENT_INSERT() {
  yield takeLatest(USER_COMMENT_WRITE_REQUEST, CommentInsert);
}

function* USER_COMMENT_DELETE() {
  yield takeLatest(USER_COMMENT_DELETE_REQUEST, CommentDelete);
}

export default function* S_user_movie() {
  yield all([fork(USER_COMMENT_INSERT), fork(USER_COMMENT_DELETE)]);
}
