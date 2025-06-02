package com.masai.notionclone.page.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.masai.notionclone.model.User;
import com.masai.notionclone.page.model.Page;
import com.masai.notionclone.page.model.UserPageFavorite;

@Repository
public interface UserPageFavoriteRepository extends JpaRepository<UserPageFavorite, UserPageFavorite.UserPageFavoriteId> {
    
    boolean existsByUserAndPage(User user, Page page);
    
    @Query("SELECT CASE WHEN COUNT(upf) > 0 THEN true ELSE false END " +
           "FROM UserPageFavorite upf WHERE upf.user.id = :userId AND upf.page.id = :pageId")
    boolean isPageFavoritedByUser(@Param("userId") Long userId, @Param("pageId") UUID pageId);
    
    @Modifying
    @Query("DELETE FROM UserPageFavorite upf WHERE upf.user.id = :userId AND upf.page.id = :pageId")
    void deleteByUserAndPage(@Param("userId") Long userId, @Param("pageId") UUID pageId);
    
    @Modifying
    @Query("SELECT upf.page FROM UserPageFavorite upf WHERE upf.user.id = :userId")
    List<Page> findFavoritePagesByUserId(@Param("userId") Long userId);
    
    @Query("SELECT upf FROM UserPageFavorite upf WHERE upf.user.id = :userId")
    List<UserPageFavorite> findFavoritesByUserId(@Param("userId") Long userId);
    
    @Modifying
    @Query("DELETE FROM UserPageFavorite upf WHERE upf.page.id = :pageId")
    void deleteAllByPageId(@Param("pageId") UUID pageId);
    
    default void toggleFavorite(User user, Page page) {
        if (existsByUserAndPage(user, page)) {
            deleteByUserAndPage(user.getId(), page.getId());
        } else {
            UserPageFavorite favorite = new UserPageFavorite();
            favorite.setUser(user);
            favorite.setPage(page);
            save(favorite);
        }
    }
}
