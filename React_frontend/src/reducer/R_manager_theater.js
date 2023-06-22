/*
 23-03-29 영화관에 대한 리듀서 (강경목)
 23-04-17 상영관, 영화관 관리자 페이지 리듀서 수정(오병주)
*/
// 영화관 조회 리스트
export const MANAGER_THEATER_REQUEST = "MANAGER_THEATER_REQUEST";
export const MANAGER_THEATER_SUCCESS = "MANAGER_THEATER_SUCCESS";
export const MANAGER_THEATER_FAILURE = "MANAGER_THEATER_FAILURE";

// 영화관 삽입 리스트
export const MANAGER_THEATER_INSERT_REQUEST = "MANAGER_THEATER_INSERT_REQUEST";
export const MANAGER_THEATER_INSERT_SUCCESS = "MANAGER_THEATER_INSERT_SUCCESS";
export const MANAGER_THEATER_INSERT_FAILURE = "MANAGER_THEATER_INSERT_FAILURE";
export const MANAGER_THEATER_INSERT_RESET = "MANAGER_THEATER_INSERT_RESET";

// 영화관 삭제 리스트
export const MANAGER_THEATER_DELETE_REQUEST = "MANAGER_THEATER_DELETE_REQUEST";
export const MANAGER_THEATER_DELETE_SUCCESS = "MANAGER_THEATER_DELETE_SUCCESS";
export const MANAGER_THEATER_DELETE_FAILURE = "MANAGER_THEATER_DELETE_FAILURE";
export const MANAGER_THEATER_DELETE_RESET = "MANAGER_THEATER_DELETE_RESET";

// 영화관 수정 리스트
export const MANAGER_THEATER_UPDATE_REQUEST = "MANAGER_THEATER_UPDATE_REQUEST";
export const MANAGER_THEATER_UPDATE_SUCCESS = "MANAGER_THEATER_UPDATE_SUCCESS";
export const MANAGER_THEATER_UPDATE_FAILURE = "MANAGER_THEATER_UPDATE_FAILURE";
export const MANAGER_THEATER_UPDATE_RESET = "MANAGER_THEATER_UPDATE_RESET";

// 상영관 조회 리스트
export const MANAGER_CINEMA_REQUEST = "MANAGER_CINEMA_REQUEST";
export const MANAGER_CINEMA_SUCCESS = "MANAGER_CINEMA_SUCCESS";
export const MANAGER_CINEMA_FAILURE = "MANAGER_CINEMA_FAILURE";

// 상영관 삽입 리스트
export const MANAGER_CINEMA_INSERT_REQUEST = "MANAGER_CINEMA_INSERT_REQUEST";
export const MANAGER_CINEMA_INSERT_SUCCESS = "MANAGER_CINEMA_INSERT_SUCCESS";
export const MANAGER_CINEMA_INSERT_FAILURE = "MANAGER_CINEMA_INSERT_FAILURE";
export const MANAGER_CINEMA_INSERT_RESET = "MANAGER_CINEMA_INSERT_RESET";

// 상영관 삭제 리스트
export const MANAGER_CINEMA_DELETE_REQUEST = "MANAGER_CINEMA_DELETE_REQUEST";
export const MANAGER_CINEMA_DELETE_SUCCESS = "MANAGER_CINEMA_DELETE_SUCCESS";
export const MANAGER_CINEMA_DELETE_FAILURE = "MANAGER_CINEMA_DELETE_FAILURE";
export const MANAGER_CINEMA_DELETE_RESET = "MANAGER_CINEMA_DELETE_RESET";

// 상영관 수정 리스트
export const MANAGER_CINEMA_UPDATE_REQUEST = "MANAGER_CINEMA_UPDATE_REQUEST";
export const MANAGER_CINEMA_UPDATE_SUCCESS = "MANAGER_CINEMA_UPDATE_SUCCESS";
export const MANAGER_CINEMA_UPDATE_FAILURE = "MANAGER_CINEMA_UPDATE_FAILURE";
export const MANAGER_CINEMA_UPDATE_RESET = "MANAGER_CINEMA_UPDATE_RESET";

