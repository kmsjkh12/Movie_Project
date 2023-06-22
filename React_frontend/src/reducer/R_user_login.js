/*
 23-01-19 로그인 구현(오병주)
 23-01-24 로그인 상태확인 구현(오병주)
 23-01-27 로그아웃 구현(오병주)
 23-03-13 비밀번호 비교 구현(오병주)
 23-04-15 아이디, 비밀번호 찾기 구현(오병주)
*/
// 로그인 요청 리스트
export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAILURE = "USER_LOGIN_FAILURE";
export const USER_LOGIN_RESET = "USER_LOGIN_RESET";

// 로그인 상태 확인 리스트
export const USER_LOGIN_STATUS_REQUEST = "USER_LOGIN_STATUS_REQUEST";
export const USER_LOGIN_STATUS_SUCCESS = "USER_LOGIN_STATUS_SUCCESS";
export const USER_LOGIN_STATUS_FAILURE = "USER_LOGIN_STATUS_FAILURE";

// 로그아웃 요청 리스트
export const USER_LOGOUT_REQUEST = "USER_LOGOUT_REQUEST";
export const USER_LOGOUT_SUCCESS = "USER_LOGOUT_SUCCESS";
export const USER_LOGOUT_FAILURE = "USER_LOGOUT_FAILURE";

// 아이디 찾기 리스트
export const USER_ID_FIND_REQUEST = "USER_ID_FIND_REQUEST";
export const USER_ID_FIND_SUCCESS = "USER_ID_FIND_SUCCESS";
export const USER_ID_FIND_FAILURE = "USER_ID_FIND_FAILURE";
export const USER_ID_FIND_RESET = "USER_ID_FIND_RESET";

// 비밀번호 찾기 리스트
export const USER_PW_FIND_REQUEST = "USER_PW_FIND_REQUEST";
export const USER_PW_FIND_SUCCESS = "USER_PW_FIND_SUCCESS";
export const USER_PW_FIND_FAILURE = "USER_PW_FIND_FAILURE";
export const USER_PW_FIND_RESET = "USER_PW_FIND_RESET";

// 비밀번호 변경 리스트
export const USER_PW_CHANGE_REQUEST = "USER_PW_CHANGE_REQUEST";
export const USER_PW_CHANGE_SUCCESS = "USER_PW_CHANGE_SUCCESS";
export const USER_PW_CHANGE_FAILURE = "USER_PW_CHANGE_FAILURE";

// 마이페이지 비밀번호 재확인 리스트
export const USER_PW_CHECK_REQUEST = "USER_PW_CHECK_REQUEST";
export const USER_PW_CHECK_SUCCESS = "USER_PW_CHECK_SUCCESS";
export const USER_PW_CHECK_FAILURE = "USER_PW_CHECK_FAILURE";
export const USER_PW_CHECK_RESET = "USER_PW_CHECK_RESET";

const initalState = {
  LOGIN_loading: false,
  LOGIN_done: false,
  LOGIN_error: null,
  LOGIN_data: {uid: 'No_login', uname : ''},

  LOGIN_STATUS_loading: false,
  LOGIN_STATUS_done: false,
  LOGIN_STATUS_error: null,

  LOGOUT_loading: false,
  LOGOUT_done: false,
  LOGOUT_error: null,

  ID_FIND_loading: false,
  ID_FIND_done: false,
  ID_FIND_error: null,
  ID_FIND_data: '',

  PW_FIND_loading: false,
  PW_FIND_done: false,
  PW_FIND_error: null,
  PW_FIND_data: '',

  PW_CHANGE_loading: false,
  PW_CHANGE_done: false,
  PW_CHANGE_error: null,

  PW_CHECK_loading: false,
  PW_CHECK_done: false,
  PW_CHECK_error: null,
  PW_data: ''
};

