/* 
  23-02-02 css 수정 및 Like수 적용(오병주)
  23-02-08 사용자가 누른 Like 적용(오병주)
  23-02-15 페이지 css 수정(오병주)
*/
import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { USER_MLIKE_REQUEST } from "../../reducer/R_movie";
import { useLocation } from "react-router-dom";
import { TICKET_PAGE_SETTING } from "../../reducer/R_ticket";

const Movie = ({ movie }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
  const location = useLocation();

  // 반올림 없이 소수점 생성해주는 함수
  const getNotRoundDecimalNumber = (number, decimalPoint = 1) => {
    let num = typeof number === "number" ? String(number) : number;
    const pointPos = num.indexOf(".");

    if (pointPos === -1) return Number(num).toFixed(decimalPoint);

    const splitNumber = num.split(".");
    const rightNum = splitNumber[1].substring(0, decimalPoint);
    return Number(`${splitNumber[0]}.${rightNum}`).toFixed(decimalPoint);
  };

  // 리덕스 로그인 상태 정보
  const { LOGIN_data } = useSelector((state) => state.R_user_login);
  // 영화 좋아요 실패 여부 상태
  const { MLIKE_error } = useSelector((state) => state.R_movie);

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
					mid: movie.mid,
				}
			});
		}
  }, [movie.mid, LOGIN_data.uid, location.pathname, navigate, dispatch]);

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
    <LI>
      <div className="Image">
        <div className="banner_img">
          <Link to={`/Moviedetail/${movie.mid}`}>
            <Img className="img2" src={movie.mimagepath} alt="영화" />
          </Link>
          <div className="middle">
            <Link to={`/Moviedetail/${movie.mid}`}>
              <Text className="hover_text">상세정보</Text>
              <TextScore>
                관람평 : &nbsp;
                <span>
                  {movie.mscore ? parseInt(movie.mscore).toFixed(1) : (0.0).toFixed(1)}
                </span>
              </TextScore>
            </Link>
          </div>
        </div>
        <Des>
          <div className="title">
            <img
              className="rating"
              src={`img/age/${movie.mrating}.png`}
              alt="rating"
              style={{ width: "30px", height: "30px" }}
            />
            <span title={movie.mtitle}>{movie.mtitle}</span>
          </div>
          <div className="infomation">
            <span className="rate">
              예매율 {movie.reserveRate ? parseInt(movie.reserveRate).toFixed(1) : (0.0).toFixed(1)}%
            </span>
            <span className="date">개봉일 {movie.mdate}</span>
          </div>
        </Des>
        <Button>
          <Like onClick={LikeChange}>
            <span>
              {movie.mlike === true ? (
                <HeartFilled style={{ color: "red" }} />
              ) : (
                <HeartOutlined />
              )}
            </span>
            <span>
              {movie.mlikes > 999
                ? getNotRoundDecimalNumber(movie.mlikes / 1000) + "K"
                : movie.mlikes}
            </span>
          </Like>
					<Ticket disabled={!movie.reserve} reserve={movie.reserve} onClick={onClickReserve}>
						{movie.reserve ? '예매' : '상영예정'}
					</Ticket>
        </Button>
      </div>
    </LI>
  );
};

const LI = styled.li`
  float: left;
  padding-right: 83px;
  width: 245px;
  height: 450px;
  padding-bottom: 15px;

  .banner_img {
    position: relative;

    .middle {
      transition: 0.5s ease;
      opacity: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      text-align: center;
    }

    &:hover .img2 {
      filter: brightness(0.3);
    }

    &:hover .middle {
      opacity: 1;
    }
  }
`;

const Img = styled.img`
  opacity: 1;
  display: block;
  width: 230px;
  height: 331px;
  transition: 0.5s ease;
  backface-visibility: hidden;
  cursor: pointer;
`;

const Text = styled.div`
  position: absolute;
  width: 180px;
  top: -45px;
  left: -127px;
  color: white;
  font-size: 18px;
  padding: 16px 32px;
  cursor: pointer;
  border-color: #fff;
  text-decoration: underline;
`;

const TextScore = styled.div`
  position: absolute;
  width: 180px;
  top: -10px;
  left: -130px;
  color: white;
  font-size: 1em;
  padding: 16px 32px;
  cursor: pointer;
  border-color: #fff;
  font-weight: 500;

  span {
    font-size: 1.5em;
    color: #00cccc;
  }
`;
const Des = styled.div`
  .title {
    display: block;
    padding-top: 10px;

    span {
      display: inline-block;
      overflow: hidden;
      width: 180px;
      font-size: 1.2222em;
      font-weight: 400;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 2px 0 0 1px;
      margin-left: 10px;
      position: relative;
      top: -2px;
    }
  }

  .infomation {
    display: block;

    .rate {
      position: relative;
      display: inline-block;
      font-size: 14.5px;
      font-weight: 400;
      margin: 0 7px 0 0;
      padding: 0 8px 0 0;

      ::after {
        content: "";
        display: block;
        position: absolute;
        right: 0;
        top: 50%;
        width: 1px;
        height: 13px;
        margin: -6px 0 0 0;
        background-color: #d8d9db;
      }
    }
		
    .date {
      position: relative;
      display: inline-block;
      font-size: 14.5px;
      font-weight: 400;
    }
  }
`;

const Button = styled.div`
  position: absolute;
  display: flex;
  padding-top: 10px;
  width: 230px;
`;

const Like = styled.div`
  position: absolute;
  cursor: pointer;
  text-align: center;
  width: 60px;
  height: 31px;
  border: 1px solid;
  font-size: 11pt;
  line-height: 31px;
  border-radius: 4px;
  span:first-child {
    margin-right: 3px;
  }
`;

const Ticket = styled.button`
  position: absolute;
  right: 0px;
  top: 8px;
  margin-left: 10px;
  text-align: center;
  width: 70%;
  padding-left: 10px;
  border-radius: 4px;
  height: 36px;
  text-align: center;
  background: ${props => props.reserve ? '#503396' : '#adadad'};
  cursor: ${props => props.reserve ? 'pointer' : 'default'};
  color: white;
  border: 0;
  font-weight: 400;
  font-size: 16px;
`; // 예매하기 버튼

export default Movie;
