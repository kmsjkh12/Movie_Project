import styled from "styled-components";
import React, { useEffect, useCallback } from "react";
import { TIMETABLE_MOVIEINFO_LIST_THEATER_REQUEST } from "../../reducer/R_timetable";
import { TICKET_PAGE_SETTING } from "../../reducer/R_ticket";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";

const TheaterSchedule = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// 필요한 리덕스 상태들
	const { THEATER, DAY, DAY_LIST_loading, MOVIEINFO_LIST_THEATER, LOGIN_data } = useSelector(
		state => ({
			THEATER: state.R_timetable.THEATER,
			DAY: state.R_timetable.DAY,
			DAY_LIST_loading: state.R_timetable.DAY_LIST_loading,
			MOVIEINFO_LIST_THEATER: state.R_timetable.MOVIEINFO_LIST_THEATER,
			LOGIN_data: state.R_user_login.LOGIN_data
		}),
		shallowEqual
	);

	// 극장 선택에 따른 상영정보 조회 useEffect
	useEffect(()=> {
		if (THEATER && DAY && !DAY_LIST_loading) {
			dispatch({
				type: TIMETABLE_MOVIEINFO_LIST_THEATER_REQUEST,
				data: {
					tid: THEATER.tid,
					miday: DAY,
					uid : LOGIN_data.uid
				}
			});
		}
	}, [THEATER, DAY, DAY_LIST_loading, LOGIN_data, dispatch]);

	// 예매하기 버튼 누를떄 실행되는 함수
	const onClickReserve = useCallback((movie, cinema, info)=> {
		// 남은 좌석이 없을경우
		if (cinema.cseat - info.cntSeatInfo === 0) {
			alert('남은 좌석이 없습니다.');
			return;
		}

		// 영화 정보
		const temp_movie = {
			mid: movie.mid,
			mtitle: movie.mtitle,
			mgenre: movie.mgenre,
			mrating: movie.mrating,
			mimagepath: movie.mimagepath,
			reserve: true
		}

		// 극장 정보
		const temp_thater = {
			tid: THEATER.tid,
			tarea: THEATER.tarea,
			tname: THEATER.tname,
			reserve: true
		}

		// 지역 정보
		var eng_area = "";
		if (THEATER.tarea === '서울') {
			eng_area = 'seoul';
		}
		if (THEATER.tarea === '경기') {
			eng_area = 'gyeonggi';
		}
		if (THEATER.tarea === '인천') {
			eng_area = 'incheon';
		}
		if (THEATER.tarea === '부산') {
			eng_area = 'busan';
		}

		// 날짜정보
		const temp_day = {
			miday: DAY,
			reserve: true
		}

		// 상영정보
		const temp_info = {
			miid: info.miid,
			miday: DAY,
			mistarttime: info.mistarttime,
			miendtime: info.miendtime,
			cid: cinema.cid,
			cname: cinema.cname,
			cntSeatAll: cinema.cseat,
			cntSeatInfo: info.cntSeatInfo,
			ctype: cinema.ctype		
		}
		 
		// 예매페이지 세팅 후 넘어감
		dispatch({
			type: TICKET_PAGE_SETTING,
			data: {
				movie: temp_movie,
				theater: temp_thater,
				area: eng_area,
				day: temp_day,
				movieinfo: temp_info,
				reserve: true,
				like: false
			}
		});
		navigate('/Reserve', {state: {url: '/TimeTable'}});
	}, [THEATER, DAY, dispatch, navigate])
	
	return (
		<>
			<ReverseTheaterWrapper>
			{MOVIEINFO_LIST_THEATER.map((movieInfo, index)=>
				<MovieList key={index}>
					<MovieArea>
						<Img src={`img/age/${movieInfo.mrating}.png`} alt="등급"/>
							<span>
								&nbsp;{movieInfo.mtitle}
							</span>
						<MovieTime>
							<div>
								상영시간 {movieInfo.mtime}분
							</div>
						</MovieTime>
					</MovieArea>
					{movieInfo.cinemaDtoList.map((cinema)=>
					<CinemaTypeWrapper key={cinema.cid}>
						<CinemaType>
							<p className="theater-type">
								{cinema.cname}
							</p>
							<p className="chair">
								{cinema.cseat} 좌석
							</p>
						</CinemaType>
						<CinemaTime>
							<Type>
								{cinema.ctype}
							</Type>
							<Time>
								<table>
									<tbody>
										<tr>
										{cinema.movieInfoDtoList.map((info)=>
											<td key={info.miid} onClick={()=> onClickReserve(movieInfo, cinema, info)}>
												<div>
													<span>
														<p className='movietime'>
															{info.mistarttime.substring(11, 16)} ~ {info.miendtime.substring(11, 16)}
														</p>
														<p className='seatinfo'>
															{cinema.cseat - info.cntSeatInfo} / {cinema.cseat}
														</p>
														<p className='reserinfo'>
															예매하기
														</p>
													</span>
												</div>
											</td>
										)}
										</tr>
									</tbody>
								</table>
							</Time>
						</CinemaTime>
					</CinemaTypeWrapper>)}
				</MovieList>)}
			</ReverseTheaterWrapper>
		</>
	);
};

const ReverseTheaterWrapper = styled.div`
	width: 100%;
	display: table;
	border-top: 0;
	padding-top: 40px;
`;

const MovieList = styled.div`
	position: relative;
	padding-bottom: 50px;
`;

const MovieArea = styled.div`
	padding: 0 0 15px 0;
	border-bottom: 1px solid #eaeaea;
	font-weight: 700;
	font-size: 1.2em;

	div {
		color: black;
		text-decoration: none;
	}
`;

const Img = styled.img`
  width: 23px;
  height: 20px;
  position: relative;
  top: 3px;
  padding-right: 5px;
`;

const MovieTime = styled.div`
	position: absolute;
	top: 0;
	right: 0;
`;

const CinemaTypeWrapper =styled.div`
	overflow: hidden;
	width: 100%;
	position: relative;
	border-bottom: 1px solid #eaeaea;
`;

const CinemaType = styled.div`
	text-align: left;
	width: 170px;
	display: table-cell;
	vertical-align: middle;
	position: absolute;
	top: 0;
	left: 0;
	padding: 0!important;
	float: left;

	.theater-type{
		font-size: 1.2em;
		color: #444;
		font-weight: 400;
		margin-bottom: 10px;
		line-height: 1em;
	}
`;

const CinemaTime = styled.div`
	width: 100%;
	float: left;
	margin: 12px 0;
	margin-left: 190px;
`;

const Type = styled.div`
	display: table-cell;
	vertical-align: middle;
	width: 100px;
	box-sizing: border-box;
	background-color: #f2f4f5;
	text-align: center;
	color: #444;
	font-weight: 700;
	border-bottom: 0;
`;

const Time = styled.div`
	display: table-cell;
	width: 800px;

	table {
    margin-left: 9px;
    width: auto;
    table-layout: auto;

    td {
			width: 99px;
			cursor: pointer;
			text-align: center;

			:hover {
				color: white;
				font-weight: 500;
				background: purple;
				border: none;

				.reserinfo {
					display: block;
				}
				.seatinfo {
					display: none;
				}
				div {
					border: 1px solid purple;
				}
			}

			div {
				width: 100%;
				height: 70px;
				display: table;
				border: 1px solid #ededed;
		
				p {
					margin: 0;
				}
				.movietime {
					font-size: 14px;
					margin-bottom: 5px;
					margin-top: 11px;
				}
				.reserinfo {
					display: none;
				}
				.seatinfo {
					display: block;
				}
			}
		}
	}
`;

export default TheaterSchedule;