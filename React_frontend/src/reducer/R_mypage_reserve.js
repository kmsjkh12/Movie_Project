/*
 23-03-24 마이페이지 예매 함수들 구현(오병주)
*/
// 마이페이지 예매내역 조회 리스트
export const USER_RESERVE_SEARCH_REQUEST = "USER_RESERVE_SEARCH_REQUEST"
export const USER_RESERVE_SEARCH_SUCCESS = "USER_RESERVE_SEARCH_SUCCESS"
export const USER_RESERVE_SEARCH_FAILURE = "USER_RESERVE_SEARCH_FAILURE"

// 마이페이지 예매내역 상세 조회 리스트
export const USER_RESERVE_DETAIL_REQUEST = "USER_RESERVE_DETAIL_REQUEST"
export const USER_RESERVE_DETAIL_SUCCESS = "USER_RESERVE_DETAIL_SUCCESS"
export const USER_RESERVE_DETAIL_FAILURE = "USER_RESERVE_DETAIL_FAILURE"

// 마이페이지 예매취소 리스트
export const USER_RESERVE_DROP_REQUEST = "USER_RESERVE_DROP_REQUEST"
export const USER_RESERVE_DROP_SUCCESS = "USER_RESERVE_DROP_SUCCESS"
export const USER_RESERVE_DROP_FAILURE = "USER_RESERVE_DROP_FAILURE"

// 마이페이지 예매 취소내역 조회 리스트
export const USER_RESERVE_CANCEL_SEARCH_REQUEST = "USER_RESERVE_CANCEL_SEARCH_REQUEST"
export const USER_RESERVE_CANCEL_SEARCH_SUCCESS = "USER_RESERVE_CANCEL_SEARCH_SUCCESS"
export const USER_RESERVE_CANCEL_SEARCH_FAILURE = "USER_RESERVE_CANCEL_SEARCH_FAILURE"

// 마이페이지 예매취소내역 상세 조회 리스트
export const USER_RESERVE_CANCEL_DETAIL_REQUEST = "USER_RESERVE_CANCEL_DETAIL_REQUEST"
export const USER_RESERVE_CANCEL_DETAIL_SUCCESS = "USER_RESERVE_CANCEL_DETAIL_SUCCESS"
export const USER_RESERVE_CANCEL_DETAIL_FAILURE = "USER_RESERVE_CANCEL_DETAIL_FAILURE"

// 마이페이지 지난 관람내역 조회 리스트
export const USER_RESERVE_FINISH_SEARCH_REQUEST = "USER_RESERVE_FINISH_SEARCH_REQUEST"
export const USER_RESERVE_FINISH_SEARCH_SUCCESS = "USER_RESERVE_FINISH_SEARCH_SUCCESS"
export const USER_RESERVE_FINISH_SEARCH_FAILURE = "USER_RESERVE_FINISH_SEARCH_FAILURE"

// 마이페이지 지난관람내역 상세 조회 리스트
export const USER_RESERVE_FINISH_DETAIL_REQUEST = "USER_RESERVE_FINISH_DETAIL_REQUEST"
export const USER_RESERVE_FINISH_DETAIL_SUCCESS = "USER_RESERVE_FINISH_DETAIL_SUCCESS"
export const USER_RESERVE_FINISH_DETAIL_FAILURE = "USER_RESERVE_FINISH_DETAIL_FAILURE"

