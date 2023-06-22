/*
	23-03-12 마이페이지 css 구축(오병주)
	23-03-17 마이페이지 관람평 작성 구현(오병주)
*/
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { CloseOutlined } from "@ant-design/icons";
import { Rate } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { USER_MOVIE_POSSIBLE_REQUEST, USER_MY_COMMENT_WRITE_REQUEST, USER_MY_COMMENT_WRITE_RESET, USER_MOVIE_POSSIBLE_UPDATE } from '../../reducer/R_mypage_movie';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 별점 표시를 위한 배열
const desc = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const CommentModal = ({ movie, setwrite }) => {
	const dispatch = useDispatch();
	const location = useLocation();

	// 별점 표시를 위한 useState
	const [value, setValue] = useState(5);
	
	// textarea 내용 변수
	const [comment, setcomment] = useState("");
	const handleCommentChange = e => {
    setcomment(e.target.value);
  };

	// 관람평 작성 확인에 필요한 리덕스 상태
	const { MY_COMMENT_status } = useSelector((state) => state.R_mypage_movie);

	// 관람평 작성 버튼을 누르면 실행되는 함수
	const onSubmit = useCallback(() => {

		// 관람평이 빈칸인지 확인
		if (comment === '') {
			alert("관람평을 작성해 주세요!");
			return;
		}

		if (!window.confirm("관람평을 작성하시겠습니까?")) {
      return;
    }

		// 관람평 작성 요청
		dispatch({
			type: USER_MY_COMMENT_WRITE_REQUEST,
			data: {
				mid: movie.mid,
				mcomment: comment,
				mscore: (value*2)
			}
		});
	}, [dispatch, movie, comment, value]);

	// 관람평 작성 결과에 따른 alert을 위한 useEffect
	useEffect(()=> {
		// 작성 성공
		if (MY_COMMENT_status === 204) {
			dispatch({
				type: USER_MY_COMMENT_WRITE_RESET
			});	

			dispatch({
				type: USER_MOVIE_POSSIBLE_UPDATE,
				data: movie.mid
			});
			setwrite(false);
		}

		// 작성 실패
		if (MY_COMMENT_status === 400) {
			alert("이미 작성된 관람평이 존재합니다.");
			dispatch({
				type: USER_MOVIE_POSSIBLE_REQUEST
			});

			dispatch({
				type: USER_MY_COMMENT_WRITE_RESET
			});
		}
	}, [MY_COMMENT_status, setwrite, movie.mid, location.pathname, dispatch]);

	// 모달창 스크롤 막는 useEffect
	useEffect(() => {
		document.body.style.cssText = `
			position: fixed; 
			top: -${window.scrollY}px;
			overflow-y: scroll;
			width: 100%;`;
		return () => {
			const scrollY = document.body.style.top;
			document.body.style.cssText = '';
			window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
		};
	}, []);

  return (
		<Modal>
			<LoginLayout>
				<div className="header_layout">
					<LoginText>관람평 작성</LoginText>
					<Close onClick={()=> setwrite(false)}>
						<CloseOutlined style={{ fontSize: "25px", color: "white" }} />
					</Close>
				</div>
				<ModalContents>
					<Layout>
						<Form>
							<StarForm>
								<h4 style={{paddingTop: "8px"}}>
									{movie.mtitle}
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
				</ModalContents>
			</LoginLayout>
		</Modal>
  );
};

const Modal = styled.div`
 // 배경에 픽스를 주고 투명도를 준다.
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 10001;
`;

const LoginLayout = styled.div`
  width: 790px;
  height: 351px;
  background-color: white;
  position: absolute;
  box-sizing: border-box;
  margin: 0px auto;
	top: 55%;
	left: 55%;
	transform: translate(-55%, -55%);
  background: #fff;

  .header_layout {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    background: #503396;
  }
`;

const LoginText = styled.h3`
  color: #fff;
  float: left;
  padding-left: 15px;
  padding-top: 10px;
  margin: 0;
`;

const Close = styled.button`
  background-color: #503396;
  float: right;
  margin-right: 10px;
  margin-top: 10px;
  padding: 0;
  border: 0;
  cursor: pointer;
`;

const ModalContents = styled.div`
  margin: 0 auto;
  width: 100%;
  padding: 60px 0px 15px 0px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: column;
  //padding 순서는 상우하좌
`;

const Layout = styled.div`
	overflow: hidden;
	position: relative;
	width: 100%;
	margin: 0;
	padding: 0;
	border: 0;
	vertical-align: baseline;
	word-break: break-all;
`;

const Form = styled.div`
	padding: 15px 0px 15px 0px;
	background: #f8f8f8;
	margin: 0 auto;
	width: 760px;
`;

const StarForm = styled.div`
	text-align: center;

	h4 {
    font-size: 20px;
    text-align: center;
		margin:0;
	}
`;

const RateLine = styled.div`
	margin-right: 45px;
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
	margin-left: 20px;
	margin-top: 25px;
	height: 100px;
	margin-bottom: 20px;
	box-sizing: border-box;
`;

const TextBox = styled.div`
	width: 600px;
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

export default CommentModal;
