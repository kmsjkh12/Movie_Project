import React from "react";
import styled from "styled-components";
import { GithubOutlined, HomeOutlined, UserAddOutlined } from "@ant-design/icons";
import { useLocation, Link } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  return (
    <>
      <div className="l-Footer">
        <FooterLayout>
          <FooterLink>
            <FooterLinkList>
              <FooterLinkListItemHide>
                <a
                  href="https://github.com/Oh-byeongju/Movie_Project"
                  target="_blank"
                  rel="noreferrer"
                >
                  프로젝트 소개
                </a>
              </FooterLinkListItemHide>
							<FooterLinkListItem>
                <a
                  href="https://www.moviebnb.com/APICALL/swagger-ui/index.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  API 명세서
                </a>
              </FooterLinkListItem>
              <FooterLinkListItem>
                <Link to="/Allmovie">
                  영화조회
                </Link>
              </FooterLinkListItem>
              <FooterLinkListItem>
                <Link to="/Reserve">
                  영화예매
                </Link>
              </FooterLinkListItem>
              <FooterLinkListItem>
                <Link to="/TimeTable">
                  상영시간표
                </Link>
              </FooterLinkListItem>
              <FooterLinkListItemHide>
                <Link to="/Mypage/Reserve">
                  마이페이지
                </Link>
              </FooterLinkListItemHide>
            </FooterLinkList>
          </FooterLink>
          <Content>
            <CorpInfo style={{ fontSize: "15px" }}>
              <CorpLogo>
                <h1 style={{ fontSize: "36px" }}>MOVIE_PROJECT</h1>
              </CorpLogo>
              오병주 (프로젝트 제작)
              <br></br>
              E-mail : dhqudwn0@naver.com &nbsp; | &nbsp; Github :
              https://github.com/Oh-byeongju
              <br></br>
              <br></br>
              강경목 (프로젝트 제작)
              <br></br>
              E-mail : kmsjkh12@naver.com &nbsp; | &nbsp; Github :
              https://github.com/kmsjkh12
              <br></br>
            </CorpInfo>
            <CorpSns>
              <CorpSnsList>
                <CorpSnsListItem>
                  <Link to="/">
                    <HomeOutlined
                      style={{ fontSize: "25px", color: "#97a0a7" }}
                    />
                  </Link>
                </CorpSnsListItem>
                <CorpSnsListItem>
                  <Link to={`/UserJoin`} state={{ url: location.pathname}}>
                    <UserAddOutlined
                      style={{ fontSize: "25px", color: "#97a0a7" }}
                    />
                  </Link>
                </CorpSnsListItem>
                <CorpSnsListItem>
                  <a
                    href="https://github.com/Oh-byeongju/Movie_Project"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GithubOutlined
                      style={{ fontSize: "25px", color: "#97a0a7" }}
                    />
                  </a>
                </CorpSnsListItem>
              </CorpSnsList>
            </CorpSns>
          </Content>
        </FooterLayout>
      </div>
    </>
  );
};

const FooterLayout = styled.div`
  background: #ebeef1;
  position: relative;
  height: 50%;
`;

const FooterLink = styled.div`
  background: #dddfe4;
  overflow: hidden;
  height: 3.5rem;
  border-left: none;
`;

const FooterLinkList = styled.ul`
  padding-left: 1rem;
  padding-right: 1rem;
  width: 70%;
  margin: 1.188rem auto 1.188rem -2.063rem;
  height: 1.188rem;
  padding: 0;
  margin: 1.188rem auto 1.125rem;
  list-style: none;

  li {
    &:first-child {
      padding-left: 0;
      margin-left: 0;
      border-left: 0;
    }
  }
  &:after {
    content: "";
    display: block;
    clear: both;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const FooterLinkListItem = styled.li`
  float: left;
  border-left: 1px solid #c5cbd0;
  color: #7b858e;
  line-height: 19px;
  font-size: 1rem;
  list-style: none;
  padding-left: 1rem;
  margin-left: 1rem;
`;

const FooterLinkListItemHide = styled.li`
  display: block;
  float: left;
  border-left: 1px solid #c5cbd0;
  color: #7b858e;
  line-height: 19px;
  font-size: 1rem;
  padding-left: 1rem;
  margin-left: 1rem;
`;

const Content = styled.div`
  position: relative;
  padding: 0.5rem 0 0.5rem 0;
  width: 70%;
  margin: 0 auto;
  height: 13.25rem;

  &:after {
    content: "";
    display: block;
    clear: both;
  }
`;

const CorpInfo = styled.div`
  line-height: 20px;
  font-size: 0.875rem;
  color: #7b858e;
`;

const CorpLogo = styled.div`
  display: block;
  width: 5.813rem;
  margin-bottom: 1.5rem;
`;

const CorpSns = styled.div`
  margin-top: 0;
  position: absolute;
  bottom: 2rem;
  right: 0.313rem;

  &:after {
    content: "";
    display: block;
    clear: both;
  }
`;

const CorpSnsList = styled.ul`
  list-style: none;
  li {
    &:first-child {
      margin-left: 0px;
    }
  }
`;

const CorpSnsListItem = styled.li`
  float: left;
  margin-left: 0.9rem;
  background-color: #eaeef1;
`;

export default Footer;
