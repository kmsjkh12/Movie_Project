/*
  23-05-24 ~ 26, 28 게시물 댓글 관련 서비스 수정(오병주)
*/
package com.movie.Spring_backend.service;

import com.movie.Spring_backend.dto.BoardCommentDto;
import com.movie.Spring_backend.dto.CountCommentDto;
import com.movie.Spring_backend.entity.BoardCommentEntity;
import com.movie.Spring_backend.entity.BoardEntity;
import com.movie.Spring_backend.entity.BoardLikeEntity;
import com.movie.Spring_backend.entity.MemberEntity;
import com.movie.Spring_backend.exceptionlist.BoardCommentNotFoundException;
import com.movie.Spring_backend.exceptionlist.BoardNotFoundException;
import com.movie.Spring_backend.jwt.JwtValidCheck;
import com.movie.Spring_backend.repository.BoardCommentRepository;
import com.movie.Spring_backend.repository.BoardLikeRepository;
import com.movie.Spring_backend.repository.BoardRepository;
import com.movie.Spring_backend.util.DateUtil;
import com.movie.Spring_backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BoardCommentService {
    private final BoardCommentRepository boardCommentRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final JwtValidCheck jwtValidCheck;
    private final BoardRepository boardRepository;

    // 댓글 조회하는 메소드
    @Transactional
    public CountCommentDto getComment(Map<String, String> requestMap) {
        // requestMap 안에 정보를 추출
        Long bid = Long.valueOf(requestMap.get("bid"));
        String sort = requestMap.get("sort");
        String uid = requestMap.get("uid");

        // 댓글 조회에 필요한 정보 Entity형으로 변환
        BoardEntity board = BoardEntity.builder().bid(bid).build();
        MemberEntity member = MemberEntity.builder().uid(uid).build();

        // 정렬에 따른 최상위 부모 댓글 조회
        List<BoardCommentEntity> boardComments;
        if (sort.equals("like")) {
            boardComments = boardCommentRepository.findByCommentLike(board);
        }
        else {
            boardComments = boardCommentRepository.findByBoardAndBcrootIsNullOrderByBcidDesc(board);
        }

        // 전체 답글조회(작성 시간순으로 최신순)
        List<BoardCommentEntity> boardReply = boardCommentRepository.findByBoardAndBcrootIsNotNullOrderByBcrootAscBcparentAscBcidDesc(board);

        // 사용자가 좋아요 누른 댓글 조회 및 기본키 매핑
        List<Long> checkLike = new ArrayList<>();
        List<BoardLikeEntity> commentLikes = boardLikeRepository.findByBoardAndMemberAndBllikeTrueAndBoardcommentIsNotNull(board, member);
        for (BoardLikeEntity BL : commentLikes) {
            checkLike.add(BL.getBoardcomment().getBcid());
        }

        // 사용자가 싫어요 누른 댓글 조회 및 기본키 매핑
        List<Long> checkUnlike = new ArrayList<>();
        List<BoardLikeEntity> commentUnlikes = boardLikeRepository.findByBoardAndMemberAndBlunlikeTrueAndBoardcommentIsNotNull(board, member);
        for (BoardLikeEntity BL : commentUnlikes) {
            checkUnlike.add(BL.getBoardcomment().getBcid());
        }

        // 댓글 개수 count
        int count = 0;

        // 최상위 부모 댓글 매핑
        HashMap<Long, BoardCommentDto> result = new LinkedHashMap<>();
        for (BoardCommentEntity BC : boardComments) {
            result.put(BC.getBcid(), BoardCommentDto.builder()
                    .bcid(BC.getBcid())
                    .bccomment(BC.getBccomment())
                    .bcdate(BC.getBcdate())
                    .likes(BC.getLikes())
                    .unlikes(BC.getUnlikes())
                    .like(checkLike.contains(BC.getBcid()))
                    .unlike(checkUnlike.contains(BC.getBcid()))
                    .uid(BC.getMember().getUid())
                    .child(new ArrayList<>()).build());
            count++;
        }

        // 답글 매핑
        for (BoardCommentEntity BC : boardReply) {
            // 답글 중 최상위 답글일경우 답글을 그냥 삽입
            if (BC.getBcroot().equals(BC.getBcparent())) {
                result.get(BC.getBcroot()).getChild().add(0, BoardCommentDto.builder()
                        .bcid(BC.getBcid())
                        .bccomment(BC.getBccomment())
                        .bcdate(BC.getBcdate())
                        .bcroot(BC.getBcroot())
                        .uid(BC.getMember().getUid()).build());
            }
            else {
                // 최상위 부모 댓글의 자식들을 추출
                List<BoardCommentDto> temp = result.get(BC.getBcroot()).getChild();

                // 현재 답글 리스트중 자신의 부모를 찾은 뒤 다음 인덱스에 정보 삽입
                for (int i = 0; i < temp.size(); i++) {
                    if (temp.get(i).getBcid().equals(BC.getBcparent())) {
                        temp.add(i + 1, BoardCommentDto.builder()
                                .bcid(BC.getBcid())
                                .bccomment(BC.getBccomment())
                                .bcdate(BC.getBcdate())
                                .bcroot(BC.getBcroot())
                                .uid(BC.getMember().getUid())
                                .parentUid(temp.get(i).getUid()).build());
                    }
                }
            }
            count++;
        }

        // 댓글의 총개수 + 댓글내용을 리턴
        return CountCommentDto.builder().count(count).content(new ArrayList<>(result.values())).build();
    }

    // 댓글 작성 메소드
    @Transactional
    public void CommentWrite(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // requestMap 안에 정보를 추출
        String comment = requestMap.get("comment");
        long bid = Long.parseLong(requestMap.get("bid"));

        // 댓글 삽입에 필요한 정보 Entity로 변환
        BoardEntity board = boardRepository.findById(bid)
                .orElseThrow(()-> new BoardNotFoundException("게시물이 존재하지 않습니다."));
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();

        // 댓글 저장
        boardCommentRepository.save(BoardCommentEntity.builder()
                .bccomment(comment)
                .bcdate(DateUtil.getNow())
                .bcroot(null)
                .bcparent(null)
                .board(board)
                .member(member).build());
    }

    // 댓글 삭제 메소드
    @Transactional
    public void CommentDelete(HttpServletRequest request, Long bcid){
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // 댓글 삭제전 예외처리
        BoardCommentEntity boardComment = boardCommentRepository
                .findById(bcid).orElseThrow(()-> new BoardCommentNotFoundException("댓글이 존재하지 않습니다."));
        if (boardComment.getBcroot() != null) {
            throw new BoardCommentNotFoundException("댓글이 존재하지 않습니다.");
        }

        if (!currentMemberId.equals(boardComment.getMember().getUid())) {
            throw new BoardCommentNotFoundException("본인이 작성한 댓글이 아닙니다.");
        }

        // 댓글 및 답글 모두 제거
        boardCommentRepository.deleteByBcroot(bcid);
        boardCommentRepository.deleteById(bcid);
    }

    // 댓글 좋아요 메소드
    @Transactional
    public BoardCommentDto onLike(HttpServletRequest request, Map<String, String> requestMap){
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // requestMap 안에 정보를 추출
        Long bid = Long.valueOf(requestMap.get("bid"));
        Long bcid = Long.valueOf(requestMap.get("bcid"));
        String state = requestMap.get("state");

        // 좋아요에 필요한 정보 Entity로 변환
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();
        BoardEntity board = boardRepository.findById(bid)
                .orElseThrow(() -> new BoardNotFoundException("게시물이 존재하지 않습니다."));
        BoardCommentEntity boardComment = boardCommentRepository.findById(bcid)
                .orElseThrow(() -> new BoardCommentNotFoundException("댓글이 존재하지 않습니다."));

        // 좋아요 전 예외처리
        if (!board.getBid().equals(boardComment.getBoard().getBid())) {
            throw new BoardCommentNotFoundException("댓글이 존재하지 않습니다.");
        }

        // 사용자 좋아요, 싫어요 정보 조회 및 가공
        BoardLikeEntity checkLike = boardLikeRepository
                .findByBoardAndMemberAndBoardcommentAndBllikeTrue(board, member, boardComment).orElse(null);
        BoardLikeEntity checkUnlike = boardLikeRepository
                .findByBoardAndMemberAndBoardcommentAndBlunlikeTrue(board, member, boardComment).orElse(null);

        BoardLikeEntity boardLikeEntity;
        // 사용자가 좋아요를 눌렀을 경우
        if (state.equals("like")) {
            boardLikeEntity = BoardLikeEntity.builder()
                    .bllike(true)
                    .blunlike(false)
                    .member(member)
                    .board(board)
                    .boardcomment(boardComment)
                    .build();
        }
        // 사용자가 싫어요를 눌렀을 경우
        else {
            boardLikeEntity = BoardLikeEntity.builder()
                    .bllike(false)
                    .blunlike(true)
                    .member(member)
                    .board(board)
                    .boardcomment(boardComment)
                    .build();
        }

        // 좋아요 추가
        if(checkLike == null && state.equals("like")) {
            // 싫어요 숫자 변수
            int num = boardComment.getUnlikes();

            // 싫어요가 된 상태면 제거후 삽입
            if(checkUnlike != null){
                boardLikeRepository.deleteByBoardAndMemberAndBoardcommentAndBlunlikeTrue(board, member, boardComment);
                num = num - 1;
            }
            boardLikeRepository.save(boardLikeEntity);

            // 새로운 정보 리턴
            return BoardCommentDto.builder()
                    .bcid(boardComment.getBcid())
                    .like(true)
                    .unlike(false)
                    .likes(boardComment.getLikes() + 1)
                    .unlikes(num).build();
        }
        // 싫어요 추가
        else if(checkUnlike == null && state.equals("unlike")) {
            // 좋아요 숫자 변수
            int num = boardComment.getLikes();

            // 좋아요가 된 상태면 제거후 삽입
            if(checkLike != null){
                boardLikeRepository.deleteByBoardAndMemberAndBoardcommentAndBllikeTrue(board, member, boardComment);
                num = num - 1;
            }
            boardLikeRepository.save(boardLikeEntity);

            // 새로운 정보 리턴
            return BoardCommentDto.builder()
                    .bcid(boardComment.getBcid())
                    .like(false)
                    .unlike(true)
                    .likes(num)
                    .unlikes(boardComment.getUnlikes() + 1).build();
        }
        // 좋아요 제거
        else if(checkLike != null && state.equals("like")){
            boardLikeRepository.deleteByBoardAndMemberAndBoardcommentAndBllikeTrue(board, member, boardComment);

            // 새로운 정보 리턴
            return BoardCommentDto.builder()
                    .bcid(boardComment.getBcid())
                    .like(false)
                    .unlike(false)
                    .likes(boardComment.getLikes() - 1)
                    .unlikes(boardComment.getUnlikes()).build();
        }
        // 싫어요 제거
        else {
            boardLikeRepository.deleteByBoardAndMemberAndBoardcommentAndBlunlikeTrue(board, member, boardComment);

            // 새로운 정보 리턴
            return BoardCommentDto.builder()
                    .bcid(boardComment.getBcid())
                    .like(false)
                    .unlike(false)
                    .likes(boardComment.getLikes())
                    .unlikes(boardComment.getUnlikes() - 1).build();
        }
    }

    // 답글 작성 메소드
    @Transactional
    public void ReplyWrite(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // requestMap 안에 정보를 추출
        String comment = requestMap.get("comment");
        long bid = Long.parseLong(requestMap.get("bid"));
        long bcroot = Long.parseLong(requestMap.get("bcroot"));
        long bcparent = Long.parseLong(requestMap.get("bcparent"));

        // 답글 삽입에 필요한 정보 Entity로 변환
        BoardEntity board = boardRepository.findById(bid)
                .orElseThrow(()-> new BoardNotFoundException("게시물이 존재하지 않습니다."));
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();

        // 답글 삽입전 최상위 부모 댓글 및 부모 댓글의 존재유무 확인
        if (!boardCommentRepository.existsById(bcroot) || !boardCommentRepository.existsById(bcparent)) {
            throw new BoardCommentNotFoundException("댓글이 존재하지 않습니다.");
        }

        // 답글 저장
        boardCommentRepository.save(BoardCommentEntity.builder()
                .bccomment(comment)
                .bcdate(DateUtil.getNow())
                .bcroot(bcroot)
                .bcparent(bcparent)
                .board(board)
                .member(member).build());
    }

    // 답글 삭제 메소드
    @Transactional
    public void ReplyDelete(HttpServletRequest request, Long bcid){
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // 답글 삭제전 예외처리
        BoardCommentEntity boardComment = boardCommentRepository.findById(bcid)
                .orElseThrow(()-> new BoardCommentNotFoundException("답글이 존재하지 않습니다."));
        if (boardComment.getBcroot() == null) {
            throw new BoardCommentNotFoundException("답글이 존재하지 않습니다.");
        }

        if (!currentMemberId.equals(boardComment.getMember().getUid())) {
            throw new BoardCommentNotFoundException("본인이 작성한 답글이 아닙니다.");
        }

        // 현재 답글과 관련된 모든 답글들을 제거하기위해 List선언 및 현재답글의 id값 삽입
        List<Long> delList = new ArrayList<>();
        delList.add(bcid);

        // List가 비어 있을때 까지 반복
        while (!delList.isEmpty()) {
            // List의 제일 앞 인덱스 값 추출 후 자식 답글들 검색
            long delNum = delList.get(0);
            List<BoardCommentEntity> boardComments = boardCommentRepository.findByBcparent(delNum);

            // 자식들의 id값 리스트에 삽입
            for (BoardCommentEntity BC : boardComments) {
                delList.add(BC.getBcid());
            }

            // 제일 앞 인덱스 값 답글 삭제 및 List에서 제거
            boardCommentRepository.deleteById(delNum);
            delList.remove(0);
        }
    }
}

