package com.masai.notionclone.workspace.model;

import java.time.LocalDateTime;
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

import com.masai.notionclone.model.User;
import com.masai.notionclone.workspace.dto.WorkspaceMemberDto;

import lombok.Data;

@Data
@Entity
@Table(name = "workspace_members")
public class WorkspaceMember {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String role; // e.g., "OWNER", "ADMIN", "MEMBER"

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    // Helper method to convert entity to DTO
    public WorkspaceMemberDto toDto() {
        WorkspaceMemberDto dto = new WorkspaceMemberDto();
        dto.setUserId(this.user.getId());
        dto.setEmail(this.user.getEmail());
        dto.setName(this.user.getUniqueName());
        dto.setRole(this.role);
        dto.setJoinedAt(this.joinedAt);
        return dto;
    }
}
