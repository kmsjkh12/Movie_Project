/*
	23-05-19 ~ 23, 26, 28 게시물 페이지 리듀서 수정(오병주)
*/
// 게시물 조회 리스트
export const BOARD_LIST_REQUEST = "BOARD_LIST_REQUEST";
export const BOARD_LIST_SUCCESS = "BOARD_LIST_SUCCESS";
export const BOARD_LIST_FAILURE = "BOARD_LIST_FAILURE";

// 게시물 검색 리스트
export const BOARD_SEARCH_REQUEST = "BOARD_SEARCH_REQUEST"
export const BOARD_SEARCH_SUCCESS = "BOARD_SEARCH_SUCCESS"
export const BOARD_SEARCH_FAILURE = "BOARD_SEARCH_FAILURE"

// 게시물 상세조회 리스트
export const BOARD_CONTENT_REQUEST = "BOARD_CONTENT_REQUEST";
export const BOARD_CONTENT_SUCCESS = "BOARD_CONTENT_SUCCESS";
export const BOARD_CONTENT_FAILURE = "BOARD_CONTENT_FAILURE";

// 게시물 작성 리스트
export const BOARD_WRITE_REQUEST = "BOARD_WRITE_REQUEST"
export const BOARD_WRITE_SUCCESS = "BOARD_WRITE_SUCCESS"
export const BOARD_WRITE_FAILURE = "BOARD_WRITE_FAILURE"

// 게시물 수정 리스트
export const BOARD_UPDATE_REQUEST = "BOARD_UPDATE_REQUEST"
export const BOARD_UPDATE_SUCCESS = "BOARD_UPDATE_SUCCESS"
export const BOARD_UPDATE_FAILURE = "BOARD_UPDATE_FAILURE"

// 게시물 삭제 리스트
export const BOARD_DELETE_REQUEST = "BOARD_DELETE_REQUEST"
export const BOARD_DELETE_SUCCESS = "BOARD_DELETE_SUCCESS"
export const BOARD_DELETE_FAILURE = "BOARD_DELETE_FAILURE"

// 게시물 좋아요 리스트
export const BOARD_LIKE_REQUEST = "BOARD_LIKE_REQUEST"
export const BOARD_LIKE_SUCCESS = "BOARD_LIKE_SUCCESS"
export const BOARD_LIKE_FAILURE = "BOARD_LIKE_FAILURE"

// 게시물 댓글 조회 리스트
export const BOARD_COMMENT_LIST_REQUEST = "BOARD_COMMENT_LIST_REQUEST";
export const BOARD_COMMENT_LIST_SUCCESS = "BOARD_COMMENT_LIST_SUCCESS";
export const BOARD_COMMENT_LIST_FAILURE = "BOARD_COMMENT_LIST_FAILURE";

// 게시물 댓글 작성 리스트
export const BOARD_COMMENT_WRITE_REQUEST = "BOARD_COMMENT_WRITE_REQUEST";
export const BOARD_COMMENT_WRITE_SUCCESS = "BOARD_COMMENT_WRITE_SUCCESS";
export const BOARD_COMMENT_WRITE_FAILURE = "BOARD_COMMENT_WRITE_FAILURE";
export const BOARD_COMMENT_WRITE_RESET = "BOARD_COMMENT_WRITE_RESET";

// 게시물 댓글 삭제 리스트
export const BOARD_COMMENT_DELETE_REQUEST = "BOARD_COMMENT_DELETE_REQUEST";
export const BOARD_COMMENT_DELETE_SUCCESS = "BOARD_COMMENT_DELETE_SUCCESS";
export const BOARD_COMMENT_DELETE_FAILURE = "BOARD_COMMENT_DELETE_FAILURE";
export const BOARD_COMMENT_DELETE_RESET = "BOARD_COMMENT_DELETE_RESET";

// 게시물 댓글 좋아요 리스트
export const BOARD_COMMENT_LIKE_REQUEST = "BOARD_COMMENT_LIKE_REQUEST";
export const BOARD_COMMENT_LIKE_SUCCESS = "BOARD_COMMENT_LIKE_SUCCESS";
export const BOARD_COMMENT_LIKE_FAILURE = "BOARD_COMMENT_LIKE_FAILURE";

