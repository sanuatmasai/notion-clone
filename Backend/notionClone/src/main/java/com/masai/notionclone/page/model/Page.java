package com.masai.notionclone.page.model;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.masai.notionclone.model.User;
import com.masai.notionclone.page.dto.PageDto;
import com.masai.notionclone.workspace.model.Workspace;

import lombok.Data;

@Data
@Entity
@Table(name = "pages")
public class Page {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String icon;
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Page parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    private int position;
    private boolean archived = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false, updatable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", nullable = false)
    private User updatedBy;
    
    private Boolean favorite = false; 

    public PageDto toDto() {
        PageDto dto = new PageDto();
        dto.setId(this.id);
        dto.setTitle(this.title);
        dto.setIcon(this.icon);
//        dto.setCoverImage(this.coverImage);
        dto.setContent(this.content);
//        dto.setParentId(this.parent != null ? this.parent.getId() : null);
//        dto.setPosition(this.position);
//        dto.setArchived(this.archived);
        dto.setWsUid(this.workspace.getId().toString());
        dto.setFavorite(this.getFavorite());
        dto.setCreatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
        dto.setUpdatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
        dto.setCreatedBy(this.createdBy != null ? this.createdBy.getId() : null);
        dto.setUpdatedBy(this.updatedBy != null ? this.updatedBy.getId() : null);
        return dto;
    }
}
