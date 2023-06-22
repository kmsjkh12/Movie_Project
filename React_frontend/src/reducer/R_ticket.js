/*
	23-04-27 ~ 28 예매 페이지 리듀서 수정(오병주)
  23-05-02 결제 페이지 리듀서 수정(오병주)
*/
// 영화 목록 조회 리스트
export const TICKET_MOVIE_LIST_REQUEST = "TICKET_MOVIE_LIST_REQUEST";
export const TICKET_MOVIE_LIST_SUCCESS = "TICKET_MOVIE_LIST_SUCCESS";
export const TICKET_MOVIE_LIST_FAILURE = "TICKET_MOVIE_LIST_FAILURE";
export const TICKET_MOVIE_SELECT = "TICKET_MOVIE_SELECT";
export const TICKET_MOVIE_SORT_SELECT = "TICKET_MOVIE_SORT_SELECT";
export const TICKET_MOVIE_RESET = "TICKET_MOVIE_RESET";

// 극장 목록 조회 리스트
export const TICKET_THEATER_LIST_REQUEST = "TICKET_THEATER_LIST_REQUEST";
export const TICKET_THEATER_LIST_SUCCESS = "TICKET_THEATER_LIST_SUCCESS";
export const TICKET_THEATER_LIST_FAILURE = "TICKET_THEATER_LIST_FAILURE";
export const TICKET_THEATER_SELECT = "TICKET_THEATER_SELECT";
export const TICKET_AREA_SELECT = "TICKET_AREA_SELECT";
export const TICKET_THEATER_RESET = "TICKET_THEATER_RESET";

// 날짜 목록 조회 리스트
export const TICKET_DAY_LIST_REQUEST = "TICKET_DAY_LIST_REQUEST";
export const TICKET_DAY_LIST_SUCCESS = "TICKET_DAY_LIST_SUCCESS";
export const TICKET_DAY_LIST_FAILURE = "TICKET_DAY_LIST_FAILURE";
export const TICKET_DAY_SELECT = "TICKET_DAY_SELECT";
export const TICKET_DAY_RESET = "TICKET_DAY_RESET";

// 상영정보 목록 조회 리스트
export const TICKET_MOVIEINFO_LIST_REQUEST = "TICKET_MOVIEINFO_LIST_REQUEST";
export const TICKET_MOVIEINFO_LIST_SUCCESS = "TICKET_MOVIEINFO_LIST_SUCCESS";
export const TICKET_MOVIEINFO_LIST_FAILURE = "TICKET_MOVIEINFO_LIST_FAILURE";
export const TICKET_MOVIEINFO_SELECT = "TICKET_MOVIEINFO_SELECT";

// 결제 검증 요청 리스트
export const TICKET_PAYMENT_REQUEST = "TICKET_PAYMENT_REQUEST";
export const TICKET_PAYMENT_SUCCESS = "TICKET_PAYMENT_SUCCESS";
export const TICKET_PAYMENT_FAILURE = "TICKET_PAYMENT_FAILURE";
export const TICKET_PAYMENT_RESET = "TICKET_PAYMENT_RESET";

// 예매 페이지 초기화 리스트
export const TICKET_PAGE_RESET = "TICKET_PAGE_RESET";

// 예매 페이지 설정 리스트
export const TICKET_PAGE_SETTING = "TICKET_PAGE_SETTING";

const initalState = {
	MOVIE_LIST_loading: false,
  MOVIE_LIST_done: false,
  MOVIE_LIST_error: false,
	MOVIE_LIST: [],
	MOVIE: '',

	THEATER_LIST_loading: false,
  THEATER_LIST_done: false,
  THEATER_LIST_error: false,
	THEATER_LIST: [],
	THEATER: '',
	AREA: 'seoul',

	DAY_LIST_loading: false,
  DAY_LIST_done: false,
  DAY_LIST_error: false,
	DAY_LIST: [],
	DAY: '',

	MOVIEINFO_LIST_loading: false,
  MOVIEINFO_LIST_done: false,
  MOVIEINFO_LIST_error: false,
	MOVIEINFO_LIST: [],
	MOVIEINFO: '',

	PAYMENT_loading: false,
  PAYMENT_done: false,
  PAYMENT_error: false,
	PAYMENT: '',

	RESERVE_SORT: true,
	LIKE_SORT: false,
	TICKET_KEY: '',
	SETTING_STATE: false
};

