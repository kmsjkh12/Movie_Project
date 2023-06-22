/*
	23-05-30 관리자 게시물 페이지 리듀서 수정(오병주)
	23-06-01 관리자 게시물 페이지 리듀서 수정(오병주)
*/
// 게시물 조회 리스트
export const MANAGER_BOARD_LIST_REQUEST = "MANAGER_BOARD_LIST_REQUEST";
export const MANAGER_BOARD_LIST_SUCCESS = "MANAGER_BOARD_LIST_SUCCESS";
export const MANAGER_BOARD_LIST_FAILURE = "MANAGER_BOARD_LIST_FAILURE";

// 게시물 검색 리스트
export const MANAGER_BOARD_SEARCH_REQUEST = "MANAGER_BOARD_SEARCH_REQUEST";
export const MANAGER_BOARD_SEARCH_SUCCESS = "MANAGER_BOARD_SEARCH_SUCCESS";
export const MANAGER_BOARD_SEARCH_FAILURE = "MANAGER_BOARD_SEARCH_FAILURE";

// 게시물 삭제 리스트
export const MANAGER_BOARD_DELETE_REQUEST = "MANAGER_BOARD_DELETE_REQUEST";
export const MANAGER_BOARD_DELETE_SUCCESS = "MANAGER_BOARD_DELETE_SUCCESS";
export const MANAGER_BOARD_DELETE_FAILURE = "MANAGER_BOARD_DELETE_FAILURE";
export const MANAGER_BOARD_DELETE_RESET = "MANAGER_BOARD_DELETE_RESET";

// 게시물 댓글 조회 리스트
export const MANAGER_BOARD_COMMENT_LIST_REQUEST = "MANAGER_BOARD_COMMENT_LIST_REQUEST";
export const MANAGER_BOARD_COMMENT_LIST_SUCCESS = "MANAGER_BOARD_COMMENT_LIST_SUCCESS";
export const MANAGER_BOARD_COMMENT_LIST_FAILURE = "MANAGER_BOARD_COMMENT_LIST_FAILURE";

// 게시물 댓글 삭제 리스트
export const MANAGER_BOARD_COMMENT_DELETE_REQUEST = "MANAGER_BOARD_COMMENT_DELETE_REQUEST";
export const MANAGER_BOARD_COMMENT_DELETE_SUCCESS = "MANAGER_BOARD_COMMENT_DELETE_SUCCESS";
export const MANAGER_BOARD_COMMENT_DELETE_FAILURE = "MANAGER_BOARD_COMMENT_DELETE_FAILURE";
export const MANAGER_BOARD_COMMENT_DELETE_RESET = "MANAGER_BOARD_COMMENT_DELETE_RESET";

// 게시물 답글 삭제 리스트
export const MANAGER_BOARD_COMMENT_REPLY_DELETE_REQUEST = "MANAGER_BOARD_COMMENT_REPLY_DELETE_REQUEST";
export const MANAGER_BOARD_COMMENT_REPLY_DELETE_SUCCESS = "MANAGER_BOARD_COMMENT_REPLY_DELETE_SUCCESS";
export const MANAGER_BOARD_COMMENT_REPLY_DELETE_FAILURE = "MANAGER_BOARD_COMMENT_REPLY_DELETE_FAILURE";
export const MANAGER_BOARD_COMMENT_REPLY_DELETE_RESET = "MANAGER_BOARD_COMMENT_REPLY_DELETE_RESET";

