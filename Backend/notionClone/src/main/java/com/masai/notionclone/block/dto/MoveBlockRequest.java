package com.masai.notionclone.block.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class MoveBlockRequest {
    private UUID newParentId;
    private int newPosition;
}
