/*
 23-02-02 css 수정 및 Like수 적용(오병주)
 23-02-08 사용자가 누른 Like 적용(오병주)
 23-03-07 영화 정렬 추가(오병주)
*/
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { ALLMOVIE_REQUEST, ALLMOVIE_SETTING } from "../../reducer/R_movie";
import Movie from "./Movie";
import MovieSearchLoading from "./MovieSearchLoading";
import styled from "styled-components";
import { Input } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
const { Search } = Input;

const AllMovieList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // 리덕스에 있는 allmovie 상태들
  const { allMovie, allmovie_loading, allMovieKey, allMovieSortRate, allMovieSortLike, 
    allMovieLimit, allMovieId, allMovieSearch } = useSelector(
    state => ({
      allMovie: state.R_movie.allMovie,
      allmovie_loading: state.R_movie.allmovie_loading,
      allMovieKey: state.R_movie.allMovieKey,
      allMovieSortRate: state.R_movie.allMovieSortRate,
      allMovieSortLike: state.R_movie.allMovieSortLike,
      allMovieLimit: state.R_movie.allMovieLimit,
      allMovieId: state.R_movie.allMovieId,
      allMovieSearch: state.R_movie.allMovieSearch
    }),
    shallowEqual
  );

  // 로그인 리덕스 상태
  const { LOGIN_data } = useSelector((state) => state.R_user_login);

  // UL의 높이를 구하기 위한 useRef
  const UL_Ref = useRef();
  const [Height, setHeight] = useState(962.2);
  const [Limit, setLimit] = useState(allMovieLimit); // 더보기 리미트

  // 검색칸 내용 변수
  const [search, setsearch] = useState(allMovieSearch);
  const handleSearchChange = e => {
    setsearch(e.target.value);
  };

  // 정렬 버튼 css 변수
	const [ratebutton, setratebutton] = useState(allMovieSortRate);
	const [likebutton, setlikebutton] = useState(allMovieSortLike);

  // 로그인 상태에 따라 전체 검색이 다름(좋아요 표시 때문)
  useEffect(() => {
    // 사용자가 브라우저에 있는 뒤로가기 또는 앞으로가기 버튼을 누른것을 감지
    if (allMovieKey !== location.key) {
      dispatch({
        type: ALLMOVIE_REQUEST,
        data: {
          uid: LOGIN_data.uid,
          button: 'rate',
          search: '',
          key: location.key
        }
      });
      setratebutton(true);
      setlikebutton(false);
      setLimit(8);
    }

    // 리덕스 상태에 있는 사용자 아이디가 바뀐것을 감지
    if (allMovieId !== LOGIN_data.uid) {
      dispatch({
        type: ALLMOVIE_REQUEST,
        data: {
          uid: LOGIN_data.uid,
          button: 'rate',
          search: '',
          key: location.key
        }
      });
    }

    // 페이지를 탈출할 때 현재 페이지의 정보를 리덕스에 저장
    return () => {
      dispatch({
        type: ALLMOVIE_SETTING,
        data: {
          key: location.key,
          rate: ratebutton,
          like: likebutton,
          limit: Limit,
          uid: LOGIN_data.uid,
          search: search
        }
      });
    };
  }, [allMovieKey, allMovieId, location, LOGIN_data, search, ratebutton, likebutton, Limit, dispatch]);

  // 최신순 버튼을 누를 때
	const clickrate = useCallback(()=> {
		dispatch({
      type: ALLMOVIE_REQUEST,
      data: {
        uid: LOGIN_data.uid,
        button: 'rate',
        search: search.trim(),
        key: location.key
      }
    });
		setratebutton(true);
		setlikebutton(false);

    setLimit(8);
    // UL의 높이 갱신
    var UL_Ref_style = window.getComputedStyle(UL_Ref.current);
    var UL_Ref_height = UL_Ref_style.getPropertyValue("height");
    setHeight(parseInt(UL_Ref_height) + 32.4);

	}, [LOGIN_data.uid, search, location, dispatch])

	// 공감순 버튼을 누를 때
	const clicklike = useCallback(()=> {
		dispatch({
      type: ALLMOVIE_REQUEST,
      data: {
        uid: LOGIN_data.uid,
        button: 'like',
        search: search.trim(),
        key: location.key
      }
    });
		setlikebutton(true);
		setratebutton(false);

    setLimit(8);
    // UL의 높이 갱신
    var UL_Ref_style = window.getComputedStyle(UL_Ref.current);
    var UL_Ref_height = UL_Ref_style.getPropertyValue("height");
    setHeight(parseInt(UL_Ref_height) + 32.4);

	}, [LOGIN_data.uid, search, location, dispatch])

  // 검색 버튼 누를때 실행되는 함수
  const onSearch = useCallback(() => {

    // 예매순 버튼이 눌러져있을 경우
    if (ratebutton) {
      dispatch({
        type: ALLMOVIE_REQUEST,
        data: {
          uid: LOGIN_data.uid,
          button: 'rate',
          search: search.trim(),
          key: location.key
        }
      });
    }
    // 공감순 버튼이 눌러져있을 경우
    else {
      dispatch({
        type: ALLMOVIE_REQUEST,
        data: {
          uid: LOGIN_data.uid,
          button: 'like',
          search: search.trim(),
          key: location.key
        }
      });
    }

    setLimit(8);
    // UL의 높이 갱신
    var UL_Ref_style = window.getComputedStyle(UL_Ref.current);
    var UL_Ref_height = UL_Ref_style.getPropertyValue("height");
    setHeight(parseInt(UL_Ref_height) + 32.4);
  }, [LOGIN_data.uid, ratebutton, search, location, dispatch]);

  // 더보기 버튼을 누를경우 limit를 증가시켜줌
  const onMoreClick = useCallback(() => {
    setLimit(Limit + 8);
  }, [Limit]);

  return (
    <Container>
      <InnerWraps>
        <div className="titleMenu">
          <h1>전체영화</h1>
        </div>
        <div className="search">
          <p>
            {`${allMovie.slice(0, Limit).length}개의 영화가 검색되었습니다.`}
          </p>
          <ButtonList>
            <ButtonWrap>
              <button className={"btn" + (ratebutton ? " active" : "")} onClick={clickrate}>
                예매순
              </button>
            </ButtonWrap>
            <ButtonWrap>
              <button className={"btn" + (likebutton ? " active" : "")} onClick={clicklike}>
                공감순
              </button>
            </ButtonWrap>
          </ButtonList>
          <div className="search_button">
            <SearchWarp
              placeholder="영화명 검색"
              allowClear
              onSearch={onSearch}
              value={search}
              onChange={handleSearchChange}
              style={{
                width: 200,
                height: 10,
              }}
            />
          </div>
        </div>
        {/* 처음 랜더링 될때 로딩화면 */}
        {allMovie.length === 0 && Height === 962.2 ? (
          <div>
            <MovieSearchLoading height={Height} />
          </div>
        ) : null}
        {allmovie_loading ? (
          <MovieSearchLoading height={Height} />
        ) : (
          <div className="movie-list">
            <UL ref={UL_Ref}>
              {/* 영화 검색 결과에 따라 다른 화면을 출력 */}
              {allMovie.length !== 0 ? (
                allMovie
                  .slice(0, Limit)
                  .map((movie) => <Movie movie={movie} key={movie.mid}/>)
              ) : (
                <NoSearch>
                  <p>현재 상영중인 영화가 없습니다.</p>
                </NoSearch>
              )}
            </UL>
          </div>
        )}
        {Limit >= allMovie.length ? (
          ""
        ) : (
          <More onClick={onMoreClick}>
            더보기 <DownOutlined />
          </More>
        )}
      </InnerWraps>
    </Container>
  );
};

