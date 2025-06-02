package com.masai.notionclone.workspace.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.masai.notionclone.exception.BadRequestException;
import com.masai.notionclone.exception.UnauthorizedException;
import com.masai.notionclone.model.User;
import com.masai.notionclone.repository.UserRepository;
import com.masai.notionclone.service.contextService;
import com.masai.notionclone.workspace.dto.AddMemberRequest;
import com.masai.notionclone.workspace.dto.WorkspaceMemberDto;
import com.masai.notionclone.workspace.model.Workspace;
import com.masai.notionclone.workspace.model.WorkspaceMember;
import com.masai.notionclone.workspace.repository.WorkspaceMemberRepository;
import com.masai.notionclone.workspace.repository.WorkspaceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkspaceMemberServiceImpl implements WorkspaceMemberService {

    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final contextService contextService;

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceMemberDto> getWorkspaceMembers(UUID workspaceId) {
        // Verify workspace exists and user has access
        verifyWorkspaceAccess(workspaceId);
        
        return workspaceMemberRepository.findByWorkspaceId(workspaceId).stream()
                .map(WorkspaceMember::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WorkspaceMemberDto addWorkspaceMember(UUID workspaceId, AddMemberRequest request) {
        User currentUser = contextService.getCurrentUser();
        Workspace workspace = getWorkspaceIfAdmin(workspaceId, currentUser);
        
        // Find user by email
        User userToAdd = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        // Check if user is already a member
        if (workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, userToAdd.getId())) {
            throw new IllegalArgumentException("User is already a member of this workspace");
        }
        
        // Create and save workspace member
        WorkspaceMember member = new WorkspaceMember();
        member.setWorkspace(workspace);
        member.setUser(userToAdd);
        member.setRole(request.getRole());
        
        WorkspaceMember savedMember = workspaceMemberRepository.save(member);
        return savedMember.toDto();
    }

    @Override
    @Transactional
    public void removeWorkspaceMember(UUID workspaceId, Long userId) {
        User currentUser = contextService.getCurrentUser();
        
        // Only workspace admin can remove members
        if (!isWorkspaceAdmin(workspaceId, currentUser.getId())) {
            throw new UnauthorizedException("Only workspace admin can remove members");
        }
        
        // Prevent removing yourself if you're the only admin
        if (userId.equals(currentUser.getId())) {
            long adminCount = workspaceMemberRepository.countByWorkspaceIdAndRole(workspaceId, "ADMIN");
            if (adminCount <= 1) {
                throw new IllegalStateException("Cannot remove the only admin of the workspace");
            }
        }
        
        workspaceMemberRepository.deleteByWorkspaceIdAndUserId(workspaceId, userId);
    }

    @Override
    @Transactional
    public WorkspaceMemberDto updateWorkspaceMemberRole(UUID workspaceId, Long userId, String role) {
        User currentUser = contextService.getCurrentUser();
        
        // Only workspace admin can update roles
        if (!isWorkspaceAdmin(workspaceId, currentUser.getId())) {
            throw new UnauthorizedException("Only workspace admin can update member roles");
        }
        
        // Prevent changing your own role if you're the only admin
        if (userId.equals(currentUser.getId()) && !"ADMIN".equals(role)) {
            long adminCount = workspaceMemberRepository.countByWorkspaceIdAndRole(workspaceId, "ADMIN");
            if (adminCount <= 1) {
                throw new IllegalStateException("Cannot remove admin role from the only admin");
            }
        }
        
        WorkspaceMember member = workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> new BadRequestException("Workspace member not found"));
        
        member.setRole(role);
        WorkspaceMember updatedMember = workspaceMemberRepository.save(member);
        return updatedMember.toDto();
    }
    
    private Workspace getWorkspaceIfAdmin(UUID workspaceId, User user) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new BadRequestException("Workspace not found"));
        
        WorkspaceMember member = workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, user.getId())
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this workspace"));
        
        if (!"ADMIN".equals(member.getRole()) && !workspace.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only workspace admin can perform this action");
        }
        
        return workspace;
    }
    
    private boolean isWorkspaceAdmin(UUID workspaceId, Long userId) {
        return workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .map(member -> "ADMIN".equals(member.getRole()))
                .orElse(false);
    }
    
    private void verifyWorkspaceAccess(UUID workspaceId) {
        User currentUser = contextService.getCurrentUser();
        if (!workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, currentUser.getId())) {
            throw new UnauthorizedException("You don't have access to this workspace");
        }
    }
}
