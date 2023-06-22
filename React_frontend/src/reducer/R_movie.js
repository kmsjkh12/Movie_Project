/*
  영화 좋아요는 브라우저에 있는 뒤로가기, 앞으로가기를 누를 경우
  리렌더링이 되지않는 페이지가 많아서 여기 있는 리덕스로 한번에 관리
  + 좋아요를 누를 때 UI 변경을 위해 좋아요 요청을 하는 액션타입은 여기서 실행
*/
// 박스 오피스 영화 리스트
export const BOXMOVIE_REQUEST = "BOXMOVIE_REQUEST";
export const BOXMOVIE_SUCCESS = "BOXMOVIE_SUCCESS";
export const BOXMOVIE_FAILURE = "BOXMOVIE_FAILURE";

// 전체 영화 리스트
export const ALLMOVIE_REQUEST = "ALLMOVIE_REQUEST";
export const ALLMOVIE_SUCCESS = "ALLMOVIE_SUCCESS";
export const ALLMOVIE_FAILURE = "ALLMOVIE_FAILURE";
export const ALLMOVIE_SETTING = "ALLMOVIE_SETTING";

// 현재 상영작 리스트
export const SCREENMOVIE_REQUEST = "SCREENMOVIE_REQUEST";
export const SCREENMOVIE_SUCCESS = "SCREENMOVIE_SUCCESS";
export const SCREENMOVIE_FAILURE = "SCREENMOVIE_FAILURE";
export const SCREENMOVIE_SETTING = "SCREENMOVIE_SETTING";

// 상영 예정작 리스트
export const COMINGMOVIE_REQUEST = "COMINGMOVIE_REQUEST";
export const COMINGMOVIE_SUCCESS = "COMINGMOVIE_SUCCESS";
export const COMINGMOVIE_FAILURE = "COMINGMOVIE_FAILURE";
export const COMINGMOVIE_SETTING = "COMINGMOVIE_SETTING";

// 영화 좋아요 리스트
export const USER_MLIKE_REQUEST = "USER_MLIKE_REQUEST"
export const USER_MLIKE_SUCCESS = "USER_MLIKE_SUCCESS"
export const USER_MLIKE_FAILURE = "USER_MLIKE_FAILURE"

// 영화 세부정보 리스트
export const DETAIL_MOVIE_REQUEST = "DETAIL_MOVIE_REQUEST";
export const DETAIL_MOVIE_SUCCESS = "DETAIL_MOVIE_SUCCESS";
export const DETAIL_MOVIE_FAILURE = "DETAIL_MOVIE_FAILURE";

// 영화 관람평 조회 리스트
export const DETAIL_COMMENT_REQUEST = "DETAIL_COMMENT_REQUEST";
export const DETAIL_COMMENT_SUCCESS = "DETAIL_COMMENT_SUCCESS";
export const DETAIL_COMMENT_FAILURE = "DETAIL_COMMENT_FAILURE";

// 영화 관람평 좋아요 리스트
export const USER_COMMENT_LIKE_REQUEST = "USER_COMMENT_LIKE_REQUEST"
export const USER_COMMENT_LIKE_SUCCESS = "USER_COMMENT_LIKE_SUCCESS"
export const USER_COMMENT_LIKE_FAILURE = "USER_COMMENT_LIKE_FAILURE"

// 사용자가 좋아요 누른 영화 리스트
export const USER_MY_MOVIE_SEARCH_REQUEST = "USER_MY_MOVIE_SEARCH_REQUEST"
export const USER_MY_MOVIE_SEARCH_SUCCESS = "USER_MY_MOVIE_SEARCH_SUCCESS"
export const USER_MY_MOVIE_SEARCH_FAILURE = "USER_MY_MOVIE_SEARCH_FAILURE"

export const initalState = {
  boxmovie_loading: false,
  boxmovie_done: false,
  boxmovie_error: null,

  allmovie_loading: false,
  allmovie_done: false,
  allmovie_error: null,
  allMovieKey: '',
  allMovieSortRate: true,
  allMovieSortLike: false,
  allMovieLimit: 8,
  allMovieId: 'No_login',
  allMovieSearch: '',

  screenmovie_loading: false,
  screenmovie_done: false,
  screenmovie_error: null,
  screenmovieKey: '',
  screenmovieSortRate: true,
  screenmovieSortLike: false,
  screenmovieLimit: 8,
  screenmovieId: 'No_login',
  screenmovieSearch: '',

  comingmovie_loading: false,
  comingmovie_done: false,
  comingmovie_error: null,
  comingmovieKey: '',
  comingmovieSortRate: true,
  comingmovieSortLike: false,
  comingmovieLimit: 8,
  comingmovieId: 'No_login',
  comingmovieSearch: '',

  MLIKE_loading: false,
  MLIKE_done: false,
  MLIKE_error: null,

  detail_movie_loading: false,
  detail_movie_done: false,
  detail_movie_error: null,

  detail_comment_loading: false,
  detail_comment_done: false,
  detail_comment_error: null,

  COMMENT_LIKE_loading: false,
  COMMENT_LIKE_done: false,
  COMMENT_LIKE_error: false,
  COMMENT_LIKE_id: '',

  MY_MOVIE_loading: false,
  MY_MOVIE_done: false,
  MY_MOVIE_error: false,
  MY_MOVIE_key: '',

  boxMovie: [],
  allMovie: [],
  screenMovie: [],
  comingMovie: [],
  detailMovie: [],
  detailComment: [],
  likeMovie: []
};

