# Notion Clone API Implementation Plan

## Phase 1: Project Setup & Base Structure
- [x] Create base package structure for new features
- [x] Set up common DTOs and response objects
- [x] Configure Swagger documentation for new APIs

## Phase 2: Workspace Management (7 APIs)
- [x] GET /api/workspaces - Get all workspaces for current user
- [x] POST /api/workspaces - Create a new workspace
- [x] GET /api/workspaces/{workspaceId} - Get workspace details by ID
- [x] PUT /api/workspaces/{workspaceId} - Update workspace
- [x] DELETE /api/workspaces/{workspaceId} - Delete workspace
- [x] GET /api/workspaces/{workspaceId}/members - Get workspace members
- [x] POST /api/workspaces/{workspaceId}/members - Add member to workspace
- [x] DELETE /api/workspaces/{workspaceId}/members/{userId} - Remove member from workspace
- [x] PUT /api/workspaces/{workspaceId}/members/{userId}/role - Update member role

## Phase 3: Page Management (8 APIs) - COMPLETED ✅
- [x] GET /api/workspaces/{workspaceId}/pages - Get all pages in workspace
  - Query params: parentId (optional), archived (default: false)
  - Response: List of PageDto with basic info (id, title, icon, lastModified, etc.)
  
- [x] POST /api/workspaces/{workspaceId}/pages - Create a new page
  - Request: CreatePageRequest (title, parentId, workspaceId, content)
  - Response: Created PageDto with full details
  
- [x] GET /api/pages/{pageId} - Get page details
  - Response: PageDto with full content and metadata
  
- [x] PUT /api/pages/{pageId} - Update page
  - Request: UpdatePageRequest (title, content, icon, coverImage)
  - Response: Updated PageDto
  
- [x] DELETE /api/pages/{pageId} - Delete page
  - Soft delete: Set archived=true
  
- [x] POST /api/pages/{pageId}/move - Move page
  - Request: MovePageRequest (newParentId, newPosition)
  
- [x] POST /api/pages/{pageId}/favorite - Toggle favorite status
  - Toggle favorite status for current user
  
- [x] GET /api/favorites - Get favorite pages
  - Returns all favorited pages across workspaces for current user

## Phase 4: Block Management (6 APIs) - COMPLETED ✅
- [x] GET /api/blocks/page/{pageId} - Get all blocks in page
  - Returns a flat list of root-level blocks
  - Response: List of BlockDto
  
- [x] POST /api/blocks - Add block to page
  - Request: CreateBlockRequest (type, content, pageId, parentId, position)
  - Response: Created BlockDto with URI in Location header
  
- [x] GET /api/blocks/{blockId} - Get block details
  - Response: BlockDto with block details
  
- [x] PUT /api/blocks/{blockId} - Update block
  - Request: UpdateBlockRequest (content, type, archived)
  - Response: Updated BlockDto
  
- [x] DELETE /api/blocks/{blockId} - Delete block
  - Soft delete: Sets archived=true
  
- [x] POST /api/blocks/{blockId}/move - Move block to new position
  - Request: MoveBlockRequest (newParentId, newPosition)
  - Handles reordering of blocks
  
- [x] GET /api/blocks/{blockId}/children - Get child blocks
  - Returns all direct children of a block
  - Response: List of BlockDto

## Phase 5: Search & Sharing (4 APIs) - COMPLETED ✅
- [x] GET /api/search - Search across shared content
  - Query param: q (search query)
  - Response: List of SharedPageDto matching the search query
  
- [x] POST /api/pages/{pageId}/share - Share page with another user
  - Request: SharePageRequest (email, permission)
  - Response: SharedPageDto with sharing details
  
- [x] GET /api/shared - Get all pages shared with current user
  - Response: List of SharedPageDto
  
- [x] DELETE /api/shared/{shareId} - Revoke sharing
  - Removes access for the shared user