const initalState = {
	MANAGER_BOARD_LIST_loading: false,
  MANAGER_BOARD_LIST_done: false,
  MANAGER_BOARD_LIST_error: false,
	MANAGER_BOARD_LIST: [],

	MANAGER_BOARD_SEARCH_loading: false,
  MANAGER_BOARD_SEARCH_done: false,
  MANAGER_BOARD_SEARCH_error: false,

	MANAGER_BOARD_DELETE_loading: false,
  MANAGER_BOARD_DELETE_done: false,
  MANAGER_BOARD_DELETE_error: false,

	MANAGER_BOARD_COMMENT_LIST_loading: false,
  MANAGER_BOARD_COMMENT_LIST_done: false,
  MANAGER_BOARD_COMMENT_LIST_error: false,
	MANAGER_BOARD_COMMENT_LIST: [],

	MANAGER_BOARD_COMMENT_DELETE_loading: false,
  MANAGER_BOARD_COMMENT_DELETE_done: false,
  MANAGER_BOARD_COMMENT_DELETE_error: false,

	MANAGER_BOARD_COMMENT_REPLY_DELETE_loading: false,
  MANAGER_BOARD_COMMENT_REPLY_DELETE_done: false,
  MANAGER_BOARD_COMMENT_REPLY_DELETE_error: false,
};

