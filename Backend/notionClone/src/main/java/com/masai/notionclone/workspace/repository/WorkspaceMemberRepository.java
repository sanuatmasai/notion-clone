package com.masai.notionclone.workspace.repository;

import com.masai.notionclone.workspace.model.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, UUID> {
    List<WorkspaceMember> findByWorkspaceId(UUID workspaceId);
    Optional<WorkspaceMember> findByWorkspaceIdAndUserId(UUID workspaceId, Long userId);
    boolean existsByWorkspaceIdAndUserId(UUID workspaceId, Long userId);
    void deleteByWorkspaceIdAndUserId(UUID workspaceId, Long userId);
    
    @Query("SELECT COUNT(wm) FROM WorkspaceMember wm WHERE wm.workspace.id = :workspaceId AND wm.role = :role")
    long countByWorkspaceIdAndRole(@Param("workspaceId") UUID workspaceId, @Param("role") String role);
}
