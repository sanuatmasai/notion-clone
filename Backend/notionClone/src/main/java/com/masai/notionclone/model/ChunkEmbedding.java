package com.masai.notionclone.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chunk_embedding")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChunkEmbedding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "chunk_text", columnDefinition = "text")
    private String chunkText;

    //here we will store userUid
    @Column(name = "source")
    private String source;

    @Column(name = "vector", columnDefinition = "vector(384)")
    private String vector;
    
    private String wsUid;
    private String pageUid;
}