const R_user_login = (state = initalState, action) => {
  switch (action.type) {
    // 로그인 케이스들
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        LOGIN_loading: true,
        LOGIN_done: false,
        LOGIN_error: null,
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        LOGIN_loading: false,
        LOGIN_done: true,
        LOGIN_error: null,
        LOGIN_data: action.data
      };
    case USER_LOGIN_FAILURE:
      return {
        ...state,
        LOGIN_loading: false,
        LOGIN_done: false,
        LOGIN_error: action.data,
        LOGIN_data: {uname : 'error!!'}
      };
    case USER_LOGIN_RESET:
      return {
        ...state,
        LOGIN_loading: false,
        LOGIN_done: false,
        LOGIN_error: null,
        LOGIN_data: {uid: 'No_login', uname : ''}
      };
    // 로그인 상태확인 케이스들
    case USER_LOGIN_STATUS_REQUEST:
      return {
        ...state,
        LOGIN_STATUS_loading: true,
        LOGIN_STATUS_done: false,
        LOGIN_STATUS_error: null,
      };
    case USER_LOGIN_STATUS_SUCCESS:
      return {
        ...state,
        LOGIN_STATUS_loading: false,
        LOGIN_STATUS_done: true,
        LOGIN_STATUS_error: null,
        LOGIN_data: action.data
      };
    case USER_LOGIN_STATUS_FAILURE:
      return {
        ...state,
        LOGIN_STATUS_loading: false,
        LOGIN_STATUS_done: true,
        LOGIN_STATUS_error: action.data,
      };
    // 로그아웃 케이스들
    case USER_LOGOUT_REQUEST:
      return {
        ...state,
        LOGOUT_loading: true,
        LOGOUT_done: false,
        LOGOUT_error: null,
      };
    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        LOGOUT_loading: false,
        LOGOUT_done: true,
        LOGOUT_error: null
      };
    case USER_LOGOUT_FAILURE:
      return {
        ...state,
        LOGOUT_loading: false,
        LOGOUT_done: true,
        LOGOUT_error: action.data
      };
    // 아이디 찾기 케이스들
    case USER_ID_FIND_REQUEST:
      return {
        ...state,
        ID_FIND_loading: true,
        ID_FIND_done: false,
        ID_FIND_error: null,
      };
    case USER_ID_FIND_SUCCESS:
      return {
        ...state,
        ID_FIND_loading: false,
        ID_FIND_done: true,
        ID_FIND_error: null,
        ID_FIND_data: action.data
      };
    case USER_ID_FIND_FAILURE:
      return {
        ...state,
        ID_FIND_loading: false,
        ID_FIND_done: false,
        ID_FIND_error: action.data,
        ID_FIND_data: 'error'
      };
    case USER_ID_FIND_RESET:
      return {
        ...state,
        ID_FIND_loading: false,
        ID_FIND_done: false,
        ID_FIND_error: null,
        ID_FIND_data: ''
      };
    // 비밀번호 찾기 케이스들
    case USER_PW_FIND_REQUEST:
      return {
        ...state,
        PW_FIND_loading: true,
        PW_FIND_done: false,
        PW_FIND_error: null,
      };
    case USER_PW_FIND_SUCCESS:
      return {
        ...state,
        PW_FIND_loading: false,
        PW_FIND_done: true,
        PW_FIND_error: null,
        PW_FIND_data: action.data
      };
    case USER_PW_FIND_FAILURE:
      return {
        ...state,
        PW_FIND_loading: false,
        PW_FIND_done: false,
        PW_FIND_error: action.data,
        PW_FIND_data: 'error'
      };
    case USER_PW_FIND_RESET:
      return {
        ...state,
        PW_FIND_loading: false,
        PW_FIND_done: false,
        PW_FIND_error: null,
        PW_FIND_data: ''
      };
    // 비밀번호 변경 케이스들
    case USER_PW_CHANGE_REQUEST:
      return {
        ...state,
        PW_CHANGE_loading: true,
        PW_CHANGE_done: false,
        PW_CHANGE_error: null
      };
    case USER_PW_CHANGE_SUCCESS:
      return {
        ...state,
        PW_CHANGE_loading: false,
        PW_CHANGE_done: true,
        PW_CHANGE_error: null
      };
    case USER_PW_CHANGE_FAILURE:
      return {
        ...state,
        PW_CHANGE_loading: false,
        PW_CHANGE_done: false,
        PW_CHANGE_error: true
      };
    // 비밀번호 비교 케이스들
    case USER_PW_CHECK_REQUEST:
      return {
        ...state,
        PW_CHECK_loading: true,
        PW_CHECK_done: false,
        PW_CHECK_error: null,
      };
    case USER_PW_CHECK_SUCCESS:
      return {
        ...state,
        PW_CHECK_loading: false,
        PW_CHECK_done: true,
        PW_CHECK_error: null,
        PW_data: action.data
      };
    case USER_PW_CHECK_FAILURE:
      return {
        ...state,
        PW_CHECK_loading: false,
        PW_CHECK_done: false,
        PW_CHECK_error: true,
        PW_data: action.data
      };
    case USER_PW_CHECK_RESET:
      return {
        ...state,
        PW_CHECK_loading: false,
        PW_CHECK_done: false,
        PW_CHECK_error: null,
        PW_data: ''
      }
    default:
      return state;
  }
};

export default R_user_login;
