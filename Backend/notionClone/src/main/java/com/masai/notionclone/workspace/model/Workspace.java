package com.masai.notionclone.workspace.model;

import com.masai.notionclone.model.User;
import com.masai.notionclone.workspace.dto.WorkspaceDto;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

@Data
@Entity
@Table(name = "workspaces")
public class Workspace {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private boolean personal = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper method to convert entity to DTO
    public WorkspaceDto toDto() {
        WorkspaceDto dto = new WorkspaceDto();
        dto.setId(this.id);
        dto.setName(this.name);
        dto.setDescription(this.description);
        dto.setPersonal(this.personal);
        dto.setCreatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
        dto.setUpdatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
        return dto;
    }
}
