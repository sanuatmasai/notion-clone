package com.masai.notionclone.share.service;

import com.masai.notionclone.exception.BadRequestException;
import com.masai.notionclone.exception.UnauthorizedException;
import com.masai.notionclone.model.User;
import com.masai.notionclone.page.model.Page;
import com.masai.notionclone.page.repository.PageRepository;
import com.masai.notionclone.service.contextService;
import com.masai.notionclone.share.dto.SharedPageDto;
import com.masai.notionclone.share.dto.SharePageRequest;
import com.masai.notionclone.share.model.Share;
import com.masai.notionclone.share.repository.ShareRepository;
import com.masai.notionclone.workspace.repository.WorkspaceMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShareServiceImpl implements ShareService {

    private final ShareRepository shareRepository;
    private final PageRepository pageRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final contextService contextService;

    @Override
    @Transactional
    public SharedPageDto sharePage(UUID pageId, SharePageRequest request) {
        User currentUser = contextService.getCurrentUser();
        Page page = getPageIfAccessible(pageId, currentUser);
        
        // Check if already shared with this email
        if (shareRepository.existsByPageIdAndSharedWithEmailAndIsActiveTrue(pageId, request.getEmail())) {
            throw new BadRequestException("Page is already shared with this user");
        }
        
        // Create share record
        Share share = new Share();
        share.setPage(page);
        share.setSharedWithEmail(request.getEmail());
        share.setPermission(request.getPermission().toUpperCase());
        share.setSharedBy(currentUser);
        share.setActive(true);
        
        Share savedShare = shareRepository.save(share);
        return savedShare.toDto();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SharedPageDto> getSharedPages() {
        User currentUser = contextService.getCurrentUser();
        List<Share> shares = shareRepository.findBySharedWithEmailAndIsActiveTrue(currentUser.getEmail());
        
        return shares.stream()
                .map(Share::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void revokeShare(UUID shareId) {
        User currentUser = contextService.getCurrentUser();
        Share share = shareRepository.findById(shareId)
                .orElseThrow(() -> new BadRequestException("Share not found"));
        
        // Only the owner or the person who shared can revoke
        if (!share.getPage().getCreatedBy().equals(currentUser.getId()) && 
            !share.getSharedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to revoke this share");
        }
        
        shareRepository.deactivateShare(shareId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SharedPageDto> searchSharedContent(String query) {
        User currentUser = contextService.getCurrentUser();
        
        // Search in pages shared with the current user
        List<Share> shares = shareRepository.findBySharedWithEmailAndIsActiveTrue(currentUser.getEmail());
        
        return shares.stream()
                .filter(share -> containsQuery(share, query))
                .map(Share::toDto)
                .collect(Collectors.toList());
    }
    
    private boolean containsQuery(Share share, String query) {
        if (query == null || query.trim().isEmpty()) {
            return true;
        }
        String lowerQuery = query.toLowerCase();
        return share.getPage().getTitle().toLowerCase().contains(lowerQuery) ||
               (share.getPage().getContent() != null && 
                share.getPage().getContent().toLowerCase().contains(lowerQuery));
    }
    
    private Page getPageIfAccessible(UUID pageId, User user) {
        Page page = pageRepository.findByIdAndArchivedFalse(pageId)
                .orElseThrow(() -> new BadRequestException("Page not found"));
        
        // Check if user has access to the page's workspace
        if (!workspaceMemberRepository.existsByWorkspaceIdAndUserId(
                page.getWorkspace().getId(), user.getId())) {
            throw new UnauthorizedException("You don't have access to this page");
        }
        
        return page;
    }
}
