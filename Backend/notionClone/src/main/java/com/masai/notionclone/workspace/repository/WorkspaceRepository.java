package com.masai.notionclone.workspace.repository;

import com.masai.notionclone.workspace.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
    List<Workspace> findByOwnerId(Long ownerId);
    boolean existsByIdAndOwnerId(UUID id, Long ownerId);
}
