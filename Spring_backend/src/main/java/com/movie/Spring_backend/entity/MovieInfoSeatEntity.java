package com.movie.Spring_backend.entity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Table(name="movie_infoseat")
@Entity
@Getter
@NoArgsConstructor
public class MovieInfoSeatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long misid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="sid")
    private SeatEntity seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="miid")
    private MovieInfoEntity movieInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="rid")
    private ReservationEntity reservation;

    @Builder
    public MovieInfoSeatEntity(Long misid, SeatEntity seat, MovieInfoEntity movieInfo, ReservationEntity reservation) {
        this.misid = misid;
        this.seat = seat;
        this.movieInfo = movieInfo;
        this.reservation = reservation;
    }
}
