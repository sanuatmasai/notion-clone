package com.masai.notionclone.block.service;

import com.masai.notionclone.block.dto.BlockDto;
import com.masai.notionclone.block.dto.CreateBlockRequest;
import com.masai.notionclone.block.dto.MoveBlockRequest;
import com.masai.notionclone.block.dto.UpdateBlockRequest;
import com.masai.notionclone.block.model.Block;
import com.masai.notionclone.block.repository.BlockRepository;
import com.masai.notionclone.exception.BadRequestException;
import com.masai.notionclone.exception.UnauthorizedException;
import com.masai.notionclone.model.User;
import com.masai.notionclone.page.model.Page;
import com.masai.notionclone.page.repository.PageRepository;
import com.masai.notionclone.service.contextService;
import com.masai.notionclone.workspace.repository.WorkspaceMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlockServiceImpl implements BlockService {

    private final BlockRepository blockRepository;
    private final PageRepository pageRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final contextService contextService;

    @Override
    @Transactional(readOnly = true)
    public List<BlockDto> getBlocksByPage(UUID pageId) {
        User currentUser = contextService.getCurrentUser();
        verifyPageAccess(pageId, currentUser);
        
        return blockRepository.findByPageIdAndArchivedFalseOrderByPosition(pageId).stream()
                .map(Block::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BlockDto getBlock(UUID blockId) {
        User currentUser = contextService.getCurrentUser();
        Block block = getBlockIfAccessible(blockId, currentUser);
        return block.toDto();
    }

    @Override
    @Transactional
    public BlockDto createBlock(CreateBlockRequest request) {
        User currentUser = contextService.getCurrentUser();
        Page page = getPageIfAccessible(request.getPageId(), currentUser);
        
        Block block = new Block();
        block.setType(request.getType());
        block.setContent(request.getContent());
        block.setPage(page);
        block.setCreatedBy(currentUser.getId());
        
        // Handle parent block if specified
        if (request.getParentId() != null) {
            Block parent = blockRepository.findByIdAndArchivedFalse(request.getParentId())
                    .orElseThrow(() -> new BadRequestException("Parent block not found"));
            block.setParent(parent);
            
            // Set position for child block
            Integer maxPosition = blockRepository.findMaxPositionByParentId(request.getParentId());
            block.setPosition(maxPosition != null ? maxPosition + 1 : 0);
        } else {
            // Set position for root block
            Integer maxPosition = blockRepository.findMaxPositionByPageId(page.getId());
            block.setPosition(maxPosition != null ? maxPosition + 1 : 0);
            
            // Increment positions of blocks after the new position if needed
            if (request.getPosition() >= 0) {
                block.setPosition(request.getPosition());
                blockRepository.incrementPositionsFrom(page.getId(), request.getPosition());
            }
        }
        
        Block savedBlock = blockRepository.save(block);
        return savedBlock.toDto();
    }

    @Override
    @Transactional
    public BlockDto updateBlock(UUID blockId, UpdateBlockRequest request) {
        User currentUser = contextService.getCurrentUser();
        Block block = getBlockIfAccessible(blockId, currentUser);
        
        if (request.getContent() != null) {
            block.setContent(request.getContent());
        }
        
        if (request.getType() != null) {
            block.setType(request.getType());
        }
        
        if (request.getArchived() != null) {
            block.setArchived(request.getArchived());
        }
        
        block.setUpdatedBy(currentUser.getId());
        Block updatedBlock = blockRepository.save(block);
        return updatedBlock.toDto();
    }

    @Override
    @Transactional
    public void deleteBlock(UUID blockId) {
        User currentUser = contextService.getCurrentUser();
        Block block = getBlockIfAccessible(blockId, currentUser);
        
        // Soft delete the block
        blockRepository.softDelete(blockId);
        
        // Optionally, you might want to recursively delete child blocks
        // deleteChildBlocks(blockId);
    }


    @Override
    @Transactional
    public BlockDto moveBlock(UUID blockId, MoveBlockRequest request) {
        User currentUser = contextService.getCurrentUser();
        Block block = getBlockIfAccessible(blockId, currentUser);
        
        // Handle parent change if needed
        if (request.getNewParentId() != null) {
            if (!request.getNewParentId().equals(block.getParent() != null ? block.getParent().getId() : null)) {
                Block newParent = blockRepository.findByIdAndArchivedFalse(request.getNewParentId())
                        .orElseThrow(() -> new BadRequestException("New parent block not found"));
                block.setParent(newParent);
            }
        } else if (block.getParent() != null) {
            // If newParentId is null but block has a parent, make it a root block
            block.setParent(null);
        }
        
        // Handle position change
        block.setPosition(request.getNewPosition());
        
        // Save the block with new position and parent
        Block updatedBlock = blockRepository.save(block);
        return updatedBlock.toDto();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlockDto> getChildrenBlocks(UUID parentId) {
        User currentUser = contextService.getCurrentUser();
        Block parent = getBlockIfAccessible(parentId, currentUser);
        
        return blockRepository.findByParentIdAndArchivedFalseOrderByPosition(parentId).stream()
                .map(Block::toDto)
                .collect(Collectors.toList());
    }
    
    private Block getBlockIfAccessible(UUID blockId, User user) {
        Block block = blockRepository.findByIdAndArchivedFalse(blockId)
                .orElseThrow(() -> new BadRequestException("Block not found"));
        
        verifyPageAccess(block.getPage().getId(), user);
        return block;
    }
    
    private Page getPageIfAccessible(UUID pageId, User user) {
        Page page = pageRepository.findByIdAndArchivedFalse(pageId)
                .orElseThrow(() -> new BadRequestException("Page not found"));
        
        verifyPageAccess(pageId, user);
        return page;
    }
    
    private void verifyPageAccess(UUID pageId, User user) {
        UUID workspaceId = pageRepository.findWorkspaceIdByPageId(pageId);
        if (workspaceId == null || !workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, user.getId())) {
            throw new UnauthorizedException("You don't have access to this page");
        }
    }
    
    private void verifyPageAccess(Page page, User user) {
        if (page == null || !workspaceMemberRepository.existsByWorkspaceIdAndUserId(
                page.getWorkspace().getId(), user.getId())) {
            throw new UnauthorizedException("You don't have access to this page");
        }
    }
}
