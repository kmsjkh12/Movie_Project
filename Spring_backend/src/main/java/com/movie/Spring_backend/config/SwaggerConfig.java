/*
  23-06-07 Swagger 설정 구현(오병주)
*/
package com.movie.Spring_backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.extensions.Extensions;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.parameters.Parameter;
import org.springdoc.core.GroupedOpenApi;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.HandlerMethod;

@OpenAPIDefinition(
        servers = {@Server(url = "https://www.moviebnb.com/APICALL", description = "Backend Server url")},
        info = @Info(title = "영화 웹페이지 API 명세서",
                contact = @Contact(name="웹페이지 링크", url="https://www.moviebnb.com/"),
                description = "Spring boot와 React를 이용한 영화 웹페이지 API 명세서입니다.\n\n" +
                        "① URL 가운데에 auth가 붙으면 accessToken이 필요해서 로그인 이후 사용가능합니다.\n\n" +
                        "② 쿠키를 기반으로 검증하기 때문에 회원 관련 API에 있는 /Member/normal/login 요청 이후 헤더에 토큰값을 추가할 필요가 없습니다.\n\n" +
                        "③ accessToken의 만료 시간은 30분이라서 만료 이후에는 재 로그인을 하거나 회원 관련 API에 있는 /Member/normal/reissue 요청을 하면 토큰이 갱신 됩니다.\n\n" +
                        "(몇몇 기능들은 특정 파라미터를 사용하므로 작동이 안될 수 있습니다. 자세한 기능은 배포된 웹페이지를 이용해 주십시오.)",
                version = "v1"))

@Configuration
public class SwaggerConfig {
    // 테스트 케이스 확인을 위한 전역 파라미터 설정
    @Bean
    public OperationCustomizer operationCustomizer() {
        return (Operation operation, HandlerMethod handlerMethod) -> {
            Parameter param = new Parameter()
                    .in(ParameterIn.HEADER.toString())  // 전역 헤더 설정
                    .schema(new StringSchema()._default("Test_case").name("TestID")) // default값 설정
                    .name("TestID")
                    .description("TEST 케이스를 위한 헤더값(수정금지)")
                    .required(true);
            operation.addParametersItem(param);
            return operation;
        };
    }

    @Bean
    // 회원과 관련된 Api
    public GroupedOpenApi MemberApi(OperationCustomizer operationCustomizer) {
        String path = "/Member/**";

        return GroupedOpenApi.builder()
                .group("① 회원 관련 API")
                .pathsToMatch(path)
                .addOperationCustomizer(operationCustomizer)
                .build();
    }

    @Bean
    // 영화와 관련된 Api
    public GroupedOpenApi MovieApi(OperationCustomizer operationCustomizer) {
        String path = "/Movie/**";

        return GroupedOpenApi.builder()
                .group("② 영화 관련 API")
                .pathsToMatch(path)
                .addOperationCustomizer(operationCustomizer)
                .build();
    }

    @Bean
    // 상영정보와 관련된 Api
    public GroupedOpenApi MovieInfoAPi(OperationCustomizer operationCustomizer) {
        String path = "/MovieInfo/**";

        return GroupedOpenApi.builder()
                .group("③ 상영정보 관련 API")
                .pathsToMatch(path)
                .addOperationCustomizer(operationCustomizer)
                .build();
    }

    @Bean
    // 극장과 관련된 Api
    public GroupedOpenApi TheaterAPi(OperationCustomizer operationCustomizer) {
        String path = "/Theater/**";

        return GroupedOpenApi.builder()
                .group("④ 극장 관련 API")
                .pathsToMatch(path)
                .addOperationCustomizer(operationCustomizer)
                .build();
    }

    @Bean
    // 좌석과 관련된 Api
    public GroupedOpenApi SeatAPi(OperationCustomizer operationCustomizer) {
        String path = "/Seat/**";

        return GroupedOpenApi.builder()
                .group("⑤ 좌석 관련 API")
                .pathsToMatch(path)
                .addOperationCustomizer(operationCustomizer)
                .build();
    }

    @Bean
    // 결제와 관련된 Api
    public GroupedOpenApi PaymentAPi(OperationCustomizer operationCustomizer) {
        String path = "/Payment/**";

        return GroupedOpenApi.builder()
                .group("⑥ 결제 관련 API")
                .pathsToMatch(path)
                .addOperationCustomizer(operationCustomizer)
                .build();
    }

    @Bean
    // 회원의 영화 평가와 관련된 Api
    public GroupedOpenApi MovieMemberAPi(OperationCustomizer operationCustomizer) {
        String path = "/MovieMember/**";

        return GroupedOpenApi.builder()
                .group("⑦ 회원 영화평가 관련 API")
                .pathsToMatch(path)
                .addOperationCustomizer(operationCustomizer)
                .build();
    }

    @Bean
    // 마이페이지와 관련된 Api
    public GroupedOpenApi MyPageMovieAPi(OperationCustomizer operationCustomizer) {
        String path = "/MyPageMovie/**";

        return GroupedOpenApi.builder()
                .group("⑧ 마이페이지 관련 API")
                .pathsToMatch(path)
                .addOperationCustomizer(operationCustomizer)
                .build();
    }

    @Bean
    // 게시판과 관련된 Api
    public GroupedOpenApi BoardAPi(OperationCustomizer operationCustomizer) {
        String path = "/Board/**";

        return GroupedOpenApi.builder()
                .group("⑨ 게시판 관련 API")
                .pathsToMatch(path)
                .addOperationCustomizer(operationCustomizer)
                .build();
    }

    @Bean
    // 관리자와 관련된 Api
    public GroupedOpenApi ManagerAPi(OperationCustomizer operationCustomizer) {
        String path = "/Manager/**";

        return GroupedOpenApi.builder()
                .group("⑩ 관리자 관련 API")
                .pathsToMatch(path)
                .addOperationCustomizer(operationCustomizer)
                .build();
    }
}

