import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Movie from './Movie';
import Actor from './Actor';

const MovieLayout = () => {
	// css를 위한 버튼 변수
	const [moviebutton, setMoviebutton] = useState(true);
	const [actorbutton, setActorbutton] = useState(false);

	// 영화 버튼 누를때
	const onMovie = useCallback(() => {
		setMoviebutton(true);
		setActorbutton(false);
	}, []);

	// 배우 버튼 누를때
	const onActor = useCallback(() => {
		setMoviebutton(false);
		setActorbutton(true);
	}, [])

	return (
		<Container>
      <InnerWraps>
        <div className="titleMenu">
					<button className={moviebutton ? "hover" : "not_hover"} onClick={onMovie}>
          	영화 관리
          </button>
					<button className={actorbutton ? "hover" : "not_hover"} onClick={onActor}>
						배우 관리
					</button>
        </div>
				{moviebutton ? <Movie/> : <Actor/>}
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

export default MovieLayout;