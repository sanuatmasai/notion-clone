package com.masai.notionclone.page.repository;

import com.masai.notionclone.page.model.Page;
import com.masai.notionclone.workspace.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PageRepository extends JpaRepository<Page, UUID> {
	List<Page> findAllByCreatedById(Long userId);
    
    List<Page> findByWorkspaceIdAndParentIdAndArchivedFalseOrderByPositionAsc(UUID workspaceId, UUID parentId);
    
    List<Page> findByWorkspaceIdAndArchivedFalseOrderByPositionAsc(UUID workspaceId);
    
    Optional<Page> findByIdAndArchivedFalse(UUID id);
    
    boolean existsByWorkspaceAndId(Workspace workspace, UUID id);
    
    @Query("SELECT MAX(p.position) FROM Page p WHERE p.workspace.id = :workspaceId AND p.parent.id = :parentId")
    Integer findMaxPositionByWorkspaceAndParent(@Param("workspaceId") UUID workspaceId, 
                                               @Param("parentId") UUID parentId);
    
    @Modifying
    @Query("UPDATE Page p SET p.position = p.position + 1 " +
           "WHERE p.workspace.id = :workspaceId AND p.parent.id = :parentId AND p.position >= :position")
    void incrementPositionsAfter(@Param("workspaceId") UUID workspaceId,
                                @Param("parentId") UUID parentId,
                                @Param("position") int position);
    
    @Query("SELECT p FROM Page p JOIN UserPageFavorite upf ON p.id = upf.page.id " +
           "WHERE upf.user.id = :userId AND p.archived = false ORDER BY upf.favoritedAt DESC")
    List<Page> findFavoritesByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT COUNT(p) > 0 FROM Page p WHERE p.workspace.id = :workspaceId " +
           "AND p.parent.id = :parentId AND p.position = :position")
    boolean existsByWorkspaceAndParentAndPosition(@Param("workspaceId") UUID workspaceId,
                                                 @Param("parentId") UUID parentId,
                                                 @Param("position") int position);
                                                 
    @Query("SELECT p.workspace.id FROM Page p WHERE p.id = :pageId")
    UUID findWorkspaceIdByPageId(@Param("pageId") UUID pageId);
}
