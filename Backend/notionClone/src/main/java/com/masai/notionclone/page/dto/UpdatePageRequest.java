package com.masai.notionclone.page.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UpdatePageRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String icon;
    private String coverImage;
    private String content;
}
