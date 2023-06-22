import React from 'react';
import styled from 'styled-components';
import { useSelector, shallowEqual } from 'react-redux';
import * as date from "../../lib/date.js";
import { Table } from 'antd';

const ReserveMovie = () => {
  // 필요한 리덕스 상태들
  const { RESERVE_MOVIE_LIST_loading, RESERVE_MOVIE_LIST } = useSelector(
    state => ({
      RESERVE_MOVIE_LIST_loading: state.R_manager_user.RESERVE_MOVIE_LIST_loading,
      RESERVE_MOVIE_LIST: state.R_manager_user.RESERVE_MOVIE_LIST
    }),
    shallowEqual
  );

	// antd css 설정
  const columns = [
    {
      title: '계정',
      width: 110,
      dataIndex: 'uid',
      fixed: 'left',
    },
    {
      title: '예매번호',
      width: 100,
      dataIndex: 'rid',
      fixed: 'left',
    },
    {
      title: '예매일시',
      width: 190,
      render: (text, row) => <div> {row["rdate"].substr(0, 10)} ({date.getDayOfWeek(row["rdate"])}) {row["rdate"].substr(10, 9)} </div>,
      sorter: (a, b) => new Date(a.rdate) - new Date(b.rdate)
    },
    {
      title: '관람극장',
      width: 180,
      render: (text, row) => <div> {row["tarea"]}-{row["tname"]}점 {row["cname"]}</div>,
    },
    {
      title: '관람일시',
      width: 170,
      render: (text, row) => <div> {row["mistarttime"].substr(0, 10)} ({date.getDayOfWeek(row["mistarttime"])}) {row["mistarttime"].substr(10, 6)} </div>,
    },
    {
      title: '관람인원',
      width: 270,
			render: (text, row) => <div> {row["rpeople"]} (총 {row["rticket"]}매) </div>,
    },
		{
      title: '결제유형', 
      width: 105,
      dataIndex: 'rpaytype',
    },
		{
      title: '결제금액', 
      width: 100,
			render: (text, row) => <div> {row["rprice"]}원 </div>,
    },
    {
			title: '취소일시',
			width: 190,
			render: (text, row) => <div> {row["rcanceldate"] ? row["rcanceldate"].substr(0, 10) + " (" + date.getDayOfWeek(row["rcanceldate"]) + ") " + row["rcanceldate"].substr(10, 9): "-"} </div>,
		},
    {
      title: '예매상태',
      fixed: 'right',
      width: 104,
			filters: [
				{
					text: '예매완료',
					value: '예매완료'
				},
				{
					text: '예매취소',
					value: '예매취소'
				},
			],
			onFilter: (value, record) => record.rstate_string.indexOf(value) === 0,
      dataIndex: 'rstate_string'
    },
  ];  

	return (
		<>
			<TableWrap rowKey="rid"
        loading={RESERVE_MOVIE_LIST_loading}
        columns={columns}
        dataSource={RESERVE_MOVIE_LIST.reservations}
        scroll={{x: 1350}}
        locale={{ 
          triggerDesc: '내림차순 정렬하기',
          triggerAsc: '오름차순 정렬하기', 
          cancelSort: '정렬해제하기',
					filterConfirm: '확인',
					filterReset: '초기화'
      	}}
      />
		</>
	);
};

const TableWrap = styled(Table)`
  padding-bottom: 20px;
  min-height: 693px;

  .ant-table-placeholder {
    .ant-table-expanded-row-fixed{
      min-height: 603px !important;
    }
    .css-dev-only-do-not-override-acm2ia {
      position:absolute;
      top: 45%;
      left: 50%;
      transform:translate(-50%, -45%); /* translate(x축,y축) */
    }
  }
`;

export default ReserveMovie;