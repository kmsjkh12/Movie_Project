import React from "react";
import styled from "styled-components";
import { Carousel } from "antd";

const HomeBanner = () => {
  // 캐러셀 넘어가는 속도 조절을 위한 setting
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 5000
  };

  return (
    <div style={{ zIndex: "0" }}>
      <Carousel {...settings}>
        <div>
          <Image alt ='carousel1' src={"img/carousel/first.png"} />
        </div>
        <div>
          <Image alt ='carousel2' src={"img/carousel/second.png"} />
        </div>
        <div>
          <Image alt ='carousel3' src={"img/carousel/third.png"} />
        </div>
      </Carousel>
    </div>
  );
};

const Image = styled.img`
  width: 100%;
  line-height: 160px;
  text-align: center;
`;

export default HomeBanner;
