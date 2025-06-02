package com.masai.notionclone.share.dto;

import com.masai.notionclone.page.dto.PageDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SharedPageDto {
    private UUID id;
    private PageDto page;
    private String sharedWithEmail;
    private String permission;
    private LocalDateTime sharedAt;
    private Long sharedById;
}
