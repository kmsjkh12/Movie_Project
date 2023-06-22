/*
 23-02-02 css 수정 및 Like수 적용(오병주)
 23-02-08 사용자가 누른 Like 적용(오병주)
*/
import React, { useEffect } from "react";
import Box from "./Box";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BOXMOVIE_REQUEST } from "../../reducer/R_movie";

const BoxList = () => {
  const dispatch = useDispatch();

  // 로그인 리덕스 상태
  const { LOGIN_data } = useSelector((state) => state.R_user_login);

  // 로그인 상태에 따라 전체 검색이 다름(좋아요 표시 때문)
  useEffect(() => {
    dispatch({
      type: BOXMOVIE_REQUEST,
      data: {
        uid: LOGIN_data.uid,
        button: 'rate',
        search: ''
      }
    });
  }, [LOGIN_data.uid, dispatch]);

  // 영화 리덕스 상태
  const { boxMovie } = useSelector((state) => state.R_movie);

  return (
    <CardList>
      <div style={{ paddingBottom: "40px" }}>
        <Title>박스오피스</Title>
        <Link to="/Allmovie">
          <More>
            더 많은 영화보기 <PlusOutlined />
          </More>
        </Link>
      </div>
      <UL>
        {boxMovie.slice(0, 4).map((movie) => (
          <Box movie={movie} key={movie.mid} />
        ))}
      </UL>
    </CardList>
  );
};

const CardList = styled.div`
  color: #fff;
  position: relative;
  margin-top: 30px;
`;

const Title = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 80px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  transform: translate(-50%, 0);
`;

const More = styled.div`
  position: absolute;
  font-size: 13px;
  top: 11px;
  right: 100px;
  color: #808080;
  cursor: pointer;
`;

const UL = styled.ul`
  position: relative;
  display : flex;
  justify-content: center;
  align-items : center;
  list-style-type: none;
  margin-bottom: 45px;
  padding: 0;

  &:after {
    content: "";
    clear: both;
    display: block;
  }

  & li:last-child {
    padding-right: 0px !important; 
  }
`;

export default BoxList;
