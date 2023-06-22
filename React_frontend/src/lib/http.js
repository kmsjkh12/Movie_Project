/*
  23-01-31 axios interceptor 구현(오병주)
  23-02-01 CSRF 공격 대응 구현(오병주)
*/
import axios from 'axios';

// axios instance 생성
export const http = axios.create({
	headers: {
		'Cache-Control': 'no-cache',
		'Pragma': 'no-cache',
		'Expires': '0'
	},
  baseURL: "https://www.moviebnb.com/APICALL", // 백엔드 주소
	withCredentials: true
});

// axios 요청시 resquest에 대한 처리
http.interceptors.request.use(
  (config) => {
    // axios 요청이 post, delete, put, patch인 경우 쿠키와 헤더를 추가 (csrf 공격 방지를 위해)
    if (
      config.method === "post" ||
      config.method === "delete" ||
      config.method === "patch"||
      config.method === "put") {
        
        // CTK라는 쿠키가 존재하지 않는 경우
        if (getCookie('CTK') === undefined) {
        // 랜덤으로 난수를 생성해서 쿠키에 등록
        const RandomText = generateRandomString();
        setCookie('CTK', encodeURIComponent(RandomText));
        }
        // 쿠키에 등록된 CTK값 추출후 임의의 값을 붙인 후 헤더에 넣음
        // 추후 백엔드단에서 cookie로 받은 값에 현재 적용한 임의의값을 붙여서 Double Submit Cookie를 진행
        const csrfToken = getCookie('CTK').substring(4, 64) + "S1e2rfaSDASXx3sx631s1RVGcQsFEWZX5S11a2FdaT22fwLOa32q3";
        config.headers.Checktoken = csrfToken;
        return config;
      }
      return config; 
    },
  (error) => Promise.reject(error)
);

// csrf 공격 방지를 위한 난수 생성 함수
const generateRandomString = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 60; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// 쿠키 등록 함수
const setCookie = (cname, cvalue) => {
  document.cookie = cname + "=" + cvalue + ";path=/";
}

// 쿠키를 가져오는 함수
const getCookie = (cname) => {
  let cookies = document.cookie.split(';');
  for (let i in cookies) {
    // 존재하지 않으면 -1을 반환한다.
    if (cookies[i].indexOf(cname) > -1) {
      return `${cookies[i]};`;
    }
  }
}

// axios 요청시 response에 대한 처리
http.interceptors.response.use(
  // 200 번대 정상 요청이 왔을경우 일반적인 리턴
  function (response) {
    return response;
  },
  // 에러가 발생하였을 경우
  async (error) => {
    // 비구조화 할당으로 데이터 추출
    const { config, response: { status }} = error;
    // error의 상태와 메시지가 Access 토큰의 만료를 알리는 경우
    if (status === 401) {
      if (error.response.data.message === "로그인이 만료되었습니다.") {

        // 원래의 요청을 변수에 저장
        const originalRequest = config;

        // 토큰 재발급 요청
        await http.post("/Member/normal/reissue");

        // 실패했던 원래의 요청을 토큰을 재발급 받은뒤에 다시 요청
        return axios(originalRequest);
      }
    }
    // Access 토큰의 만료 error가 아닌경우 리턴
    return Promise.reject(error);
  }
);