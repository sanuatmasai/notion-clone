package com.masai.notionclone.page.controller;

import com.masai.notionclone.page.dto.CreatePageRequest;
import com.masai.notionclone.page.dto.MovePageRequest;
import com.masai.notionclone.page.dto.PageDto;
import com.masai.notionclone.page.dto.UpdatePageRequest;
import com.masai.notionclone.page.service.PageService;
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
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Pages", description = "Page management APIs")
@SecurityRequirement(name = "bearerAuth")
public class PageController {

    private final PageService pageService;

    @GetMapping("/workspaces/{workspaceId}/pages")
    @Operation(summary = "Get all pages in a workspace")
    public ResponseEntity<List<PageDto>> getWorkspacePages(
            @PathVariable UUID workspaceId,
            @RequestParam(required = false) UUID parentId) {
        return ResponseEntity.ok(pageService.getWorkspacePages(workspaceId, parentId));
    }

    @GetMapping("/pages/{pageId}")
    @Operation(summary = "Get page details by ID")
    public ResponseEntity<PageDto> getPageById(@PathVariable UUID pageId) {
        return ResponseEntity.ok(pageService.getPageById(pageId));
    }

    @PostMapping("/workspaces/{workspaceId}/pages")
    @Operation(summary = "Create a new page")
    public ResponseEntity<PageDto> createPage(
            @PathVariable UUID workspaceId,
            @Valid @RequestBody CreatePageRequest request) {
        request.setWorkspaceId(workspaceId);
        PageDto createdPage = pageService.createPage(request);
        return ResponseEntity
                .created(URI.create("/api/pages/" + createdPage.getId()))
                .body(createdPage);
    }

    @PutMapping("/pages/{pageId}")
    @Operation(summary = "Update a page")
    public ResponseEntity<PageDto> updatePage(
            @PathVariable UUID pageId,
            @Valid @RequestBody UpdatePageRequest request) {
        return ResponseEntity.ok(pageService.updatePage(pageId, request));
    }

    @DeleteMapping("/pages/{pageId}")
    @Operation(summary = "Delete a page (soft delete)")
    public ResponseEntity<Void> deletePage(@PathVariable UUID pageId) {
        pageService.deletePage(pageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/pages/{pageId}/move")
    @Operation(summary = "Move a page to a new position or parent")
    public ResponseEntity<PageDto> movePage(
            @PathVariable UUID pageId,
            @Valid @RequestBody MovePageRequest request) {
        return ResponseEntity.ok(pageService.movePage(pageId, request));
    }

    @PostMapping("/pages/{pageId}/favorite")
    @Operation(summary = "Toggle favorite status for a page")
    public ResponseEntity<PageDto> toggleFavorite(@PathVariable UUID pageId) {
        return ResponseEntity.ok(pageService.toggleFavorite(pageId));
    }

    @GetMapping("/favorites")
    @Operation(summary = "Get all favorite pages for current user")
    public ResponseEntity<List<PageDto>> getFavoritePages() {
        return ResponseEntity.ok(pageService.getFavoritePages());
    }
}