// 게시물 답글 작성 리스트
export const BOARD_COMMENT_REPLY_WRITE_REQUEST = "BOARD_COMMENT_REPLY_WRITE_REQUEST";
export const BOARD_COMMENT_REPLY_WRITE_SUCCESS = "BOARD_COMMENT_REPLY_WRITE_SUCCESS";
export const BOARD_COMMENT_REPLY_WRITE_FAILURE = "BOARD_COMMENT_REPLY_WRITE_FAILURE";
export const BOARD_COMMENT_REPLY_WRITE_RESET = "BOARD_COMMENT_REPLY_WRITE_RESET";

// 게시물 답글 삭제 리스트
export const BOARD_COMMENT_REPLY_DELETE_REQUEST = "BOARD_COMMENT_REPLY_DELETE_REQUEST";
export const BOARD_COMMENT_REPLY_DELETE_SUCCESS = "BOARD_COMMENT_REPLY_DELETE_SUCCESS";
export const BOARD_COMMENT_REPLY_DELETE_FAILURE = "BOARD_COMMENT_REPLY_DELETE_FAILURE";
export const BOARD_COMMENT_REPLY_DELETE_RESET = "BOARD_COMMENT_REPLY_DELETE_RESET";

// 게시글 답글 입력칸 상태 리스트
export const BOARD_REPLY_KEY_SETTING = "BOARD_REPLY_KEY_SETTING";

const initalState = {
	BOARD_LIST_loading: false,
  BOARD_LIST_done: false,
  BOARD_LIST_error: false,
	BOARD_LIST: [],
	
	BOARD_SEARCH_loading: false,
  BOARD_SEARCH_done: false,
  BOARD_SEARCH_error: false,
	BOARD_SEARCH_LIST: [],

	BOARD_CONTENT_loading: false,
  BOARD_CONTENT_done: false,
  BOARD_CONTENT_error: false,
	BOARD_CONTENT: [],

	BOARD_WRITE_loading: false,
  BOARD_WRITE_done: false,
  BOARD_WRITE_error: false,

	BOARD_UPDATE_loading: false,
  BOARD_UPDATE_done: false,
  BOARD_UPDATE_error: false,

	BOARD_DELETE_loading: false,
  BOARD_DELETE_done: false,
  BOARD_DELETE_error: false,

	BOARD_LIKE_loading: false,
  BOARD_LIKE_done: false,
  BOARD_LIKE_error: false,

	BOARD_COMMENT_LIST_loading: false,
  BOARD_COMMENT_LIST_done: false,
  BOARD_COMMENT_LIST_error: false,
	BOARD_COMMENT_LIST: [],

	BOARD_COMMENT_WRITE_loading: false,
  BOARD_COMMENT_WRITE_done: false,
  BOARD_COMMENT_WRITE_error: false,

	BOARD_COMMENT_DELETE_loading: false,
  BOARD_COMMENT_DELETE_done: false,
  BOARD_COMMENT_DELETE_error: false,

	BOARD_COMMENT_LIKE_loading: false,
  BOARD_COMMENT_LIKE_done: false,
  BOARD_COMMENT_LIKE_error: false,

	BOARD_COMMENT_REPLY_WRITE_loading: false,
  BOARD_COMMENT_REPLY_WRITE_done: false,
  BOARD_COMMENT_REPLY_WRITE_error: false,

	BOARD_COMMENT_REPLY_DELETE_loading: false,
  BOARD_COMMENT_REPLY_DELETE_done: false,
  BOARD_COMMENT_REPLY_DELETE_error: false,

	// 답글 입력칸 상태
	BOARD_Reply_Id: '',
};

