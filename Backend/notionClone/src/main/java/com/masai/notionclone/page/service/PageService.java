package com.masai.notionclone.page.service;

import com.masai.notionclone.page.dto.CreatePageRequest;
import com.masai.notionclone.page.dto.MovePageRequest;
import com.masai.notionclone.page.dto.PageDto;
import com.masai.notionclone.page.dto.UpdatePageRequest;

import java.util.List;
import java.util.UUID;

public interface PageService {
    
    List<PageDto> getWorkspacePages(UUID workspaceId, UUID parentId);
    
    PageDto getPageById(UUID pageId);
    
    PageDto createPage(CreatePageRequest request);
    
    PageDto updatePage(UUID pageId, UpdatePageRequest request);
    
    void deletePage(UUID pageId);
    
    PageDto movePage(UUID pageId, MovePageRequest request);
    
    PageDto toggleFavorite(UUID pageId);
    
    List<PageDto> getFavoritePages();
    
    List<PageDto> getUserPages(Long userId);
    
    
}