const R_manager_board = (state = initalState, action) => {
	switch (action.type) {
		// 게시물 조회 케이스들
    case MANAGER_BOARD_LIST_REQUEST:
      return {
        ...state,
        MANAGER_BOARD_LIST_loading: true,
        MANAGER_BOARD_LIST_done: false,
        MANAGER_BOARD_LIST_error: false
      };
    case MANAGER_BOARD_LIST_SUCCESS:
      return {
        ...state,
        MANAGER_BOARD_LIST_loading: false,
        MANAGER_BOARD_LIST_done: true,
        MANAGER_BOARD_LIST_error: false,
        MANAGER_BOARD_LIST: action.data
      };
    case MANAGER_BOARD_LIST_FAILURE:
      return {
        ...state,
        MANAGER_BOARD_LIST_loading: false,
        MANAGER_BOARD_LIST_done: false,
        MANAGER_BOARD_LIST_error: true
      };
		// 게시물 검색 케이스들
    case MANAGER_BOARD_SEARCH_REQUEST:
      return {
        ...state,
        MANAGER_BOARD_SEARCH_loading: true,
        MANAGER_BOARD_SEARCH_done: false,
        MANAGER_BOARD_SEARCH_error: false
      };
    case MANAGER_BOARD_SEARCH_SUCCESS:
      return {
        ...state,
        MANAGER_BOARD_SEARCH_loading: false,
        MANAGER_BOARD_SEARCH_done: true,
        MANAGER_BOARD_SEARCH_error: false,
        MANAGER_BOARD_LIST: action.data
      };
    case MANAGER_BOARD_SEARCH_FAILURE:
      return {
        ...state,
        MANAGER_BOARD_SEARCH_loading: false,
        MANAGER_BOARD_SEARCH_done: false,
        MANAGER_BOARD_SEARCH_error: true
      };
		// 게시물 삭제 케이스들
    case MANAGER_BOARD_DELETE_REQUEST:
      return {
        ...state,
        MANAGER_BOARD_DELETE_loading: true,
        MANAGER_BOARD_DELETE_done: false,
        MANAGER_BOARD_DELETE_error: false
      };
    case MANAGER_BOARD_DELETE_SUCCESS:
      return {
        ...state,
        MANAGER_BOARD_DELETE_loading: false,
        MANAGER_BOARD_DELETE_done: true,
        MANAGER_BOARD_DELETE_error: false
      };
    case MANAGER_BOARD_DELETE_FAILURE:
      return {
        ...state,
        MANAGER_BOARD_DELETE_loading: false,
        MANAGER_BOARD_DELETE_done: false,
        MANAGER_BOARD_DELETE_error: true
      };
		case MANAGER_BOARD_DELETE_RESET:
			return {
				...state,
				MANAGER_BOARD_DELETE_loading: false,
				MANAGER_BOARD_DELETE_done: false,
				MANAGER_BOARD_DELETE_error: false
			};
		// 게시물 댓글 조회 케이스들
    case MANAGER_BOARD_COMMENT_LIST_REQUEST:
      return {
        ...state,
        MANAGER_BOARD_COMMENT_LIST_loading: true,
        MANAGER_BOARD_COMMENT_LIST_done: false,
        MANAGER_BOARD_COMMENT_LIST_error: false
      };
    case MANAGER_BOARD_COMMENT_LIST_SUCCESS:
      return {
        ...state,
        MANAGER_BOARD_COMMENT_LIST_loading: false,
        MANAGER_BOARD_COMMENT_LIST_done: true,
        MANAGER_BOARD_COMMENT_LIST_error: false,
        MANAGER_BOARD_COMMENT_LIST: action.data
      };
    case MANAGER_BOARD_COMMENT_LIST_FAILURE:
      return {
        ...state,
        MANAGER_BOARD_COMMENT_LIST_loading: false,
        MANAGER_BOARD_COMMENT_LIST_done: false,
        MANAGER_BOARD_COMMENT_LIST_error: true
      };
		// 게시물 댓글 삭제 케이스들
    case MANAGER_BOARD_COMMENT_DELETE_REQUEST:
      return {
        ...state,
        MANAGER_BOARD_COMMENT_DELETE_loading: true,
        MANAGER_BOARD_COMMENT_DELETE_done: false,
        MANAGER_BOARD_COMMENT_DELETE_error: false
      };
    case MANAGER_BOARD_COMMENT_DELETE_SUCCESS:
      return {
        ...state,
        MANAGER_BOARD_COMMENT_DELETE_loading: false,
        MANAGER_BOARD_COMMENT_DELETE_done: true,
        MANAGER_BOARD_COMMENT_DELETE_error: false
      };
    case MANAGER_BOARD_COMMENT_DELETE_FAILURE:
      return {
        ...state,
        MANAGER_BOARD_COMMENT_DELETE_loading: false,
        MANAGER_BOARD_COMMENT_DELETE_done: false,
        MANAGER_BOARD_COMMENT_DELETE_error: true
      };
		case MANAGER_BOARD_COMMENT_DELETE_RESET:
			return {
				...state,
				MANAGER_BOARD_COMMENT_DELETE_loading: false,
				MANAGER_BOARD_COMMENT_DELETE_done: false,
				MANAGER_BOARD_COMMENT_DELETE_error: false
			};
		// 게시물 답글 삭제 케이스들
    case MANAGER_BOARD_COMMENT_REPLY_DELETE_REQUEST:
      return {
        ...state,
        MANAGER_BOARD_COMMENT_REPLY_DELETE_loading: true,
        MANAGER_BOARD_COMMENT_REPLY_DELETE_done: false,
        MANAGER_BOARD_COMMENT_REPLY_DELETE_error: false
      };
    case MANAGER_BOARD_COMMENT_REPLY_DELETE_SUCCESS:
      return {
        ...state,
        MANAGER_BOARD_COMMENT_REPLY_DELETE_loading: false,
        MANAGER_BOARD_COMMENT_REPLY_DELETE_done: true,
        MANAGER_BOARD_COMMENT_REPLY_DELETE_error: false
      };
    case MANAGER_BOARD_COMMENT_REPLY_DELETE_FAILURE:
      return {
        ...state,
        MANAGER_BOARD_COMMENT_REPLY_DELETE_loading: false,
        MANAGER_BOARD_COMMENT_REPLY_DELETE_done: false,
        MANAGER_BOARD_COMMENT_REPLY_DELETE_error: true
      };
		case MANAGER_BOARD_COMMENT_REPLY_DELETE_RESET:
			return {
				...state,
				MANAGER_BOARD_COMMENT_REPLY_DELETE_loading: false,
				MANAGER_BOARD_COMMENT_REPLY_DELETE_done: false,
				MANAGER_BOARD_COMMENT_REPLY_DELETE_error: false
			};
		default:
      return state;
	}
}

export default R_manager_board;