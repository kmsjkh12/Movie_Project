import React, { useCallback } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const TopButton = () => {
	// 예매 다시하기 버튼 누를떄
  const onReset = useCallback(() => {
    if (!window.confirm("예매 페이지를 초기화합니다.")) {
      return;
    }
    window.location.replace("/reserve");
  }, []);

  return (
    <Nav>
      <Right>
				<Link to="/TimeTable">
					<Schedule>
						<span>
							상영 시간표
						</span>
					</Schedule>
				</Link>
        <Rereserve onClick={onReset}>
          <span>
						예매 다시하기
					</span>
        </Rereserve>
      </Right>
    </Nav>
  );
};

const Nav = styled.div`
  position: relative;
	width: 1043px;
  height: 78px;
	padding-left: 10px;
	margin : 0 auto;
	margin-bottom: 10px;
`;

const Right = styled.div`
	float: right;
	padding-top: 20px;
	margin-right: 5px;
`;

const Schedule = styled.button`
  position: relative;
  border: none;
  display: inline-block;
  padding: 15px 30px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
  background-color: #f8e6e0;
  color: #6e6e6e;
	margin-right: 15px;
`;

const Rereserve = styled.button`
  position: relative;
  cursor: pointer;
  border: none;
  display: inline-block;
  padding: 15px 30px;
  border-radius: 15px;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
  background-color: #f8e6e0;
  color: #6e6e6e;
`;

export default TopButton;