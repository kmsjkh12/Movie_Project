/*
 23-03-10 마이페이지 css 구축(오병주)
 23-03-24 사용자가 예매한 지난 관람영화 내역 조회 구현(오병주)
*/
import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import * as date from "../../lib/date.js";

const FinishReserve = ({ reserve }) => {
	return (
		<ContentDetail>
			<ContentDetailTop>
				<span>
					예매일시 : &nbsp;{reserve.rdate.substr(0, 10)} ({date.getDayOfWeek(reserve.rdate)})
				</span>
				<Link to={`/Mypage/FinishDetail/${reserve.rid}`}>
					예매내역 상세보기
				</Link>
			</ContentDetailTop>
			<ContentDetailMiddle>
				<ContentDetailMiddleInfos>
					<Poster src={`/${reserve.mimagepath}`} alt="Poster" />
					<ContentDetailMiddleInfo>
						<dl>
							<dt>
								예매번호
							</dt>
							<dd>
								{reserve.rid}
							</dd>
						</dl>
						<dl>
							<dt>
								영화명
							</dt>
							<dd>
								{reserve.mtitle}
							</dd>
						</dl>
						<dl>
							<dt>
								관람극장
							</dt>
							<dd>
								{reserve.tarea}-{reserve.tname}점 {reserve.cname}
							</dd>
						</dl>
						<dl>
							<dt>
								관람일시
							</dt>
							<dd>
								{reserve.mistarttime.substr(0, 10)} ({date.getDayOfWeek(reserve.mistarttime)}) {reserve.mistarttime.substr(10, 6)}
							</dd>
						</dl>
						<dl>
							<dt>
								관람좌석
							</dt>
							{reserve.seats && reserve.seats.map((seat) => (<dd key={seat}> {seat} </dd>))}
						</dl>
						<dl>
							<dt>
								결제금액
							</dt>
							<dd>
								{reserve.rprice}원
							</dd>
						</dl>
					</ContentDetailMiddleInfo>
				</ContentDetailMiddleInfos>
			</ContentDetailMiddle>
		</ContentDetail>
	);
};

const ContentDetail = styled.div`
	width: 100%;
	padding: 16px 20px;
	margin-bottom: 14px;
	box-sizing: border-box;
	margin: 0;
	border: 1px solid rgb(221, 223, 225);
	margin-top: 20px;
`;

const ContentDetailTop = styled.div`
	display: flex;
	padding: 8px 0px 13px;
	-webkit-box-pack: justify;
	justify-content: space-between;
	border-bottom: 1px solid rgb(221, 223, 225);
	box-sizing: border-box;
  margin: 0;

	span {
		font-size: 16px;
    font-weight: 500;
    line-height: 1.2;
    color: rgb(51, 51, 51);
	}

	a {
		align-self: center;
    padding-right: 10px;
    line-height: 1.9;
    font-size: 12px;
    color: rgb(51, 51, 51);
		cursor: pointer;
		text-decoration: none;
	}
`;

const ContentDetailMiddle = styled.div`
	display: flex;
	flex-direction: row;
	-webkit-box-pack: justify;
	justify-content: space-between;
	padding: 14px 0px 16px;
	box-sizing: border-box;
	margin: 0;
`;

const ContentDetailMiddleInfos = styled.div`
	display: flex;
	flex-direction: row;
	-webkit-box-align: center;
	align-items: center;
`;

const Poster = styled.img`
  width: 175px;
	height: 260px;
	margin-right: 30px;
	background-color: rgb(245, 245, 245);
`;

const ContentDetailMiddleInfo = styled.div`
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	padding-bottom: 20px !important;

	dl {
		display: flex;
    padding-top: 20px !important;
    flex-direction: row;
    color: rgb(0, 0, 0);
    line-height: 20px;
		margin: 0;
		padding: 0;
		box-sizing: border-box;

		dt {
			width: 50px;
			margin-right: 30px !important;
			font-size: 12px;
			color: #99a0a6;
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			margin-top: 2px;
		}

		dd:not(:first-of-type) {
 		 margin-left: 6px;
		}

		dd {
			display: flex;
			font-weight: 550;
			color: rgb(51, 51, 51);
			line-height: 1.36;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			letter-spacing: 0.9px;
		}
	}
`;

export default FinishReserve;