const R_ticket = (state = initalState, action) => {
  switch (action.type) {
		// 영화 조회 케이스들
    case TICKET_MOVIE_LIST_REQUEST:
      return {
        ...state,
        MOVIE_LIST_loading: true,
        MOVIE_LIST_done: false,
        MOVIE_LIST_error: false
      };
    case TICKET_MOVIE_LIST_SUCCESS:
      return {
        ...state,
        MOVIE_LIST_loading: false,
        MOVIE_LIST_done: true,
        MOVIE_LIST_error: false,
        MOVIE_LIST: action.data
      };
    case TICKET_MOVIE_LIST_FAILURE:
      return {
        ...state,
        MOVIE_LIST_loading: false,
        MOVIE_LIST_done: false,
        MOVIE_LIST_error: true
      };
    case TICKET_MOVIE_SELECT:
      return {
        ...state,
        MOVIE: action.data,
				MOVIEINFO: ''
      };
		case TICKET_MOVIE_SORT_SELECT:
			return {
				...state,
				RESERVE_SORT: action.data.reserve,
				LIKE_SORT: action.data.like,
			};
		case TICKET_MOVIE_RESET:
			return {
        ...state,
        MOVIE: action.data,
				THEATER: '',
				DAY: '',
				MOVIEINFO: '',
				MOVIEINFO_LIST: []
      };
		// 극장 조회 케이스들
    case TICKET_THEATER_LIST_REQUEST:
      return {
        ...state,
        THEATER_LIST_loading: true,
        THEATER_LIST_done: false,
        THEATER_LIST_error: false
      };
    case TICKET_THEATER_LIST_SUCCESS:
      return {
        ...state,
        THEATER_LIST_loading: false,
        THEATER_LIST_done: true,
        THEATER_LIST_error: false,
        THEATER_LIST: action.data
      };
    case TICKET_THEATER_LIST_FAILURE:
      return {
        ...state,
        THEATER_LIST_loading: false,
        THEATER_LIST_done: false,
        THEATER_LIST_error: true
      };
    case TICKET_THEATER_SELECT:
      return {
        ...state,
        THEATER: action.data,
				MOVIEINFO: ''
      };
		case TICKET_AREA_SELECT:
			return {
				...state,
				AREA: action.data
			};
		case TICKET_THEATER_RESET:
			return {
        ...state,
        MOVIE: '',
				THEATER: action.data,
				DAY: '',
				MOVIEINFO: '',
				MOVIEINFO_LIST: []
      };
		// 날짜 조회 케이스들
    case TICKET_DAY_LIST_REQUEST:
      return {
        ...state,
        DAY_LIST_loading: true,
        DAY_LIST_done: false,
        DAY_LIST_error: false
      };
    case TICKET_DAY_LIST_SUCCESS:
      return {
        ...state,
        DAY_LIST_loading: false,
        DAY_LIST_done: true,
        DAY_LIST_error: false,
        DAY_LIST: action.data
      };
    case TICKET_DAY_LIST_FAILURE:
      return {
        ...state,
        DAY_LIST_loading: false,
        DAY_LIST_done: false,
        DAY_LIST_error: true
      };
    case TICKET_DAY_SELECT:
      return {
        ...state,
        DAY: action.data,
				MOVIEINFO: ''
      };
		case TICKET_DAY_RESET:
			return {
				...state,
				MOVIE: '',
				THEATER: '',
				DAY: action.data,
				MOVIEINFO: '',
				MOVIEINFO_LIST: []
			};
		// 상영정보 조회 케이스들
    case TICKET_MOVIEINFO_LIST_REQUEST:
      return {
        ...state,
        MOVIEINFO_LIST_loading: true,
        MOVIEINFO_LIST_done: false,
        MOVIEINFO_LIST_error: false
      };
    case TICKET_MOVIEINFO_LIST_SUCCESS:
      return {
        ...state,
        MOVIEINFO_LIST_loading: false,
        MOVIEINFO_LIST_done: true,
        MOVIEINFO_LIST_error: false,
        MOVIEINFO_LIST: action.data
      };
    case TICKET_MOVIEINFO_LIST_FAILURE:
      return {
        ...state,
        MOVIEINFO_LIST_loading: false,
        MOVIEINFO_LIST_done: false,
        MOVIEINFO_LIST_error: true
      };
    case TICKET_MOVIEINFO_SELECT:
      return {
        ...state,
        MOVIEINFO: action.data
      };
		// 결제 검증 요청 케이스들
    case TICKET_PAYMENT_REQUEST:
      return {
        ...state,
        PAYMENT_loading: true,
        PAYMENT_done: false,
        PAYMENT_error: false
      };
    case TICKET_PAYMENT_SUCCESS:
      return {
        ...state,
        PAYMENT_loading: false,
        PAYMENT_done: true,
        PAYMENT_error: false,
				PAYMENT: action.data
      };
    case TICKET_PAYMENT_FAILURE:
      return {
        ...state,
        PAYMENT_loading: false,
        PAYMENT_done: false,
        PAYMENT_error: true,
				PAYMENT: action.data
      };
		case TICKET_PAYMENT_RESET:
			return {
        ...state,
        PAYMENT_loading: false,
				PAYMENT_done: false,
				PAYMENT_error: false,
				PAYMENT: '',
      };
		// 예매 페이지 초기화 케이스
		case TICKET_PAGE_RESET:
			return {
				...state,
				MOVIE_LIST_loading: false,
				MOVIE_LIST_done: false,
				MOVIE_LIST_error: false,
				MOVIE_LIST: [],
				MOVIE: '',

				THEATER_LIST_loading: false,
				THEATER_LIST_done: false,
				THEATER_LIST_error: false,
				THEATER_LIST: [],
				THEATER: '',
				AREA: 'seoul',

				DAY_LIST_loading: false,
				DAY_LIST_done: false,
				DAY_LIST_error: false,
				DAY_LIST: [],
				DAY: '',

				MOVIEINFO_LIST_loading: false,
				MOVIEINFO_LIST_done: false,
				MOVIEINFO_LIST_error: false,
				MOVIEINFO_LIST: [],
				MOVIEINFO: '',

				PAYMENT_loading: false,
				PAYMENT_done: false,
				PAYMENT_error: false,
				PAYMENT: '',

				RESERVE_SORT: true,
				LIKE_SORT: false,
				TICKET_KEY: action.data,
				SETTING_STATE: false
			}
		// 예매 페이지 설정 케이스
		case TICKET_PAGE_SETTING:
			return {
				...state,
				MOVIE: action.data.movie,
				THEATER: action.data.theater,
				AREA: action.data.area,				
				DAY: action.data.day,
				MOVIEINFO: action.data.movieinfo,
				RESERVE_SORT: action.data.reserve,
				LIKE_SORT: action.data.like,
				SETTING_STATE: true
			}
    default:
      return state;
  }
};
export default R_ticket;
