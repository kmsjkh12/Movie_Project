/*
	23-04-03 ~ 23-04-05 관리자 페이지 상영정보관리 구현(오병주)
*/
// 영화 목록 조회 리스트
export const MANAGER_MOVIEINFO_MOVIE_LIST_REQUEST = "MANAGER_MOVIEINFO_MOVIE_LIST_REQUEST";
export const MANAGER_MOVIEINFO_MOVIE_LIST_SUCCESS = "MANAGER_MOVIEINFO_MOVIE_LIST_SUCCESS";
export const MANAGER_MOVIEINFO_MOVIE_LIST_FAILURE = "MANAGER_MOVIEINFO_MOVIE_LIST_FAILURE";

// 극장 목록 조회 리스트
export const MANAGER_MOVIEINFO_THEATER_LIST_REQUEST = "MANAGER_MOVIEINFO_THEATER_LIST_REQUEST";
export const MANAGER_MOVIEINFO_THEATER_LIST_SUCCESS = "MANAGER_MOVIEINFO_THEATER_LIST_SUCCESS";
export const MANAGER_MOVIEINFO_THEATER_LIST_FAILURE = "MANAGER_MOVIEINFO_THEATER_LIST_FAILURE";
export const MANAGER_MOVIEINFO_THEATER_LIST_RESET = "MANAGER_MOVIEINFO_THEATER_LIST_RESET";

// 상영관 목록 조회 리스트
export const MANAGER_MOVIEINFO_CINEMA_LIST_REQUEST = "MANAGER_MOVIEINFO_CINEMA_LIST_REQUEST";
export const MANAGER_MOVIEINFO_CINEMA_LIST_SUCCESS = "MANAGER_MOVIEINFO_CINEMA_LIST_SUCCESS";
export const MANAGER_MOVIEINFO_CINEMA_LIST_FAILURE = "MANAGER_MOVIEINFO_CINEMA_LIST_FAILURE";

// 상영정보 조회 리스트
export const MANAGER_MOVIEINFO_LIST_REQUEST = "MANAGER_MOVIEINFO_LIST_REQUEST";
export const MANAGER_MOVIEINFO_LIST_SUCCESS = "MANAGER_MOVIEINFO_LIST_SUCCESS";
export const MANAGER_MOVIEINFO_LIST_FAILURE = "MANAGER_MOVIEINFO_LIST_FAILURE";

// 상영정보 추가 리스트
export const MANAGER_MOVIEINFO_INSERT_REQUEST = "MANAGER_MOVIEINFO_INSERT_REQUEST";
export const MANAGER_MOVIEINFO_INSERT_SUCCESS = "MANAGER_MOVIEINFO_INSERT_SUCCESS";
export const MANAGER_MOVIEINFO_INSERT_FAILURE = "MANAGER_MOVIEINFO_INSERT_FAILURE";
export const MANAGER_MOVIEINFO_INSERT_RESET = "MANAGER_MOVIEINFO_INSERT_RESET";

// 상영정보 삭제 리스트
export const MANAGER_MOVIEINFO_DELETE_REQUEST = "MANAGER_MOVIEINFO_DELETE_REQUEST";
export const MANAGER_MOVIEINFO_DELETE_SUCCESS = "MANAGER_MOVIEINFO_DELETE_SUCCESS";
export const MANAGER_MOVIEINFO_DELETE_FAILURE = "MANAGER_MOVIEINFO_DELETE_FAILURE";
export const MANAGER_MOVIEINFO_DELETE_RESET = "MANAGER_MOVIEINFO_DELETE_RESET";

// 상영정보 수정 리스트
export const MANAGER_MOVIEINFO_UPDATE_REQUEST = "MANAGER_MOVIEINFO_UPDATE_REQUEST";
export const MANAGER_MOVIEINFO_UPDATE_SUCCESS = "MANAGER_MOVIEINFO_UPDATE_SUCCESS";
export const MANAGER_MOVIEINFO_UPDATE_FAILURE = "MANAGER_MOVIEINFO_UPDATE_FAILURE";
export const MANAGER_MOVIEINFO_UPDATE_RESET = "MANAGER_MOVIEINFO_UPDATE_RESET";

