package com.masai.notionclone.repository;

import java.util.List;

import com.masai.notionclone.model.ChunkEmbedding;

public interface ChunkEmbeddingRepositoryCustom {
    List<ChunkEmbedding> findSimilarByVector(List<Double> vector, String sourceId);
}
