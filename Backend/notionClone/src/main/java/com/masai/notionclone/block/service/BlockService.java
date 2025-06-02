package com.masai.notionclone.block.service;

import com.masai.notionclone.block.dto.BlockDto;
import com.masai.notionclone.block.dto.CreateBlockRequest;
import com.masai.notionclone.block.dto.MoveBlockRequest;
import com.masai.notionclone.block.dto.UpdateBlockRequest;

import java.util.List;
import java.util.UUID;

public interface BlockService {
    List<BlockDto> getBlocksByPage(UUID pageId);
    BlockDto getBlock(UUID blockId);
    BlockDto createBlock(CreateBlockRequest request);
    BlockDto updateBlock(UUID blockId, UpdateBlockRequest request);
    void deleteBlock(UUID blockId);
    BlockDto moveBlock(UUID blockId, MoveBlockRequest request);
    List<BlockDto> getChildrenBlocks(UUID parentId);
}
