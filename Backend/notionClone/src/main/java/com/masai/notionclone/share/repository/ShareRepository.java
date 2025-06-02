package com.masai.notionclone.share.repository;

import com.masai.notionclone.share.model.Share;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShareRepository extends JpaRepository<Share, UUID> {
    
    List<Share> findBySharedWithEmailAndIsActiveTrue(String email);
    
    List<Share> findByPageIdAndIsActiveTrue(UUID pageId);
    
    Optional<Share> findByPageIdAndSharedWithEmailAndIsActiveTrue(UUID pageId, String email);
    
    boolean existsByPageIdAndSharedWithEmailAndIsActiveTrue(UUID pageId, String email);
    
    @Modifying
    @Query("UPDATE Share s SET s.isActive = false WHERE s.id = :id")
    void deactivateShare(@Param("id") UUID id);
    
    @Query("SELECT s FROM Share s WHERE s.page.workspace.id = :workspaceId AND s.sharedWithEmail = :email AND s.isActive = true")
    List<Share> findActiveSharesByWorkspaceAndEmail(@Param("workspaceId") UUID workspaceId, 
                                                   @Param("email") String email);
}
