/*
 23-03-11 마이페이지 css 구축(오병주)
*/
import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { HeartOutlined, HeartFilled, StarFilled } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { USER_MLIKE_REQUEST } from '../../reducer/R_movie';
import { TICKET_PAGE_SETTING } from '../../reducer/R_ticket';

const Like= ({ movie }) => {
	const location = useLocation();  
  const dispatch = useDispatch();
	const navigate = useNavigate();

	// 반올림 없이 소수점 생성해주는 함수
  const getNotRoundDecimalNumber = (number, decimalPoint = 1) => {
    let num = typeof number === "number" ? String(number) : number;
    const pointPos = num.indexOf(".");
  
    if (pointPos === -1) return Number(num).toFixed(decimalPoint);
  
    const splitNumber = num.split(".");
    const rightNum = splitNumber[1].substring(0, decimalPoint);
    return Number(`${splitNumber[0]}.${rightNum}`).toFixed(decimalPoint);
  };

	// 영화 좋아요 실패 여부 상태
  const { MLIKE_error } = useSelector((state) => state.R_movie);

	// 사용자가 영화의 좋아요를 누를 때 호출되는 함수
	const LikeChange = useCallback(() => {
		if (!window.confirm("좋아요를 취소하시겠습니까?")) {
      return;
    };

		dispatch({
			type: USER_MLIKE_REQUEST,
			data: {
				mid: movie.mid
			}
		})
	}, [movie.mid, dispatch]);

	// UI에는 변경되지 않았지만 삭제된 영화 좋아요 누를 경우
	useEffect(()=> {
		if (MLIKE_error === movie.mid) {
			alert("존재하지 않는 영화입니다.");
			window.location.replace(location.pathname);
		}
	}, [MLIKE_error, movie.mid, location.pathname]);

	// 예매 버튼을 누를경우 실행되는 함수
	const onClickReserve = useCallback(()=> {
		// 영화 정보
		const temp_movie = {
			mid: movie.mid,
			mtitle: movie.mtitle,
			mgenre: movie.mgenre,
			mrating: movie.mrating,
			mimagepath: movie.mimagepath,
			reserve: true
		}
		
		// 예매페이지 세팅 후 넘어감
		dispatch({
			type: TICKET_PAGE_SETTING,
			data: {
				movie: temp_movie,
				theater: '',
				area: 'seoul',
				day: '',
				movieinfo: '',
				reserve: true,
				like: false
			}
		});
		navigate('/Reserve');
	}, [movie, dispatch, navigate]);

	return (
		<ContentDetail>
			<ContentDetailMiddle>
				<BoxImage>
					<Poster src={`/${movie.mimagepath}`} alt="Poster" />
        </BoxImage>
        <BoxContent>
          <Title>
          	<strong>
              {movie.mtitle}
            </strong>
						<span className="reservation">
							예매율&nbsp; {movie.reserveRate ? movie.reserveRate.toFixed(1) : (0.0).toFixed(1)}%
						</span>
						<span className="rate">
							관람객 평점 
							<StarFilled style={{color :"#fea408", marginLeft: "7px", marginRight: "7px"}}/>
							{movie.mscore ? movie.mscore.toFixed(1) : 0.0.toFixed(1)}
						</span>	
						<span className="more">
							<Link to={`/Moviedetail/${movie.mid}`}> 
								영화 상세정보 보기
							</Link>
						</span>
					</Title>
					<Spec>
						<dl>
							<dt>
								감독 : &nbsp;
							</dt>
							<dd>
								{movie.mdir}
							</dd>
							<br/>
							<dt>
								장르 : &nbsp; 
							</dt>
							<dd>
								{movie.mgenre}
							</dd>
							<br/>
							<dt>
								상영 시간 : &nbsp;
							</dt>
							<dd>
								{movie.mtime}분
							</dd>
							<br/>
							<dt> 
								상영 등급 : &nbsp;
							</dt>
							<dd>
								{movie.mrating === '0' ? "전체 이용가" : movie.mrating === '18' ? '청소년 관람불가' : movie.mrating+"세 이용가"}
							</dd>
							<br />
							<dt>
								개봉일 : &nbsp;
							</dt>
							<dd>
								{movie.mdate}
							</dd>
						</dl>
					</Spec>
					<Buttons>
						<Likes onClick={LikeChange}>
							<div>
								<span>
									{movie.mlike === true ? <HeartFilled style={{color: "red"}} /> : <HeartOutlined />}
								</span>
								<span>
									{movie.mlikes > 999 ? getNotRoundDecimalNumber(movie.mlikes / 1000) + "K" : movie.mlikes}
								</span> 
							</div>
						</Likes>
						<Ticket onClick={onClickReserve} disabled={!movie.reserve} reserve={movie.reserve}>
							{movie.reserve ? '예매' : '상영예정'}
						</Ticket>         
					</Buttons>
				</BoxContent>
			</ContentDetailMiddle>
		</ContentDetail>
	);
};

