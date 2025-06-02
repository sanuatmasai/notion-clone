package com.masai.notionclone.share.controller;

import com.masai.notionclone.share.dto.SharedPageDto;
import com.masai.notionclone.share.dto.SharePageRequest;
import com.masai.notionclone.share.service.ShareService;
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
@Tag(name = "Sharing & Search", description = "APIs for sharing pages and searching content")
@SecurityRequirement(name = "bearerAuth")
public class ShareController {

    private final ShareService shareService;

    @PostMapping("/pages/{pageId}/share")
    @Operation(summary = "Share a page", 
               description = "Share a page with another user by email")
    public ResponseEntity<SharedPageDto> sharePage(
            @PathVariable UUID pageId,
            @Valid @RequestBody SharePageRequest request) {
        SharedPageDto sharedPage = shareService.sharePage(pageId, request);
        return ResponseEntity
                .created(URI.create("/api/shared/" + sharedPage.getId()))
                .body(sharedPage);
    }

    @GetMapping("/shared")
    @Operation(summary = "Get shared pages", 
               description = "Get all pages shared with the current user")
    public ResponseEntity<List<SharedPageDto>> getSharedPages() {
        return ResponseEntity.ok(shareService.getSharedPages());
    }

    @DeleteMapping("/shared/{shareId}")
    @Operation(summary = "Revoke sharing", 
               description = "Revoke access to a shared page")
    public ResponseEntity<Void> revokeShare(@PathVariable UUID shareId) {
        shareService.revokeShare(shareId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search content", 
               description = "Search across shared pages and workspaces")
    public ResponseEntity<List<SharedPageDto>> searchContent(
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(shareService.searchSharedContent(q));
    }
}
