import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Theater from './Theater';
import Cinema from './Cinema';

const BuildingLayout = () => {
	// css를 위한 버튼 변수
	const [theaterbutton, setTheaterbutton] = useState(true);
	const [cinemabutton, setCinemabutton] = useState(false);

	// 영화관 버튼 누를때
	const onTheater = useCallback(() => {
		setTheaterbutton(true);
		setCinemabutton(false);
	}, []);

	// 상영관 버튼 누를때
	const onCinema = useCallback(() => {
		setTheaterbutton(false);
		setCinemabutton(true);
	}, [])

	return (
		<Container>
      <InnerWraps>
        <div className="titleMenu">
					<button className={theaterbutton ? "hover" : "not_hover"} onClick={onTheater}>
          	영화관 관리
          </button>
					<button className={cinemabutton ? "hover" : "not_hover"} onClick={onCinema}>
						상영관 관리
					</button>
        </div>
				{theaterbutton ? <Theater/> : <Cinema/>}
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
  min-height: 820px;
`;

const InnerWraps = styled.div`
  width: 100%;
  padding-left: 10px;

  .titleMenu {
    position: relative;
    top: 18px;

		.not_hover {
			color: #999;
		}

		button:first-child {
			margin-left: 0;
			::before {
				display: none;
			}
		}

		button {
			position: relative;
			font-size: 2em;
			margin-block-start: 0.67em;
			margin-block-end: 0.67em;
			margin-inline-start: 0px;
			margin-inline-end: 0px;
			font-weight: bold;
			border: none;
			background-color: white;
			padding: 0;
			cursor: pointer;
			margin-left: 30px;
			margin-bottom: 14.2px;

			::before {
				position: absolute;
				top: 5px;
				left: -14px;
				height: 37px;
				vertical-align: middle;
				content: "";
				border-left: 2px solid #dddfe4;
			}
		}
  }

  .search {
    position: relative;
    width: 100%;
    border-bottom: 3px solid #241d1e;
    padding-bottom: 5px;

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

export default BuildingLayout;