/*
 23-03-17 마이페이지 영화 함수들 구현(오병주)
*/
// 마이페이지 관람평 작성가능영화 조회 리스트
export const USER_MOVIE_POSSIBLE_REQUEST = "USER_MOVIE_POSSIBLE_REQUEST"
export const USER_MOVIE_POSSIBLE_SUCCESS = "USER_MOVIE_POSSIBLE_SUCCESS"
export const USER_MOVIE_POSSIBLE_FAILURE = "USER_MOVIE_POSSIBLE_FAILURE"
export const USER_MOVIE_POSSIBLE_UPDATE = "USER_MOVIE_POSSIBLE_UPDATE"

// 마이페이지 관람평 작성 리스트
export const USER_MY_COMMENT_WRITE_REQUEST = "USER_MY_COMMENT_WRITE_REQUEST"
export const USER_MY_COMMENT_WRITE_SUCCESS = "USER_MY_COMMENT_WRITE_SUCCESS"
export const USER_MY_COMMENT_WRITE_FAILURE = "USER_MY_COMMENT_WRITE_FAILURE"
export const USER_MY_COMMENT_WRITE_RESET = "USER_MY_COMMENT_WRITE_RESET"

// 마이페이지 작성한 관람평 리스트
export const USER_MY_COMMENT_SEARCH_REQUEST = "USER_MY_COMMENT_SEARCH_REQUEST"
export const USER_MY_COMMENT_SEARCH_SUCCESS = "USER_MY_COMMENT_SEARCH_SUCCESS"
export const USER_MY_COMMENT_SEARCH_FAILURE = "USER_MY_COMMENT_SEARCH_FAILURE"

// 마이페이지 영화 관람평 좋아요 리스트
export const USER_MY_COMMENT_LIKE_REQUEST = "USER_MY_COMMENT_LIKE_REQUEST"
export const USER_MY_COMMENT_LIKE_SUCCESS = "USER_MY_COMMENT_LIKE_SUCCESS"
export const USER_MY_COMMENT_LIKE_FAILURE = "USER_MY_COMMENT_LIKE_FAILURE"

// 마이페이지 영화 관람평 삭제 리스트
export const USER_MY_COMMENT_DELETE_REQUEST = "USER_MY_COMMENT_DELETE_REQUEST"
export const USER_MY_COMMENT_DELETE_SUCCESS = "USER_MY_COMMENT_DELETE_SUCCESS"
export const USER_MY_COMMENT_DELETE_FAILURE = "USER_MY_COMMENT_DELETE_FAILURE"

// 마이페이지 영화 관람평 내역 버튼 상태 Setting
export const USER_MY_COMMENT_SETTING = "USER_MY_COMMENT_SETTING"

// 무비 디테일에서 누른 관람평 내용 수정
export const USER_MY_COMMENT_LIKE_UPDATE = "USER_MY_COMMENT_LIKE_UPDATE"

const initalState = {
  MOVIE_POSSIBLE_loading: false,
  MOVIE_POSSIBLE_done: false,
  MOVIE_POSSIBLE_error: false,
	possibleMovie: [],
	Comment_key: '',

	MY_COMMENT_WRITE_loading: false,
  MY_COMMENT_WRITE_done: false,
  MY_COMMENT_WRITE_error: false,
	MY_COMMENT_status: '',

	MY_COMMENT_SEARCH_loading: false,
  MY_COMMENT_SEARCH_done: false,
  MY_COMMENT_SEARCH_error: false,
	MY_COMMENT_List: [],

	MY_COMMENT_LIKE_loading: false,
  MY_COMMENT_LIKE_done: false,
  MY_COMMENT_LIKE_error: false,

	MY_COMMENT_DELETE_loading: false,
  MY_COMMENT_DELETE_done: false,
  MY_COMMENT_DELETE_error: false,

	// 관람평 내역 버튼 상태
	Possiblebuttonstate: true,
	Reviewbuttonstate: false
};

