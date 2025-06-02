package com.masai.notionclone.workspace.controller;

import com.masai.notionclone.workspace.dto.AddMemberRequest;
import com.masai.notionclone.workspace.dto.WorkspaceMemberDto;
import com.masai.notionclone.workspace.service.WorkspaceMemberService;
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
@RequestMapping("/api/workspaces/{workspaceId}/members")
@RequiredArgsConstructor
@Tag(name = "Workspace Members", description = "Workspace member management APIs")
@SecurityRequirement(name = "bearerAuth")
public class WorkspaceMemberController {

    private final WorkspaceMemberService workspaceMemberService;

    @GetMapping
    @Operation(summary = "Get all members of a workspace")
    public ResponseEntity<List<WorkspaceMemberDto>> getWorkspaceMembers(
            @PathVariable UUID workspaceId) {
        return ResponseEntity.ok(workspaceMemberService.getWorkspaceMembers(workspaceId));
    }

    @PostMapping
    @Operation(summary = "Add a member to the workspace")
    public ResponseEntity<WorkspaceMemberDto> addWorkspaceMember(
            @PathVariable UUID workspaceId,
            @Valid @RequestBody AddMemberRequest request) {
        WorkspaceMemberDto member = workspaceMemberService.addWorkspaceMember(workspaceId, request);
        return ResponseEntity
                .created(URI.create(String.format("/api/workspaces/%s/members/%s", workspaceId, member.getUserId())))
                .body(member);
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Remove a member from the workspace")
    public ResponseEntity<Void> removeWorkspaceMember(
            @PathVariable UUID workspaceId,
            @PathVariable Long userId) {
        workspaceMemberService.removeWorkspaceMember(workspaceId, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}/role")
    @Operation(summary = "Update member role in the workspace")
    public ResponseEntity<WorkspaceMemberDto> updateMemberRole(
            @PathVariable UUID workspaceId,
            @PathVariable Long userId,
            @RequestParam String role) {
        return ResponseEntity.ok(workspaceMemberService.updateWorkspaceMemberRole(workspaceId, userId, role));
    }
}
