package com.masai.notionclone.page.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class MovePageRequest {
    private UUID newParentId;
    private int newPosition;
}
