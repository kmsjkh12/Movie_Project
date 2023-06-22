/*
	23-04-18 ~ 19 영화 관리자 페이지 리듀서 수정(오병주)
*/
// 영화 조회 리스트
export const MANAGER_MOVIE_REQUEST = "MANAGER_MOVIE_REQUEST";
export const MANAGER_MOVIE_SUCCESS = "MANAGER_MOVIE_SUCCESS";
export const MANAGER_MOVIE_FAILURE = "MANAGER_MOVIE_FAILURE";

// 영화 삽입 리스트
export const MANAGER_MOVIE_INSERT_REQUEST = "MANAGER_MOVIE_INSERT_REQUEST";
export const MANAGER_MOVIE_INSERT_SUCCESS = "MANAGER_MOVIE_INSERT_SUCCESS";
export const MANAGER_MOVIE_INSERT_FAILURE = "MANAGER_MOVIE_INSERT_FAILURE";
export const MANAGER_MOVIE_INSERT_RESET = "MANAGER_MOVIE_INSERT_RESET";

// 영화 삭제 리스트
export const MANAGER_MOVIE_DELETE_REQUEST = "MANAGER_MOVIE_DELETE_REQUEST";
export const MANAGER_MOVIE_DELETE_SUCCESS = "MANAGER_MOVIE_DELETE_SUCCESS";
export const MANAGER_MOVIE_DELETE_FAILURE = "MANAGER_MOVIE_DELETE_FAILURE";
export const MANAGER_MOVIE_DELETE_RESET = "MANAGER_MOVIE_DELETE_RESET";

// 영화 수정 리스트
export const MANAGER_MOVIE_UPDATE_REQUEST = "MANAGER_MOVIE_UPDATE_REQUEST";
export const MANAGER_MOVIE_UPDATE_SUCCESS = "MANAGER_MOVIE_UPDATE_SUCCESS";
export const MANAGER_MOVIE_UPDATE_FAILURE = "MANAGER_MOVIE_UPDATE_FAILURE";
export const MANAGER_MOVIE_UPDATE_RESET = "MANAGER_MOVIE_UPDATE_RESET";

// 배우 조회 리스트
export const MANAGER_ACTOR_REQUEST = "MANAGER_ACTOR_REQUEST";
export const MANAGER_ACTOR_SUCCESS = "MANAGER_ACTOR_SUCCESS";
export const MANAGER_ACTOR_FAILURE = "MANAGER_ACTOR_FAILURE";

// 배우 삽입 리스트
export const MANAGER_ACTOR_INSERT_REQUEST = "MANAGER_ACTOR_INSERT_REQUEST";
export const MANAGER_ACTOR_INSERT_SUCCESS = "MANAGER_ACTOR_INSERT_SUCCESS";
export const MANAGER_ACTOR_INSERT_FAILURE = "MANAGER_ACTOR_INSERT_FAILURE";
export const MANAGER_ACTOR_INSERT_RESET = "MANAGER_ACTOR_INSERT_RESET";

// 배우 삭제 리스트
export const MANAGER_ACTOR_DELETE_REQUEST = "MANAGER_ACTOR_DELETE_REQUEST";
export const MANAGER_ACTOR_DELETE_SUCCESS = "MANAGER_ACTOR_DELETE_SUCCESS";
export const MANAGER_ACTOR_DELETE_FAILURE = "MANAGER_ACTOR_DELETE_FAILURE";
export const MANAGER_ACTOR_DELETE_RESET = "MANAGER_ACTOR_DELETE_RESET";

// 배우 수정 리스트
export const MANAGER_ACTOR_UPDATE_REQUEST = "MANAGER_ACTOR_UPDATE_REQUEST";
export const MANAGER_ACTOR_UPDATE_SUCCESS = "MANAGER_ACTOR_UPDATE_SUCCESS";
export const MANAGER_ACTOR_UPDATE_FAILURE = "MANAGER_ACTOR_UPDATE_FAILURE";
export const MANAGER_ACTOR_UPDATE_RESET = "MANAGER_ACTOR_UPDATE_RESET";

