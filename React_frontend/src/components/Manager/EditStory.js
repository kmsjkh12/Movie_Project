import React, { useState, useMemo, useRef } from 'react';
import { CloseOutlined } from "@ant-design/icons";
import { Button } from 'antd';
import styled from "styled-components";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const EditStroy = ({ setOpenStory, story, setStory }) =>{
	// 줄거리 수정을 위한 변수
	const [editstory, setEditStory] = useState(story);
	const onChangeValue = (value) =>{
		setEditStory(value);
	}

	// 확인 버튼을 누를때
	const onClickStory = () =>{
		setStory(editstory);
		setOpenStory(false);
	}

	const quillRef = useRef();
	const modules = useMemo (() => ({
		toolbar: {
			container : [
				[{ 'header': [1, 2, false] }],
				['bold', 'italic', 'underline','strike', 'blockquote'],
				[{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
				['link', 'image'],
				[{ 'align': [] }, { 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
				['clean']
			],
		},}),
	[]);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    'align', 'color', 'background',        
  ];

  return (
    <>
			<Modal>
				<Layout>
					<div className="header_layout">
						<Title>
							영화 줄거리 수정
						</Title>
						<Close onClick={()=> setOpenStory(false)}>
							<CloseOutlined style={{ fontSize: "25px", color: "white" }} />
						</Close>
					</div>
          <ModalContents>
						<CustomReactQuill
							ref={quillRef}
							formats={formats}
							value={editstory}
							onChange={onChangeValue}
							modules={modules}
							theme="snow"
							placeholder="내용을 입력해주세요."
						/>    
					</ModalContents>
					<ButtonWrap>
						<Button onClick={()=> setOpenStory(false)}>
							취소
						</Button>
						<Button onClick={onClickStory} type="primary" style={{marginLeft: "10px"}}>
							확인
						</Button>
					</ButtonWrap>
				</Layout>
			</Modal>
    </>
  );
}

const Modal = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 10001; ///배경에 픽스를 주고 투명도를 준다.
`;

const Layout = styled.div`
  width: 880px;
  height: 650px;
  background-color: white;
  position: relative;
  box-sizing: border-box;
  margin: 50px auto;
  margin-top: 2.5% !important;
  padding: 20px;
  background: #fff; //로그인 배경이다

  .header_layout {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    background: #503396; // 로그인 윗쪽 배경
  }
`;

const Title = styled.h3`
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
  padding: 60px 30px 59px 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: column;
  //padding 순서는 상우하좌
`;

const CustomReactQuill = styled(ReactQuill)`
	height: 455px;
`;

const ButtonWrap = styled.div`
	float: right;
	margin-right: 30px;
`;

export default EditStroy;