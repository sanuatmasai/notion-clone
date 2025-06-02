package com.masai.notionclone.share.service;

import com.masai.notionclone.share.dto.SharedPageDto;
import com.masai.notionclone.share.dto.SharePageRequest;

import java.util.List;
import java.util.UUID;

public interface ShareService {
    SharedPageDto sharePage(UUID pageId, SharePageRequest request);
    List<SharedPageDto> getSharedPages();
    void revokeShare(UUID shareId);
    List<SharedPageDto> searchSharedContent(String query);
}
