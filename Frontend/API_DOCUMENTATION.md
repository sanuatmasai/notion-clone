# Dynamic-Form-Builder API Documentation

## Overview
This document provides comprehensive API documentation for the Dynamic-Form-Builder Backend System (Notion Clone). All authenticated endpoints require Bearer token authentication.

**Base URL:** `http://localhost:8080`

## Authentication
Most endpoints require Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

---

## API Categories & Implementation Sequence

### 1. User Management APIs
Start with user registration and authentication flow.

#### POST `/api/users/register/request-otp`
**Purpose:** Request OTP for user registration. First step in the registration process.
**Authentication:** None required
**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "password": "string (min 8 chars)"
}
```
**Response:** `200 OK` with OTP sent confirmation
**Frontend Flow:** Call this when user fills registration form, then show OTP input field.

---

#### POST `/api/users/register`
**Purpose:** Complete user registration with OTP verification. Creates new user account.
**Authentication:** None required
**Query Parameters:**
- `otp` (required): The OTP received via email
**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string", 
  "password": "string (min 8 chars)"
}
```
**Response:** `200 OK` with user object and authentication token
**Frontend Flow:** Call after user enters valid OTP to complete registration.

---

#### POST `/api/users/login`
**Purpose:** Authenticate user and get access token for subsequent API calls.
**Authentication:** None required
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:** `200 OK` with authentication token and user details
**Frontend Flow:** Use for user login, store returned token for authenticated requests.

---

#### POST `/api/users/forgot-password/request-otp`
**Purpose:** Request OTP for password reset. Sends reset OTP to user's email.
**Authentication:** None required
**Query Parameters:**
- `email` (required): User's email address
**Response:** `200 OK` with OTP sent confirmation
**Frontend Flow:** Call when user clicks "Forgot Password" and enters email.

---

#### POST `/api/users/forgot-password/reset`
**Purpose:** Reset user password using OTP verification. Completes password reset flow.
**Authentication:** None required
**Query Parameters:**
- `email` (required): User's email
- `otp` (required): OTP received via email
- `newPassword` (required): New password
**Response:** `200 OK` with success confirmation
**Frontend Flow:** Call after user enters OTP and new password to complete reset.

---

#### GET `/api/users/profile`
**Purpose:** Get current user's profile information. Retrieves authenticated user details.
**Authentication:** Required
**Response:** `200 OK` with user object
**Frontend Flow:** Call after login to display user profile information.

---