const initalState = {
  RESERVE_SEARCH_loading: false,
  RESERVE_SEARCH_done: false,
  RESERVE_SEARCH_error: false,
	RESERVE_SEARCH_Key: '',
	RESERVE_SEARCH: [],

	RESERVE_DETAIL_loading: false,
  RESERVE_DETAIL_done: false,
  RESERVE_DETAIL_error: false,
	RESERVE_DETAIL: [],

	RESERVE_DROP_loading: false,
  RESERVE_DROP_done: false,
  RESERVE_DROP_error: false,
	RESERVE_DROP_status: '',

	RESERVE_CANCEL_SEARCH_loading: false,
  RESERVE_CANCEL_SEARCH_done: false,
  RESERVE_CANCEL_SEARCH_error: false,
	RESERVE_CANCEL_SEARCH_Key: '',
	RESERVE_CANCEL_SEARCH: [],

	RESERVE_CANCEL_DETAIL_loading: false,
  RESERVE_CANCEL_DETAIL_done: false,
  RESERVE_CANCEL_DETAIL_error: false,
	RESERVE_CANCEL_DETAIL: [],

	RESERVE_FINISH_SEARCH_loading: false,
  RESERVE_FINISH_SEARCH_done: false,
  RESERVE_FINISH_SEARCH_error: false,
	RESERVE_FINISH_SEARCH_Key: '',
	RESERVE_FINISH_SEARCH: [],

	RESERVE_FINISH_DETAIL_loading: false,
  RESERVE_FINISH_DETAIL_done: false,
  RESERVE_FINISH_DETAIL_error: false,
	RESERVE_FINISH_DETAIL: []
};

