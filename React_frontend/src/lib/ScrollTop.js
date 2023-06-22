import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Link to로 페이지 이동시 제일위쪽으로 움직이게 하는 함수
export default function ScrollTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
	
  return null;
}