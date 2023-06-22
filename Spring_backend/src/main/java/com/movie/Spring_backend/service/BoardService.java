/*
  23-05-19 ~ 23 게시물 관련 서비스 수정(오병주)
*/
package com.movie.Spring_backend.service;

import com.movie.Spring_backend.dto.BoardDto;
import com.movie.Spring_backend.entity.*;
import com.movie.Spring_backend.exceptionlist.BoardNotFoundException;
import com.movie.Spring_backend.jwt.JwtValidCheck;
import com.movie.Spring_backend.repository.BoardLikeRepository;
import com.movie.Spring_backend.repository.BoardRepository;
import com.movie.Spring_backend.util.DateUtil;
import com.movie.Spring_backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final JwtValidCheck jwtValidCheck;
    private final BoardLikeRepository boardLikeRepository;

    // 게시물 조회 메소드
    @Transactional
    public Page<BoardDto> getBoard(Map<String, String> requestMap) {
        // requestMap 안에 정보를 추출
        String category = requestMap.get("category");
        String sort = requestMap.get("sort");
        String uid = requestMap.get("uid");
        int page = Integer.parseInt(requestMap.get("page"));

        // 페이지네이션을 위한 정보
        PageRequest PageInfo = PageRequest.of(page, 20);

        // 카테고리 분류
        String search_category = "";
        switch (category) {
            case "free":
                search_category = "자유 게시판";
                break;
            case "news":
                search_category = "영화 뉴스";
                break;
            case "debate":
                search_category = "영화 토론";
                break;
        }

        // 게시물 조회
        Page<BoardEntity> board;
        switch (sort) {
            // 최신순
            case "all":
                board = boardRepository.findByBcategoryOrderByBidDesc(search_category, PageInfo);
                break;
            // 인기순
            case "like":
                board = boardRepository.findByBcategoryOrderByBlikeDesc(search_category, PageInfo);
                break;
            // 조회순
            case "top":
                board = boardRepository.findByBcategoryOrderByBclickindexDescBidAsc(search_category, PageInfo);
                break;
            // 내 게시물
            default:
                board = boardRepository.findByMemberOrderByBidDesc(MemberEntity.builder().uid(uid).build(), PageInfo);
        }

        return board.map(data -> BoardDto.builder()
                .bid(data.getBid())
                .btitle(data.getBtitle())
                .bdate(data.getBdate())
                .bcategory(data.getBcategory())
                .bthumbnail(data.getBthumbnail())
                .uid(data.getMember().getUid())
                .likes(data.getLikes())
                .unlikes(data.getUnlikes())
                .commentCounts(data.getCommentCounts()).build());
    }

    // 게시물 검색 메소드
    @Transactional
    public Page<BoardDto> getSearchBoard(Map<String, String> requestMap) {
        // requestMap 안에 정보를 추출
        String category = requestMap.get("category");
        String title = requestMap.get("title").trim();
        int page = Integer.parseInt(requestMap.get("page"));

        // 페이지네이션을 위한 정보
        PageRequest PageInfo = PageRequest.of(page, 20);

        // 게시물 검색
        Page<BoardEntity> board;
        if (category.equals("title")) {
            board = boardRepository.findByBtitleContainsOrderByBidDesc(title, PageInfo);
        }
        else {
            board = boardRepository.findByMemberUidContainsOrderByBidDesc(title, PageInfo);
        }

        return board.map(data -> BoardDto.builder()
                .bid(data.getBid())
                .btitle(data.getBtitle())
                .bdate(data.getBdate())
                .bcategory(data.getBcategory())
                .bthumbnail(data.getBthumbnail())
                .uid(data.getMember().getUid())
                .likes(data.getLikes())
                .unlikes(data.getUnlikes())
                .commentCounts(data.getCommentCounts()).build());
    }

    // 게시물 상세조회 메소드
    @Transactional
    public BoardDto getBoardDetail(Map<String, String> requestMap) {
        // requestMap 안에 정보를 추출
        Long bid = Long.valueOf(requestMap.get("bid"));
        String uid = requestMap.get("uid");

        // 게시물 상세조회
        BoardEntity Board = boardRepository.findById(bid).orElseThrow(() -> new BoardNotFoundException("게시물이 존재하지 않습니다."));

        // 게시물 조회수 1증가
        boardRepository.updateViews(bid);

        // 게시물 조회에 필요한 정보 Entity로 변환
        BoardEntity board = BoardEntity.builder().bid(bid).build();
        MemberEntity member = MemberEntity.builder().uid(uid).build();

        // 좋아요, 싫어요 정보 조회 및 가공
        BoardLikeEntity checkLike = boardLikeRepository
                .findByBoardAndMemberAndBllikeTrueAndBoardcommentIsNull(board, member).orElse(null);
        BoardLikeEntity checkUnlike = boardLikeRepository
                .findByBoardAndMemberAndBlunlikeTrueAndBoardcommentIsNull(board, member).orElse(null);

        boolean like = false;
        boolean unlike = false;
        if (checkLike != null) {
            like = true;
        }
        if (checkUnlike != null) {
            unlike = true;
        }

        return BoardDto.builder()
                .bid(Board.getBid())
                .btitle(Board.getBtitle())
                .bdetail(Board.getBdetail())
                .bdate(Board.getBdate())
                .bcategory(Board.getBcategory())
                .bclickindex(Board.getBclickindex() + 1)
                .uid(Board.getMember().getUid())
                .likes(Board.getLikes())
                .unlikes(Board.getUnlikes())
                .commentCounts(Board.getCommentCounts())
                .like(like)
                .unlike(unlike).build();
    }

    // 게시물 작성시 이미지 저장 메소드
    public BoardDto ImageUpload(HttpServletRequest request, MultipartFile multipartFiles) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 원본 이미지명
        String originFileName = multipartFiles.getOriginalFilename();
        // 저장될 이미지명
        String newFilename = System.currentTimeMillis() + originFileName;
        // 이미지 파일 저장할 경로
        String IMAGE_PATH = "/home/ubuntu/Movie_Project/React_frontend/build/img/board";

        try {
            // 이미지를 저장
            File file = new File(IMAGE_PATH, newFilename);
            multipartFiles.transferTo(file);
        }
        catch (IOException e) {
            throw new RuntimeException("이미지 저장 실패");
        }

        // 저장된 이미지 경로를 return
        return BoardDto.builder().image("https://www.moviebnb.com/img/board/" + newFilename).build();
    }

    // 게시물 작성 메소드
    @Transactional
    public void BoardWrite(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // requestMap 안에 정보를 추출
        String title = requestMap.get("title").trim();
        String detail = requestMap.get("detail").trim();
        String category = requestMap.get("category").trim();

        // 게시물 삽입에 필요한 정보 Entity로 변환
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();

        // 썸네일 정보 가공
        String imgTag = "<img src=\"https://www.moviebnb.com/img/board/post_hidden.jpg\">";
        Pattern pattern = Pattern.compile("<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>");
        Matcher match = pattern.matcher(detail);

        // 게시물 내에 이미지 태그를 찾으면
        if (match.find()) {
            // 게시물 내용 중 첫번째 이미지 태그를 뽑은 후 변수에 할당
            imgTag = match.group(0);
        }

        // 게시물 저장
        boardRepository.save(BoardEntity.builder()
                .btitle(title)
                .bdate(DateUtil.getNow())
                .bdetail(detail)
                .bcategory(category)
                .bclickindex(0)
                .member(member)
                .bthumbnail(imgTag)
                .build());
    }

    // 게시물 수정 메소드
    @Transactional
    public void BoardUpdate(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // requestMap 안에 정보를 추출
        Long bid = Long.valueOf(requestMap.get("bid"));
        String title = requestMap.get("title").trim();
        String detail = requestMap.get("detail").trim();
        String category = requestMap.get("category").trim();

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // 게시물 수정전 예외처리
        BoardEntity board = boardRepository.findById(bid).orElseThrow(()-> new BoardNotFoundException("게시물이 존재하지 않습니다."));
        if (!currentMemberId.equals(board.getMember().getUid())) {
            throw new BoardNotFoundException("본인이 작성한 게시물이 아닙니다.");
        }

        // 썸네일 정보 가공
        String imgTag = "<img src=\"https://www.moviebnb.com/img/board/post_hidden.jpg\">";
        Pattern pattern = Pattern.compile("<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>");
        Matcher match = pattern.matcher(detail);

        // 게시물 내에 이미지 태그를 찾으면
        if (match.find()) {
            // 게시물 내용 중 첫번째 이미지 태그를 뽑은 후 변수에 할당
            imgTag = match.group(0);
        }

        // 게시물 수정
        boardRepository.BoardUpdate(title, detail, category, imgTag, bid);
    }

    // 게시물 삭제 메소드
    @Transactional
    public void BoardDelete(HttpServletRequest request, Long bid){
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // 게시물 삭제전 예외처리
        BoardEntity board = boardRepository.findById(bid).orElseThrow(()-> new BoardNotFoundException("게시물이 존재하지 않습니다."));
        if (!currentMemberId.equals(board.getMember().getUid())) {
            throw new BoardNotFoundException("본인이 작성한 게시물이 아닙니다.");
        }

        // 게시물 삭제
        boardRepository.deleteById(bid);
    }

    // 좋아요 구현 메소드
    @Transactional
    public BoardDto onLike(HttpServletRequest request, Map<String, String> requestMap){
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // requestMap 안에 정보를 추출
        Long bid = Long.valueOf(requestMap.get("bid"));
        String state = requestMap.get("state");

        // 좋아요에 필요한 정보 Entity로 변환
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();
        BoardEntity board = boardRepository.findById(bid).orElseThrow(() -> new BoardNotFoundException("게시물이 존재하지 않습니다."));

        // 사용자 좋아요, 싫어요 정보 조회 및 가공
        BoardLikeEntity checkLike = boardLikeRepository
                .findByBoardAndMemberAndBllikeTrueAndBoardcommentIsNull(board, member).orElse(null);
        BoardLikeEntity checkUnlike = boardLikeRepository
                .findByBoardAndMemberAndBlunlikeTrueAndBoardcommentIsNull(board, member).orElse(null);

        BoardLikeEntity boardLikeEntity;
        // 사용자가 좋아요를 눌렀을 경우
        if (state.equals("like")) {
            boardLikeEntity = BoardLikeEntity.builder()
                    .bllike(true)
                    .board(board)
                    .blunlike(false)
                    .member(member)
                    .build();
        }
        // 사용자가 싫어요를 눌렀을 경우
        else {
            boardLikeEntity = BoardLikeEntity.builder()
                    .bllike(false)
                    .board(board)
                    .blunlike(true)
                    .member(member)
                    .build();
        }

        // 좋아요 추가
        if(checkLike == null && state.equals("like")) {
            // 싫어요 숫자 변수
            int num = board.getUnlikes();

            // 싫어요가 된 상태면 제거후 삽입
            if(checkUnlike != null){
                boardLikeRepository.deleteByBoardAndMemberAndBlunlikeTrueAndBoardcommentIsNull(board, member);
                num = num - 1;
            }
            boardLikeRepository.save(boardLikeEntity);

            // 새로운 정보 리턴
            return BoardDto.builder()
                    .bid(board.getBid())
                    .like(true)
                    .unlike(false)
                    .likes(board.getLikes() + 1)
                    .unlikes(num).build();
        }
        // 싫어요 추가
        else if(checkUnlike == null && state.equals("unlike")) {
            // 좋아요 숫자 변수
            int num = board.getLikes();

            // 좋아요가 된 상태면 제거후 삽입
            if(checkLike != null){
                boardLikeRepository.deleteByBoardAndMemberAndBllikeTrueAndBoardcommentIsNull(board, member);
                num = num - 1;
            }
            boardLikeRepository.save(boardLikeEntity);

            // 새로운 정보 리턴
            return BoardDto.builder()
                    .bid(board.getBid())
                    .like(false)
                    .unlike(true)
                    .likes(num)
                    .unlikes(board.getUnlikes() + 1).build();
        }
        // 좋아요 제거
        else if(checkLike != null && state.equals("like")){
            boardLikeRepository.deleteByBoardAndMemberAndBllikeTrueAndBoardcommentIsNull(board, member);

            // 새로운 정보 리턴
            return BoardDto.builder()
                    .bid(board.getBid())
                    .like(false)
                    .unlike(false)
                    .likes(board.getLikes() - 1)
                    .unlikes(board.getUnlikes()).build();
        }
        // 싫어요 제거
        else {
            boardLikeRepository.deleteByBoardAndMemberAndBlunlikeTrueAndBoardcommentIsNull(board, member);

            // 새로운 정보 리턴
            return BoardDto.builder()
                    .bid(board.getBid())
                    .like(false)
                    .unlike(false)
                    .likes(board.getLikes())
                    .unlikes(board.getUnlikes() - 1).build();
        }
    }
}
