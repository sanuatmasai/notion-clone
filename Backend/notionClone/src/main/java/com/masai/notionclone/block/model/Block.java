package com.masai.notionclone.block.model;

import com.masai.notionclone.block.dto.BlockDto;
import com.masai.notionclone.page.model.Page;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "blocks")
public class Block {
    
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;
    
    @Column(nullable = false)
    private String type;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id", nullable = false)
    private Page page;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Block parent;
    
    @Column(nullable = false)
    private int position;
    
    @Column(nullable = false)
    private boolean archived = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by", nullable = false)
    private Long createdBy;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    public BlockDto toDto() {
        BlockDto dto = new BlockDto();
        dto.setId(this.id);
        dto.setType(this.type);
        dto.setContent(this.content);
        dto.setPageId(this.page != null ? this.page.getId() : null);
        dto.setParentId(this.parent != null ? this.parent.getId() : null);
        dto.setPosition(this.position);
        dto.setArchived(this.archived);
        dto.setCreatedAt(this.createdAt);
        dto.setUpdatedAt(this.updatedAt);
        dto.setCreatedBy(this.createdBy);
        dto.setUpdatedBy(this.updatedBy);
        return dto;
    }
}
