## 3. WORKSPACE MANAGEMENT APIs (7 APIs)

### 3.1 GET /api/workspaces
**Purpose**: Get all workspaces for current user
**Method**: GET
**Authentication**: Bearer token required
**Response**: Array of WorkspaceDto objects

### 3.2 POST /api/workspaces
**Purpose**: Create a new workspace
**Method**: POST
**Authentication**: Bearer token required
**Request Body**:
```json
{
  "name": "My Workspace",
  "description": "Workspace description",
  "personal": false
}
```
**Response**: Created WorkspaceDto

### 3.3 GET /api/workspaces/{workspaceId}
**Purpose**: Get workspace details by ID
**Method**: GET
**Authentication**: Bearer token required
**Path Parameters**: `workspaceId` (UUID)
**Response**: WorkspaceDto

### 3.4 PUT /api/workspaces/{workspaceId}
**Purpose**: Update workspace details
**Method**: PUT
**Authentication**: Bearer token required
**Path Parameters**: `workspaceId` (UUID)
**Request Body**:
```json
{
  "name": "Updated Workspace Name",
  "description": "Updated description"
}
```
**Response**: Updated WorkspaceDto

### 3.5 DELETE /api/workspaces/{workspaceId}
**Purpose**: Delete workspace
**Method**: DELETE
**Authentication**: Bearer token required
**Path Parameters**: `workspaceId` (UUID)
**Response**: Success confirmation

### 3.6 GET /api/workspaces/{workspaceId}/members
**Purpose**: Get workspace members
**Method**: GET
**Authentication**: Bearer token required
**Path Parameters**: `workspaceId` (UUID)
**Response**: Array of WorkspaceMemberDto objects

### 3.7 POST /api/workspaces/{workspaceId}/members
**Purpose**: Add member to workspace
**Method**: POST
**Authentication**: Bearer token required
**Path Parameters**: `workspaceId` (UUID)
**Query Parameters**: `email` (required)
**Response**: WorkspaceMemberDto

### 3.8 DELETE /api/workspaces/{workspaceId}/members/{memberId}
**Purpose**: Remove member from workspace
**Method**: DELETE
**Authentication**: Bearer token required
**Path Parameters**: `workspaceId` (UUID), `memberId` (UUID)
**Response**: Success confirmation

### 3.9 POST /api/workspaces/{workspaceId}/leave
**Purpose**: Leave workspace (for current user)
**Method**: POST
**Authentication**: Bearer token required
**Path Parameters**: `workspaceId` (UUID)
**Response**: Success confirmation

---

## 4. PAGE MANAGEMENT APIs (8 APIs)

### 4.1 POST /api/pages
**Purpose**: Create a new page
**Method**: POST
**Authentication**: Bearer token required
**Request Body**:
```json
{
  "title": "Page Title",
  "content": "Page content",
  "workspaceId": "workspace-uuid",
  "parentId": "parent-page-uuid" // optional
}
```
**Response**: Created PageDto

### 4.2 GET /api/pages/{pageId}
**Purpose**: Get page by ID
**Method**: GET
**Authentication**: Bearer token required
**Path Parameters**: `pageId` (UUID)
**Response**: PageDto with page details

### 4.3 PUT /api/pages/{pageId}
**Purpose**: Update page content and metadata
**Method**: PUT
**Authentication**: Bearer token required
**Path Parameters**: `pageId` (UUID)
**Request Body**:
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "parentId": "new-parent-uuid",
  "isArchived": false
}
```
**Response**: Updated PageDto

### 4.4 DELETE /api/pages/{pageId}
**Purpose**: Delete (archive) a page
**Method**: DELETE
**Authentication**: Bearer token required
**Path Parameters**: `pageId` (UUID)
**Response**: Success confirmation

### 4.5 GET /api/pages/workspace/{workspaceId}
**Purpose**: Get all root pages in a workspace
**Method**: GET
**Authentication**: Bearer token required
**Path Parameters**: `workspaceId` (UUID)
**Response**: Array of PageDto objects (root level pages only)

### 4.6 GET /api/pages/{parentId}/children
**Purpose**: Get child pages of a parent page
**Method**: GET
**Authentication**: Bearer token required
**Path Parameters**: `parentId` (UUID)
**Response**: Array of PageDto objects (child pages)

### 4.7 POST /api/pages/{pageId}/move
**Purpose**: Move page to new parent
**Method**: POST
**Authentication**: Bearer token required
**Path Parameters**: `pageId` (UUID)
**Query Parameters**: `newParentId` (UUID, required)
**Response**: Updated PageDto

### 4.8 POST /api/pages/{pageId}/archive
**Purpose**: Archive a page
**Method**: POST
**Authentication**: Bearer token required
**Path Parameters**: `pageId` (UUID)
**Response**: Updated PageDto with archived status

### 4.9 POST /api/pages/{pageId}/restore
**Purpose**: Restore an archived page
**Method**: POST
**Authentication**: Bearer token required
**Path Parameters**: `pageId` (UUID)
**Response**: Updated PageDto with restored status

---

## 5. BLOCK MANAGEMENT APIs (6 APIs)

### 5.1 POST /api/blocks
**Purpose**: Create a new block
**Method**: POST
**Authentication**: Bearer token required
**Request Body**:
```json
{
  "pageId": "page-uuid",
  "parentId": "parent-block-uuid", // optional
  "position": 0,
  "content": "Block content"
}
```
**Response**: Created BlockDto

### 5.2 GET /api/blocks/{blockId}
**Purpose**: Get block by ID
**Method**: GET
**Authentication**: Bearer token required
**Path Parameters**: `blockId` (UUID)
**Response**: BlockDto with block details

### 5.3 PUT /api/blocks/{blockId}
**Purpose**: Update block content and archived status
**Method**: PUT
**Authentication**: Bearer token required
**Path Parameters**: `blockId` (UUID)
**Request Body**:
```json
{
  "content": "Updated block content",
  "archived": false
}
```
**Response**: Updated BlockDto

### 5.4 DELETE /api/blocks/{blockId}
**Purpose**: Delete a block
**Method**: DELETE
**Authentication**: Bearer token required
**Path Parameters**: `blockId` (UUID)
**Response**: Success confirmation

### 5.5 GET /api/blocks/page/{pageId}
**Purpose**: Get all blocks for a page
**Method**: GET
**Authentication**: Bearer token required
**Path Parameters**: `pageId` (UUID)
**Response**: Array of BlockDto objects

### 5.6 GET /api/blocks/{parentId}/children
**Purpose**: Get child blocks of a parent block
**Method**: GET
**Authentication**: Bearer token required
**Path Parameters**: `parentId` (UUID)
**Response**: Array of BlockDto objects (child blocks)

### 5.7 POST /api/blocks/{blockId}/move
**Purpose**: Move block to new parent/position
**Method**: POST
**Authentication**: Bearer token required
**Path Parameters**: `blockId` (UUID)
**Query Parameters**: 
- `parentId` (UUID, optional): New parent block
- `position` (integer, optional): New position
**Response**: Updated BlockDto

---

## 6. DATA TRANSFER OBJECTS (DTOs)

### WorkspaceDto
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string", 
  "ownerId": "uuid",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "personal": "boolean"
}
```

