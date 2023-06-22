/*
 23-01-08 회원가입 시 필요한 리듀서 작성(오병주)
 23-01-13 아이디 중복확인 함수 생성(오병주)
 23-01-18 회원가입 구현(오병주)
*/
// 회원가입시 아이디 중복 확인 리스트
export const USER_ID_REQUEST = "USER_ID_REQUEST";
export const USER_ID_SUCCESS = "USER_ID_SUCCESS";
export const USER_ID_FAILURE = "USER_ID_FAILURE";
export const USER_ID_RESET = "USER_ID_RESET";

// 회원가입시 이메일 중복 확인 리스트
export const USER_EMAIL_REQUEST = "USER_EMAIL_REQUEST";
export const USER_EMAIL_SUCCESS = "USER_EMAIL_SUCCESS";
export const USER_EMAIL_FAILURE = "USER_EMAIL_FAILURE";
export const USER_EMAIL_RESET = "USER_EMAIL_RESET";

// 회원가입 요청 리스트
export const USER_JOIN_REQUEST = "USER_JOIN_REQUEST";
export const USER_JOIN_SUCCESS = "USER_JOIN_SUCCESS";
export const USER_JOIN_FAILURE = "USER_JOIN_FAILURE";

// 회원정보 수정 요청 리스트
export const USER_UPDATE_REQUEST = "USER_UPDATE_REQUEST";
export const USER_UPDATE_SUCCESS = "USER_UPDATE_SUCCESS";
export const USER_UPDATE_FAILURE = "USER_UPDATE_FAILURE";
export const USER_UPDATE_RESET = "USER_UPDATE_RESET";

// 회원탈퇴 리스트
export const USER_DROP_REQUEST = "USER_DROP_REQUEST";
export const USER_DROP_SUCCESS = "USER_DROP_SUCCESS";
export const USER_DROP_FAILURE = "USER_DROP_FAILURE";

const initalState = {
  ID_loading: false,
  ID_done: false,
  ID_error: null,
  ID_status: '',

  EMAIL_loading: false,
  EMAIL_done: false,
  EMAIL_error: null,
  EMAIL_status: '',

  JOIN_loading: false,
  JOIN_done: false,
  JOIN_error: null,
  JOIN_status: '',

  UPDATE_loading: false,
  UPDATE_done: false,
  UPDATE_error: null,
  UPDATE_status: '',
	
  DROP_loading: false,
  DROP_done: false,
  DROP_error: null,
  DROP_status: ''
};

const R_user_join = (state = initalState, action) => {
  switch (action.type) {
    // 아이디 중복 확인 케이스들
    case USER_ID_REQUEST:
      return {
        ...state,
        ID_loading: true,
        ID_done: false,
        ID_error: null,
      };
    case USER_ID_SUCCESS:
      return {
        ...state,
        ID_loading: false,
        ID_done: true,
        ID_error: null,
        ID_status: action.data
      };
    case USER_ID_FAILURE:
      return {
        ...state,
        ID_loading: false,
        ID_done: false,
        ID_error: action.error,
        ID_status: action.data
      };
    case USER_ID_RESET:
      return {
        ...state,
        ID_loading: false,
        ID_done: false,
        ID_error: null,
        ID_status: ''
      };
    // 이메일 중복 확인 케이스들
    case USER_EMAIL_REQUEST:
      return {
        ...state,
        EMAIL_loading: true,
        EMAIL_done: false,
        EMAIL_error: null,
      };
    case USER_EMAIL_SUCCESS:
      return {
        ...state,
        EMAIL_loading: false,
        EMAIL_done: true,
        EMAIL_error: null,
        EMAIL_status: action.data
      };
    case USER_EMAIL_FAILURE:
      return {
        ...state,
        EMAIL_loading: false,
        EMAIL_done: false,
        EMAIL_error: action.error,
        EMAIL_status: action.data
      };
    case USER_EMAIL_RESET:
      return {
        ...state,
        EMAIL_loading: false,
        EMAIL_done: false,
        EMAIL_error: null,
        EMAIL_status: ''
      };
    // 회원가입 케이스들
    case USER_JOIN_REQUEST:
      return {
        ...state,
        JOIN_loading: true,
        JOIN_done: false,
        JOIN_error: null,
      };
    case USER_JOIN_SUCCESS:
      return {
        ...state,
        JOIN_loading: false,
        JOIN_done: true,
        JOIN_error: null,
        JOIN_status: action.data
      };
    case USER_JOIN_FAILURE:
      return {
        ...state,
        JOIN_loading: false,
        JOIN_done: false,
        JOIN_error: action.error,
        JOIN_status: action.data
      };
    // 회원정보 수정 케이스들
    case USER_UPDATE_REQUEST:
      return {
        ...state,
        UPDATE_loading: true,
        UPDATE_done: false,
        UPDATE_error: null,
      };
    case USER_UPDATE_SUCCESS:
      return {
        ...state,
        UPDATE_loading: false,
        UPDATE_done: true,
        UPDATE_error: null,
        UPDATE_status: action.data
      };
    case USER_UPDATE_FAILURE:
      return {
        ...state,
        UPDATE_loading: false,
        UPDATE_done: false,
        UPDATE_error: action.error,
        UPDATE_status: action.data
      };
    case USER_UPDATE_RESET:
      return {
        ...state,
        UPDATE_loading: false,
        UPDATE_done: false,
        UPDATE_error: null,
        UPDATE_status: ''
      };
    // 회원탈퇴 케이스들
    case USER_DROP_REQUEST:
      return {
        ...state,
        DROP_loading: true,
        DROP_done: false,
        DROP_error: null,
      };
    case USER_DROP_SUCCESS:
      return {
        ...state,
        DROP_loading: false,
        DROP_done: true,
        DROP_error: null,
        DROP_status: action.data
      };
    case USER_DROP_FAILURE:
      return {
        ...state,
        DROP_loading: false,
        DROP_done: false,
        DROP_error: action.error,
        DROP_status: action.data
      };
    default:
      return state;
  }
};

export default R_user_join;
