package com.masai.notionclone.page.model;

import com.masai.notionclone.model.User;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Data
@Entity
@Table(name = "user_page_favorites")
@IdClass(UserPageFavorite.UserPageFavoriteId.class)
public class UserPageFavorite {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id", nullable = false)
    private Page page;

    @CreationTimestamp
    @Column(name = "favorited_at", nullable = false, updatable = false)
    private LocalDateTime favoritedAt;

    @Data
    public static class UserPageFavoriteId implements Serializable {
        private Long user;
        private UUID page;

        public UserPageFavoriteId() {}

        public UserPageFavoriteId(Long user, UUID page) {
            this.user = user;
            this.page = page;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            UserPageFavoriteId that = (UserPageFavoriteId) o;
            return Objects.equals(user, that.user) &&
                   Objects.equals(page, that.page);
        }

        @Override
        public int hashCode() {
            return Objects.hash(user, page);
        }
    }
}
