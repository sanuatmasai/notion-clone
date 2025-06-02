package com.masai.notionclone.block.repository;

import com.masai.notionclone.block.model.Block;
import com.masai.notionclone.page.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlockRepository extends JpaRepository<Block, UUID> {
    
    List<Block> findByPageIdAndArchivedFalseOrderByPosition(UUID pageId);
    
    List<Block> findByParentIdAndArchivedFalseOrderByPosition(UUID parentId);
    
    Optional<Block> findByIdAndArchivedFalse(UUID id);
    
    @Query("SELECT MAX(b.position) FROM Block b WHERE b.page.id = :pageId AND b.parent IS NULL")
    Integer findMaxPositionByPageId(@Param("pageId") UUID pageId);
    
    @Query("SELECT MAX(b.position) FROM Block b WHERE b.parent.id = :parentId")
    Integer findMaxPositionByParentId(@Param("parentId") UUID parentId);
    
    @Modifying
    @Query("UPDATE Block b SET b.position = b.position + 1 " +
           "WHERE b.page.id = :pageId AND b.position >= :position AND b.parent IS NULL")
    void incrementPositionsFrom(@Param("pageId") UUID pageId, @Param("position") int position);
    
    @Modifying
    @Query("UPDATE Block b SET b.position = b.position + 1 " +
           "WHERE b.parent.id = :parentId AND b.position >= :position")
    void incrementChildPositionsFrom(@Param("parentId") UUID parentId, @Param("position") int position);
    
    @Modifying
    @Query("UPDATE Block b SET b.archived = true WHERE b.id = :blockId")
    void softDelete(@Param("blockId") UUID blockId);
    
    @Query("SELECT COUNT(b) > 0 FROM Block b WHERE b.page.workspace.id = :workspaceId AND b.id = :blockId")
    boolean existsByIdAndWorkspaceId(@Param("blockId") UUID blockId, @Param("workspaceId") UUID workspaceId);
}
