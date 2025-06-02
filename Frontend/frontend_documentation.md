# Notion Clone Frontend Development Documentation

## Table of Contents
1. [Project Setup](#project-setup)
2. [Architecture Overview](#architecture-overview)
3. [Component Structure](#component-structure)
4. [API Integration Guide](#api-integration-guide)
5. [State Management](#state-management)
6. [Authentication Flow](#authentication-flow)
7. [Page Management](#page-management)
8. [Block Editor Implementation](#block-editor-implementation)
9. [Workspace Management](#workspace-management)
10. [Error Handling](#error-handling)
11. [Development Phases](#development-phases)

---

## Project Setup

### Tech Stack
- **Framework**: React 18 with Vite
- **Language**: JavaScript (ES6+)
- **Styling**: TailwindCSS 3.x
- **Rich Text Editor**: Lexical
- **State Management**: React Query + Context API
- **Routing**: React Router 6
- **HTTP Client**: Axios

### Initial Setup Commands
```bash
# Create Vite React project
npm create vite@latest notion-clone -- --template react

# Install dependencies
npm install @tanstack/react-query axios react-router-dom @lexical/react lucide-react

# Install TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Environment Configuration
Create `.env.local` file:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Notion Clone
```

---

## Architecture Overview

### Folder Structure
```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components
│   ├── blocks/          # Block editor components
│   ├── workspace/       # Workspace components
│   └── common/          # Common UI elements
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── context/             # React context providers
├── utils/               # Utility functions
├── constants/           # Application constants
└── styles/              # Global styles
```

### Key Architectural Principles
- **Component Composition**: Build reusable, composable components
- **Separation of Concerns**: Separate UI, business logic, and data fetching
- **Single Responsibility**: Each component/hook has one clear purpose
- **Error Boundaries**: Implement error boundaries for robust error handling

---

## Component Structure

### Core Layout Components

#### `AppLayout`
- Main application wrapper
- Contains header, sidebar, and main content area
- Handles responsive layout switching
- Manages global loading states

#### `Sidebar`
- Workspace navigation
- Page tree structure
- Collapsible sections
- Quick actions (New Page, New Workspace)

#### `Header`
- User profile dropdown
- Workspace switcher
- Search functionality
- Breadcrumb navigation

#### `PageEditor`
- Main content editing area
- Block container
- Page title editing
- Block insertion controls

### Authentication Components

#### `AuthGuard`
- Route protection wrapper
- Redirects unauthenticated users
- Token validation
- Automatic token refresh

#### `LoginForm`
- Email/password inputs
- Form validation
- Error display
- "Remember me" functionality

#### `RegisterForm`
- User registration fields
- Password strength validation
- Terms acceptance
- Email verification flow

#### `EmailVerification`
- OTP input component
- Resend verification button
- Timer display
- Success/error states

---

## API Integration Guide

### Service Layer Structure

#### `authService.js`
```javascript
// Authentication API calls
- register(userData)
- login(credentials)
- verifyEmail(email, otpCode)
- resendVerification(email)
- forgotPassword(email)
- resetPassword(token, newPassword)
- refreshToken()
```

#### `userService.js`
```javascript
// User management API calls
- getCurrentUser()
- updateUserProfile(userId, userData)
- deleteUser(userId)
- getUserById(userId)
- checkEmailAvailability(email)
```

#### `workspaceService.js`
```javascript
// Workspace management API calls
- getWorkspaces()
- createWorkspace(workspaceData)
- getWorkspaceById(workspaceId)
- updateWorkspace(workspaceId, updates)
- deleteWorkspace(workspaceId)
- getWorkspaceMembers(workspaceId)
- addWorkspaceMember(workspaceId, email)
- removeWorkspaceMember(workspaceId, memberId)
- leaveWorkspace(workspaceId)
```

#### `pageService.js`
```javascript
// Page management API calls
- createPage(pageData)
- getPageById(pageId)
- updatePage(pageId, updates)
- deletePage(pageId)
- getWorkspacePages(workspaceId)
- getChildPages(parentId)
- movePage(pageId, newParentId)
- archivePage(pageId)
- restorePage(pageId)
```

#### `blockService.js`
```javascript
// Block management API calls
- createBlock(blockData)
- getBlockById(blockId)
- updateBlock(blockId, updates)
- deleteBlock(blockId)
- getPageBlocks(pageId)
- getChildBlocks(parentId)
- moveBlock(blockId, parentId, position)
```

### API Response Handling

#### Success Response Pattern
```javascript
{
  data: {...}, // Response data
  status: 200,
  message: "Success"
}
```

#### Error Response Pattern
```javascript
{
  error: true,
  status: 400|401|403|404|500,
  message: "Error description",
  details: {...} // Optional error details
}
```

---

## State Management

### React Query Configuration

#### Query Keys Structure
```javascript
// Authentication
['auth', 'user']
['auth', 'refresh']

// Users
['user', userId]
['user', 'current']

// Workspaces
['workspaces']
['workspace', workspaceId]
['workspace', workspaceId, 'members']

// Pages
['pages', 'workspace', workspaceId]
['page', pageId]
['pages', 'children', parentId]

// Blocks
['blocks', 'page', pageId]
['block', blockId]
['blocks', 'children', parentId]
```

#### Custom Hooks Structure

#### `useAuth`
- Manages authentication state
- Provides login/logout functions
- Handles token refresh
- User profile access

#### `useWorkspaces`
- Fetches user workspaces
- Provides workspace CRUD operations
- Handles workspace switching
- Member management

#### `usePages`
- Page CRUD operations
- Page hierarchy management
- Search functionality
- Archive/restore operations

#### `useBlocks`
- Block CRUD operations
- Block reordering
- Content persistence
- Real-time updates

### Context Providers

#### `AuthContext`
- Current user state
- Authentication status
- Token management
- User permissions

#### `WorkspaceContext`
- Active workspace
- Workspace switching
- Permission checks
- Member information

#### `EditorContext`
- Current page state
- Block selection
- Editor mode (view/edit)
- Collaboration state

---

## Authentication Flow

### Registration Process
1. User fills registration form
2. Validate form data locally
3. Call `POST /api/auth/register`
4. Display email verification prompt
5. User enters OTP code
6. Call `POST /api/auth/verify-email`
7. Redirect to dashboard on success

### Login Process
1. User enters credentials
2. Validate form data
3. Call `POST /api/auth/login`
4. Store JWT token securely
5. Fetch user profile
6. Redirect to last visited workspace/page

### Token Management
- Store access token in memory (React state)
- Store refresh token in httpOnly cookie (if supported)
- Implement automatic token refresh
- Handle token expiration gracefully
- Clear tokens on logout

### Protected Routes
```javascript
// Route protection pattern
<Route 
  path="/dashboard" 
  element={
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  } 
/>
```

---

## Page Management

### Page Hierarchy Structure
- Pages can be nested infinitely
- Each page has optional parent relationship
- Root pages belong directly to workspace
- Maintain breadcrumb navigation

### Page Creation Flow
1. User clicks "New Page" button
2. Show page creation modal/form
3. Collect page title and parent selection
4. Call `POST /api/pages`
5. Navigate to new page
6. Initialize with default block

### Page Editor Features
- **Title Editing**: Inline title editor
- **Content Area**: Block-based content editor
- **Page Properties**: Metadata editing panel
- **Actions Menu**: Move, archive, delete options
- **Breadcrumbs**: Navigation path display

### Page Navigation
- **Sidebar Tree**: Hierarchical page navigation
- **Recent Pages**: Quick access to recently viewed
- **Search**: Global page search functionality
- **Breadcrumbs**: Current location indicator

---

## Block Editor Implementation

### Block Types to Implement

#### Text Block
- Basic paragraph text
- Rich text formatting (bold, italic, underline)
- Inline code and links
- Text alignment options

#### Heading Block
- H1, H2, H3 heading levels
- Auto-generate page outline
- Anchor link generation
- Collapsible sections

#### List Block
- Bulleted lists
- Numbered lists
- Checkbox/todo lists
- Nested list support

#### Divider Block
- Horizontal rule separator
- Different divider styles
- Spacing control

#### Quote Block
- Blockquote formatting
- Citation support
- Styled quote appearance

#### Code Block
- Syntax highlighting
- Language selection
- Copy to clipboard
- Line numbers

### Block Editor Features

#### Block Operations
- **Add Block**: Insert new block below current
- **Delete Block**: Remove block with confirmation
- **Move Block**: Drag and drop reordering
- **Convert Block**: Change block type
- **Duplicate Block**: Copy existing block

#### Slash Commands
- Type `/` to open command menu
- Quick block type selection
- Keyboard navigation
- Search/filter commands

#### Keyboard Shortcuts
- Enter: New block
- Backspace: Delete empty block
- Tab: Indent block
- Shift+Tab: Outdent block
- Ctrl+/: Toggle command menu

### Lexical Editor Configuration
- Initialize with default plugins
- Configure block node types
- Implement custom commands
- Handle state persistence
- Error boundary integration

---

## Workspace Management

### Workspace Features
- **Creation**: New workspace with name/description
- **Switching**: Switch between user workspaces
- **Settings**: Workspace configuration panel
- **Members**: Member management (future feature)
- **Deletion**: Workspace removal with confirmation

### Workspace Context
- Track active workspace
- Provide workspace-scoped data
- Handle permission checks
- Manage workspace switching

### Workspace Limits
- Maximum 5 workspaces per user (MVP)
- Display quota usage
- Prevent creation when limit reached
- Clear upgrade messaging

---

## Error Handling

### Error Boundary Implementation
- Wrap main application sections
- Provide fallback UI
- Log errors for debugging
- Recovery mechanisms

### API Error Handling
- Network errors
- Authentication errors (401)
- Authorization errors (403)
- Validation errors (400)
- Server errors (500)

### User Feedback
- Toast notifications for actions
- Inline error messages for forms
- Loading states for async operations
- Empty states for no data

## Development Phases

### Phase 1: Foundation (Hours 1-12)
**Authentication & User Management**

1. **Project Setup** (Hours 1-2)
   - Initialize Vite React project
   - Configure TailwindCSS
   - Setup folder structure
   - Install dependencies

2. **Authentication UI** (Hours 3-6)
   - Login/Register forms
   - Email verification component
   - Password reset flow
   - Form validation

3. **API Integration** (Hours 7-9)
   - Axios configuration
   - Authentication service
   - React Query setup
   - Token management

4. **User Profile** (Hours 10-12)
   - Profile display component
   - Profile edit functionality
   - User settings panel
   - Account deletion

### Phase 2: Core Features (Hours 13-24)
**Workspace & Page Management**

5. **Application Layout** (Hours 13-15)
   - Main app layout
   - Sidebar navigation
   - Header component
   - Responsive design

6. **Workspace Management** (Hours 16-18)
   - Workspace list/grid
   - Workspace creation
   - Workspace switching
   - Workspace settings

7. **Page Management** (Hours 19-21)
   - Page tree navigation
   - Page creation flow
   - Page editing interface
   - Page operations menu

8. **Navigation & Routing** (Hours 22-24)
   - React Router setup
   - Protected routes
   - Breadcrumb navigation
   - Deep linking support

### Phase 3: Block Editor (Hours 25-36)
**Content Editing System**

9. **Lexical Setup** (Hours 25-27)
   - Lexical editor initialization
   - Basic text editing
   - Rich text toolbar
   - Editor theme configuration

10. **Basic Block Types** (Hours 28-30)
    - Text/paragraph blocks
    - Heading blocks
    - List blocks
    - Block type conversion

11. **Block Operations** (Hours 31-33)
    - Block creation/deletion
    - Block reordering
    - Slash commands
    - Keyboard shortcuts

12. **Advanced Blocks** (Hours 34-36)
    - Quote blocks
    - Code blocks
    - Divider blocks
    - Block styling options

### Phase 4: Polish & Enhancement (Hours 37-48)
**UI/UX & Final Features**

13. **UI/UX Polish** (Hours 37-39)
    - Loading states
    - Error handling
    - Empty states
    - Animations/transitions

14. **Mobile Responsiveness** (Hours 40-42)
    - Mobile layout optimization
    - Touch interactions
    - Mobile navigation
    - Performance optimization

15. **Final Features** (Hours 43-45)
    - Search functionality
    - Recent pages
    - Keyboard shortcuts
    - Data persistence


This documentation provides a comprehensive guide for building the Notion clone frontend. Follow the phases sequentially, referring to the API_DOCUMENTATION.md for exact endpoint specifications and data structures.