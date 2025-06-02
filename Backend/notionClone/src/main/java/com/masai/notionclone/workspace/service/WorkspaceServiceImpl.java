package com.masai.notionclone.workspace.service;

import com.masai.notionclone.service.contextService;
import com.masai.notionclone.exception.BadRequestException;
import com.masai.notionclone.exception.UnauthorizedException;
import com.masai.notionclone.model.User;
import com.masai.notionclone.workspace.dto.CreateWorkspaceRequest;
import com.masai.notionclone.workspace.dto.WorkspaceDto;
import com.masai.notionclone.workspace.model.Workspace;
import com.masai.notionclone.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final contextService contextService;

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceDto> getAllWorkspacesForCurrentUser() {
        User currentUser = contextService.getCurrentUser();
        return workspaceRepository.findByOwnerId(currentUser.getId()).stream()
                .map(Workspace::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WorkspaceDto createWorkspace(CreateWorkspaceRequest request) {
        User currentUser = contextService.getCurrentUser();
        
        Workspace workspace = new Workspace();
        workspace.setName(request.getName());
        workspace.setDescription(request.getDescription());
        workspace.setPersonal(request.isPersonal());
        workspace.setOwner(currentUser);
        
        Workspace savedWorkspace = workspaceRepository.save(workspace);
        return savedWorkspace.toDto();
    }

    @Override
    @Transactional(readOnly = true)
    public WorkspaceDto getWorkspaceById(UUID workspaceId) {
        User currentUser = contextService.getCurrentUser();
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new BadRequestException("Workspace not found"));
        
        // Check if user has access to this workspace
        if (!workspace.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to access this workspace");
        }
        
        return workspace.toDto();
    }

    @Override
    @Transactional
    public WorkspaceDto updateWorkspace(UUID workspaceId, CreateWorkspaceRequest request) {
        User currentUser = contextService.getCurrentUser();
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new BadRequestException("Workspace not found"));
        
        // Check if user is the owner
        if (!workspace.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only workspace owner can update the workspace");
        }
        
        workspace.setName(request.getName());
        workspace.setDescription(request.getDescription());
        workspace.setPersonal(request.isPersonal());
        
        Workspace updatedWorkspace = workspaceRepository.save(workspace);
        return updatedWorkspace.toDto();
    }

    @Override
    @Transactional
    public void deleteWorkspace(UUID workspaceId) {
        User currentUser = contextService.getCurrentUser();
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new BadRequestException("Workspace not found"));
        
        // Check if user is the owner
        if (!workspace.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only workspace owner can delete the workspace");
        }
        
        workspaceRepository.delete(workspace);
    }
}
