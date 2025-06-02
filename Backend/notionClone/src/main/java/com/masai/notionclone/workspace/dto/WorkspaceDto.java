package com.masai.notionclone.workspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceDto {
    private UUID id;
    private String name;
    private String description;
    private boolean personal;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
