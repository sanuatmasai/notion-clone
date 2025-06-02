package com.masai.notionclone.block.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UpdateBlockRequest {
    @NotBlank(message = "Content is required")
    private String content;
    
    private String type;
    private Boolean archived;
}
