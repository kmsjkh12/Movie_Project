package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BoardDto {
    private Long bid;
    private String btitle;
    private String bdetail;
    private String bdate;
    private Integer bclickindex;
    private String bcategory;
    private String bthumbnail;
    private String uid;
    private Integer likes;
    private Integer unlikes;
    private Integer commentCounts;
    private boolean like;
    private boolean unlike;
    private String image;

    @Builder
    public BoardDto(Long bid, String btitle, String bdetail, String bdate, Integer bclickindex, String bcategory, String bthumbnail,
                    String uid, Integer likes, Integer unlikes, Integer commentCounts, boolean like, boolean unlike, String image) {
        this.bid = bid;
        this.btitle = btitle;
        this.bdetail = bdetail;
        this.bdate = bdate;
        this.bclickindex = bclickindex;
        this.bcategory = bcategory;
        this.bthumbnail = bthumbnail;
        this.uid = uid;
        this.likes = likes;
        this.unlikes = unlikes;
        this.commentCounts = commentCounts;
        this.like = like;
        this.unlike = unlike;
        this.image = image;
    }
}
