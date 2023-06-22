/*
	23-04-03 관리자 페이지 게시물 crud (강경목)
	23-05-30 관리자 게시물 페이지 수정(오병주)
	23-06-01 관리자 게시물 페이지 수정(오병주)
*/
import { call, all, takeLatest, fork, put } from "redux-saga/effects";
import { 
	MANAGER_BOARD_LIST_REQUEST, MANAGER_BOARD_LIST_SUCCESS, MANAGER_BOARD_LIST_FAILURE,
	MANAGER_BOARD_SEARCH_REQUEST, MANAGER_BOARD_SEARCH_SUCCESS, MANAGER_BOARD_SEARCH_FAILURE,
	MANAGER_BOARD_DELETE_REQUEST, MANAGER_BOARD_DELETE_SUCCESS, MANAGER_BOARD_DELETE_FAILURE,
	MANAGER_BOARD_COMMENT_LIST_REQUEST, MANAGER_BOARD_COMMENT_LIST_SUCCESS, MANAGER_BOARD_COMMENT_LIST_FAILURE,
	MANAGER_BOARD_COMMENT_DELETE_REQUEST, MANAGER_BOARD_COMMENT_DELETE_SUCCESS, MANAGER_BOARD_COMMENT_DELETE_FAILURE,
	MANAGER_BOARD_COMMENT_REPLY_DELETE_REQUEST, MANAGER_BOARD_COMMENT_REPLY_DELETE_SUCCESS, MANAGER_BOARD_COMMENT_REPLY_DELETE_FAILURE
} from "../reducer/R_manager_board";
import { http } from "../lib/http";

// 게시물 조회 함수
function* AllBoard() {
  const result = yield call(callAllBoard);
  if (result.status === 200) {
    yield put({
      type: MANAGER_BOARD_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_BOARD_LIST_FAILURE
    });
  }
}

// 게시물 조회 백엔드 호출
async function callAllBoard() {
	return await http.get("/Manager/auth/allBoard")
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 게시물 검색 함수
function* BoardSearch(action) {
  const result = yield call(callBoardSearch, action.data);
  if (result.status === 200) { 
    yield put({
      type: MANAGER_BOARD_SEARCH_SUCCESS,
      data: result.data
    });
  } 
	else {
    yield put({
      type: MANAGER_BOARD_SEARCH_FAILURE
    });   
  }
}

// 게시물 검색 백엔드 호출
async function callBoardSearch(data) {
  return await http.get("/Manager/auth/boardSearch", {
    params: {
			category: data.category,
			title: data.title
    }
	})
	.then((response) => {
		return response;
	})
	.catch((error) => {
		return error.response;
	});
}

// 게시물 삭제 함수
function* BoardDelete(action) {
  const result = yield call(callBoardDelete, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_BOARD_DELETE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_BOARD_DELETE_FAILURE
    });
  }
}

// 게시물 삭제 백엔드 호출
async function callBoardDelete(data) {
	return await http.delete("/Manager/auth/boardDelete", {
    params: {
			bid: data.bid
		}
	})
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 게시물 댓글 조회 함수
function* AllBoardComment(action) {
  const result = yield call(callAllBoardComment, action.data);
  if (result.status === 200) {
    yield put({
      type: MANAGER_BOARD_COMMENT_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: MANAGER_BOARD_COMMENT_LIST_FAILURE
    });
  }
}

// 게시물 댓글 조회 백엔드 호출
async function callAllBoardComment(data) {
	return await http.get("/Manager/auth/allBoardComment", {
    params: {
			bid: data.bid,
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

// 게시물 댓글 삭제 함수
function* BoardCommentDelete(action) {
  const result = yield call(callBoardCommentDelete, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_BOARD_COMMENT_DELETE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_BOARD_COMMENT_DELETE_FAILURE
    });
  }
}

// 게시물 댓글 삭제 백엔드 호출
async function callBoardCommentDelete(data) {
	return await http.delete("/Manager/auth/commentDelete", {
    params: {
			bcid: data.bcid
		}
	})
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

// 게시물 답글 삭제 함수
function* BoardCommentReplyDelete(action) {
  const result = yield call(callBoardCommentReplyDelete, action.data);
  if (result.status === 204) {
    yield put({
      type: MANAGER_BOARD_COMMENT_REPLY_DELETE_SUCCESS
    });
  } 
  else {
    yield put({
			type: MANAGER_BOARD_COMMENT_REPLY_DELETE_FAILURE
    });
  }
}

// 게시물 답글 삭제 백엔드 호출
async function callBoardCommentReplyDelete(data) {
	return await http.delete("/Manager/auth/replyDelete", {
    params: {
			bcid: data.bcid
		}
	})
  .then((response) => {
    return response;
  })
  .catch((error) => {
    return error.response;
  });
}

function* MANAGER_BOARD_LIST() {
	yield takeLatest(MANAGER_BOARD_LIST_REQUEST, AllBoard);
}

function* MANAGER_BOARD_SEARCH() {
	yield takeLatest(MANAGER_BOARD_SEARCH_REQUEST, BoardSearch);
}

function* MANAGER_BOARD_DELETE() {
	yield takeLatest(MANAGER_BOARD_DELETE_REQUEST, BoardDelete);
}

function* MANAGER_BOARD_COMMENT_LIST() {
	yield takeLatest(MANAGER_BOARD_COMMENT_LIST_REQUEST, AllBoardComment);
}

function* MANAGER_BOARD_COMMENT_DELETE() {
	yield takeLatest(MANAGER_BOARD_COMMENT_DELETE_REQUEST, BoardCommentDelete);
}

function* MANAGER_BOARD_COMMENT_REPLY_DELETE() {
	yield takeLatest(MANAGER_BOARD_COMMENT_REPLY_DELETE_REQUEST, BoardCommentReplyDelete);
}

export default function* S_manager_board() {
  yield all([fork(MANAGER_BOARD_LIST), 
		fork(MANAGER_BOARD_SEARCH), 
		fork(MANAGER_BOARD_DELETE),
		fork(MANAGER_BOARD_COMMENT_LIST),
		fork(MANAGER_BOARD_COMMENT_DELETE),
		fork(MANAGER_BOARD_COMMENT_REPLY_DELETE)
	]);
}
