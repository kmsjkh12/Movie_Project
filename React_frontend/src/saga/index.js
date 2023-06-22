import { all, fork } from "redux-saga/effects";
import S_user_join from "./S_user_join";
import S_ticket from "./S_ticket";
import S_user_login from "./S_user_login";
import S_movie from "./S_movie";
import S_user_movie from "./S_user_movie";
import S_seat from "./S_seat";
import S_timetable from "./S_timetable";
import S_mypage_movie from "./S_mypage_movie";
import S_board from "./S_board";
import S_mypage_reserve from "./S_mypage_reserve";
import S_manager_user from "./S_manager_user";
import S_manager_theater from "./S_manager_theater";
import S_manager_movieinfo from "./S_manager_movieinfo";
import S_manager_board from "./S_manager_board";
import S_manager_movie from "./S_manager_movie";

//사가 파일 추가 시 rootSaga 안에 fork해주면 됨
export default function* rootSaga() {
  yield all([
    fork(S_user_join),
    fork(S_ticket),
    fork(S_user_login),
    fork(S_movie),
    fork(S_user_movie),
    fork(S_seat),
    fork(S_timetable),
    fork(S_mypage_movie),
    fork(S_board),
    fork(S_mypage_reserve),
    fork(S_manager_user),
    fork(S_manager_theater),
    fork(S_manager_movieinfo),
    fork(S_manager_board),
		fork(S_manager_movie)
  ]);
}