const R_movie = (state = initalState, action) => {
  switch (action.type) {
    // 박스 오피스 영화 케이스들
    case BOXMOVIE_REQUEST:
      return {
        ...state, 
        boxmovie_loading: true,
        boxmovie_done: false,
        boxmovie_error: null,
      };
    case BOXMOVIE_SUCCESS:
      return {
        ...state,
        boxmovie_loading: false,
        boxmovie_done: true,
        boxmovie_error: null,
        boxMovie: action.data
      };
    case BOXMOVIE_FAILURE:
      return {
        ...state,
        boxmovie_loading: false,
        boxmovie_done: false,
        boxmovie_error: action.error,
        boxMovie: []
      };
    // 전체 영화 케이스들
    case ALLMOVIE_REQUEST:
      return {
        ...state, 
        allmovie_loading: true,
        allmovie_done: false,
        allmovie_error: null,
        allMovieKey: action.data.key,
        allMovieId: action.data.uid,
        allMovieSearch: action.data.search
      };
    case ALLMOVIE_SUCCESS:
      return {
        ...state,
        allmovie_loading: false,
        allmovie_done: true,
        allmovie_error: null,
        allMovie: action.data
      };
    case ALLMOVIE_FAILURE:
      return {
        ...state,
        allmovie_loading: false,
        allmovie_done: false,
        allmovie_error: action.error,
        allMovie: []
      };
    case ALLMOVIE_SETTING:
      return {
        ...state,
        allMovieKey: action.data.key,
        allMovieSortRate: action.data.rate,
        allMovieSortLike: action.data.like,
        allMovieLimit: action.data.limit,
        allMovieId: action.data.uid,
        allMovieSearch: action.data.search
      };
    // 현재 상영작 영화 케이스들
    case SCREENMOVIE_REQUEST:
      return {
        ...state, 
        screenmovie_loading: true,
        screenmovie_done: false,
        screenmovie_error: null,
        screenmovieKey: action.data.key,
        screenmovieId: action.data.uid,
        screenmovieSearch: action.data.search
      };
    case SCREENMOVIE_SUCCESS:
      return {
        ...state,
        screenmovie_loading: false,
        screenmovie_done: true,
        screenmovie_error: null,
        screenMovie: action.data
      };
    case SCREENMOVIE_FAILURE:
      return {
        ...state,
        screenmovie_loading: false,
        screenmovie_done: false,
        screenmovie_error: action.error,
        screenMovie: []
      };
    case SCREENMOVIE_SETTING:
      return {
        ...state,
        screenmovieKey: action.data.key,
        screenmovieSortRate: action.data.rate,
        screenmovieSortLike: action.data.like,
        screenmovieLimit: action.data.limit,
        screenmovieId: action.data.uid,
        screenmovieSearch: action.data.search
      };
    // 상영 예정작 영화 케이스들
    case COMINGMOVIE_REQUEST:
      return {
        ...state, 
        comingmovie_loading: true,
        comingmovie_done: false,
        comingmovie_error: null,
        comingmovieKey: action.data.key,
        comingmovieId: action.data.uid,
        comingmovieSearch: action.data.search
      };
    case COMINGMOVIE_SUCCESS:
      return {
        ...state,
        comingmovie_loading: false,
        comingmovie_done: true,
        comingmovie_error: null,
        comingMovie: action.data
      };
    case COMINGMOVIE_FAILURE:
      return {
        ...state,
        comingmovie_loading: false,
        comingmovie_done: false,
        comingmovie_error: action.error,
        comingMovie: []
      };
    case COMINGMOVIE_SETTING:
      return {
        ...state,
        comingmovieKey: action.data.key,
        comingmovieSortRate: action.data.rate,
        comingmovieSortLike: action.data.like,
        comingmovieLimit: action.data.limit,
        comingmovieId: action.data.uid,
        comingmovieSearch: action.data.search
      };
    // 영화 좋아요 누르는 케이스들
		case USER_MLIKE_REQUEST:
			return {
				...state,
				MLIKE_loading: true,
				MLIKE_done: false,
				MLIKE_error: false
			};
		case USER_MLIKE_SUCCESS:
      // 각각 영화 내용들이 존재하면 그것들에 대한 좋아요 수 및 상태 update
      return {
        ...state,
        boxMovie: state.boxMovie.map(movie => 
          movie.mid === action.data.mid ? {...movie, mlikes: action.data.mlikes, mlike: action.data.mlike} : movie
        ),
        allMovie: state.allMovie.map(movie => 
          movie.mid === action.data.mid ? {...movie, mlikes: action.data.mlikes, mlike: action.data.mlike} : movie
        ),
        screenMovie: state.screenMovie.map(movie => 
          movie.mid === action.data.mid ? {...movie, mlikes: action.data.mlikes, mlike: action.data.mlike} : movie
        ),
        comingMovie: state.comingMovie.map(movie => 
          movie.mid === action.data.mid ? {...movie, mlikes: action.data.mlikes, mlike: action.data.mlike} : movie
        ),
        likeMovie: state.likeMovie.map(movie => 
          movie.mid === action.data.mid ? {...movie, mlikes: action.data.mlikes, mlike: action.data.mlike} : movie
        ),
        detailMovie: state.detailMovie.mid === action.data.mid ?
         {...state.detailMovie, mlikes: action.data.mlikes, mlike: action.data.mlike } : state.detailMovie,
        MLIKE_loading: false,
        MLIKE_done: true,
        MLIKE_error: false
      }
		case USER_MLIKE_FAILURE:
			return {
				...state,
				MLIKE_loading: false,
				MLIKE_done: false,
				MLIKE_error: action.data
			};
    // 영화 세부정보 케이스들
    case DETAIL_MOVIE_REQUEST:
      return {
        ...state, 
        detail_movie_loading: true,
        detail_movie_done: false,
        detail_movie_error: null
      };
    case DETAIL_MOVIE_SUCCESS:
      return {
        ...state,
        detail_movie_loading: false,
        detail_movie_done: true,
        detail_movie_error: null,
        detailMovie: action.data
      };
    case DETAIL_MOVIE_FAILURE:
      return {
        ...state,
        detail_movie_loading: false,
        detail_movie_done: false,
        detail_movie_error: action.error
      };
    // 영화 관람평 조회 케이스
    case DETAIL_COMMENT_REQUEST:
      return {
        ...state, 
        detail_comment_loading: true,
  			detail_comment_done: false,
  			detail_comment_error: null,
      };
    case DETAIL_COMMENT_SUCCESS:
      return {
        ...state,
        detail_comment_loading: false,
  			detail_comment_done: true,
  			detail_comment_error: null,
        detailComment: action.data
      };
    case DETAIL_COMMENT_FAILURE:
      return {
        ...state,
        detail_comment_loading: false,
  			detail_comment_done: false,
  			detail_comment_error: action.error,
        detailComment: []
      };
    // 영화 관람평 좋아요 케이스들
		case USER_COMMENT_LIKE_REQUEST:
			return {
				...state,
				COMMENT_LIKE_loading: true,
				COMMENT_LIKE_done: false,
				COMMENT_LIKE_error: false
			};
		case USER_COMMENT_LIKE_SUCCESS:
			return {
				...state,
        detailComment: state.detailComment.map(comment => 
          comment.umid === action.data.umid ? {...comment, like: action.data.like, upcnt: action.data.upcnt} : comment
        ),
				COMMENT_LIKE_loading: false,
				COMMENT_LIKE_done: true,
				COMMENT_LIKE_error: false,
        COMMENT_LIKE_result: action.data
			};
		case USER_COMMENT_LIKE_FAILURE:
			return {
				...state,
				COMMENT_LIKE_loading: false,
				COMMENT_LIKE_done: false,
				COMMENT_LIKE_error: action.data.umid
			};
    // 사용자가 좋아요 누른 영화 케이스들
		case USER_MY_MOVIE_SEARCH_REQUEST:
			return {
				...state,
        MY_MOVIE_loading: true,
        MY_MOVIE_done: false,
        MY_MOVIE_error: false,
        MY_MOVIE_key: action.data
			};
		case USER_MY_MOVIE_SEARCH_SUCCESS:
			return {
				...state,
        MY_MOVIE_loading: false,
        MY_MOVIE_done: true,
        MY_MOVIE_error: false,
        likeMovie: action.data
			};
		case USER_MY_MOVIE_SEARCH_FAILURE:
			return {
				...state,
        MY_MOVIE_loading: false,
        MY_MOVIE_done: false,
        MY_MOVIE_error: true,
        likeMovie: []
			};
    default:
      return state;
  }
};

export default R_movie;
