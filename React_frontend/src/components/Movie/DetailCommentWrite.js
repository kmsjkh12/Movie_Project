/*
 23-02-12 유저 관람평 작성 구현(오병주)
 23-02-25 유저 관람평 작성 수정(오병주)
*/
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Rate } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { USER_COMMENT_WRITE_REQUEST, USER_COMMENT_WRITE_RESET } from '../../reducer/R_user_movie';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// 별점 표시를 위한 배열
const desc = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const DetailCommentWrite = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	// 별점 표시를 위한 useState
	const [value, setValue] = useState(5);
	
	// textarea 내용 변수
	const [comment, setcomment] = useState("");
	const handleCommentChange = e => {
    setcomment(e.target.value);
  };

	// 필요한 리덕스 상태들
  const { LOGIN_data, detailMovie, WRITE_code } = useSelector(
    state => ({
			LOGIN_data: state.R_user_login.LOGIN_data,
      detailMovie: state.R_movie.detailMovie,
      WRITE_code: state.R_user_movie.WRITE_code
    }),
    shallowEqual
  );

	// 관람평 작성 버튼을 누르면 실행되는 함수
	const onSubmit = useCallback(() => {
		// 로그인 상태 확인
		if (LOGIN_data.uid === "No_login") {
			if (!window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
				return;
			} 
			else {
				navigate(`/UserLogin`, {state: {url: location.pathname}});
				return;
			}
		}

		// 관람평이 빈칸인지 확인
		if (comment === '') {
			alert("관람평을 작성해 주세요!")
			return;
		}

		if (!window.confirm("관람평을 작성하시겠습니까?")) {
      return;
    };

		// 관람평 작성 요청
		dispatch({
			type: USER_COMMENT_WRITE_REQUEST,
			data: {
				mid: detailMovie.mid,
				mcomment: comment,
				mscore: (value*2)
			}
		})

	}, [dispatch, navigate, location.pathname, LOGIN_data.uid, detailMovie.mid, comment, value]);

	// 관람평 작성 실패에 따른 alert을 위한 useEffect
	useEffect(()=> {
		// 작성 성공시 입력칸 초기화
		if (WRITE_code === 204) {
			setValue(5);
			setcomment("");
		}

		if (WRITE_code === "MC002") {
			alert("이미 작성된 관람평이 존재합니다.");
			dispatch({
				type: USER_COMMENT_WRITE_RESET
			})
			return;
		}

		if (WRITE_code === "MC003") {
			alert("영화 관람기록이 존재하지 않습니다.");
			dispatch({
				type: USER_COMMENT_WRITE_RESET
			});
		}
	}, [WRITE_code, location.pathname, dispatch]);

	return (
		<Layout>
			<Form>
				<StarForm>
					<h4 style={{paddingTop: "8px"}}>
						평점 및 관람평 작성
					</h4>
					<RateLine>
						<Rate allowHalf onChange={setValue} value={value} style={{fontSize: "50px"}} allowClear={false}/>
						{value ? <span className="rate-text">{desc[(value * 2) - 1]}</span> : ''}
					</RateLine>
				</StarForm>
				<ReviewBox>
					<TextBox>
						<textarea placeholder='예매하신 영화가 끝난 이후 1회의 한해서 평점 및 관람평을 작성하실 수 있습니다.' 
						spellCheck={false} maxLength="149" value={comment} onChange={handleCommentChange}>
						</textarea>
						<span className='text_info'>
							<strong style={{marginRight: "2px"}}>
								{comment.length}
							</strong>
							/
							<em>
								150
							</em>
						</span>
					</TextBox>
					<ReviewSubmit onClick={onSubmit}>
						관람평 작성
					</ReviewSubmit>
				</ReviewBox>		
			</Form>
		</Layout>
	)
};

const Layout = styled.div`
	overflow: hidden;
	position: relative;
	width: 100%;
	margin: 0;
	padding: 0;
	border: 0;
	vertical-align: baseline;
	word-break: break-all;
	margin-top: 50px;
`;

const Form = styled.div`
	padding: 15px 35px 15px 35px;
	background: #f8f8f8;
	margin: 0 auto;
	width: 980px;
`;

const StarForm = styled.div`
	display: block;
	h4{
    font-size: 20px;
    text-align: center;
		margin:0;
	}
`;

const RateLine = styled.div`
	margin-right: 35px;
	position: relative;
	text-align: center;
	
	.rate-text{
		position: absolute;
		display: inline-block;
		line-height: normal;
		font-size: 40px;
  	padding: 13px;
	}
`;

const ReviewBox = styled.div`
	margin-left: 38px;
	margin-top: 25px;
	height: 100px;
	margin-bottom: 20px;
	box-sizing: border-box;
`;

const TextBox = styled.div`
	width: 799px;
	background: #fff;
	border: 1px solid #ccc;
	float: left;
	height: 100px;

	textarea {
		height: 78px;
    border: none !important;
		width: 100%;
    line-height: 1.5;
    box-sizing: border-box;
    padding: 13px 18px;
    border: 1px solid #DDD;
    resize: none;
    font-size: 14px;
		font-family: 'Raleway', sans-serif;
		font-weight: 700;
		color: #000;
		:focus {
  		outline: none;
		}
	}

	.text_info {
		display: block;
    margin: 0 10px 10px 0;
    text-align: right;
    color: #666;
		font-size: 12px;
	}
`;

const ReviewSubmit = styled.button`
	background: #414141;
	float: left;
	width: 115px;
	height: 103px;
	border: none;
	margin: -1px -1px 0 0;
	padding: 0;
	color: #fff;
	font-size: 15px;
	cursor: pointer;
`;

export default DetailCommentWrite;