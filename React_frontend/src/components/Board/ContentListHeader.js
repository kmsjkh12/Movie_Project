/*
  23-05-15 게시물 페이지 수정(오병주)
*/
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { EditTwoTone, FireTwoTone, StarTwoTone, QrcodeOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const menu = [
	{icon: QrcodeOutlined, sort: '최신순', category: 'all'},
	{icon: FireTwoTone, sort: '인기', category: 'like'},
	{icon: StarTwoTone, sort: '조회순', category: 'top'}
];
const selectList = ["제목", "작성자"];

const ContentListHeader = () => {
	const navigate = useNavigate();
	const { category, sort } = useParams();
    
	// 로그인 리덕스 상태
	const { LOGIN_STATUS_done } = useSelector((state) => state.R_user_login);
	const { LOGIN_data } = useSelector((state) => state.R_user_login);

	// 로그인 기록이 없을경우 내 게시물 접근제한 useEffect
	useEffect(() => {
		if (LOGIN_STATUS_done && LOGIN_data.uid === 'No_login' && category === 'myinfo') {
			alert('로그인이후 사용가능한 페이지입니다.');
			navigate('/Board/list/free/all/1');
		}
	}, [LOGIN_STATUS_done, LOGIN_data.uid, category, navigate]);
    
	// 검색 조건 상태
	const [Selected, setSelected] = useState("title");
	const handleSelect = useCallback((e) => {
		if (e.target.value === "제목"){
			setSelected("title");
		}
		else if(e.target.value === "작성자"){
			setSelected("name");
		}
	}, []);

	// input값 상태
	const [text, setText] = useState("");
	const onChangeText = (e) =>{
		setText(e.target.value);
	}
   
	// 검색버튼 눌렀을때 함수
	const onClickSearch = useCallback(()=>{
		// 예외처리
		if (text.trim() === '') {
			alert('검색어를 입력해주세요.');
			return;
		}
		else {
			navigate(`/Board/search/${Selected}/${text}/1`);
		}
	}, [Selected, text, navigate]);

	// enter키를 눌렀을 때 검색이 되게하는 함수
  const handleOnKeyPress = (e) => {
		// 예외처리
		if (e.key === "Enter" && text.trim() === '') {
			alert('검색어를 입력해주세요.');
			return;
		}
    if (e.key === "Enter") {
			navigate(`/Board/search/${Selected}/${text}/1`);
		}
  };

	// 글 작성하는 아이콘 눌렀을때 함수
	const onWrite = useCallback(()=> {
		if (LOGIN_data.uid === "No_login") {
			if (!window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
				return;
			} 
			else {
				navigate(`/UserLogin`, {state: {url: '/Board/write'}});
			}
		}
		else {
			navigate('/Board/write');
		}
	}, [LOGIN_data, navigate]);
	
	return (
		<ContentWrapper>
			<SubMenu>
				<SubMenuHeader category={category}>
					<h2>
						{category === "free" ? "자유 게시판" : category === "news" ? "영화 뉴스": 
						category === "debate" ? "영화 토론" : category === "myinfo" ? "내 게시글" : ""}   
					</h2>
					{category !== "myinfo" && 
					<ul className="header">
						<li onClick={onWrite}>
							<EditTwoTone style={{fontSize:'25px' }}/>
						</li>
					</ul>}
					{category !== "myinfo" &&
					<SubMenuFooter>
            <ul>
							{menu.map((data, index) =>
              <Li key={index} category={data.category} data={sort}>
								<Link to={`/Board/list/${category}/${data.category}/1`} onClick={()=>setText("")}>
									<data.icon style={{fontSize:'25px', position:'relative', top:'4px', paddingRight:'5px'}} twoToneColor={sort === data.category ? "green" : "#97a0a7"}/>
									{data.sort}
								</Link> 
              </Li>)}
            </ul>
						<Search>
							<form>
								<select onChange={handleSelect}>
									{selectList.map((select, index)=> <option key={index}> {select} </option>)}       
								</select>
								<input hidden="hidden" />
                <input type="text" placeholder="검색" value={text} onChange={onChangeText} onKeyUp={handleOnKeyPress}/>
                <button type="button" onClick={onClickSearch}>
									<SearchOutlined style={{fontSize:'21px'}}/>
								</button>
							</form>
						</Search>
					</SubMenuFooter>}
				</SubMenuHeader>
			</SubMenu>
		</ContentWrapper>
	)
};

const ContentWrapper = styled.div`
	width: 728px;
`;

const SubMenu = styled.div`
	position: relative;
	margin-bottom: 10px;
	background-color: #fff;
`;

const SubMenuHeader = styled.div`
	padding-top: 18px;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .15);
	height: ${(props)=> props.category=== "myinfo"? "30px" : ""};
	padding-bottom: 20px;
	
	h2 { 
    padding-left: 16px;
    font-size: 18px;
    color: #1e2022;
    font-weight: 700;
    float: left;
    position: absolute;
    top: 7px;
    left: 6px;
	}

	.header {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 16px;
    margin-right: 16px;
    list-style-type: none;
    
		li {
    	cursor: pointer;
			padding-right: 10px;
			padding-top: 3px;
    }	
	}
`;

const SubMenuFooter = styled.div`
	margin-top: 60px;
	padding-bottom: 30px;
	position: relative;
	left: -15px;

	ul {	
    list-style-type: none; 
	}
`;

const Li = styled.li`
	float: left;
	padding-right: 35px;
	font-weight: ${(props) => props.category === props.data ? "600" : "400"};
	color: ${(props) => props.category === props.data ? "green" : "#97a0a7"};

	a {
		font-weight: ${(props) => props.category === props.data ? "600" : "400"};
		color: ${(props) => props.category === props.data ? "green" : "#97a0a7"};
		text-decoration-line: none;
		cursor: pointer;
	}
`;

const Search = styled.div`
	display: block;
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	margin-right: 6px;
	margin-bottom: 6px;
	cursor: pointer;

	select {
		float: left;
		width: 80px;
		padding: 9px 0 8px 10px;
		box-sizing: border-box;
		border: 1px solid #ebeef1;
		background: #fff;
		border-radius: 4px 0 0 4px;
		line-height: 17px;
		font-size: 14px;
		color: #98a0a7;
		background: url(/img/down.png);
    background-size: 24px;
    background-position: top 5px right 5px;
    background-repeat: no-repeat;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

		&:focus {
			outline: none;
		}
	}
	
	input {
		float: left;
		border: none;
		width: 200px;
		box-sizing: border-box;
		padding: 10px 32px 9px 16px;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		background-color: #ebeef1;
		line-height: 10px;
		font-size: 14px;

		&:focus {
			outline: none;
		}
	}

	button {
		float: left;
		position: absolute;
		top: 0;
		right: 0;
		margin-top: 6px;
		margin-right: 7px;
		border: none;
		cursor: pointer;
	}
`;

export default ContentListHeader;