package com.masai.notionclone.dto;

import lombok.Data;

@Data
public class QueryRequest {
    private String question;
//    private String sourceId; // Optional: filter by document
}
