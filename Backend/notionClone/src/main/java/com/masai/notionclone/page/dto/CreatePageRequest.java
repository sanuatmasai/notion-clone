package com.masai.notionclone.page.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.UUID;

@Data
public class CreatePageRequest {
    @NotBlank(message = "Title is required")
    private String title;    
    private String icon;
    private String content;
    private UUID workspaceId;
}
