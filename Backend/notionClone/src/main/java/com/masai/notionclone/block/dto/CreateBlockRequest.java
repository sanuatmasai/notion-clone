package com.masai.notionclone.block.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
public class CreateBlockRequest {
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    @NotNull(message = "Page ID is required")
    private UUID pageId;
    
    private UUID parentId;
    private int position = 0;
}
