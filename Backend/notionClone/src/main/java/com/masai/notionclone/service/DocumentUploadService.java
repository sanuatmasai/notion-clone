package com.masai.notionclone.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.masai.notionclone.config.TextChunker;
import com.masai.notionclone.model.User;
import com.masai.notionclone.page.dto.PageDto;
import com.masai.notionclone.page.service.PageService;


@Service
public class DocumentUploadService {

    @Autowired private TextChunker chunker;
    @Autowired private EmbeddingService embeddingService;
//    @Autowired private ChunkEmbeddingRepository repository;
//    @Autowired private ChunkEmbeddingRepositoryCustomImpl chunkEmbeddingRepositoryCustomImpl;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private PageService pageService;

    public void processAndStore(User user) {
    	List<PageDto> pages = pageService.getUserPages(user.getId());
    	
    	// ✅ Step 1: Delete existing entries with the same sourceId
        String deleteSql = "DELETE FROM chunk_embedding WHERE source = ?";
        jdbcTemplate.update(deleteSql, user.getId().toString());
        
        for(PageDto info : pages) {
        	String wsUid = info.getWsUid();
        	List<String> chunks = chunker.chunkText(info.getContent(), 500);

            for (String chunk : chunks) {
                List<Double> vector = embeddingService.getEmbedding(chunk);

                // Convert list to pgvector format string: "[0.1, 0.2, 0.3]"
                String pgVectorFormat = vector.stream()
                        .map(String::valueOf)
                        .collect(Collectors.joining(",", "[", "]"));

                // Use native SQL with ::vector cast
                String sql = "INSERT INTO chunk_embedding (chunk_text, source, vector, ws_uid, page_uid) VALUES (?, ?, ?::vector, ?, ? )";
                jdbcTemplate.update(sql, chunk, user.getId().toString(), pgVectorFormat, wsUid, info.getId().toString());
            }
        }  
    }
    
//    public List<String> getAllSourceIds() {
//        return chunkEmbeddingRepositoryCustomImpl.findAllUniqueSourceIds();
//    }
}
