package com.masai.notionclone.workspace.controller;

import com.masai.notionclone.workspace.dto.CreateWorkspaceRequest;
import com.masai.notionclone.workspace.dto.WorkspaceDto;
import com.masai.notionclone.workspace.service.WorkspaceService;
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
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
@Tag(name = "Workspace", description = "Workspace management APIs")
@SecurityRequirement(name = "bearerAuth")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @GetMapping
    @Operation(summary = "Get all workspaces for current user")
    public ResponseEntity<List<WorkspaceDto>> getAllWorkspaces() {
        return ResponseEntity.ok(workspaceService.getAllWorkspacesForCurrentUser());
    }

    @PostMapping
    @Operation(summary = "Create a new workspace")
    public ResponseEntity<WorkspaceDto> createWorkspace(@Valid @RequestBody CreateWorkspaceRequest request) {
        WorkspaceDto createdWorkspace = workspaceService.createWorkspace(request);
        return ResponseEntity
                .created(URI.create("/api/workspaces/" + createdWorkspace.getId()))
                .body(createdWorkspace);
    }

    @GetMapping("/{workspaceId}")
    @Operation(summary = "Get workspace by ID")
    public ResponseEntity<WorkspaceDto> getWorkspaceById(@PathVariable UUID workspaceId) {
        return ResponseEntity.ok(workspaceService.getWorkspaceById(workspaceId));
    }

    @PutMapping("/{workspaceId}")
    @Operation(summary = "Update workspace")
    public ResponseEntity<WorkspaceDto> updateWorkspace(
            @PathVariable UUID workspaceId,
            @Valid @RequestBody CreateWorkspaceRequest request) {
        return ResponseEntity.ok(workspaceService.updateWorkspace(workspaceId, request));
    }

    @DeleteMapping("/{workspaceId}")
    @Operation(summary = "Delete workspace")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable UUID workspaceId) {
        workspaceService.deleteWorkspace(workspaceId);
        return ResponseEntity.noContent().build();
    }
}