const initalState = {
  MOVIEINFO_MOVIE_LIST_loading: false,
  MOVIEINFO_MOVIE_LIST_done: false,
  MOVIEINFO_MOVIE_LIST_error: false,
	MOVIEINFO_MOVIE_LIST: [],

	MOVIEINFO_THEATER_LIST_loading: false,
  MOVIEINFO_THEATER_LIST_done: false,
  MOVIEINFO_THEATER_LIST_error: false,
	MOVIEINFO_THEATER_LIST: [],

  MOVIEINFO_CINEMA_LIST_loading: false,
  MOVIEINFO_CINEMA_LIST_done: false,
  MOVIEINFO_CINEMA_LIST_error: false,
	MOVIEINFO_CINEMA_LIST: [],

	MOVIEINFO_LIST_loading: false,
  MOVIEINFO_LIST_done: false,
  MOVIEINFO_LIST_error: false,
	MOVIEINFO_LIST: [],

  MOVIEINFO_INSERT_loading: false,
  MOVIEINFO_INSERT_done: false,
  MOVIEINFO_INSERT_error: false,
	MOVIEINFO_INSERT_state: '',

  MOVIEINFO_DELETE_loading: false,
  MOVIEINFO_DELETE_done: false,
  MOVIEINFO_DELETE_error: false,
	MOVIEINFO_DELETE_state: '',
	
  MOVIEINFO_UPDATE_loading: false,
  MOVIEINFO_UPDATE_done: false,
  MOVIEINFO_UPDATE_error: false,
	MOVIEINFO_UPDATE_state: ''
};

