package com.masai.notionclone.workspace.service;

import com.masai.notionclone.workspace.dto.CreateWorkspaceRequest;
import com.masai.notionclone.workspace.dto.WorkspaceDto;

import java.util.List;
import java.util.UUID;

public interface WorkspaceService {
    List<WorkspaceDto> getAllWorkspacesForCurrentUser();
    WorkspaceDto createWorkspace(CreateWorkspaceRequest request);
    WorkspaceDto getWorkspaceById(UUID workspaceId);
    WorkspaceDto updateWorkspace(UUID workspaceId, CreateWorkspaceRequest request);
    void deleteWorkspace(UUID workspaceId);
}
