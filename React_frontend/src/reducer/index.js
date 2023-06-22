import { combineReducers } from "redux";
import R_ticket from "./R_ticket";
import R_user_join from "./R_user_join";
import R_user_login from "./R_user_login";
import R_user_movie from "./R_user_movie";
import R_movie from "./R_movie";
import R_seat from "./R_seat";
import R_timetable from "./R_timetable";
import R_mypage_movie from "./R_mypage_movie";
import R_board from "./R_board";
import R_mypage_reserve from "./R_mypage_reserve";
import R_manager_user from "./R_manager_user";
import R_manager_theater from "./R_manager_theater";
import R_manager_movieinfo from "./R_manager_movieinfo";
import R_manager_board from "./R_manager_board";
import R_manager_movie from "./R_manager_movie";

// 리듀서 파일 생성 시 여기 추가하면 됨.
const rootReducer = combineReducers({
  R_user_join,
  R_ticket,
  R_user_login,
  R_user_movie,
  R_movie,
  R_seat,
  R_timetable,
  R_mypage_movie,
  R_board,
  R_mypage_reserve,
  R_manager_user,
  R_manager_theater,
  R_manager_movieinfo,
  R_manager_board,
	R_manager_movie
});

export default rootReducer;
