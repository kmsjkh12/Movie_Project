# 📽 영화 웹페이지 프로젝트

## **📗 목차**

<b>

- 🔗 [링크](#-링크)
- 📝 [프로젝트 개요](#-프로젝트-개요)
- 🛠 [기술 및 도구](#-기술-및-도구)
- 📦 [ERD 설계](#-ERD-설계)
- 💻 [프로젝트 수행 과정](#-프로젝트-수행-과정)
- 🔎 [기능 소개 Wiki](#-기능-소개-Wiki)
- 🌟 [트러블 슈팅](#-트러블-슈팅)
- 👩‍💻 [개발 후기](#-개발-후기)

</b>

## **🔗 링크**
### 📌 웹페이지 - [**바로가기**](https://www.moviebnb.com/)
- 개발 완료 후 배포된 웹페이지의 링크입니다.

### 📌 API 명세서 - [**바로가기**](https://www.moviebnb.com/APICALL/swagger-ui/index.html)
- Springdoc-openapi-ui를 사용한 Swagger 기반의 REST API 명세서입니다.

### 📌 Demo-Version 기록 - [**바로가기**](https://github.com/Oh-byeongju/Movie_Project_Demo)
- 리팩토링 이전의 웹페이지 개발에 대한 기록입니다.

## **📝 프로젝트 개요**
#### `1. 프로젝트 소개`
- Spring-Boot와 React를 이용하여 개발한 영화 웹페이지입니다.

#### `2. 개발 기간`
- Demo-Version : 2023.01.08 ~ 2023.04.05
- Refactoring : 2023.04.10 ~ 2023.05.30

#### `3. 개발 인원`
- 오병주 : Demo-Version 프로젝트 개발, 코드 리팩토링 및 배포
- 강경목 : Demo-Version 프로젝트 개발

## **🛠 기술 및 도구**
#### `Front-end`
- React
- Styled-components
- Axios
- Redux
- Redux-Saga
#### `Back-end`
- Java 11
- Spring-Boot
- Spring Data JPA
- Spring-Security
- MySQL
- Redis
#### `DevOps`	
- AWS (EC2, RDS)
- Nginx
- Gradle
- Docker
- GitHub
#### `Security`
- JWT
- HTTPS
#### `API`
- Swagger (Springdoc)

## **📦 ERD 설계**
<img width="100%" alt="ERD" src="https://user-images.githubusercontent.com/96694919/246102323-3dbcef99-3e0a-47cc-8fa5-55926d9d65f8.png"/>

## **💻 프로젝트 수행 과정**
### 📣 시스템 구성도
<img width="100%" alt="Sys" src="https://user-images.githubusercontent.com/96694919/246202776-83847a3b-d272-4157-b927-f175c96f8f70.jpg"/>

#### 💡 프로젝트의 전체적인 시스템 구성도입니다.
1. 사용자가 웹페이지의 URL을 요청하면 ec2 인스턴스를 거쳐 Docker 컨테이너 환경에 존재하는 NGINX(Web Server)로 요청이 전달됩니다.
   
2. NGINX 서버는 요청들을 https 요청으로 리다이렉트함과 동시에 정적요소에 대한 요청인 경우 빌드된 index.html 파일로부터 데이터를 가져와 사용자에게 전달합니다.
   
3. 사용자가 동적요소에 대한 요청을 보냈을 경우 NGINX 서버는 Spring-Boot 서버에게 요청을 전달합니다.
 
4. Spring-Boot 서버는 요청에 알맞는 데이터를 RDS에 접근하여 가져온 뒤 NGINX 서버에게 전달합니다. 그리고 NGINX 서버는 사용자에게 데이터를 전달합니다.


### 📣 NGINX의 백엔드 요청과 DB 접근 순서도
### 0️⃣ 전체흐름
<img width="100%" alt="Flow" src="https://user-images.githubusercontent.com/96694919/246448896-f923d5de-9b31-4a23-9485-08d234e0a5a5.jpg"/>

### 1️⃣ NGINX
<img width="100%" alt="Flow" src="https://user-images.githubusercontent.com/96694919/246402430-297d2b2b-9c88-449a-b313-80adad1f546c.jpg"/>

- **URL Rewrite 처리** 📌 [코드 확인](https://github.com/Oh-byeongju/Movie_Project/blob/d7b4b0869aa213ec557497b573ad51bcfb3cf0ba/Docker_nginx/conf.d/default.conf#L36)
	- 사용자가 요청한 URL에서 백엔드 요청에 필요없는 ~/APICALL/ 부분을 NGINX 내부에서 제거한 뒤 URL을 재정의합니다.

- **Reverse Proxy 처리** 📌 [코드 확인](https://github.com/Oh-byeongju/Movie_Project/blob/d7b4b0869aa213ec557497b573ad51bcfb3cf0ba/Docker_nginx/conf.d/default.conf#L37)
	- 사용자의 요청을 백엔드 서버에게 전달합니다. Reverse Proxy 덕분에 사용자는 DB의 데이터가 필요할 때 프록시 서버 URL로만 접근할 수 있으며 백엔드 서버에 직접적으로 접근이 불가능하게 됩니다.

- **결과 응답** 
	- 백엔드 서버에서 전달받은 데이터를 사용자에게 전달합니다.
	

### 2️⃣ jwtFilter
<img width="100%" alt="Flow" src="https://user-images.githubusercontent.com/96694919/246399743-f2dc2997-acea-4e27-bb60-f303bcb95c95.jpg"/>

- **토큰 존재 여부 파악** 📌 [코드 확인](https://github.com/Oh-byeongju/Movie_Project/blob/5ff68aa372daa08db4a777cf06da9cac3f9a310f/Spring_backend/src/main/java/com/movie/Spring_backend/jwt/JwtFilter.java#L51)
	- REST API 요청에서 AccessToken이 필요한 요청인 경우 AccessToken의 존재 여부를 파악합니다. (토큰에 대한 검증은 Service 계층에서 실행)

- **CSRF 공격 방지** 📌 [코드 확인](https://github.com/Oh-byeongju/Movie_Project/blob/5ff68aa372daa08db4a777cf06da9cac3f9a310f/Spring_backend/src/main/java/com/movie/Spring_backend/util/CsrfCheckUtil.java#L38)
	- REST API 요청이 POST, DELETE, PUT, PATCH인 경우 CSRF 공격을 방지하기 위하여 Double submit cookie를 통한 검사를 실행합니다.

### 3️⃣ Controller
<img width="100%" alt="Flow" src="https://user-images.githubusercontent.com/96694919/246411239-2f83e6ce-83c5-4104-834d-ced93f0d64f7.jpg"/>

- **요청 처리** 📌 [코드 확인](https://github.com/Oh-byeongju/Movie_Project/blob/0a289c2b34760287beb0476d494fd245c33ccd77/Spring_backend/src/main/java/com/movie/Spring_backend/controller/MyPageMovieController.java#L43)
	- Controller 계층에서는 NGINX 서버에서 넘어온 요청을 받고, Service 계층에 데이터 처리를 위임합니다.
	- 로그인이 필요한 요청인 경우 Cookie 형태로 저장된 Token이 존재하는 HttpServletRequest 객체를 Service 계층에 전달합니다.

- **결과 응답** 📌 [코드 확인](https://github.com/Oh-byeongju/Movie_Project/blob/0a289c2b34760287beb0476d494fd245c33ccd77/Spring_backend/src/main/java/com/movie/Spring_backend/controller/MyPageMovieController.java#L44)
	- Service 계층에서 전달받은 로직 처리 결과를 ResponseEntity 객체에 담아 NGINX 서버로 전달합니다.

### 4️⃣ Service
<img width="100%" alt="Flow" src="https://user-images.githubusercontent.com/96694919/246419708-ca4f187c-d865-4d7e-8201-e6af540f2899.jpg"/>

- **토큰 검증** 📌 [코드 확인](https://github.com/Oh-byeongju/Movie_Project/blob/master/Spring_backend/src/main/java/com/movie/Spring_backend/jwt/TokenProvider.java#L114)
	- HttpServletRequest 객체를 전달 받았을경우 토큰 검증을 진행하고 토큰이 올바르지 않을경우에는 예외처리를 합니다.

- **데이터 요청** 📌 [코드 확인](https://github.com/Oh-byeongju/Movie_Project/blob/d781e9638e74169fef05e131c2d28401f62c1daa/Spring_backend/src/main/java/com/movie/Spring_backend/service/MyPageMovieService.java#L61)
	- 현재 메소드에서 필요한 데이터 정보를 Repository 계층에게 전달하여 Entity형 데이터를 요청합니다.

- **데이터 가공 및 반환** 📌 [코드 확인](https://github.com/Oh-byeongju/Movie_Project/blob/d781e9638e74169fef05e131c2d28401f62c1daa/Spring_backend/src/main/java/com/movie/Spring_backend/service/MyPageMovieService.java#L64)
	- Entity형의 데이터와 이외에 필요한 정보들을 Dto형태의 데이터로 가공한 뒤 Controller 계층에게 전달합니다.

### 5️⃣ Repository
<img width="100%" alt="Flow" src="https://user-images.githubusercontent.com/96694919/246445292-7ecf64a4-3971-4848-a9de-eca1071cf8e7.jpg"/>

- **쿼리 수행** 📌 [코드 확인](https://github.com/Oh-byeongju/Movie_Project/blob/master/Spring_backend/src/main/java/com/movie/Spring_backend/repository/ReservationRepository.java#L23)
	- Entity에 의해 생성된 DB에 접근하는 메소드들을 사용하기 위한 계층으로써 JpaRepository를 상속받아 사용합니다.
	- JPA가 제공하는 쿼리 메소드를 이용하거나 @Query 어노테이션을 활용하여 JPQL 쿼리를 직접 작성한 뒤 쿼리를 수행합니다.

## 🔎 기능 소개 Wiki
### 1️⃣ 로그인 관련 - [**상세보기**](https://github.com/Oh-byeongju/Movie_Project/wiki/%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5#-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5)
	- 회원가입
	- JWT를 이용한 로그인 (로그인 유지하기 포함)
	- 아이디 / 비밀번호 찾기

### 2️⃣ 영화 관련 - [**상세보기**](https://github.com/Oh-byeongju/Movie_Project/wiki/%EC%98%81%ED%99%94-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5#-%EC%98%81%ED%99%94-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5)
	- 분류별 영화 목록 조회
	- 영화 상세내용 조회
	- 버튼 클릭시 빠른 예매 기능
	- 영화 공감 및 관람평 작성 기능

### 3️⃣ 상영시간표 관련 - [**상세보기**](https://github.com/Oh-byeongju/Movie_Project/wiki/%EC%83%81%EC%98%81%EC%8B%9C%EA%B0%84%ED%91%9C-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5#-%EC%83%81%EC%98%81%EC%8B%9C%EA%B0%84%ED%91%9C-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5)
	- 영화를 중심으로 상영정보 목록 조회
	- 극장을 중심으로 상영정보 목록 조회
	- 버튼 클릭시 빠른 예매 기능

### 4️⃣ 영화예매 관련 - [**상세보기**](https://github.com/Oh-byeongju/Movie_Project/wiki/%EC%98%81%ED%99%94%EC%98%88%EB%A7%A4-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5#-%EC%98%81%ED%99%94%EC%98%88%EB%A7%A4-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5)
	- 예매가 가능한 영화, 극장, 날짜 조회
	- 조건에 맞는 상영정보 목록 조회
	- 좌석조회 및 선택 기능
	- 결제 기능

### 5️⃣ 게시판 관련 - [**상세보기**](https://github.com/Oh-byeongju/Movie_Project/wiki/%EA%B2%8C%EC%8B%9C%ED%8C%90-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5#-%EA%B2%8C%EC%8B%9C%ED%8C%90-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5)
	- 게시물 조회, 작성, 수정, 삭제 기능
	- 댓글 및 답글 작성, 삭제 기능
	- 게시물 및 댓글 공감 기능

### 6️⃣ 마이페이지 관련 - [**상세보기**](https://github.com/Oh-byeongju/Movie_Project/wiki/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5#-%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5)
	- 예매내역, 예매 취소내역, 지난 관람내역 목록 조회
	- 예매내역, 예매 취소내역, 지난 관람내역 상세조회
	- 예매내역 취소 기능
	- 사용자가 공감한 영화 목록 조회
	- 관람평 작성이 가능한 영화 및 작성한 관람평 목록 조회
	- 회원정보 수정 및 회원 탈퇴

### 7️⃣ 관리자 관련 - [**상세보기**](https://github.com/Oh-byeongju/Movie_Project/wiki/%EA%B4%80%EB%A6%AC%EC%9E%90-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5#-%EA%B4%80%EB%A6%AC%EC%9E%90-%EA%B4%80%EB%A0%A8-%EA%B8%B0%EB%8A%A5)
	- 영화 및 배우 목록 조회, 추가, 수정, 삭제 기능
	- 상영정보 목록 조회, 추가, 수정, 삭제 기능
	- 극장 및 상영관 목록 조회, 추가, 수정, 삭제 기능
	- 회원 목록 조회, 삭제 기능
	- 영화 또는 극장에 따른 예매기록 조회 기능
	- 관람평 및 게시물 목록 조회, 삭제 기능

## 🌟 트러블 슈팅
<details>
<summary>프로젝트에 적용한 MVC패턴의 모호함</summary>

- 프로젝트 설계 단계에서 프로젝트에 디자인 패턴으로 적용할 MVC패턴의 구성요소에 대한 모호함이 언급됐고, 팀원과 협의를 거쳐 각 구성요소에 대한 정의를 하였습니다.

- `Model` : Spring-Boot에 존재하는 비즈니스 로직(Service, Repository, Entity, Dto 계층)을 Model에 대한 구성요소로 정의했습니다.

- `View` : Spring-Boot에서 사용되는 View Template Engine(Thymeleaf, Groovy) 등을 사용하지 않고 React 라이브러리를 이용하여 프론트엔드쪽을 개발하였기 때문에 View에 대한 구성요소는 React 라이브러리로 정의했습니다.

- `Controller` : Spring-Boot에 존재하는 Controller 계층을 그대로 Controller에 대한 구성요소로 정의했습니다.
</details>

<details>
<summary>Entity 매핑 시 생성자 사용에 따른 불편함</summary>

- 데이터베이스의 필요한 정보가 많아져 테이블 내부의 컬럼수가 증가하였고, 그에 따른Spring-Boot Entity 객체 내부의 변수 개수도 증가하였습니다.

- Spring-Boot에서 생성자를 이용한 Entity 매핑도 가능했지만, Entity 객체의 규모에 따라 파라미터가 많아질수록 가독성도 떨어지고 필요한 데이터만 설정할 수 있는 기능이 필요했기에 `빌더 패턴(Builder Pattern)`을 사용했습니다.
</details>

<details>
<summary>Spring-Boot 예외처리 핸들링</summary>

- 개발 초기 수많은 예외처리가 발생했고, 예외처리에 대한 일관성이 없어 프론트엔드 로직 구성에 어려움이 존재했습니다.

- Spring-Boot에서 일관성 있는 코드 스타일로 예외처리를 하기 위해 `@ControllerAdvice`와 `@ExceptionHandler` 어노테이션을 활용하여 예외처리 핸들링을 적용했습니다.

- 또한, 통일된 `Error Response 객체`를 만들었으며 예외처리의 종류에 따라 객체의 구성을 바꿔 예외처리를 하도록 구현하였습니다.
</details>

<details>
<summary>프론트엔드에서의 백엔드 요청 규칙</summary>

- 프론트엔드에서 백엔드에 요청을 보낼 때 각각의 컴포넌트에서 요청을 보낼 경우 관리에 대한 어려움이 존재했고, 백엔드에서 전달받은 데이터를 컴포넌트 간 전역적으로 사용이 불가능한 문제가 있었습니다.

- 이를 해결하기 위해 상태관리 라이브러리 `Redux`를 사용하였고, 비동기 작업(백엔드 요청)의 효율성을 높이기 위해 `Redux-Saga`도 같이 사용하였습니다.
</details>

<details>
<summary>CORS 정책</summary>

- 현재 프로젝트는 Spring-Boot와 React를 이용하여 개발하였기 때문에 개발단계에서 사용되는 React의 Devserver와 Spring-Boot의 서버 Port가 달라 CORS 이슈가 발생하였습니다.

- 해결방안으로 처음에는 `@CrossOrigin` 어노테이션을 이용하여 모든 컨트롤러에 적용시켰으나, 반복되는 작업이 많고 수정에 어려움이 존재 했습니다.

- 그래서 CORS 정책에 대한 전역 설정을 위해 `config 파일`을 생성하였고 `Spring-Security filter`에 적용시켜 CORS 이슈를 조금 더 효율적으로 해결하였습니다.

- 더불어 검증에 사용되는 JWT를 `HttpOnly`가 적용된 쿠키로 저장하기 위해 setAllowCredentials 옵션도 적용시켰습니다.
</details>

<details>
<summary>AccessToken 유효성 검사 위치</summary>

- 현재 프로젝트는 Spring-Boot 서버에서 사용자에 대한 검증이 필요할 때 `AccessToken`에 대한 유효성 검사를 `jwtFilter 계층`에서 실시하지 않고 `Service 계층`에서 실시하는 아쉬움이 존재하고 있습니다.

- 이렇게 되면 `Service 계층`은 유효성 검사를 진행하는 `TokenProvider`에게 의존적이게 되지만, 프론트엔드에서 사용하는 `Axios interceptor` 기능에서 토큰이 만료됐을 경우의 예외 처리를 인식할 수 있게 됩니다. (토큰 재발급 요청에 용이)

- `jwtFilter 계층`에서도 Custom 예외처리를 적용시킬 수 있었으나 토큰 만료, 토큰 불일치, 토큰 형식 오류 등 각종 상황에 따른 예외처리가 불가능하여 위와 같이 적용하였고 이점은 현재 프로젝트의 매우 아쉬운 점으로 생각하고 있습니다.
</details>

<details>
<summary>MYSQL 트리거 사용</summary>

- 현재 프로젝트에서 특정 Entity의 전체 개수가 필요한 경우 `@Formula` 어노테이션을 이용하여 `Count Query`를 진행합니다.

- Query의 조건문이 간단할 경우 효율적이지만 조금이라도 복잡해질 경우 성능이 떨어지는 문제가 있었습니다. 

- 그래서 예매율 계산에 필요한 `Count Query`는 `@Formula` 어노테이션을 이용하지 않고 영화 테이블에 컬럼을 생성하여 트리거를 이용한 조작 방법을 선택했습니다.
</details>

<details>
<summary>Redis 사용</summary>

- `RefreshToken, 점유 좌석 정보` 등 특정 시간이 지날 경우 삭제해야 하는 데이터를 MYSQL에서 관리할 경우 정확하지 않고 관리가 어려운 문제점이 존재했습니다.

- 두 가지 정보는 오류가 있을 경우 문제점이 생길수도 있기 때문에 정확한 `TTL(Time To Live)` 기능을 제공하는 NoSQL 저장소 `Redis`를 사용했습니다.

- `Redis`는 인 메모리 기반의 시스템이므로 재부팅 시 데이터가 소멸한다는 문제점이 있었지만 빠른 속도와 정확성이 있었기 때문에 프로젝트에 적합하다고 판단되어 적용시키게 되었습니다.
</details>

<details>
<summary>EC2 메모리 부족으로 인한 빌드 실패</summary>

- 현재 프로젝트의 배포 환경은 `AWS 프리 티어`에서 제공하는 클라우드 컴퓨팅 서비스인 `EC2`를 사용하고 있는데 결제를 하지 않고 사용하는 것이라 저장 공간 및 메모리가 넉넉하지 않게 할당되어 있습니다.

- 그래서 개발이 완료된 코드를 `Github`에 업로드한 뒤 클라우드 컴퓨팅 환경에서 빌드를 실행할 경우 `Spring-Boot`는 빌드를 성공적으로 마치지만 `React` 같은 경우는 `JavaScript heap out of memory`의 오류가 발생하면서 빌드를 실패합니다.

- 이 문제를 해결하기 위해선 메모리를 늘려줘야 하지만 결제 없이는 방법이 없었기 때문에 대체 방안으로 `Github`에 빌드된 `React` 파일을 올려서 프로젝트 배포를 진행하였습니다.
</details>

<details>
<summary>Web Server(NGINX)의 사용</summary>

- Demo Version 테스트 배포 환경에서는 `Web Server`를 따로 사용하지 않고 Spring-Boot를 실행시켰을 때 작동되는 `Apache Tomcat(WAS)`만을 이용해 웹페이지를 배포하였습니다.

- 하지만 프로젝트에 사용한 React 라이브러리는 `SPA(Single Page Application)`으로 분류되어 있고 `SPA`는 기존의 `MPA` 방식과는 달리 페이지 갱신에 필요한 데이터만을 전달받아 페이지를 갱신하기 때문에 웹페이지에 필요한 정적 데이터와 페이지 갱신에 필요한 동적 데이터를 처리하는 서버의 분리가 필요했습니다.

- 그래서 정적 데이터를 처리하는 `Web Server(NGINX)`를 배포 환경에서 사용하였고 클라이언트가 `HTML, CSS와 같은 정적 데이터`를 요청하면 `NGINX 서버`에서 클라이언트에게 데이터를 제공하고, `동적 데이터(DB 데이터)`를 요청할 경우 클라이언트의 요청을 `WAS`에 전달하고 `WAS`가 처리한 데이터를 클라이언트에게 제공하도록 하였습니다.
</details>

<details>
<summary>HTTP 요청 응답 from disk cache 이슈</summary>

- 배포를 마치고 테스트를 하는 도중 `GET 요청`에 대한 `HTTP Response`가 서버로부터 오는 것이 아니라 이전의 데이터를 반복해서 가져오는 문제가 발생하였습니다.

- 문제의 원인은 인터넷 브라우저에서 `GET 요청`을 했을 때 동일한 요청이면 브라우저 자체에서 캐시 처리가 되어 `실제 서버를 호출하지 않는 문제` 때문이었고, 새로운 응답을 서버로부터 받아와야 하는데 크롬 브라우저 자체의 캐시로 요청을 처리한 것이었습니다.

- 문제 해결을 위해서 `Axios`를 이용하여 백엔드를 요청할 때 `Header` 값에 캐시에 대한 설정을 했으며, 수정 이후 요청에는 `from disk cache 이슈`가 생기지 않았습니다.
</details>

## 👩‍💻 개발 후기

#### ✏️ 프로젝트에 대한 후기 및 느낀점입니다.
> 