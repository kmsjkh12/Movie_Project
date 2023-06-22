# nginx 초기설정 파일 적용
FROM nginx
 
# 기존 설정파일 삭제
RUN rm -rf /etc/nginx/conf.d/default.conf

# 수정한 설정파일을 복사
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY conf.d/nginx.conf /etc/nginx/nginx.conf

VOLUME ["/data", "/etc/nginx", "/var/log/nginx"]
 
WORKDIR /etc/nginx

# nginx 가동
CMD ["nginx", "-g", "daemon off;"]
 
# 포트는 80, 443 (http, https까지)
EXPOSE 80
EXPOSE 443