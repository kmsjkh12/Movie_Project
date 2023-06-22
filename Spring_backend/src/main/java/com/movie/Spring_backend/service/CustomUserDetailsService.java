// 23-01-16 로그인 시 회원정보의 존재 유무를 판별하기위한 메소드 구현(오병주)
package com.movie.Spring_backend.service;

import com.movie.Spring_backend.entity.MemberEntity;
import com.movie.Spring_backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collections;

// UserDetailsService 인터페이스를 구현한 클래스
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    // loadUserByUsername 메소드를 오버라이드 하는데
    // 여기서 넘겨받은 UserDetails와 Authentication의 패스워드를 비교하고 검증하는 로직을 처리
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String uid) {
        // DB에 회원정보 존재 유무를 판단하고 존재하면 메소드 실행, 없을 경우에는 예외처리
        return memberRepository.findById(uid)
                .map(this::createUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException(uid + " 라는 회원정보가 존재하지 않습니다."));
    }

    // DB에 회원정보가 존재한다면 회원정보를 UserDetails 객체로 만들어서 리턴
    private UserDetails createUserDetails(MemberEntity member) {
        // 회원정보에 있는 권한값을 SimpleGrantedAuthority 클래스를 통해 권한 객체로 생성
        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(member.getUauthority().toString());

        return new User(
                member.getUid(),
                member.getUpw(),
                Collections.singleton(grantedAuthority)
        );
    }
}