### UserProfileDto
```json
{
  "id": "uuid",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "verified": "boolean"
}
```

### PageDto
```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "workspaceId": "uuid",
  "parentId": "uuid",
  "createdById": "uuid",
  "lastModifiedById": "uuid",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "archived": "boolean"
}
```

### BlockDto
```json
{
  "id": "uuid",
  "pageId": "uuid",
  "parentId": "uuid",
  "content": "string",
  "position": "integer",
  "archived": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "uuid",
  "updatedBy": "uuid",
  "hasChildren": "boolean"
}
```

---

## 7. FRONTEND IMPLEMENTATION SEQUENCE

### Phase 1: Authentication & User Management
1. **POST /api/auth/register** - User registration
2. **POST /api/auth/verify-email** - Email verification
3. **POST /api/auth/resend-verification** - Resend verification
4. **POST /api/auth/login** - User login
5. **POST /api/auth/refresh-token** - Token refresh
6. **GET /api/users/me** - Get current user profile
7. **POST /api/auth/forgot-password** - Password reset request
8. **POST /api/auth/reset-password** - Complete password reset

### Phase 2: User Profile Management
9. **GET /api/users/check-email** - Email availability check
10. **PUT /api/users/{userId}** - Update user profile
11. **GET /api/users/{userId}** - Get user profile by ID
12. **DELETE /api/users/{userId}** - Delete user account

### Phase 3: Workspace Management
13. **POST /api/workspaces** - Create workspace
14. **GET /api/workspaces** - List user workspaces
15. **GET /api/workspaces/{workspaceId}** - Get workspace details
16. **PUT /api/workspaces/{workspaceId}** - Update workspace
17. **DELETE /api/workspaces/{workspaceId}** - Delete workspace

### Phase 4: Workspace Collaboration
18. **GET /api/workspaces/{workspaceId}/members** - List workspace members
19. **POST /api/workspaces/{workspaceId}/members** - Add workspace member
20. **DELETE /api/workspaces/{workspaceId}/members/{memberId}** - Remove member
21. **POST /api/workspaces/{workspaceId}/leave** - Leave workspace

### Phase 5: Page Management
22. **POST /api/pages** - Create new page
23. **GET /api/pages/workspace/{workspaceId}** - Get workspace pages
24. **GET /api/pages/{pageId}** - Get page details
25. **PUT /api/pages/{pageId}** - Update page
26. **GET /api/pages/{parentId}/children** - Get child pages

### Phase 6: Page Operations
27. **POST /api/pages/{pageId}/move** - Move page
28. **POST /api/pages/{pageId}/archive** - Archive page
29. **POST /api/pages/{pageId}/restore** - Restore page
30. **DELETE /api/pages/{pageId}** - Delete page

### Phase 7: Block Management (Content Editor)
31. **POST /api/blocks** - Create new block
32. **GET /api/blocks/page/{pageId}** - Get page blocks
33. **GET /api/blocks/{blockId}** - Get block details
34. **PUT /api/blocks/{blockId}** - Update block content
35. **GET /api/blocks/{parentId}/children** - Get child blocks
36. **POST /api/blocks/{blockId}/move** - Move block
37. **DELETE /api/blocks/{blockId}** - Delete block

---