package com.movie.Spring_backend.repository;
import com.movie.Spring_backend.entity.RedisSeatEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RedisSeatRepository extends CrudRepository<RedisSeatEntity, String> {
    @Override
    List<RedisSeatEntity> findAll();
}
