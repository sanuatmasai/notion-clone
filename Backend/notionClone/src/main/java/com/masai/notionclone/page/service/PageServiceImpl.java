package com.masai.notionclone.page.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.masai.notionclone.exception.BadRequestException;
import com.masai.notionclone.model.User;
import com.masai.notionclone.page.dto.CreatePageRequest;
import com.masai.notionclone.page.dto.MovePageRequest;
import com.masai.notionclone.page.dto.PageDto;
import com.masai.notionclone.page.dto.UpdatePageRequest;
import com.masai.notionclone.page.model.Page;
import com.masai.notionclone.page.repository.PageRepository;
import com.masai.notionclone.page.repository.UserPageFavoriteRepository;
import com.masai.notionclone.service.contextService;
import com.masai.notionclone.workspace.model.Workspace;
import com.masai.notionclone.workspace.repository.WorkspaceMemberRepository;
import com.masai.notionclone.workspace.repository.WorkspaceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PageServiceImpl implements PageService {

    private final PageRepository pageRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final UserPageFavoriteRepository userPageFavoriteRepository;
    private final contextService contextService;

    @Override
    @Transactional(readOnly = true)
    public List<PageDto> getWorkspacePages(UUID workspaceId, UUID parentId) {
        User currentUser = contextService.getCurrentUser();
        verifyWorkspaceAccess(workspaceId, currentUser);

        List<Page> pages = parentId == null 
            ? pageRepository.findByWorkspaceIdAndArchivedFalseOrderByPositionAsc(workspaceId)
            : pageRepository.findByWorkspaceIdAndParentIdAndArchivedFalseOrderByPositionAsc(workspaceId, parentId);

        return pages.stream()
                .map(page -> {
                    PageDto dto = page.toDto();
                    dto.setFavorite(userPageFavoriteRepository.isPageFavoritedByUser(currentUser.getId(), page.getId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageDto getPageById(UUID pageId) {
        User currentUser = contextService.getCurrentUser();
        Page page = pageRepository.findByIdAndArchivedFalse(pageId)
                .orElseThrow(() -> new BadRequestException("Page not found"));

        verifyWorkspaceAccess(page.getWorkspace().getId(), currentUser);
        
        PageDto dto = page.toDto();
        dto.setFavorite(userPageFavoriteRepository.isPageFavoritedByUser(currentUser.getId(), pageId));
        return dto;
    }

    @Override
    @Transactional
    public PageDto createPage(CreatePageRequest request) {
        User currentUser = contextService.getCurrentUser();
        Workspace workspace = getWorkspaceIfMember(request.getWorkspaceId(), currentUser);
        
        Page page = new Page();
        page.setTitle(request.getTitle());
        page.setIcon(request.getIcon());
//        page.setCoverImage(request.getCoverImage());
        page.setContent(request.getContent());
        page.setWorkspace(workspace);
        page.setCreatedBy(currentUser);
        page.setUpdatedBy(currentUser);
        
        Page savedPage = pageRepository.save(page);
        PageDto dto = savedPage.toDto();
        dto.setFavorite(false); // New page can't be favorited yet
        return dto;
    }

    @Override
    @Transactional
    public PageDto updatePage(UUID pageId, UpdatePageRequest request) {
        User currentUser = contextService.getCurrentUser();
        Page page = getPageIfHasAccess(pageId, currentUser);

        // Update fields if they are not null
        if (request.getTitle() != null) {
            page.setTitle(request.getTitle());
        }
        if (request.getIcon() != null) {
            page.setIcon(request.getIcon());
        }
        if (request.getCoverImage() != null) {
            page.setCoverImage(request.getCoverImage());
        }
        if (request.getContent() != null) {
            page.setContent(request.getContent());
        }
        
        page.setUpdatedBy(currentUser);
        
        Page updatedPage = pageRepository.save(page);
        PageDto dto = updatedPage.toDto();
        dto.setFavorite(userPageFavoriteRepository.isPageFavoritedByUser(currentUser.getId(), pageId));
        return dto;
    }

    @Override
    @Transactional
    public void deletePage(UUID pageId) {
        User currentUser = contextService.getCurrentUser();
        Page page = getPageIfHasAccess(pageId, currentUser);
        
        // Soft delete by marking as archived
        page.setArchived(true);
        page.setUpdatedBy(currentUser);
        pageRepository.save(page);
        
        // Remove from favorites
        userPageFavoriteRepository.deleteAllByPageId(pageId);
    }

    @Override
    @Transactional
    public PageDto movePage(UUID pageId, MovePageRequest request) {
        User currentUser = contextService.getCurrentUser();
        Page page = getPageIfHasAccess(pageId, currentUser);
        
        // If parent is changing, verify access to new parent
        if (request.getNewParentId() != null) {
            if (!request.getNewParentId().equals(page.getParent() != null ? page.getParent().getId() : null)) {
                Page newParent = pageRepository.findByIdAndArchivedFalse(request.getNewParentId())
                        .orElseThrow(() -> new BadRequestException("New parent page not found"));
                verifyWorkspaceAccess(newParent.getWorkspace().getId(), currentUser);
                page.setParent(newParent);
            }
        } else if (page.getParent() != null) {
            // Moving to root
            page.setParent(null);
        }
        
        // Handle position changes
        int newPosition = request.getNewPosition();
        if (newPosition != page.getPosition()) {
            // Shift positions of other pages
            pageRepository.incrementPositionsAfter(
                    page.getWorkspace().getId(),
                    request.getNewParentId(),
                    newPosition);
            
            // Set new position
            page.setPosition(newPosition);
        }
        
        page.setUpdatedBy(currentUser);
        Page updatedPage = pageRepository.save(page);
        
        PageDto dto = updatedPage.toDto();
        dto.setFavorite(userPageFavoriteRepository.isPageFavoritedByUser(currentUser.getId(), pageId));
        return dto;
    }

    @Override
    public PageDto toggleFavorite(UUID pageId) {
        User currentUser = contextService.getCurrentUser();
        Page page = getPageIfHasAccess(pageId, currentUser);
        
        page.setFavorite(!page.getFavorite());
        Page p = pageRepository.save(page);
        PageDto pd = new PageDto();
        pd.setId(p.getId());
        pd.setTitle(p.getTitle());
        pd.setIcon(p.getIcon());
        pd.setFavorite(p.getFavorite());
        return pd;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PageDto> getFavoritePages() {
        User currentUser = contextService.getCurrentUser();
        return userPageFavoriteRepository.findFavoritesByUserId(currentUser.getId()).stream()
                .map(favorite -> {
                    PageDto dto = favorite.getPage().toDto();
                    dto.setFavorite(true);
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    // Helper methods
    private Page getPageIfHasAccess(UUID pageId, User user) {
        Page page = pageRepository.findByIdAndArchivedFalse(pageId)
                .orElseThrow(() -> new BadRequestException("Page not found"));
        
        verifyWorkspaceAccess(page.getWorkspace().getId(), user);
        return page;
    }
    
    private Workspace getWorkspaceIfMember(UUID workspaceId, User user) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new BadRequestException("Workspace not found"));
        
       
        verifyWorkspaceAccess(workspaceId, user);
        return workspace;
    }
    
    private void verifyWorkspaceAccess(UUID workspaceId, User user) {
        if (!workspaceRepository.existsByIdAndOwnerId(workspaceId, user.getId())) {
            throw new BadRequestException("You don't have access to this workspace");
        }
    }

	@Override
	public List<PageDto> getUserPages(Long userId) {
		List<Page> pages = pageRepository.findAllByCreatedById(userId);
		
        
		 return pages.stream()
	                .map(page -> {
	                    PageDto dto = page.toDto();
	                    return dto;
	                })
	                .collect(Collectors.toList());
	}
}
