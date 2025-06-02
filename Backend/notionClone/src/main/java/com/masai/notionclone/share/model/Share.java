package com.masai.notionclone.share.model;

import com.masai.notionclone.model.User;
import com.masai.notionclone.page.model.Page;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "shares")
public class Share {
    
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id", nullable = false)
    private Page page;
    
    @Column(name = "shared_with_email", nullable = false)
    private String sharedWithEmail;
    
    @Column(nullable = false)
    private String permission; // "VIEW" or "EDIT"
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_by_id", nullable = false)
    private User sharedBy;
    
    @CreationTimestamp
    @Column(name = "shared_at", nullable = false, updatable = false)
    private LocalDateTime sharedAt;
    
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
    
    public com.masai.notionclone.share.dto.SharedPageDto toDto() {
        com.masai.notionclone.share.dto.SharedPageDto dto = new com.masai.notionclone.share.dto.SharedPageDto();
        dto.setId(this.id);
        dto.setPage(this.page.toDto());
        dto.setSharedWithEmail(this.sharedWithEmail);
        dto.setPermission(this.permission);
        dto.setSharedAt(this.sharedAt);
        dto.setSharedById(this.sharedBy != null ? this.sharedBy.getId() : null);
        return dto;
    }
}