const initalState = {
	MOVIE_loading: false,
  MOVIE_done: false,
  MOVIE_error: false,
	MOVIE: [],

	MOVIE_INSERT_loading: false,
  MOVIE_INSERT_done: false,
  MOVIE_INSERT_error: false,

	MOVIE_DELETE_loading: false,
  MOVIE_DELETE_done: false,
  MOVIE_DELETE_error: false,

	MOVIE_UPDATE_loading: false,
  MOVIE_UPDATE_done: false,
  MOVIE_UPDATE_error: false,

	ACTOR_loading: false,
  ACTOR_done: false,
  ACTOR_error: false,
	ACTOR: [],

	ACTOR_INSERT_loading: false,
  ACTOR_INSERT_done: false,
  ACTOR_INSERT_error: false,

	ACTOR_DELETE_loading: false,
  ACTOR_DELETE_done: false,
  ACTOR_DELETE_error: false,

	ACTOR_UPDATE_loading: false,
  ACTOR_UPDATE_done: false,
  ACTOR_UPDATE_error: false
};

const R_manager_movie = (state = initalState, action) => {
	switch (action.type) {
		// 영화 조회 케이스들
		case MANAGER_MOVIE_REQUEST:
			return {
				...state,
				MOVIE_loading: true,
				MOVIE_done: false,
				MOVIE_error: false,
			};
		case MANAGER_MOVIE_SUCCESS:
			return {
				...state,
				MOVIE_loading: false,
				MOVIE_done: true,
				MOVIE_error: false,
				MOVIE: action.data
			};
		case MANAGER_MOVIE_FAILURE:
			return {
				...state,
				MOVIE_loading: false,
				MOVIE_done: false,
				MOVIE_error: true,
			};
		// 영화 삽입 케이스들
		case MANAGER_MOVIE_INSERT_REQUEST:
			return {
				...state,
				MOVIE_INSERT_loading: true,
				MOVIE_INSERT_done: false,
				MOVIE_INSERT_error: false
			};
		case MANAGER_MOVIE_INSERT_SUCCESS:
			return {
				...state,
				MOVIE_INSERT_loading: false,
				MOVIE_INSERT_done: true,
				MOVIE_INSERT_error: false
			};
		case MANAGER_MOVIE_INSERT_FAILURE:
			return {
				...state,
				MOVIE_INSERT_loading: false,
				MOVIE_INSERT_done: false,
				MOVIE_INSERT_error: true
			};
		case MANAGER_MOVIE_INSERT_RESET:
			return {
				...state,
				MOVIE_INSERT_loading: false,
				MOVIE_INSERT_done: false,
				MOVIE_INSERT_error: false
			};
		// 영화 삭제 케이스들
		case MANAGER_MOVIE_DELETE_REQUEST:
			return {
				...state,
				MOVIE_DELETE_loading: true,
				MOVIE_DELETE_done: false,
				MOVIE_DELETE_error: false
			};
		case MANAGER_MOVIE_DELETE_SUCCESS:
			return {
				...state,
				MOVIE_DELETE_loading: false,
				MOVIE_DELETE_done: true,
				MOVIE_DELETE_error: false
			};
		case MANAGER_MOVIE_DELETE_FAILURE:
			return {
				...state,
				MOVIE_DELETE_loading: false,
				MOVIE_DELETE_done: false,
				MOVIE_DELETE_error: true
			};
		case MANAGER_MOVIE_DELETE_RESET:
			return {
				...state,
				MOVIE_DELETE_loading: false,
				MOVIE_DELETE_done: false,
				MOVIE_DELETE_error: false
			};
		// 영화 수정 케이스들
		case MANAGER_MOVIE_UPDATE_REQUEST:
			return {
				...state,
				MOVIE_UPDATE_loading: true,
				MOVIE_UPDATE_done: false,
				MOVIE_UPDATE_error: false
			};
		case MANAGER_MOVIE_UPDATE_SUCCESS:
			return {
				...state,
				MOVIE_UPDATE_loading: false,
				MOVIE_UPDATE_done: true,
				MOVIE_UPDATE_error: false
			};
		case MANAGER_MOVIE_UPDATE_FAILURE:
			return {
				...state,
				MOVIE_UPDATE_loading: false,
				MOVIE_UPDATE_done: false,
				MOVIE_UPDATE_error: true
			};
		case MANAGER_MOVIE_UPDATE_RESET:
			return {
				...state,
				MOVIE_UPDATE_loading: false,
				MOVIE_UPDATE_done: false,
				MOVIE_UPDATE_error: false
			};
		// 배우 조회 케이스들
		case MANAGER_ACTOR_REQUEST:
			return {
				...state,
				ACTOR_loading: true,
				ACTOR_done: false,
				ACTOR_error: false,
			};
		case MANAGER_ACTOR_SUCCESS:
			return {
				...state,
				ACTOR_loading: false,
				ACTOR_done: true,
				ACTOR_error: false,
				ACTOR: action.data
			};
		case MANAGER_ACTOR_FAILURE:
			return {
				...state,
				ACTOR_loading: false,
				ACTOR_done: false,
				ACTOR_error: true,
			};
		// 배우 삽입 케이스들
		case MANAGER_ACTOR_INSERT_REQUEST:
			return {
				...state,
				ACTOR_INSERT_loading: true,
				ACTOR_INSERT_done: false,
				ACTOR_INSERT_error: false
			};
		case MANAGER_ACTOR_INSERT_SUCCESS:
			return {
				...state,
				ACTOR_INSERT_loading: false,
				ACTOR_INSERT_done: true,
				ACTOR_INSERT_error: false
			};
		case MANAGER_ACTOR_INSERT_FAILURE:
			return {
				...state,
				ACTOR_INSERT_loading: false,
				ACTOR_INSERT_done: false,
				ACTOR_INSERT_error: true
			};
		case MANAGER_ACTOR_INSERT_RESET:
			return {
				...state,
				ACTOR_INSERT_loading: false,
				ACTOR_INSERT_done: false,
				ACTOR_INSERT_error: false
			};
		// 배우 삭제 케이스들
		case MANAGER_ACTOR_DELETE_REQUEST:
			return {
				...state,
				ACTOR_DELETE_loading: true,
				ACTOR_DELETE_done: false,
				ACTOR_DELETE_error: false
			};
		case MANAGER_ACTOR_DELETE_SUCCESS:
			return {
				...state,
				ACTOR_DELETE_loading: false,
				ACTOR_DELETE_done: true,
				ACTOR_DELETE_error: false
			};
		case MANAGER_ACTOR_DELETE_FAILURE:
			return {
				...state,
				ACTOR_DELETE_loading: false,
				ACTOR_DELETE_done: false,
				ACTOR_DELETE_error: true
			};
		case MANAGER_ACTOR_DELETE_RESET:
			return {
				...state,
				ACTOR_DELETE_loading: false,
				ACTOR_DELETE_done: false,
				ACTOR_DELETE_error: false
			};
		// 배우 수정 케이스들
		case MANAGER_ACTOR_UPDATE_REQUEST:
			return {
				...state,
				ACTOR_UPDATE_loading: true,
				ACTOR_UPDATE_done: false,
				ACTOR_UPDATE_error: false
			};
		case MANAGER_ACTOR_UPDATE_SUCCESS:
			return {
				...state,
				ACTOR_UPDATE_loading: false,
				ACTOR_UPDATE_done: true,
				ACTOR_UPDATE_error: false
			};
		case MANAGER_ACTOR_UPDATE_FAILURE:
			return {
				...state,
				ACTOR_UPDATE_loading: false,
				ACTOR_UPDATE_done: false,
				ACTOR_UPDATE_error: true
			};
		case MANAGER_ACTOR_UPDATE_RESET:
			return {
				...state,
				ACTOR_UPDATE_loading: false,
				ACTOR_UPDATE_done: false,
				ACTOR_UPDATE_error: false
			};		
		default:
      return state;
	}
}

export default R_manager_movie;