const ContentDetail = styled.div`
	width: 100%;
	padding: 0 20px;
	margin-bottom: 14px;
	box-sizing: border-box;
	margin: 0;
	border: 1px solid rgb(221, 223, 225);
	margin-top: 15px;
`;

const ContentDetailMiddle = styled.div`
	display: flex;
	flex-direction: row;
	-webkit-box-pack: justify;
	justify-content: space-between;
	padding: 14px 0px 16px;
	box-sizing: border-box;
	margin: 0;
`;

const BoxImage = styled.div`
  margin-right: 25px;
  width: 148px;
  height: 224px;
  float: left;
`;

const Poster = styled.img`
  display: block;
  width: 148px;
  height: 224px;
`;

const BoxContent = styled.div`
  width: 765px;
  float: left;
  position: relative;
`;

const Title = styled.div`
  display: block;
  color: #333333;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border-bottom: 1.5px solid #d9d6c8;
  padding-bottom: 10px;

  strong {
    color: #1a1919;
    font-size: 21px;
    vertical-align: middle;
		text-overflow: ellipsis;
    white-space: nowrap;
		width: 177px;
		display: inline-block;
		overflow: hidden;
  }

	.reservation {
	font-size: 13px;
	position: relative;
	vertical-align: middle;
	margin: 0 13px 0 68px;
	padding: 0 14px 0 0;

	::after {
		content: '';
		display: block;
		position: absolute;
		right: 0;
		top: 50%;
		width: 1px;
		height: 14px;
		margin: -6px 0 0 0;
		background-color: #d9d6c8;
		
		}
	}

	.rate {
		font-size: 13px;
		position: relative;
		vertical-align: middle;
	}
  
	.more {
		font-size: 12px;
		position: relative;
		vertical-align: middle;
		float: right;
		margin-top: 6px;
		margin-right: 4px;

		a {
			text-decoration: none;
			color: rgb(170, 172, 172);
		}
	}
`;

const Spec = styled.div`
  padding-top: 2px;
  line-height: 1.8;
  color: #333333;
  font-size: 14px;
  font-weight: 700;

	dl {
		margin-top: 8px;
	}

  dd {
    white-space: normal;
    text-overflow: clip;
    overflow: visible;
    float: left;
    margin: 0;
    a:link {
      color : #6a6a6a;
    }
    a:visited {
      color : #6a6a6a;
    }
    a:hover {
      color : #000080;
      text-decoration: underline;
    }
    a:active {
      color : #000080;
      text-decoration: underline;
    }
  }
  dt {
    float: left;
  }
`;

const Buttons = styled.div`
  margin-top: 21px;
  display: inline-block;
  margin-right: 3px;
  position: absolute;
  left: 0;
`;

const Likes = styled.div`
  width: 90px;
  height: 36px;
  border: 1px solid #222222;
  line-height: 36px;
  text-align: center;
  display: inline-block;
  border-radius: 4px;
  margin-right: 2px;
  color: #222222;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;

  span:first-child {
    margin-right: 4px;
  }
`;

const Ticket = styled.div`
  margin-left: 4px;
  width: 106px;
  height: 36px;
  border: ${props => props.reserve ? '1px solid #222222' : '1px solid #adadad'};
  background: ${props => props.reserve ? '#503396' : '#adadad'};
  line-height: 36px;
  text-align: center;
  display: inline-block;
  border-radius: 4px;
  margin-right: 2px;
  color: white;
  font-size: 14px;
  font-weight: 400;
  cursor: ${props => props.reserve ? 'pointer' : 'default'};
`;

export default Like;