const R_board = (state = initalState, action) => {
	switch (action.type) {
		// 게시물 조회 케이스들
    case BOARD_LIST_REQUEST:
      return {
        ...state,
        BOARD_LIST_loading: true,
        BOARD_LIST_done: false,
        BOARD_LIST_error: false
      };
    case BOARD_LIST_SUCCESS:
      return {
        ...state,
        BOARD_LIST_loading: false,
        BOARD_LIST_done: true,
        BOARD_LIST_error: false,
        BOARD_LIST: action.data
      };
    case BOARD_LIST_FAILURE:
      return {
        ...state,
        BOARD_LIST_loading: false,
        BOARD_LIST_done: false,
        BOARD_LIST_error: true
      };
		// 게시물 검색 케이스들
    case BOARD_SEARCH_REQUEST:
      return {
        ...state,
        BOARD_SEARCH_loading: true,
        BOARD_SEARCH_done: false,
        BOARD_SEARCH_error: false
      };
    case BOARD_SEARCH_SUCCESS:
      return {
        ...state,
        BOARD_SEARCH_loading: false,
        BOARD_SEARCH_done: true,
        BOARD_SEARCH_error: false,
        BOARD_SEARCH_LIST: action.data
      };
    case BOARD_SEARCH_FAILURE:
      return {
        ...state,
        BOARD_SEARCH_loading: false,
        BOARD_SEARCH_done: false,
        BOARD_SEARCH_error: true
      };
		// 게시물 상세조회 케이스들
    case BOARD_CONTENT_REQUEST:
      return {
        ...state,
        BOARD_CONTENT_loading: true,
        BOARD_CONTENT_done: false,
        BOARD_CONTENT_error: false
      };
    case BOARD_CONTENT_SUCCESS:
      return {
        ...state,
        BOARD_CONTENT_loading: false,
        BOARD_CONTENT_done: true,
        BOARD_CONTENT_error: false,
        BOARD_CONTENT: action.data
      };
    case BOARD_CONTENT_FAILURE:
      return {
        ...state,
        BOARD_CONTENT_loading: false,
        BOARD_CONTENT_done: false,
        BOARD_CONTENT_error: true
      };
		// 게시물 작성 케이스들
		case BOARD_WRITE_REQUEST:
			return {
				...state,
				BOARD_WRITE_loading: true,
				BOARD_WRITE_done: false,
				BOARD_WRITE_error: false
			};
		case BOARD_WRITE_SUCCESS:
			return {
				...state,
				BOARD_WRITE_loading: false,
				BOARD_WRITE_done: true,
				BOARD_WRITE_error: false
			};
		case BOARD_WRITE_FAILURE:
			return {
				...state,
				BOARD_WRITE_loading: false,
				BOARD_WRITE_done: false,
				BOARD_WRITE_error: true
			};
		// 게시물 수정 케이스들
		case BOARD_UPDATE_REQUEST:
			return {
				...state,
				BOARD_UPDATE_loading: true,
				BOARD_UPDATE_done: false,
				BOARD_UPDATE_error: false
			};
		case BOARD_UPDATE_SUCCESS:
			return {
				...state,
				BOARD_UPDATE_loading: false,
				BOARD_UPDATE_done: true,
				BOARD_UPDATE_error: false
			};
		case BOARD_UPDATE_FAILURE:
			return {
				...state,
				BOARD_UPDATE_loading: false,
				BOARD_UPDATE_done: false,
				BOARD_UPDATE_error: true
			};
		// 게시물 삭제 케이스들
		case BOARD_DELETE_REQUEST:
			return {
				...state,
				BOARD_DELETE_loading: true,
				BOARD_DELETE_done: false,
				BOARD_DELETE_error: false
			};
		case BOARD_DELETE_SUCCESS:
			return {
				...state,
				BOARD_DELETE_loading: false,
				BOARD_DELETE_done: true,
				BOARD_DELETE_error: false
			};
		case BOARD_DELETE_FAILURE:
			return {
				...state,
				BOARD_DELETE_loading: false,
				BOARD_DELETE_done: false,
				BOARD_DELETE_error: true
			};
		// 게시물 좋아요 케이스들
		case BOARD_LIKE_REQUEST:
			return {
				...state,
				BOARD_LIKE_loading: true,
				BOARD_LIKE_done: false,
				BOARD_LIKE_error: false
			};
		case BOARD_LIKE_SUCCESS:
			return {
				...state,
				BOARD_LIKE_loading: false,
				BOARD_LIKE_done: true,
				BOARD_LIKE_error: false,
				BOARD_CONTENT : {
					...state.BOARD_CONTENT,
					like: action.data.like,
					unlike: action.data.unlike,
					likes: action.data.likes, 
					unlikes: action.data.unlikes
				}
			}		
		case BOARD_LIKE_FAILURE:
			return {
				...state,
				BOARD_LIKE_loading: false,
				BOARD_LIKE_done: false,
				BOARD_LIKE_error: true
			}; 
		// 게시물 댓글 조회 케이스들
    case BOARD_COMMENT_LIST_REQUEST:
      return {
        ...state,
        BOARD_COMMENT_LIST_loading: true,
        BOARD_COMMENT_LIST_done: false,
        BOARD_COMMENT_LIST_error: false
      };
    case BOARD_COMMENT_LIST_SUCCESS:
			let origin = state.BOARD_CONTENT.commentCounts;
			let newdata = action.data.count;
			if (origin !== newdata) {
				origin = newdata;
			}

      return {
        ...state,
        BOARD_COMMENT_LIST_loading: false,
        BOARD_COMMENT_LIST_done: true,
        BOARD_COMMENT_LIST_error: false,
        BOARD_COMMENT_LIST: action.data,
				BOARD_CONTENT: {...state.BOARD_CONTENT, commentCounts: origin}
      };
    case BOARD_COMMENT_LIST_FAILURE:
      return {
        ...state,
        BOARD_COMMENT_LIST_loading: false,
        BOARD_COMMENT_LIST_done: false,
        BOARD_COMMENT_LIST_error: true
      };
		// 게시물 댓글 작성 케이스들
    case BOARD_COMMENT_WRITE_REQUEST:
      return {
        ...state,
        BOARD_COMMENT_WRITE_loading: true,
        BOARD_COMMENT_WRITE_done: false,
        BOARD_COMMENT_WRITE_error: false
      };
    case BOARD_COMMENT_WRITE_SUCCESS:
      return {
        ...state,
        BOARD_COMMENT_WRITE_loading: false,
        BOARD_COMMENT_WRITE_done: true,
        BOARD_COMMENT_WRITE_error: false
      };
    case BOARD_COMMENT_WRITE_FAILURE:
      return {
        ...state,
        BOARD_COMMENT_WRITE_loading: false,
        BOARD_COMMENT_WRITE_done: false,
        BOARD_COMMENT_WRITE_error: true
      };
		case BOARD_COMMENT_WRITE_RESET:
			return {
				...state,
				BOARD_COMMENT_WRITE_loading: false,
				BOARD_COMMENT_WRITE_done: false,
				BOARD_COMMENT_WRITE_error: false
			};
		// 게시물 댓글 삭제 케이스들
    case BOARD_COMMENT_DELETE_REQUEST:
      return {
        ...state,
        BOARD_COMMENT_DELETE_loading: true,
        BOARD_COMMENT_DELETE_done: false,
        BOARD_COMMENT_DELETE_error: false
      };
    case BOARD_COMMENT_DELETE_SUCCESS:
      return {
        ...state,
        BOARD_COMMENT_DELETE_loading: false,
        BOARD_COMMENT_DELETE_done: true,
        BOARD_COMMENT_DELETE_error: false
      };
    case BOARD_COMMENT_DELETE_FAILURE:
      return {
        ...state,
        BOARD_COMMENT_DELETE_loading: false,
        BOARD_COMMENT_DELETE_done: false,
        BOARD_COMMENT_DELETE_error: true
      };
		case BOARD_COMMENT_DELETE_RESET:
			return {
				...state,
				BOARD_COMMENT_DELETE_loading: false,
				BOARD_COMMENT_DELETE_done: false,
				BOARD_COMMENT_DELETE_error: false
			};
		// 게시물 댓글 좋아요 케이스들
		case BOARD_COMMENT_LIKE_REQUEST:
			return {
				...state,
				BOARD_COMMENT_LIKE_loading: true,
				BOARD_COMMENT_LIKE_done: false,
				BOARD_COMMENT_LIKE_error: false
			};
		case BOARD_COMMENT_LIKE_SUCCESS:
			const temp = state.BOARD_COMMENT_LIST.content.map(comment =>
				comment.bcid === action.data.bcid ? {
					...comment,
					like: action.data.like,
					unlike: action.data.unlike,
					likes: action.data.likes, 
					unlikes: action.data.unlikes 
				} : comment
			)
			const list = {...state.BOARD_COMMENT_LIST, content: temp}

			return {
				...state,
				BOARD_COMMENT_LIKE_loading: false,
				BOARD_COMMENT_LIKE_done: true,
				BOARD_COMMENT_LIKE_error: false,
				BOARD_COMMENT_LIST: list
			}		
		case BOARD_COMMENT_LIKE_FAILURE:
			return {
				...state,
				BOARD_COMMENT_LIKE_loading: false,
				BOARD_COMMENT_LIKE_done: false,
				BOARD_COMMENT_LIKE_error: true
			};
		// 게시물 답글 작성 케이스들
    case BOARD_COMMENT_REPLY_WRITE_REQUEST:
      return {
        ...state,
        BOARD_COMMENT_REPLY_WRITE_loading: true,
        BOARD_COMMENT_REPLY_WRITE_done: false,
        BOARD_COMMENT_REPLY_WRITE_error: false
      };
    case BOARD_COMMENT_REPLY_WRITE_SUCCESS:
      return {
        ...state,
        BOARD_COMMENT_REPLY_WRITE_loading: false,
        BOARD_COMMENT_REPLY_WRITE_done: true,
        BOARD_COMMENT_REPLY_WRITE_error: false
      };
    case BOARD_COMMENT_REPLY_WRITE_FAILURE:
      return {
        ...state,
        BOARD_COMMENT_REPLY_WRITE_loading: false,
        BOARD_COMMENT_REPLY_WRITE_done: false,
        BOARD_COMMENT_REPLY_WRITE_error: true
      };
		case BOARD_COMMENT_REPLY_WRITE_RESET:
			return {
				...state,
				BOARD_COMMENT_REPLY_WRITE_loading: false,
				BOARD_COMMENT_REPLY_WRITE_done: false,
				BOARD_COMMENT_REPLY_WRITE_error: false
			};
		// 게시물 답글 삭제 케이스들
    case BOARD_COMMENT_REPLY_DELETE_REQUEST:
      return {
        ...state,
        BOARD_COMMENT_REPLY_DELETE_loading: true,
        BOARD_COMMENT_REPLY_DELETE_done: false,
        BOARD_COMMENT_REPLY_DELETE_error: false
      };
    case BOARD_COMMENT_REPLY_DELETE_SUCCESS:
      return {
        ...state,
        BOARD_COMMENT_REPLY_DELETE_loading: false,
        BOARD_COMMENT_REPLY_DELETE_done: true,
        BOARD_COMMENT_REPLY_DELETE_error: false
      };
    case BOARD_COMMENT_REPLY_DELETE_FAILURE:
      return {
        ...state,
        BOARD_COMMENT_REPLY_DELETE_loading: false,
        BOARD_COMMENT_REPLY_DELETE_done: false,
        BOARD_COMMENT_REPLY_DELETE_error: true
      };
		case BOARD_COMMENT_REPLY_DELETE_RESET:
			return {
				...state,
				BOARD_COMMENT_REPLY_DELETE_loading: false,
				BOARD_COMMENT_REPLY_DELETE_done: false,
				BOARD_COMMENT_REPLY_DELETE_error: false
			};
		// 답글 입력칸 띄우는 케이스
		case BOARD_REPLY_KEY_SETTING:
			return {
				...state,
				BOARD_Reply_Id: action.data,
				BOARD_COMMENT_LIST_done: false
			};
		default:
			return state;
	}
};

export default R_board;
  