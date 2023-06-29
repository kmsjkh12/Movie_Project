# docker 설정파일
version: "3.8"
services:
  redis:
    image: redis:alpine
    hostname: redis
    expose:
      - 6379
  springboot:
    hostname: springboot
    build:
      context: ./Spring_backend
    expose:
      - 8080
    depends_on:
      - redis
    environment:
      - TZ=Asia/Seoul
    # 이미지 저장을 위한 바인드 마운트
    volumes:
      - /Users/mok/Desktop/Movie_Project/React_frontend/build/img:/Users/mok/Desktop/Movie_Project/React_frontend/build/img
  nginx:
    hostname: nginx
    build:
      context: ./Docker_nginx
    ports:
      - 80:80
      - 443:443
    depends_on:
      - springboot
    # 빌드된 React파일과 https를 위한 key를 바인드 마운트
    volumes:
      - /Users/mok/Desktop/Movie_Project/React_frontend/build
      - /etc/letsencrypt/archive/moviepjo.com:/keys

# ec2 프리티어 메모리 부족현상으로 인해 리액트 파일을 빌드 못하므로
# 도커에서 volume을 따로 생성하지 않고 바인드 마운트하여 사용
# https키 또한 ubuntu에서 관리 위해 바인드 마운트하여 사용
