package com.masai.notionclone.share.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

@Data
public class SharePageRequest {
    @Email(message = "Email should be valid")
    @NotNull(message = "Email is required")
    private String email;
    
    @NotNull(message = "Permission level is required")
    private String permission; // "VIEW" or "EDIT"
}
