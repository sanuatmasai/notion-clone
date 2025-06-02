package com.masai.notionclone.repository;

import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.masai.notionclone.model.ChunkEmbedding;

@Repository
public class ChunkEmbeddingRepositoryCustomImpl implements ChunkEmbeddingRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;
    
    @Autowired private JdbcTemplate jdbcTemplate;


    @Override
    public List<ChunkEmbedding> findSimilarByVector(List<Double> vector, String sourceId) {
        String vectorString = vector.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(", ", "[", "]"));

        // Important: Move ::vector *inside* the SQL string literal
        String sql = "SELECT * FROM chunk_embedding " +
                "WHERE (:sourceId IS NULL OR source = :sourceId) " +
                "ORDER BY vector <-> CAST(:vectorStr AS vector) " +
                "LIMIT 3";

   Query query = entityManager.createNativeQuery(sql, ChunkEmbedding.class);
   query.setParameter("sourceId", sourceId);
   query.setParameter("vectorStr", vectorString);


        @SuppressWarnings("unchecked")
        List<ChunkEmbedding> results = query.getResultList();
        return results;
    }
    
    public List<String> findAllUniqueSourceIds() {
        String sql = "SELECT DISTINCT source FROM chunk_embedding";
        return jdbcTemplate.queryForList(sql, String.class);
    }


}

