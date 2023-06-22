/*
  23-06-06 Tomcat URL 특수문자 허용 설정 구현(오병주)
*/
package com.movie.Spring_backend.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatWebCustomConfig implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {
    @Override
    // Rest Api GET 요청시 특수문자를 사용하기 위한 Custom
    public void customize(TomcatServletWebServerFactory factory) {
        factory.addConnectorCustomizers(connector -> connector.setProperty("relaxedQueryChars", "<>[\\]^`{|}"));
    }
}