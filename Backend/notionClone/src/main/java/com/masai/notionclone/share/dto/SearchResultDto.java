package com.masai.notionclone.share.dto;

import com.masai.notionclone.page.dto.PageDto;
import com.masai.notionclone.workspace.dto.WorkspaceDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDto {
    private List<PageDto> pages;
    private List<WorkspaceDto> workspaces;
    // Can be extended with more result types in the future
}