#### PUT `/api/users/profile`
**Purpose:** Update current user's profile information. Allows users to modify their details.
**Authentication:** Required
**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string"
}
```
**Response:** `200 OK` with updated user object
**Frontend Flow:** Use in profile settings page for updating user information.

---

### 2. Workspace Management APIs
After authentication, implement workspace functionality.

#### GET `/api/workspaces`
**Purpose:** Get all workspaces for current user. Lists user's accessible workspaces.
**Authentication:** Required
**Response:** `200 OK` with array of WorkspaceDto objects
**Frontend Flow:** Call after login to populate workspace sidebar/dropdown.

---

#### POST `/api/workspaces`
**Purpose:** Create a new workspace. Allows users to create personal or team workspaces.
**Authentication:** Required
**Request Body:**
```json
{
  "name": "string (max 100 chars)",
  "description": "string (max 500 chars, optional)",
  "personal": "boolean"
}
```
**Response:** `200 OK` with created WorkspaceDto
**Frontend Flow:** Use in "Create Workspace" modal/form.

---

#### GET `/api/workspaces/{workspaceId}`
**Purpose:** Get specific workspace details by ID. Retrieves workspace information and metadata.
**Authentication:** Required
**Path Parameters:**
- `workspaceId` (UUID): Workspace identifier
**Response:** `200 OK` with WorkspaceDto
**Frontend Flow:** Call when switching workspaces or loading workspace details.

---

#### PUT `/api/workspaces/{workspaceId}`
**Purpose:** Update workspace information. Modify workspace name, description, or settings.
**Authentication:** Required
**Path Parameters:**
- `workspaceId` (UUID): Workspace identifier
**Request Body:**
```json
{
  "name": "string (max 100 chars)",
  "description": "string (max 500 chars, optional)",
  "personal": "boolean"
}
```
**Response:** `200 OK` with updated WorkspaceDto
**Frontend Flow:** Use in workspace settings page for editing workspace details.

---

#### DELETE `/api/workspaces/{workspaceId}`
**Purpose:** Delete a workspace permanently. Removes workspace and all associated data.
**Authentication:** Required
**Path Parameters:**
- `workspaceId` (UUID): Workspace identifier
**Response:** `200 OK`
**Frontend Flow:** Use in workspace settings with confirmation dialog.

---

### 3. Workspace Members Management
Implement after basic workspace functionality.

#### GET `/api/workspaces/{workspaceId}/members`
**Purpose:** Get all members of a workspace. Lists users with access to the workspace.
**Authentication:** Required
**Path Parameters:**
- `workspaceId` (UUID): Workspace identifier
**Response:** `200 OK` with array of WorkspaceMemberDto objects
**Frontend Flow:** Display in workspace members section or sharing modal.

---

#### POST `/api/workspaces/{workspaceId}/members`
**Purpose:** Add a new member to workspace. Invite users to collaborate in workspace.
**Authentication:** Required
**Path Parameters:**
- `workspaceId` (UUID): Workspace identifier
**Request Body:**
```json
{
  "email": "string",
  "role": "string"
}
```
**Response:** `200 OK` with WorkspaceMemberDto
**Frontend Flow:** Use in "Invite Members" modal when sharing workspace.

---

#### PUT `/api/workspaces/{workspaceId}/members/{userId}/role`
**Purpose:** Update member's role in workspace. Change user permissions and access level.
**Authentication:** Required
**Path Parameters:**
- `workspaceId` (UUID): Workspace identifier
- `userId` (integer): User identifier
**Query Parameters:**
- `role` (required): New role for the user
**Response:** `200 OK` with updated WorkspaceMemberDto
**Frontend Flow:** Use in member management interface for role changes.

---

#### DELETE `/api/workspaces/{workspaceId}/members/{userId}`
**Purpose:** Remove member from workspace. Revoke user's access to workspace.
**Authentication:** Required
**Path Parameters:**
- `workspaceId` (UUID): Workspace identifier
- `userId` (integer): User identifier
**Response:** `200 OK`
**Frontend Flow:** Use in member management with confirmation dialog.

---

### 4. Page Management APIs
Core functionality for document/page management.

#### GET `/api/workspaces/{workspaceId}/pages`
**Purpose:** Get all pages in workspace. Retrieves page hierarchy and structure.
**Authentication:** Required
**Path Parameters:**
- `workspaceId` (UUID): Workspace identifier
**Query Parameters:**
- `parentId` (UUID, optional): Filter by parent page for hierarchical loading
**Response:** `200 OK` with array of PageDto objects
**Frontend Flow:** Use to populate page tree/sidebar navigation.

---

#### POST `/api/workspaces/{workspaceId}/pages`
**Purpose:** Create new page in workspace. Adds new document to workspace.
**Authentication:** Required
**Path Parameters:**
- `workspaceId` (UUID): Workspace identifier
**Request Body:**
```json
{
  "title": "string",
  "icon": "string (optional)",
  "coverImage": "string (optional)",
  "content": "string (optional)",
  "parentId": "UUID (optional)",
  "position": "integer (optional)"
}
```
**Response:** `200 OK` with created PageDto
**Frontend Flow:** Use when user creates new page via "+" button or menu.

---

#### GET `/api/pages/{pageId}`
**Purpose:** Get specific page details by ID. Retrieves page content and metadata.
**Authentication:** Required
**Path Parameters:**
- `pageId` (UUID): Page identifier
**Response:** `200 OK` with PageDto
**Frontend Flow:** Call when user opens/navigates to a specific page.

---

#### PUT `/api/pages/{pageId}`
**Purpose:** Update page content and properties. Save changes to existing page.
**Authentication:** Required
**Path Parameters:**
- `pageId` (UUID): Page identifier
**Request Body:**
```json
{
  "title": "string",
  "icon": "string (optional)",
  "coverImage": "string (optional)",
  "content": "string (optional)"
}
```
**Response:** `200 OK` with updated PageDto
**Frontend Flow:** Use for auto-save or manual save when editing pages.

---

#### POST `/api/pages/{pageId}/move`
**Purpose:** Move page to new position or parent. Reorganize page hierarchy.
**Authentication:** Required
**Path Parameters:**
- `pageId` (UUID): Page identifier
**Request Body:**
```json
{
  "newParentId": "UUID (optional)",
  "newPosition": "integer (optional)"
}
```
**Response:** `200 OK` with updated PageDto
**Frontend Flow:** Use for drag-and-drop functionality in page tree.

---

#### POST `/api/pages/{pageId}/favorite`
**Purpose:** Toggle favorite status for page. Add/remove page from favorites.
**Authentication:** Required
**Path Parameters:**
- `pageId` (UUID): Page identifier
**Response:** `200 OK`
**Frontend Flow:** Use for star/favorite button functionality.

---

#### DELETE `/api/pages/{pageId}`
**Purpose:** Soft delete page (archive). Move page to trash/archive.
**Authentication:** Required
**Path Parameters:**
- `pageId` (UUID): Page identifier
**Response:** `200 OK`
**Frontend Flow:** Use for trash/delete page functionality.

---

#### GET `/api/favorites`
**Purpose:** Get all favorite pages for current user. List user's starred pages.
**Authentication:** Required
**Response:** `200 OK` with array of PageDto objects
**Frontend Flow:** Use to populate favorites section in sidebar.

---

### 5. Block Management APIs
Advanced content editing with block-based structure.

#### GET `/api/blocks/page/{pageId}`
**Purpose:** Get all root-level blocks for page. Retrieve page's content structure.
**Authentication:** Required
**Path Parameters:**
- `pageId` (UUID): Page identifier
**Response:** `200 OK` with array of BlockDto objects
**Frontend Flow:** Call when loading page editor to display content blocks.

---

#### POST `/api/blocks`
**Purpose:** Create new content block. Add new block to page structure.
**Authentication:** Required
**Request Body:**
```json
{
  "type": "string",
  "content": "string",
  "pageId": "UUID",
  "parentId": "UUID (optional)",
  "position": "integer (optional)"
}
```
**Response:** `200 OK` with created BlockDto
**Frontend Flow:** Use when user adds new content block in editor.

---

#### GET `/api/blocks/{blockId}`
**Purpose:** Get specific block by ID. Retrieve individual block details.
**Authentication:** Required
**Path Parameters:**
- `blockId` (UUID): Block identifier
**Response:** `200 OK` with BlockDto
**Frontend Flow:** Use for block-specific operations or detailed loading.

---

#### PUT `/api/blocks/{blockId}`
**Purpose:** Update block content and properties. Save changes to existing block.
**Authentication:** Required
**Path Parameters:**
- `blockId` (UUID): Block identifier
**Request Body:**
```json
{
  "content": "string",
  "type": "string (optional)",
  "archived": "boolean (optional)"
}
```
**Response:** `200 OK` with updated BlockDto
**Frontend Flow:** Use for real-time editing and saving block content.

---

#### GET `/api/blocks/{blockId}/children`
**Purpose:** Get child blocks of specific block. Retrieve nested block structure.
**Authentication:** Required
**Path Parameters:**
- `blockId` (UUID): Block identifier
**Response:** `200 OK` with array of BlockDto objects
**Frontend Flow:** Use for loading nested/indented content blocks.

---

#### POST `/api/blocks/{blockId}/move`
**Purpose:** Move block to new position or parent. Reorganize content structure.
**Authentication:** Required
**Path Parameters:**
- `blockId` (UUID): Block identifier
**Request Body:**
```json
{
  "newParentId": "UUID (optional)",
  "newPosition": "integer (optional)"
}
```
**Response:** `200 OK` with updated BlockDto
**Frontend Flow:** Use for drag-and-drop functionality in content editor.

---

#### DELETE `/api/blocks/{blockId}`
**Purpose:** Soft delete block (archive). Remove block from active content.
**Authentication:** Required
**Path Parameters:**
- `blockId` (UUID): Block identifier
**Response:** `200 OK`
**Frontend Flow:** Use for deleting content blocks with undo capability.

---

### 6. Sharing & Search APIs
Collaboration and content discovery features.

#### POST `/api/pages/{pageId}/share`
**Purpose:** Share page with another user. Grant access to specific pages.
**Authentication:** Required
**Path Parameters:**
- `pageId` (UUID): Page identifier
**Request Body:**
```json
{
  "email": "string",
  "permission": "string"
}
```
**Response:** `200 OK` with SharedPageDto
**Frontend Flow:** Use in page sharing modal for collaboration.

---

#### GET `/api/shared`
**Purpose:** Get all pages shared with current user. List accessible shared content.
**Authentication:** Required
**Response:** `200 OK` with array of SharedPageDto objects
**Frontend Flow:** Display in "Shared with me" section of sidebar.

---

#### DELETE `/api/shared/{shareId}`
**Purpose:** Revoke sharing access. Remove shared page access.
**Authentication:** Required
**Path Parameters:**
- `shareId` (UUID): Share identifier
**Response:** `200 OK`
**Frontend Flow:** Use for unsharing pages or revoking access.

---

#### GET `/api/search`
**Purpose:** Search across shared pages and workspaces. Find content by query.
**Authentication:** Required
**Query Parameters:**
- `q` (optional): Search query string
**Response:** `200 OK` with array of SharedPageDto objects
**Frontend Flow:** Use for global search functionality in top navigation.

---

## Data Models

### WorkspaceDto
```json
{
  "id": "UUID",
  "name": "string",
  "description": "string",
  "personal": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### PageDto
```json
{
  "id": "UUID",
  "title": "string",
  "icon": "string",
  "coverImage": "string", 
  "content": "string",
  "parentId": "UUID",
  "workspace": "WorkspaceDto",
  "position": "integer",
  "archived": "boolean",
  "favorite": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "integer",
  "updatedBy": "integer"
}
```

### BlockDto
```json
{
  "id": "UUID",
  "type": "string",
  "content": "string",
  "pageId": "UUID",
  "parentId": "UUID",
  "position": "integer",
  "archived": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime", 
  "createdBy": "integer",
  "updatedBy": "integer"
}
```

### WorkspaceMemberDto
```json
{
  "userId": "integer",
  "email": "string",
  "name": "string",
  "role": "string",
  "joinedAt": "datetime"
}
```

### SharedPageDto
```json
{
  "id": "UUID",
  "page": "PageDto",
  "sharedWithEmail": "string",
  "permission": "string",
  "sharedAt": "datetime",
  "sharedById": "integer"
}
```

### UserDto
```json
{
  "id": "integer",
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "password": "string",
  "role": "string"
}
```

---

## Frontend Implementation Sequence

1. **Authentication Flow**: Implement user registration, login, and password reset
2. **Workspace Management**: Create workspace listing and creation functionality
3. **Basic Page Operations**: Implement page creation, reading, and updating
4. **Page Hierarchy**: Add support for nested pages and page organization
5. **Block-based Editing**: Implement rich content editing with blocks
6. **Member Management**: Add workspace collaboration features
7. **Sharing System**: Implement page sharing and permissions
8. **Search & Discovery**: Add search functionality and shared content access
9. **Advanced Features**: Implement favorites, archiving, and advanced organization

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

Implement proper error handling on the frontend for each API call to provide good user experience.