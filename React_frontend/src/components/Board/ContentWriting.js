/*
  23-05-16 게시물 페이지 수정(오병주)
*/
import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";
import styled from "styled-components";
import ReactQuill, { Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css';
import ImageResize from '@looop/quill-image-resize-module-react';
import { useSelector ,useDispatch, shallowEqual } from "react-redux";
import { http } from "../../lib/http";
import { BOARD_WRITE_REQUEST } from "../../reducer/R_board";
import { useLocation, useNavigate } from "react-router-dom";
Quill.register('modules/ImageResize', ImageResize);

const selectList = ["자유 게시판", "영화 뉴스", "영화 토론"];

const ContentWriting = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const quillRef = useRef();

	// 필요한 리덕스 상태들
  const { BOARD_WRITE_done, BOARD_WRITE_error } = useSelector(
    state => ({
      BOARD_WRITE_done: state.R_board.BOARD_WRITE_done,
			BOARD_WRITE_error: state.R_board.BOARD_WRITE_error
    }),
    shallowEqual
  ); 

	// 카테고리 지정
	const [Selected, setSelected] = useState("자유 게시판");
	const handleSelect = useCallback((e) => {
		setSelected(e.target.value);
	}, []);

	// 게시글 제목
  const [title, setTitle] = useState('');
  const handleTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

	// 게시글 내용
	const [Board_Content, setContent] = useState('');
	const onEditorChange = useCallback((value) => {
		setContent(value);
	}, []);

	// 이미지 추가시 사용되는 함수
  const imageHandler = () => {
    // file input 임의 생성
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.onchange = async() => {
			const file = input.files;
			const formData = new FormData();

			if (file) {
				formData.append("multipartFiles", file[0]);
			}

			// file 데이터 담아서 서버에 전달하여 이미지 업로드
			const res = await http.post('/Board/auth/uploadImage', formData);

			if (quillRef.current) {
				// 현재 Editor 커서 위치에 서버로부터 전달받은 이미지 불러오는 url을 이용하여 이미지 태그 추가
				const index = (quillRef.current.getEditor().getSelection()).index;

				const quillEditor = quillRef.current.getEditor();
				quillEditor.setSelection(index, 1);
				quillEditor.clipboard.dangerouslyPasteHTML(index, `<img src=${res.data.image} alt='이미지'/>`);
			}
		}
	};

	// quill 라이브러리 설정값
	const modules = useMemo (() => ({
		toolbar: {
			container : [
				[{ 'header': [1, 2, false] }],
				['bold', 'italic', 'underline','strike', 'blockquote'],
				[{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
				['link', 'image'],
				[{ 'align': [] }, { 'color': [] }, { 'background': [] }],
				['clean']
			],
			handlers: {
				image: imageHandler
			},
		}, 
		ImageResize : {
    	modules : ['Resize', 'DisplaySize']
    }
	}), []);
	
	// quill 라이브러리 설정값
	const formats = [
		'header',
		'bold', 'italic', 'underline', 'strike', 'blockquote',
		'list', 'bullet', 'indent',
		'link', 'image',
		'align', 'color', 'background',
		'width'  
	];

	// 작성하기 버튼 누를때 실행되는 함수
	const onWrite = useCallback(()=> {
		// 제목 빈칸 예외처리
		if (title.trim() === '') {
			alert('제목을 입력해주세요.');
			return;
		}

		// 게시글 빈칸 예외처리
		if (Board_Content.trim() === '') {
			alert('게시글을 입력해주세요.');
			return;
		}

		if (!window.confirm("게시글을 작성하시겠습니까?")) {
			return;
		} 
		else {
			dispatch({
				type: BOARD_WRITE_REQUEST,
				data:{
					title: title,
					detail: Board_Content,
					category: Selected
				}
			});
		}
	}, [title, Board_Content, Selected, dispatch]);

	// 취소버튼 누를때 실행되는 함수
	const onCancel = useCallback(()=> {
		if (location.state && location.state.url === '/UserLogin') {
			navigate('/Board/list/free/all/1');
		}
		else {
			navigate(-1);
		}
	}, [location, navigate]);

	// 게시글 작성 성공 여부에 따른 useEffect
	useEffect(()=> {
		if (BOARD_WRITE_done) {
			window.location.assign(`/Board/list/${Selected === '자유 게시판' ? 'free' : Selected === '영화 뉴스' ? 'news' : 'debate'}/all/1`);
		}

		if (BOARD_WRITE_error) {
			alert('게시글 작성에 실패했습니다.');
			window.location.replace('/Board/write');
		}
	}, [BOARD_WRITE_done, BOARD_WRITE_error, Selected]);

  return (
		<ContentWrapper>       
			<WriteWrapper>  
				<h2>
					글쓰기
				</h2>
				<Select>
					<select onChange={handleSelect} value={Selected}>
						{selectList.map((item) => (
						<option value={item} key={item}>
              {item}
            </option>))}
					</select>
					<input type="text" placeholder="제목" value={title} onChange={handleTitle}/>
				</Select>
				<CustomReactQuill
					ref={quillRef}
					formats={formats}
					value={Board_Content}
					onChange={onEditorChange}
					modules={modules}
					theme="snow"
					placeholder="내용을 입력해주세요."
				/>          
			</WriteWrapper>
      <ButtonMore>
        <Fail onClick={onCancel}>
					취소
				</Fail>
        <Success onClick={onWrite}>
					작성하기
				</Success>
			</ButtonMore>
		</ContentWrapper>
	);
};

const ContentWrapper = styled.div`
	float: right;
	width: 728px;
`;

const WriteWrapper = styled.div`
	width: 728px;
	height: 688px;
	border-top: 1px solid #ebeef1;
	line-height: 18px;
	font-size: 14px;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .15);
    
	h2 {
		padding-left: 16px;
		font-size: 18px;
		color: #1e2022;
		font-weight: 700;        
		margin-top: 20px;
		margin-bottom: 20px;
	}
`;

const Select = styled.div`
	width: 100%;
	padding-left: 13px;
	padding-bottom: 20px;

	select {
    position: relative;
    border: 1px solid #dddfe4;
    border-radius: 4px;
    padding: 10px 30px 9px 15px;
    line-height: 19px;
    font-size: 16px;
    color: #1e2022;
    float: left;
    margin-right: 10px;
		background: url(/img/down.png);
    background-size: 24px;
    background-position: top 7px right 3px;
    background-repeat: no-repeat;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

		&:focus {
			outline: none;
		}
	}

	input {
    display: block;
    width: 76%;
    background-color: #fff;
    border: 1px solid #dddfe4;
    padding: 10px 16px 9px;
    line-height: 19px;
    font-size: 16px;
    color: #1e2022;
    box-sizing: border-box;

		&:focus {
			outline: none;
		}
	}
`;

const ButtonMore = styled.div`
	width: 100%;
	position: static;
	margin-top: 30px;
`;

const Fail = styled.button`
	line-height: 19px;
	font-size: 17px;
	color: #7b858e;
	border-radius: 4px;
	background-color: #fff;
	border: 1px solid #dddfe4;
	width: 154px;
	height: 48px;
	cursor: pointer;
`;

const Success = styled.button`
	float: right;
	position: static;
	color: #fff;
	border-radius: 4px;
	border: 0;
	background-color: #46cfa7;
	width: 154px;
	height: 48px;
	line-height: 19px;
	font-size: 17px;
	margin-left: 60px;
	cursor: pointer;
`;

const CustomReactQuill = styled(ReactQuill)`
	height: 530px;
`;

export default ContentWriting;