const R_mypage_reserve = (state = initalState, action) => {
	switch (action.type) {
		// 마이페이지 예매내역 조회 케이스들
		case USER_RESERVE_SEARCH_REQUEST:
			return {
				...state,
				RESERVE_SEARCH_loading: true,
				RESERVE_SEARCH_done: false,
				RESERVE_SEARCH_error: false,
				RESERVE_SEARCH_Key: action.data
			};
		case USER_RESERVE_SEARCH_SUCCESS:
			return {
				...state,
				RESERVE_SEARCH_loading: false,
				RESERVE_SEARCH_done: true,
				RESERVE_SEARCH_error: false,
				RESERVE_SEARCH: action.data
			};
		case USER_RESERVE_SEARCH_FAILURE:
			return {
				...state,
				RESERVE_SEARCH_loading: false,
				RESERVE_SEARCH_done: false,
				RESERVE_SEARCH_error: true,
				RESERVE_SEARCH: []
			};
		// 마이페이지 예매내역 상세 조회 케이스들
		case USER_RESERVE_DETAIL_REQUEST:
			return {
				...state,
				RESERVE_DETAIL_loading: true,
				RESERVE_DETAIL_done: false,
				RESERVE_DETAIL_error: false,
			};
		case USER_RESERVE_DETAIL_SUCCESS:
			return {
				...state,
				RESERVE_DETAIL_loading: false,
				RESERVE_DETAIL_done: true,
				RESERVE_DETAIL_error: false,
				RESERVE_DETAIL: action.data
			};
		case USER_RESERVE_DETAIL_FAILURE:
			return {
				...state,
				RESERVE_DETAIL_loading: false,
				RESERVE_DETAIL_done: false,
				RESERVE_DETAIL_error: true,
				RESERVE_DETAIL: []
			};
		// 마이페이지 예매취소 케이스들
		case USER_RESERVE_DROP_REQUEST:
			return {
				...state,
				RESERVE_DROP_loading: true,
				RESERVE_DROP_done: false,
				RESERVE_DROP_error: false
			};
		case USER_RESERVE_DROP_SUCCESS:
			return {
				...state,
				RESERVE_DROP_loading: false,
				RESERVE_DROP_done: true,
				RESERVE_DROP_error: false,
				RESERVE_DROP_status: action.data
			};
		case USER_RESERVE_DROP_FAILURE:
			return {
				...state,
				RESERVE_DROP_loading: false,
				RESERVE_DROP_done: false,
				RESERVE_DROP_error: true,
				RESERVE_DROP_status: action.data
			};
		// 마이페이지 예매 취소내역 조회 케이스들
		case USER_RESERVE_CANCEL_SEARCH_REQUEST:
			return {
				...state,
				RESERVE_CANCEL_SEARCH_loading: true,
				RESERVE_CANCEL_SEARCH_done: false,
				RESERVE_CANCEL_SEARCH_error: false,
				RESERVE_CANCEL_SEARCH_Key: action.data
			};
		case USER_RESERVE_CANCEL_SEARCH_SUCCESS:
			return {
				...state,
				RESERVE_CANCEL_SEARCH_loading: false,
				RESERVE_CANCEL_SEARCH_done: true,
				RESERVE_CANCEL_SEARCH_error: false,
				RESERVE_CANCEL_SEARCH: action.data
			};
		case USER_RESERVE_CANCEL_SEARCH_FAILURE:
			return {
				...state,
				RESERVE_CANCEL_SEARCH_loading: false,
				RESERVE_CANCEL_SEARCH_done: false,
				RESERVE_CANCEL_SEARCH_error: true,
				RESERVE_CANCEL_SEARCH: []
			};
		// 마이페이지 예매취소내역 상세 조회 케이스들
		case USER_RESERVE_CANCEL_DETAIL_REQUEST:
			return {
				...state,
				RESERVE_CANCEL_DETAIL_loading: true,
				RESERVE_CANCEL_DETAIL_done: false,
				RESERVE_CANCEL_DETAIL_error: false,
			};
		case USER_RESERVE_CANCEL_DETAIL_SUCCESS:
			return {
				...state,
				RESERVE_CANCEL_DETAIL_loading: false,
				RESERVE_CANCEL_DETAIL_done: true,
				RESERVE_CANCEL_DETAIL_error: false,
				RESERVE_CANCEL_DETAIL: action.data
			};
		case USER_RESERVE_CANCEL_DETAIL_FAILURE:
			return {
				...state,
				RESERVE_CANCEL_DETAIL_loading: false,
				RESERVE_CANCEL_DETAIL_done: false,
				RESERVE_CANCEL_DETAIL_error: true,
				RESERVE_CANCEL_DETAIL: []
			};
		// 마이페이지 지난 관람내역 조회 케이스들
		case USER_RESERVE_FINISH_SEARCH_REQUEST:
			return {
				...state,
				RESERVE_FINISH_SEARCH_loading: true,
				RESERVE_FINISH_SEARCH_done: false,
				RESERVE_FINISH_SEARCH_error: false,
				RESERVE_FINISH_SEARCH_Key: action.data
			};
		case USER_RESERVE_FINISH_SEARCH_SUCCESS:
			return {
				...state,
				RESERVE_FINISH_SEARCH_loading: false,
				RESERVE_FINISH_SEARCH_done: true,
				RESERVE_FINISH_SEARCH_error: false,
				RESERVE_FINISH_SEARCH: action.data
			};
		case USER_RESERVE_FINISH_SEARCH_FAILURE:
			return {
				...state,
				RESERVE_FINISH_SEARCH_loading: false,
				RESERVE_FINISH_SEARCH_done: false,
				RESERVE_FINISH_SEARCH_error: true,
				RESERVE_FINISH_SEARCH: []
			};
		// 마이페이지 지난관람내역 상세 조회 케이스들
		case USER_RESERVE_FINISH_DETAIL_REQUEST:
			return {
				...state,
				RESERVE_FINISH_DETAIL_loading: true,
				RESERVE_FINISH_DETAIL_done: false,
				RESERVE_FINISH_DETAIL_error: false,
			};
		case USER_RESERVE_FINISH_DETAIL_SUCCESS:
			return {
				...state,
				RESERVE_FINISH_DETAIL_loading: false,
				RESERVE_FINISH_DETAIL_done: true,
				RESERVE_FINISH_DETAIL_error: false,
				RESERVE_FINISH_DETAIL: action.data
			};
		case USER_RESERVE_FINISH_DETAIL_FAILURE:
			return {
				...state,
				RESERVE_FINISH_DETAIL_loading: false,
				RESERVE_FINISH_DETAIL_done: false,
				RESERVE_FINISH_DETAIL_error: true,
				RESERVE_FINISH_DETAIL: []
			};
		default:
      return state;
	}
}

export default R_mypage_reserve;