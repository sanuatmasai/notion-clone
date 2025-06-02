package com.masai.notionclone.page.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.masai.notionclone.workspace.dto.WorkspaceDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PageDto {
    private UUID id;
    private String title;
    private String icon;
//    private String coverImage;
    private String content;
//    private UUID parentId;
    private WorkspaceDto workspace;
//    private int position;
//    private boolean archived;
    private boolean favorite;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;
    private String wsUid;
}