const R_mypage_movie = (state = initalState, action) => {
	switch (action.type) {
		// 관람평 작성 가능 영화 조회 케이스들
		case USER_MOVIE_POSSIBLE_REQUEST:
			return {
				...state,
				MOVIE_POSSIBLE_loading: true,
				MOVIE_POSSIBLE_done: false,
				MOVIE_POSSIBLE_error: false
			};
		case USER_MOVIE_POSSIBLE_SUCCESS:
			return {
				...state,
				MOVIE_POSSIBLE_loading: false,
				MOVIE_POSSIBLE_done: true,
				MOVIE_POSSIBLE_error: false,
				possibleMovie: action.data
			};
		case USER_MOVIE_POSSIBLE_FAILURE:
			return {
				...state,
				MOVIE_POSSIBLE_loading: false,
				MOVIE_POSSIBLE_done: false,
				MOVIE_POSSIBLE_error: true,
				possibleMovie: []
			};
		case USER_MOVIE_POSSIBLE_UPDATE:
			return {
				...state,
				possibleMovie: state.possibleMovie.filter(movie => movie.mid !== action.data)
			}
		// 관람평 작성 케이스들
		case USER_MY_COMMENT_WRITE_REQUEST:
			return {
				...state,
				MY_COMMENT_WRITE_loading: true,
				MY_COMMENT_WRITE_done: false,
				MY_COMMENT_WRITE_error: false
			};
		case USER_MY_COMMENT_WRITE_SUCCESS:
			return {
				...state,
				MY_COMMENT_WRITE_loading: false,
				MY_COMMENT_WRITE_done: true,
				MY_COMMENT_WRITE_error: false,
				MY_COMMENT_status: action.data
			};
		case USER_MY_COMMENT_WRITE_FAILURE:
			return {
				...state,
				MY_COMMENT_WRITE_loading: false,
				MY_COMMENT_WRITE_done: false,
				MY_COMMENT_WRITE_error: true,
				MY_COMMENT_status: action.data
			};
		case USER_MY_COMMENT_WRITE_RESET:
			return {
				...state,
				MY_COMMENT_WRITE_loading: false,
				MY_COMMENT_WRITE_done: false,
				MY_COMMENT_WRITE_error: false,
				MY_COMMENT_status: ''
			};
		// 작성한 관람평 조회 케이스들
		case USER_MY_COMMENT_SEARCH_REQUEST:
			return {
				...state,
				MY_COMMENT_SEARCH_loading: true,
				MY_COMMENT_SEARCH_done: false,
				MY_COMMENT_SEARCH_error: false
			};
		case USER_MY_COMMENT_SEARCH_SUCCESS:
			return {
				...state,
				MY_COMMENT_SEARCH_loading: false,
				MY_COMMENT_SEARCH_done: true,
				MY_COMMENT_SEARCH_error: false,
				MY_COMMENT_List: action.data
			};
		case USER_MY_COMMENT_SEARCH_FAILURE:
			return {
				...state,
				MY_COMMENT_SEARCH_loading: false,
				MY_COMMENT_SEARCH_done: false,
				MY_COMMENT_SEARCH_error: true,
			};
		// 작성한 관람평 좋아요 케이스들
		case USER_MY_COMMENT_LIKE_REQUEST:
			return {
				...state,
				MY_COMMENT_LIKE_loading: true,
				MY_COMMENT_LIKE_done: false,
				MY_COMMENT_LIKE_error: false
			};
		case USER_MY_COMMENT_LIKE_SUCCESS:
			return {
				...state,
				// 좋아요 버튼을 누른 관람평의 내용을 수정
				MY_COMMENT_List: state.MY_COMMENT_List.map(comment => 
          comment.umid === action.data.umid ? {...comment, like: action.data.like, upcnt: action.data.upcnt} : comment
        ),
				MY_COMMENT_LIKE_loading: false,
				MY_COMMENT_LIKE_done: true,
				MY_COMMENT_LIKE_error: false,
			};
		case USER_MY_COMMENT_LIKE_FAILURE:
			return {
				...state,
				MY_COMMENT_LIKE_loading: false,
				MY_COMMENT_LIKE_done: false,
				MY_COMMENT_LIKE_error: action.data.umid
			};
		// 작성한 관람평 삭제 케이스들
		case USER_MY_COMMENT_DELETE_REQUEST:
			return {
				...state,
				MY_COMMENT_DELETE_loading: true,
				MY_COMMENT_DELETE_done: false,
				MY_COMMENT_DELETE_error: false
			};
		case USER_MY_COMMENT_DELETE_SUCCESS:
			return {
				...state,
				// 삭제 버튼을 누른 관람평을 제거
				MY_COMMENT_List: state.MY_COMMENT_List.filter(comment => comment.umid !== action.data),
				MY_COMMENT_DELETE_loading: false,
				MY_COMMENT_DELETE_done: true,
				MY_COMMENT_DELETE_error: false,
			};
		case USER_MY_COMMENT_DELETE_FAILURE:
			return {
				...state,
				MY_COMMENT_DELETE_loading: false,
				MY_COMMENT_DELETE_done: false,
				MY_COMMENT_DELETE_error: action.data
			};
		// 마이페이지 영화 관람평 내역 버튼 상태 케이스
		case USER_MY_COMMENT_SETTING:
			return {
				...state,
				Possiblebuttonstate: action.data.possible,
				Reviewbuttonstate: action.data.review,
				Comment_key: action.data.key
			};
		// 무비 디테일에서 누른 관람평 좋아요 수정 케이스
		case USER_MY_COMMENT_LIKE_UPDATE:
			return {
				...state,
				// 좋아요 버튼을 누른 관람평의 내용을 수정
				MY_COMMENT_List: state.MY_COMMENT_List.map(comment => 
          comment.umid === action.data.umid ? {...comment, like: action.data.like, upcnt: action.data.upcnt} : comment
        )
			}
		default:
      return state;
	}
}

export default R_mypage_movie;