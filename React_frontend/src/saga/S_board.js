/*
	23-05-19 ~ 23, 26, 28 게시물 페이지 수정(오병주)
*/
import { call, all, takeLatest, fork, put } from "redux-saga/effects";
import { 
	BOARD_LIST_REQUEST, BOARD_LIST_SUCCESS, BOARD_LIST_FAILURE,
	BOARD_SEARCH_REQUEST, BOARD_SEARCH_SUCCESS, BOARD_SEARCH_FAILURE,
	BOARD_CONTENT_REQUEST, BOARD_CONTENT_SUCCESS, BOARD_CONTENT_FAILURE,
	BOARD_WRITE_REQUEST, BOARD_WRITE_SUCCESS, BOARD_WRITE_FAILURE,
	BOARD_UPDATE_REQUEST, BOARD_UPDATE_SUCCESS, BOARD_UPDATE_FAILURE,
	BOARD_DELETE_REQUEST, BOARD_DELETE_SUCCESS, BOARD_DELETE_FAILURE,
	BOARD_LIKE_REQUEST, BOARD_LIKE_SUCCESS, BOARD_LIKE_FAILURE,
	BOARD_COMMENT_LIST_REQUEST, BOARD_COMMENT_LIST_SUCCESS, BOARD_COMMENT_LIST_FAILURE,
	BOARD_COMMENT_WRITE_REQUEST, BOARD_COMMENT_WRITE_SUCCESS, BOARD_COMMENT_WRITE_FAILURE,
	BOARD_COMMENT_DELETE_REQUEST, BOARD_COMMENT_DELETE_SUCCESS, BOARD_COMMENT_DELETE_FAILURE,
	BOARD_COMMENT_LIKE_REQUEST, BOARD_COMMENT_LIKE_SUCCESS, BOARD_COMMENT_LIKE_FAILURE,
	BOARD_COMMENT_REPLY_WRITE_REQUEST, BOARD_COMMENT_REPLY_WRITE_SUCCESS, BOARD_COMMENT_REPLY_WRITE_FAILURE,
	BOARD_COMMENT_REPLY_DELETE_REQUEST, BOARD_COMMENT_REPLY_DELETE_SUCCESS, BOARD_COMMENT_REPLY_DELETE_FAILURE
} from "../reducer/R_board";
import { http } from "../lib/http";

// 게시물 조회 함수
function* AllBoard(action) {
  const result = yield call(callAllBoard, action.data);
  if (result.status === 200) {
    yield put({
      type: BOARD_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: BOARD_LIST_FAILURE
    });
  }
}

// 게시물 조회 백엔드 호출
async function callAllBoard(data) {
	return await http.get("/Board/normal/allBoard", {
    params: {
			category: data.category,
      sort: data.sort,
			uid: data.uid,
			page: data.page
		}
	})
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
      type: BOARD_SEARCH_SUCCESS,
      data: result.data
    });
  } 
	else {
    yield put({
      type: BOARD_SEARCH_FAILURE
    });   
  }
}

// 게시물 검색 백엔드 호출
async function callBoardSearch(data) {
  return await http.get("/Board/normal/boardSearch", {
    params: {
			category: data.category,
			title: data.title,
      page: data.page
    }
	})
	.then((response) => {
		return response;
	})
	.catch((error) => {
		return error.response;
	});
}

// 게시물 상세조회 함수
function* BoardContent(action) {
  const result = yield call(callBoardContent, action.data);
  if (result.status === 200) {
    yield put({
      type: BOARD_CONTENT_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: BOARD_CONTENT_FAILURE
    });
  }
}