const initalState = {
	THEATER_loading: false,
  THEATER_done: false,
  THEATER_error: false,
	THEATER: [],

	THEATER_INSERT_loading: false,
  THEATER_INSERT_done: false,
  THEATER_INSERT_error: false,

	THEATER_DELETE_loading: false,
  THEATER_DELETE_done: false,
  THEATER_DELETE_error: false,

	THEATER_UPDATE_loading: false,
  THEATER_UPDATE_done: false,
  THEATER_UPDATE_error: false,

	CINEMA_loading: false,
  CINEMA_done: false,
  CINEMA_error: false,
	CINEMA: [],

	CINEMA_INSERT_loading: false,
  CINEMA_INSERT_done: false,
  CINEMA_INSERT_error: false,

	CINEMA_DELETE_loading: false,
  CINEMA_DELETE_done: false,
  CINEMA_DELETE_error: false,

	CINEMA_UPDATE_loading: false,
  CINEMA_UPDATE_done: false,
  CINEMA_UPDATE_error: false
};

const R_manager_theater = (state = initalState, action) => {
	switch (action.type) {
		// 영화관 조회 케이스들
		case MANAGER_THEATER_REQUEST:
			return {
				...state,
				THEATER_loading: true,
				THEATER_done: false,
				THEATER_error: false,
			};
		case MANAGER_THEATER_SUCCESS:
			return {
				...state,
				THEATER_loading: false,
				THEATER_done: true,
				THEATER_error: false,
				THEATER: action.data
			};
		case MANAGER_THEATER_FAILURE:
			return {
				...state,
				THEATER_loading: false,
				THEATER_done: false,
				THEATER_error: true,
			};
		// 영화관 삽입 케이스들
		case MANAGER_THEATER_INSERT_REQUEST:
			return {
				...state,
				THEATER_INSERT_loading: true,
				THEATER_INSERT_done: false,
				THEATER_INSERT_error: false
			};
		case MANAGER_THEATER_INSERT_SUCCESS:
			return {
				...state,
				THEATER_INSERT_loading: false,
				THEATER_INSERT_done: true,
				THEATER_INSERT_error: false
			};
		case MANAGER_THEATER_INSERT_FAILURE:
			return {
				...state,
				THEATER_INSERT_loading: false,
				THEATER_INSERT_done: false,
				THEATER_INSERT_error: true
			};
		case MANAGER_THEATER_INSERT_RESET:
			return {
				...state,
				THEATER_INSERT_loading: false,
				THEATER_INSERT_done: false,
				THEATER_INSERT_error: false
			};
		// 영화관 삭제 케이스들
		case MANAGER_THEATER_DELETE_REQUEST:
			return {
				...state,
				THEATER_DELETE_loading: true,
				THEATER_DELETE_done: false,
				THEATER_DELETE_error: false
			};
		case MANAGER_THEATER_DELETE_SUCCESS:
			return {
				...state,
				THEATER_DELETE_loading: false,
				THEATER_DELETE_done: true,
				THEATER_DELETE_error: false
			};
		case MANAGER_THEATER_DELETE_FAILURE:
			return {
				...state,
				THEATER_DELETE_loading: false,
				THEATER_DELETE_done: false,
				THEATER_DELETE_error: true
			};
		case MANAGER_THEATER_DELETE_RESET:
			return {
				...state,
				THEATER_DELETE_loading: false,
				THEATER_DELETE_done: false,
				THEATER_DELETE_error: false
			};
		// 영화관 수정 케이스들
		case MANAGER_THEATER_UPDATE_REQUEST:
			return {
				...state,
				THEATER_UPDATE_loading: true,
				THEATER_UPDATE_done: false,
				THEATER_UPDATE_error: false
			};
		case MANAGER_THEATER_UPDATE_SUCCESS:
			return {
				...state,
				THEATER_UPDATE_loading: false,
				THEATER_UPDATE_done: true,
				THEATER_UPDATE_error: false
			};
		case MANAGER_THEATER_UPDATE_FAILURE:
			return {
				...state,
				THEATER_UPDATE_loading: false,
				THEATER_UPDATE_done: false,
				THEATER_UPDATE_error: true
			};
		case MANAGER_THEATER_UPDATE_RESET:
			return {
				...state,
				THEATER_UPDATE_loading: false,
				THEATER_UPDATE_done: false,
				THEATER_UPDATE_error: false
			};
		// 상영관 조회 케이스들
		case MANAGER_CINEMA_REQUEST:
			return {
				...state,
				CINEMA_loading: true,
				CINEMA_done: false,
				CINEMA_error: false,
			};
		case MANAGER_CINEMA_SUCCESS:
			return {
				...state,
				CINEMA_loading: false,
				CINEMA_done: true,
				CINEMA_error: false,
				CINEMA: action.data
			};
		case MANAGER_CINEMA_FAILURE:
			return {
				...state,
				CINEMA_loading: false,
				CINEMA_done: false,
				CINEMA_error: true,
			};
		// 상영관 삽입 케이스들
		case MANAGER_CINEMA_INSERT_REQUEST:
			return {
				...state,
				CINEMA_INSERT_loading: true,
				CINEMA_INSERT_done: false,
				CINEMA_INSERT_error: false
			};
		case MANAGER_CINEMA_INSERT_SUCCESS:
			return {
				...state,
				CINEMA_INSERT_loading: false,
				CINEMA_INSERT_done: true,
				CINEMA_INSERT_error: false
			};
		case MANAGER_CINEMA_INSERT_FAILURE:
			return {
				...state,
				CINEMA_INSERT_loading: false,
				CINEMA_INSERT_done: false,
				CINEMA_INSERT_error: true
			};
		case MANAGER_CINEMA_INSERT_RESET:
			return {
				...state,
				CINEMA_INSERT_loading: false,
				CINEMA_INSERT_done: false,
				CINEMA_INSERT_error: false
			};
		// 상영관 삭제 케이스들
		case MANAGER_CINEMA_DELETE_REQUEST:
			return {
				...state,
				CINEMA_DELETE_loading: true,
				CINEMA_DELETE_done: false,
				CINEMA_DELETE_error: false
			};
		case MANAGER_CINEMA_DELETE_SUCCESS:
			return {
				...state,
				CINEMA_DELETE_loading: false,
				CINEMA_DELETE_done: true,
				CINEMA_DELETE_error: false
			};
		case MANAGER_CINEMA_DELETE_FAILURE:
			return {
				...state,
				CINEMA_DELETE_loading: false,
				CINEMA_DELETE_done: false,
				CINEMA_DELETE_error: true
			};
		case MANAGER_CINEMA_DELETE_RESET:
			return {
				...state,
				CINEMA_DELETE_loading: false,
				CINEMA_DELETE_done: false,
				CINEMA_DELETE_error: false
			};
		// 상영관 수정 케이스들
		case MANAGER_CINEMA_UPDATE_REQUEST:
			return {
				...state,
				CINEMA_UPDATE_loading: true,
				CINEMA_UPDATE_done: false,
				CINEMA_UPDATE_error: false
			};
		case MANAGER_CINEMA_UPDATE_SUCCESS:
			return {
				...state,
				CINEMA_UPDATE_loading: false,
				CINEMA_UPDATE_done: true,
				CINEMA_UPDATE_error: false
			};
		case MANAGER_CINEMA_UPDATE_FAILURE:
			return {
				...state,
				CINEMA_UPDATE_loading: false,
				CINEMA_UPDATE_done: false,
				CINEMA_UPDATE_error: true
			};
		case MANAGER_CINEMA_UPDATE_RESET:
			return {
				...state,
				CINEMA_UPDATE_loading: false,
				CINEMA_UPDATE_done: false,
				CINEMA_UPDATE_error: false
			};    
		default:
      return state;
	}
}

export default R_manager_theater;