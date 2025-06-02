package com.masai.notionclone.workspace.service;

import com.masai.notionclone.workspace.dto.AddMemberRequest;
import com.masai.notionclone.workspace.dto.WorkspaceMemberDto;

import java.util.List;
import java.util.UUID;

public interface WorkspaceMemberService {
    List<WorkspaceMemberDto> getWorkspaceMembers(UUID workspaceId);
    WorkspaceMemberDto addWorkspaceMember(UUID workspaceId, AddMemberRequest request);
    void removeWorkspaceMember(UUID workspaceId, Long userId);
    WorkspaceMemberDto updateWorkspaceMemberRole(UUID workspaceId, Long userId, String role);
}