const R_manager_movieinfo = (state = initalState, action) => {
  switch (action.type) {
    // 영화 목록 조회 케이스들
    case MANAGER_MOVIEINFO_MOVIE_LIST_REQUEST:
      return {
        ...state,
        MOVIEINFO_MOVIE_LIST_loading: true,
        MOVIEINFO_MOVIE_LIST_done: false,
        MOVIEINFO_MOVIE_LIST_error: false,
      };
    case MANAGER_MOVIEINFO_MOVIE_LIST_SUCCESS:
      return {
        ...state,
        MOVIEINFO_MOVIE_LIST_loading: false,
        MOVIEINFO_MOVIE_LIST_done: true,
        MOVIEINFO_MOVIE_LIST_error: false,
        MOVIEINFO_MOVIE_LIST: action.data
      };
    case MANAGER_MOVIEINFO_MOVIE_LIST_FAILURE:
      return {
        ...state,
        MOVIEINFO_MOVIE_LIST_loading: false,
        MOVIEINFO_MOVIE_LIST_done: false,
        MOVIEINFO_MOVIE_LIST_error: true,
      };
		// 극장 목록 조회 케이스들
    case MANAGER_MOVIEINFO_THEATER_LIST_REQUEST:
      return {
        ...state,
        MOVIEINFO_THEATER_LIST_loading: true,
        MOVIEINFO_THEATER_LIST_done: false,
        MOVIEINFO_THEATER_LIST_error: false,
      };
    case MANAGER_MOVIEINFO_THEATER_LIST_SUCCESS:
      return {
        ...state,
        MOVIEINFO_THEATER_LIST_loading: false,
        MOVIEINFO_THEATER_LIST_done: true,
        MOVIEINFO_THEATER_LIST_error: false,
        MOVIEINFO_THEATER_LIST: action.data
      };
    case MANAGER_MOVIEINFO_THEATER_LIST_FAILURE:
      return {
        ...state,
        MOVIEINFO_THEATER_LIST_loading: false,
        MOVIEINFO_THEATER_LIST_done: false,
        MOVIEINFO_THEATER_LIST_error: true,
      };
		case MANAGER_MOVIEINFO_THEATER_LIST_RESET:
			return {
				...state,
				MOVIEINFO_THEATER_LIST_loading: false,
				MOVIEINFO_THEATER_LIST_done: false,
				MOVIEINFO_THEATER_LIST_error: false,
				MOVIEINFO_THEATER_LIST: []
			};
    // 상영관 목록 조회 케이스들
    case MANAGER_MOVIEINFO_CINEMA_LIST_REQUEST:
      return {
        ...state,
        MOVIEINFO_CINEMA_LIST_loading: true,
        MOVIEINFO_CINEMA_LIST_done: false,
        MOVIEINFO_CINEMA_LIST_error: false,
      };
    case MANAGER_MOVIEINFO_CINEMA_LIST_SUCCESS:
      return {
        ...state,
        MOVIEINFO_CINEMA_LIST_loading: false,
        MOVIEINFO_CINEMA_LIST_done: true,
        MOVIEINFO_CINEMA_LIST_error: false,
        MOVIEINFO_CINEMA_LIST: action.data
      };
    case MANAGER_MOVIEINFO_CINEMA_LIST_FAILURE:
      return {
        ...state,
        MOVIEINFO_CINEMA_LIST_loading: false,
        MOVIEINFO_CINEMA_LIST_done: false,
        MOVIEINFO_CINEMA_LIST_error: true,
      };
		// 상영정보 조회 케이스들
    case MANAGER_MOVIEINFO_LIST_REQUEST:
      return {
        ...state,
        MOVIEINFO_LIST_loading: true,
        MOVIEINFO_LIST_done: false,
        MOVIEINFO_LIST_error: false,
      };
    case MANAGER_MOVIEINFO_LIST_SUCCESS:
      return {
        ...state,
        MOVIEINFO_LIST_loading: false,
        MOVIEINFO_LIST_done: true,
        MOVIEINFO_LIST_error: false,
        MOVIEINFO_LIST: action.data
      };
    case MANAGER_MOVIEINFO_LIST_FAILURE:
      return {
        ...state,
        MOVIEINFO_LIST_loading: false,
        MOVIEINFO_LIST_done: false,
        MOVIEINFO_LIST_error: true,
      };
    // 상영정보 추가 케이스들
    case MANAGER_MOVIEINFO_INSERT_REQUEST:
      return {
        ...state,
        MOVIEINFO_INSERT_loading: true,
        MOVIEINFO_INSERT_done: false,
        MOVIEINFO_INSERT_error: false,
      };
    case MANAGER_MOVIEINFO_INSERT_SUCCESS:
      return {
        ...state,
        MOVIEINFO_INSERT_loading: false,
        MOVIEINFO_INSERT_done: true,
        MOVIEINFO_INSERT_error: false,
        MOVIEINFO_INSERT_state: action.data
      };
    case MANAGER_MOVIEINFO_INSERT_FAILURE:
      return {
        ...state,
        MOVIEINFO_INSERT_loading: false,
        MOVIEINFO_INSERT_done: false,
        MOVIEINFO_INSERT_error: true,
        MOVIEINFO_INSERT_state: action.data
      };
    case MANAGER_MOVIEINFO_INSERT_RESET:
      return {
        ...state,
        MOVIEINFO_INSERT_loading: false,
        MOVIEINFO_INSERT_done: false,
        MOVIEINFO_INSERT_error: false,
        MOVIEINFO_INSERT_state: ''
      };
    // 상영정보 삭제 케이스들
    case MANAGER_MOVIEINFO_DELETE_REQUEST:
      return {
        ...state,
        MOVIEINFO_DELETE_loading: true,
        MOVIEINFO_DELETE_done: false,
        MOVIEINFO_DELETE_error: false,
      };
    case MANAGER_MOVIEINFO_DELETE_SUCCESS:
      return {
        ...state,
        MOVIEINFO_DELETE_loading: false,
        MOVIEINFO_DELETE_done: true,
        MOVIEINFO_DELETE_error: false,
        MOVIEINFO_DELETE_state: action.data
      };
    case MANAGER_MOVIEINFO_DELETE_FAILURE:
      return {
        ...state,
        MOVIEINFO_DELETE_loading: false,
        MOVIEINFO_DELETE_done: false,
        MOVIEINFO_DELETE_error: true,
        MOVIEINFO_DELETE_state: action.data
      };
    case MANAGER_MOVIEINFO_DELETE_RESET:
      return {
        ...state,
        MOVIEINFO_DELETE_loading: false,
        MOVIEINFO_DELETE_done: false,
        MOVIEINFO_DELETE_error: false,
        MOVIEINFO_DELETE_state: ''
      };  
    // 상영정보 수정 케이스들
    case MANAGER_MOVIEINFO_UPDATE_REQUEST:
      return {
        ...state,
        MOVIEINFO_UPDATE_loading: true,
        MOVIEINFO_UPDATE_done: false,
        MOVIEINFO_UPDATE_error: false,
      };
    case MANAGER_MOVIEINFO_UPDATE_SUCCESS:
      return {
        ...state,
        MOVIEINFO_UPDATE_loading: false,
        MOVIEINFO_UPDATE_done: true,
        MOVIEINFO_UPDATE_error: false,
        MOVIEINFO_UPDATE_state: action.data
      };
    case MANAGER_MOVIEINFO_UPDATE_FAILURE:
      return {
        ...state,
        MOVIEINFO_UPDATE_loading: false,
        MOVIEINFO_UPDATE_done: false,
        MOVIEINFO_UPDATE_error: true,
        MOVIEINFO_UPDATE_state: action.data
      };
    case MANAGER_MOVIEINFO_UPDATE_RESET:
      return {
        ...state,
        MOVIEINFO_UPDATE_loading: false,
        MOVIEINFO_UPDATE_done: false,
        MOVIEINFO_UPDATE_error: false,
        MOVIEINFO_UPDATE_state: ''
      };  
    default:
      return state;
  }
};

export default R_manager_movieinfo;
