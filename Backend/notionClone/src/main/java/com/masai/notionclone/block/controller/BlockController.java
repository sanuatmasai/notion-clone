package com.masai.notionclone.block.controller;

import com.masai.notionclone.block.dto.BlockDto;
import com.masai.notionclone.block.dto.CreateBlockRequest;
import com.masai.notionclone.block.dto.MoveBlockRequest;
import com.masai.notionclone.block.dto.UpdateBlockRequest;
import com.masai.notionclone.block.service.BlockService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blocks")
@RequiredArgsConstructor
@Tag(name = "Block Management", description = "APIs for managing content blocks")
@SecurityRequirement(name = "bearerAuth")
public class BlockController {

    private final BlockService blockService;

    @GetMapping("/page/{pageId}")
    @Operation(summary = "Get all blocks for a page", 
               description = "Retrieves all root-level blocks for a specific page")
    public ResponseEntity<List<BlockDto>> getBlocksByPage(@PathVariable UUID pageId) {
        return ResponseEntity.ok(blockService.getBlocksByPage(pageId));
    }

    @GetMapping("/{blockId}")
    @Operation(summary = "Get block by ID", 
               description = "Retrieves a specific block by its ID")
    public ResponseEntity<BlockDto> getBlock(@PathVariable UUID blockId) {
        return ResponseEntity.ok(blockService.getBlock(blockId));
    }

    @PostMapping
    @Operation(summary = "Create a new block", 
               description = "Creates a new content block")
    public ResponseEntity<BlockDto> createBlock(@Valid @RequestBody CreateBlockRequest request) {
        BlockDto createdBlock = blockService.createBlock(request);
        return ResponseEntity
                .created(URI.create("/api/blocks/" + createdBlock.getId()))
                .body(createdBlock);
    }

    @PutMapping("/{blockId}")
    @Operation(summary = "Update a block", 
               description = "Updates an existing block's content and properties")
    public ResponseEntity<BlockDto> updateBlock(
            @PathVariable UUID blockId,
            @Valid @RequestBody UpdateBlockRequest request) {
        return ResponseEntity.ok(blockService.updateBlock(blockId, request));
    }

    @DeleteMapping("/{blockId}")
    @Operation(summary = "Delete a block", 
               description = "Soft deletes a block (marks as archived)")
    public ResponseEntity<Void> deleteBlock(@PathVariable UUID blockId) {
        blockService.deleteBlock(blockId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{blockId}/move")
    @Operation(summary = "Move a block", 
               description = "Moves a block to a new position or under a new parent")
    public ResponseEntity<BlockDto> moveBlock(
            @PathVariable UUID blockId,
            @Valid @RequestBody MoveBlockRequest request) {
        return ResponseEntity.ok(blockService.moveBlock(blockId, request));
    }

    @GetMapping("/{blockId}/children")
    @Operation(summary = "Get child blocks", 
               description = "Retrieves all child blocks of a specific block")
    public ResponseEntity<List<BlockDto>> getChildBlocks(@PathVariable UUID blockId) {
        return ResponseEntity.ok(blockService.getChildrenBlocks(blockId));
    }
}
