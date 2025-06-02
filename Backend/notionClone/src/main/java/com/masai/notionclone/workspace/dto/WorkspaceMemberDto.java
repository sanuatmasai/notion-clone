package com.masai.notionclone.workspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceMemberDto {
    private Long userId;
    private String email;
    private String name;
    private String role;
    private LocalDateTime joinedAt;
}
