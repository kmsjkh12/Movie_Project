import React, { useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

// 다음 주소검색 api이고 배경 부분에는 모달로 구현
const Post = ({ setAddress, M_address, InsertAddress }) => {
  // 주소 선택시 선택한 주소값을 던져주고 주소검색창을 닫는 함수
  const onCompletePost = (data) => {
    M_address = data.address;
    InsertAddress(M_address);
    setAddress(false);
  };

  // 주소검색 css
  const postCodeStyle = {
    display: "block",
    position: "absolute",
    right: "0%",
    top: "8.2%",
    width: "550px",
    height: "500px",
  };

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
    <>
    <Modal>
      <LoginLayout>
        <div className="header_layout">
          <ModalText>
            주소검색
          </ModalText>
          <Close onClick={()=>{setAddress(false)}}>
            <CloseOutlined style={{ fontSize: "25px", color: "white" }} />
          </Close>
        </div>
        <DaumPostcode style={postCodeStyle} onComplete={onCompletePost} />
      </LoginLayout>
    </Modal>
    </>
  );
};

const Modal = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 10001; ///배경에 픽스를 주고 투명도를 준다.
`;

const LoginLayout = styled.div`
  width: 550px;
  height: 545px;
  background-color: white;
  position: relative;
  box-sizing: border-box;
  margin: 50px auto;
  margin-top: 150px !important;
  padding: 20px;
  background: #fff;

  .header_layout {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    background: #503396; // 모달 윗쪽 배경
  }
`;

const ModalText = styled.h3`
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

export default Post;