// 게시물 상세조회 백엔드 호출
async function callBoardContent(data) {
	return await http.get("/Board/normal/boardContent", {
    params: {
			bid: data.bid,
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

// 게시물 작성 함수
function* BoardWrite(action) {
	const result = yield call(callBoardWrite, action.data);
	if (result.status === 204) { 
		yield put({
			type: BOARD_WRITE_SUCCESS
		});
	} 
	else {
		yield put({
			type: BOARD_WRITE_FAILURE
		});   
	}
}

// 게시물 작성 백엔드 호출
async function callBoardWrite(data) {
	return await http.post("/Board/auth/boardWrite", data)
	.then((response) => {
		return response;
	})
	.catch((error) => {
		return error.response;
	});
}

// 게시물 수정 함수
function* BoardUpdate(action) {
	const result = yield call(callBoardUpdate, action.data);
	if (result.status === 204) { 
		yield put({
			type: BOARD_UPDATE_SUCCESS
		});
	} 
	else {
		yield put({
			type: BOARD_UPDATE_FAILURE
		});   
	}
}

// 게시물 수정 백엔드 호출
async function callBoardUpdate(data) {
	return await http.patch("/Board/auth/boardUpdate", data)
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
      type: BOARD_DELETE_SUCCESS
    });
  } 
  else {
    yield put({
			type: BOARD_DELETE_FAILURE
    });
  }
}

// 게시물 삭제 백엔드 호출
async function callBoardDelete(data) {
	return await http.delete("/Board/auth/boardDelete", {
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

// 게시물 좋아요 함수
function* BoardLike(action) {
	const result = yield call(callBoardLike, action.data);
	if (result.status === 200) { 
		yield put({
			type: BOARD_LIKE_SUCCESS,
			data: result.data
		});
	} 
	else {
		yield put({
			type: BOARD_LIKE_FAILURE
		});   
	}
}

// 게시물 좋아요 백엔드 호출
async function callBoardLike(data) {
	return await http.post("/Board/auth/boardLike", data)
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
      type: BOARD_COMMENT_LIST_SUCCESS,
      data: result.data
    });
  } 
  else {
    yield put({
			type: BOARD_COMMENT_LIST_FAILURE
    });
  }
}

// 게시물 댓글 조회 백엔드 호출
async function callAllBoardComment(data) {
	return await http.get("/Board/normal/allComment", {
    params: {
			bid: data.bid,
      sort: data.sort,
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

// 게시물 댓글 작성 함수
function* BoardCommentWrite(action) {
	const result = yield call(callBoardCommentWrite, action.data);
	if (result.status === 204) { 
		yield put({
			type: BOARD_COMMENT_WRITE_SUCCESS
		});
	} 
	else {
		yield put({
			type: BOARD_COMMENT_WRITE_FAILURE
		});   
	}
}

// 게시물 댓글 작성 백엔드 호출
async function callBoardCommentWrite(data) {
	return await http.post("/Board/auth/commentWrite", data)
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
      type: BOARD_COMMENT_DELETE_SUCCESS
    });
  } 
  else {
    yield put({
			type: BOARD_COMMENT_DELETE_FAILURE
    });
  }
}

// 게시물 댓글 삭제 백엔드 호출
async function callBoardCommentDelete(data) {
	return await http.delete("/Board/auth/commentDelete", {
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

// 게시물 댓글 좋아요 함수
function* BoardCommentLike(action) {
	const result = yield call(callBoardCommentLike, action.data);
	if (result.status === 200) { 
		yield put({
			type: BOARD_COMMENT_LIKE_SUCCESS,
			data: result.data
		});
	} 
	else {
		yield put({
			type: BOARD_COMMENT_LIKE_FAILURE
		});   
	}
}

// 게시물 댓글 좋아요 백엔드 호출
async function callBoardCommentLike(data) {
	return await http.post("/Board/auth/commentLike", data)
	.then((response) => {
		return response;
	})
	.catch((error) => {
		return error.response;
	});
}

// 게시물 답글 작성 함수
function* BoardCommentReplyWrite(action) {
	const result = yield call(callBoardCommentReplyWrite, action.data);
	if (result.status === 204) { 
		yield put({
			type: BOARD_COMMENT_REPLY_WRITE_SUCCESS
		});
	} 
	else {
		yield put({
			type: BOARD_COMMENT_REPLY_WRITE_FAILURE
		});   
	}
}

// 게시물 답글 작성 백엔드 호출
async function callBoardCommentReplyWrite(data) {
	return await http.post("/Board/auth/replyWrite", data)
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
      type: BOARD_COMMENT_REPLY_DELETE_SUCCESS
    });
  } 
  else {
    yield put({
			type: BOARD_COMMENT_REPLY_DELETE_FAILURE
    });
  }
}

// 게시물 답글 삭제 백엔드 호출
async function callBoardCommentReplyDelete(data) {
	return await http.delete("/Board/auth/replyDelete", {
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

function* BOARD_LIST() {
	yield takeLatest(BOARD_LIST_REQUEST, AllBoard);
}

function* BOARD_SEARCH() {
	yield takeLatest(BOARD_SEARCH_REQUEST, BoardSearch);
}

function* BOARD_CONTENT() {
	yield takeLatest(BOARD_CONTENT_REQUEST, BoardContent);
}

function* BOARD_WRITE() {
	yield takeLatest(BOARD_WRITE_REQUEST, BoardWrite);
}

function* BOARD_UPDATE() {
	yield takeLatest(BOARD_UPDATE_REQUEST, BoardUpdate);
}

function* BOARD_DELETE() {
	yield takeLatest(BOARD_DELETE_REQUEST, BoardDelete);
}

function* BOARD_LIKE() {
	yield takeLatest(BOARD_LIKE_REQUEST, BoardLike);
}

function* BOARD_COMMENT_LIST() {
	yield takeLatest(BOARD_COMMENT_LIST_REQUEST, AllBoardComment);
}

function* BOARD_COMMENT_WRITE() {
	yield takeLatest(BOARD_COMMENT_WRITE_REQUEST, BoardCommentWrite);
}

function* BOARD_COMMENT_DELETE() {
	yield takeLatest(BOARD_COMMENT_DELETE_REQUEST, BoardCommentDelete);
}

function* BOARD_COMMENT_LIKE() {
	yield takeLatest(BOARD_COMMENT_LIKE_REQUEST, BoardCommentLike);
}

function* BOARD_COMMENT_REPLY_WRITE() {
	yield takeLatest(BOARD_COMMENT_REPLY_WRITE_REQUEST, BoardCommentReplyWrite);
}

function* BOARD_COMMENT_REPLY_DELETE() {
	yield takeLatest(BOARD_COMMENT_REPLY_DELETE_REQUEST, BoardCommentReplyDelete);
}

export default function* S_board() {
	yield all([
		fork(BOARD_LIST), 
		fork(BOARD_SEARCH), 
		fork(BOARD_CONTENT), 
		fork(BOARD_WRITE), 
		fork(BOARD_UPDATE),
		fork(BOARD_DELETE), 
		fork(BOARD_LIKE), 
		fork(BOARD_COMMENT_LIST), 
		fork(BOARD_COMMENT_WRITE), 
		fork(BOARD_COMMENT_DELETE),
		fork(BOARD_COMMENT_LIKE),
		fork(BOARD_COMMENT_REPLY_WRITE),
		fork(BOARD_COMMENT_REPLY_DELETE)
	]);
}