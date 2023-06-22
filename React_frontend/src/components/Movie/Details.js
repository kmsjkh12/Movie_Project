/*
 23-02-11 영화 상세내용 페이지 구현(오병주)
 23-02-15 페이지 css 수정(오병주)
*/
import React, { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HeartOutlined, HeartFilled, StarFilled } from "@ant-design/icons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { DETAIL_MOVIE_REQUEST, USER_MLIKE_REQUEST  } from "../../reducer/R_movie";
import { TICKET_PAGE_SETTING } from "../../reducer/R_ticket";
import MovieSearchLoading from "./MovieSearchLoading";

const Details = () => {
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

	// 필요한 리덕스 상태들
  const { LOGIN_data, LOGIN_STATUS_loading, detailMovie, MLIKE_error, detail_movie_loading } = useSelector(
    state => ({
			LOGIN_data: state.R_user_login.LOGIN_data,
			LOGIN_STATUS_loading: state.R_user_login.LOGIN_STATUS_loading,
      detailMovie: state.R_movie.detailMovie,
      MLIKE_error: state.R_movie.MLIKE_error,
			detail_movie_loading: state.R_movie.detail_movie_loading
    }),
    shallowEqual
  );

  // 로그인 상태에 따라 영화 검색이 다름(좋아요 표시 때문)
  useEffect(() => {
    dispatch({
      type: DETAIL_MOVIE_REQUEST,
      data: {
        pathname: location.pathname,
        uid: LOGIN_data.uid
      }
    });
  }, [LOGIN_data.uid, location.pathname, dispatch]);

  // 사용자가 영화의 좋아요를 누를 때 호출되는 함수
  const LikeChange = useCallback(() => {
    // 로그인 상태 확인
		if (LOGIN_data.uid === "No_login") {
			if (!window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
				return;
			} 
			else {
				navigate(`/UserLogin`, {state: {url: location.pathname}});
			}
		}
		else {
			dispatch({
				type: USER_MLIKE_REQUEST,
				data: {
					mid: detailMovie.mid
				}
			});
		}
  }, [detailMovie.mid, LOGIN_data.uid, location.pathname, navigate, dispatch]);

  // UI에는 변경되지 않았지만 삭제된 영화 좋아요 누를 경우
  useEffect(()=> {
    if (MLIKE_error === detailMovie.mid) {
      alert("존재하지 않는 영화입니다.");
      window.location.assign('/');
    }
  }, [MLIKE_error, detailMovie.mid, location.pathname]);

	// 예매 버튼을 누를경우 실행되는 함수
	const onClickReserve = useCallback(()=> {
		// 영화 정보
		const temp_movie = {
			mid: detailMovie.mid,
			mtitle: detailMovie.mtitle,
			mgenre: detailMovie.mgenre,
			mrating: detailMovie.mrating,
			mimagepath: detailMovie.mimagepath,
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

	}, [detailMovie, dispatch, navigate]);

  // 감독 또는 배우 클릭시 링크 만드는 함수
  const anchor = useCallback((value) => {
    if (value === undefined) {
      return;
    }
    return "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=" + value.replace(',', '');;
  }, []);

  return (
    <Container>
      {detail_movie_loading || LOGIN_STATUS_loading? <MovieSearchLoading height={1050}/> : 
      <Content>
        <Wrapper>
          <BaseMovie>
            <BoxImage>
              <Poster src={`/${detailMovie.mimagepath}`} alt="Poster" />
            </BoxImage>
            <BoxContent>
              <Title>
                <strong>
                  {detailMovie.mtitle}
                </strong>
                <div className="info">
                  <span className="reservation">
                    예매율&nbsp; {detailMovie.reserveRate ? detailMovie.reserveRate.toFixed(1) : (0.0).toFixed(1)}%
                  </span>
                  <span className="rate">
                    관람객 평점 
                    <StarFilled style={{color :"#fea408", marginLeft: "7px", marginRight: "7px"}}/>
                    {detailMovie.mscore ? detailMovie.mscore.toFixed(1) : 0.0.toFixed(1)}
                  </span>
                </div>
              </Title>
              <Spec>
                <dl>
                  <dt>
                    감독 : &nbsp;
                  </dt>
                  <dd>
                    <a
                      href={anchor(detailMovie.mdir)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {detailMovie.mdir}
                    </a>
                  </dd>
                  <br/>
                  <dt> 
                    배우 : &nbsp;
                  </dt>
                  {detailMovie.actors && detailMovie.actors.map((actor) => 
                    (<dd key={actor}>
                      <a
                      href={anchor(actor)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {actor}
                    </a>
                    &nbsp;&nbsp;
                    </dd>))}
                  <br />
                  <dt>
                    장르 : &nbsp; 
                  </dt>
                  <dd>
                    {detailMovie.mgenre} &nbsp;/
                  </dd>
                  <dt>
                    &nbsp; 상영 시간 : &nbsp;
                  </dt>
                  <dd>
                    {detailMovie.mtime}분
                  </dd>
                  <br/>
                  <dt> 
                    상영 등급 : &nbsp;
                  </dt>
                  <dd>
                    {detailMovie.mrating === '0' ? "전체 이용가" : detailMovie.mrating === '18' ? '청소년 관람불가' : detailMovie.mrating+"세 이용가"}
                  </dd>
                  <br />
                  <dt>
                    개봉일 : &nbsp;
                  </dt>
                  <dd>
                    {detailMovie.mdate}
                  </dd>
                </dl>
              </Spec>
              <Like>
                <Likes onClick={LikeChange}>
                  <div>
                    <span>
                      {detailMovie.mlike === true ? <HeartFilled style={{color: "red"}} /> : <HeartOutlined />}
                    </span>
                    <span>
                      {detailMovie.mlikes > 999 ? getNotRoundDecimalNumber(detailMovie.mlikes / 1000) + "K" : detailMovie.mlikes}
                    </span> 
                  </div>
                </Likes>
                <Ticket onClick={onClickReserve} disabled={!detailMovie.reserve} reserve={detailMovie.reserve}>
                  {detailMovie.reserve ? '예매' : '상영예정'}
                </Ticket>         
              </Like>
            </BoxContent>
            <ColsContent>
            <ColsDetails>
              <Story>
                <span dangerouslySetInnerHTML={{__html: detailMovie.mstory}}/>
              </Story>
            </ColsDetails>
          </ColsContent>
          </BaseMovie>
        </Wrapper>
      </Content>}
    </Container>
  );
};

const Container = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
  word-break: break-all;
`;

const Content = styled.div`
  clear: both;
  padding-bottom: 50px;
  position: relative;
  width: 1050px;
  margin: 0 auto;
`;

const Wrapper = styled.div``;

const BaseMovie = styled.div`
  padding-top: 40px;
`;

const BoxImage = styled.div`
  margin-right: 30px;
  width: 185px;
  height: 268px;
  float: left;
`;

const Poster = styled.img`
  display: block;
  width: 185px;
  height: 268px;
  border-radius: 7px;
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
    font-size: 25px;
    vertical-align: middle;
  }

  .info {
    display: block;
    margin-top: 5px;

    .reservation {
    font-size: 14px;
    position: relative;
    margin: 0 13px 0 0;
    padding: 0 13px 0 0;

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
      font-size: 14px;
      position: relative;
    }
  }
`;

const Spec = styled.div`
  padding-top: 2px;
  line-height: 1.8;
  color: #333333;
  font-size: 14px;
  font-weight: 700;
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

const Like = styled.div`
  margin-top: 27px;
  display: inline-block;
  margin-right: 3px;
  position: absolute;
  left: 0;
`;

const Likes = styled.div`
  width: 104px;
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
  margin-left: 3px;
  width: 120px;
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

const ColsContent = styled.div`
  margin-right: 30px;
  margin-top: 35px;
  float: left;
`;

const ColsDetails = styled.div`
  margin-right: 30px;
  float: left;
  position: relative;
  width: 1020px;
`;

const Story = styled.div`
  margin-right: 30px;
  float: left;
  color: #000000; 
  font-size: 15px;
  font-weight: 400;
  line-height: 1;

  span {
    color: #000000 !important;
  }
`;

export default Details;
