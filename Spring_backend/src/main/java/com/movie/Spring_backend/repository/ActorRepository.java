package com.movie.Spring_backend.repository;

import com.movie.Spring_backend.entity.ActorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ActorRepository extends JpaRepository<ActorEntity, Long> {
    // 배우 수정하는 메소드
    @Modifying
    @Query("UPDATE ActorEntity as a " +
            "SET a.aname = :aname, a.abirthplace = :abirthplace WHERE a.aid = :aid")
    void ActorUpdate(@Param("aname") String aname, @Param("abirthplace") String abirthplace, @Param("aid") Long aid);
}