const Container = styled.div`
  padding: 0;
  width: 1235px;
  margin : 0 auto;
  box-sizing: border-box; 
  margin-bottom: 0;
`;

const InnerWraps = styled.div`
  width: 100%;
  padding-left: 10px;

  .titleMenu {
    position: relative;
    top: 18px;
  }
  .search {
    position: relative;
    width: 98.4%;
    border-bottom: 3px solid #241d1e;
    padding-bottom: 5px;
    margin-top: 30px;

    p {
      font-weight: 1000;
      padding-top: 8px;
    }

    .search_button {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
`;

const SearchWarp = styled(Search)`
  span {
    .ant-input-clear-icon {
      display: none;
    }
    .ant-input-affix-wrapper {
      border-color: #a0a0a0;
    }
    .ant-input-group-addon {
      border-color: #a0a0a0;
    }
    .ant-btn {
      border-color: #a0a0a0;
    }
    .ant-input::placeholder {
      color: #a0a0a0;
    }
  }
`;

const UL = styled.ul`
  align-items: center;
  list-style-type: none;
  width: 100%;
  height: 100%;
  padding: 0;

  &:after {
    content: "";
    clear: both;
    display: block;
  }

  li:nth-child(4n) {
    padding-right: 0px !important;
  }
`;

const NoSearch = styled.div`
  width: 98.4%;
  padding: 95px 0 95px 0;
  color: #222;
  text-align: center;
  font-size: 1.3333em;

  p {
    margin: 0;
    padding: 90px 0;
    border: 2px solid #f5f5f5;
    border-width: 2px 0 2px 0;
  }
`;

const More = styled.button`
  margin-bottom: 70px;
  width: 98.5%;
  height: 40px;
  background-color: transparent;
  border: 1px solid gainsboro;
  color: #666;
  cursor: pointer;
  font-size: 1em;
  line-height: 1.15;
  &:hover {
    border: 1px solid black;
  }
`;

const ButtonList = styled.ul`
	position: absolute;
	margin-left: 5px !important;
	list-style: none;
	margin: 0;
	padding: 0;
  top: 16%;
  right: 18%;

	::after{
		content: '';
    display: block;
    position: absolute;
    left: 60px;
    top: 3px;
    width: 1px;
    height: 16px;
    background-color: #ccc;
	}

	li:first-child {
		margin-left: 0px;
	}
`;

const ButtonWrap = styled.li`
	margin-left: 23px;
	list-style: none;
	display: list-item;
	float: left;

	.btn {
		content: "";
		cursor: pointer;
		background-color: white;
		display: block;
		position: relative;
		color: #999;
		font-size: 16px;
		border: 0;
		padding: 0;

		&.active {
      color: #000;
    }
	}
`;

export default AllMovieList;
