# Copilot CLI Prompts - Advanced Login & Context Architecture

## Overview

This document contains all Copilot CLI prompts organized by implementation phase for the Advanced Login & Context Architecture.

**Reference Document**: `docs/Advanced-Login-Context-Architecture.md`

---

## Setup: Create Task

```bash
gh copilot task create \
  --title "Implement Advanced Login & Context Management" \
  --description "Refactor session management from useState to Zustand with authorization middleware"
```

---

## Phase 1: Create Zustand Stores

### Prompt 1.1 - Create Auth & Permission Stores

```bash
gh copilot task prompt \
  "Implement Phase 1 of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 1).

Create two new files:

1. frontend/src/core/store/authStore.ts
   - Use Zustand with persist middleware
   - Implement: setSession, clearSession, validateSession, refreshAccessToken
   - Store: session, accessToken, refreshToken, expiresAt, isLoading, error
   - Persist to localStorage as 'cmms-auth'

2. frontend/src/core/store/permissionStore.ts
   - Use Zustand (no persist needed)
   - Implement: setPermissions, hasPermission, hasAnyPermission, hasAllPermissions, clear
   - Cache permissions in Map<string, boolean>
   - Store: permissions[], roles[], permissionCache

3. frontend/src/core/store/index.ts
   - Export both stores

Requirements:
- TypeScript strict mode
- Full error handling
- Match exact code from architecture document section 1
- Run: npm install zustand first"
```

---

## Phase 2: API Interceptor & Route Guard

### Prompt 2.1 - Create API Client

```bash
gh copilot task prompt \
  "Implement Phase 2a of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 2).

Create: frontend/src/core/api/apiClient.ts

Requirements:
- Auto-add Authorization header from authStore
- Auto-refresh token on 401 response
- Redirect to /login on 401 failure
- Handle 403 permission denied
- Use exact code from architecture document
- Export: const apiClient = async(endpoint, options) => Response"
```

### Prompt 2.2 - Create Protected Route Component

```bash
gh copilot task prompt \
  "Implement Phase 2b of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 2).

Create: frontend/src/core/components/ProtectedRoute.tsx

Requirements:
- React component that wraps route children
- Check validateSession() before rendering
- Check requiredPermissions using permissionStore
- Check requiredRoles against session.roleId
- Redirect to /login if not authenticated
- Redirect to /forbidden if permissions missing
- Props: children, requiredPermissions[], requiredRoles[]
- Use exact code from architecture document"
```

### Prompt 2.3 - Create Action Authorizer

```bash
gh copilot task prompt \
  "Implement Phase 2c of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 2).

Create: frontend/src/core/utils/authorizeAction.ts

Requirements:
- Export: useAuthorizeAction() hook
- Function: authorizeAndExecute(options, executor)
- Auto-check permissions before executing
- Auto-log via useAuditLog() on success/failure
- options: { requiredPermissions[], action, resourceType, resourceId? }
- Throw Error if permission denied
- Use exact code from architecture document"
```

### Prompt 2.4 - Create Index Files for Phase 2

```bash
gh copilot task prompt \
  "Create index.ts files for Phase 2 exports:

1. frontend/src/core/api/index.ts
   - Export: apiClient

2. frontend/src/core/components/index.ts
   - Export: ProtectedRoute

3. frontend/src/core/utils/index.ts
   - Export: useAuthorizeAction"
```

---

## Phase 3: Hooks Layer

### Prompt 3.1 - Create useAuth Hook

```bash
gh copilot task prompt \
  "Implement Phase 3a of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 3).

Create: frontend/src/core/hooks/useAuth.ts

Requirements:
- Custom hook using authStore
- Return object with:
  * session: LoginInfo | null
  * isLoading: boolean
  * isAuthenticated: boolean
  * login(email, password): Promise<void>
  * logout(): void
- login() calls /api/auth/login
- login() sets session via store
- logout() clears session
- Use exact code from architecture document"
```

### Prompt 3.2 - Create usePermissions Hook

```bash
gh copilot task prompt \
  "Implement Phase 3b of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 3).

Create: frontend/src/core/hooks/usePermissions.ts

Requirements:
- Custom hook using permissionStore and authStore
- Auto-sync permissions when session changes (useEffect)
- Return object with:
  * hasPermission(permission: string): boolean
  * hasAnyPermission(permissions: string[]): boolean
  * hasAllPermissions(permissions: string[]): boolean
  * canCreate(resource: string): boolean → hasPermission('{resource}:c')
  * canRead(resource: string): boolean → hasPermission('{resource}:r')
  * canUpdate(resource: string): boolean → hasPermission('{resource}:u')
  * canDelete(resource: string): boolean → hasPermission('{resource}:d')
- Use exact code from architecture document"
```

### Prompt 3.3 - Create useAuditLog Hook

```bash
gh copilot task prompt \
  "Implement Phase 3c of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 3).

Create: frontend/src/core/hooks/useAuditLog.ts

Requirements:
- Custom hook using authStore
- Export: useAuditLog() hook
- Return object with: logAction(action: string, details: object)
- logAction() sends POST to /api/audit-logs
- Include in request:
  * actor_id from session.userId
  * actor_role from session.roleId
  * action parameter
  * timestamp as ISO string
  * entity_type, entity_id from details
  * changes, reason from details
- Error handling: log to console, don't throw
- Use exact code from architecture document"
```

### Prompt 3.4 - Create useScope Hook

```bash
gh copilot task prompt \
  "Implement Phase 3d of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 3).

Create: frontend/src/core/hooks/useScope.ts

Requirements:
- Custom hook using authStore.session
- Return object with:
  * companyId: string
  * siteId: string
  * deptId: string
  * userId: string
  * scope object containing:
    - company: { id, name }
    - site: { id, name }
    - dept: { id, name }
    - user: { id, name }
- Use exact code from architecture document"
```

### Prompt 3.5 - Create Index File for Phase 3

```bash
gh copilot task prompt \
  "Create: frontend/src/core/hooks/index.ts

Requirements:
- Export all four hooks:
  * useAuth
  * usePermissions
  * useAuditLog
  * useScope
- Format: export { useAuth, usePermissions, useAuditLog, useScope }"
```

---

## Phase 4: React Router Setup

### Prompt 4.1 - Create Routes File

```bash
gh copilot task prompt \
  "Implement Phase 4 of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 4).

Create: frontend/src/routes.tsx using React Router v6

Requirements:
1. Install: npm install react-router-dom
2. Import: createBrowserRouter, Navigate
3. Create router with these routes:
   - /login → LoginPage (no protection)
   - /forbidden → ForbiddenPage (error page)
   - /app → AppShell (protected root)
     - /app/pm → PmRecordListPage (requires pm:r permission)
     - /app/wo → WorkOrderListPage (requires wo:r permission)
     - /app/wp → WorkPermitListPage (requires wp:r permission)
     - /app/po → PurchaseOrderPage (requires PURCHASE_MANAGER role)
     - /app/equipment → EquipmentListPage (requires equipment:r)
     - /app/material → MaterialListPage
     - /app/purchase-request → PurchaseRequestPage
     - /app/inventory-tx → InventoryTransactionPage
     - /app/inventory-ledger → InventoryLedgerPage
     - /app/approval → ApprovalPage (requires approval:approve)
     - /app/board → FreeBoardPage
     - /app/org → OrgPage

4. Wrap each protected route with ProtectedRoute component
5. Set requiredPermissions prop for each route
6. Set requiredRoles for admin/manager-only routes
7. Export: const router = createBrowserRouter([...])
8. Use exact code structure from architecture document"
```

---

## Phase 5: Update Main App Files

### Prompt 5.1 - Update main.tsx

```bash
gh copilot task prompt \
  "Implement Phase 5a of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 5).

Update: frontend/src/main.tsx

Changes:
1. Remove: <App /> from render
2. Add import: import { router } from './routes'
3. Add import: import { RouterProvider } from 'react-router-dom'
4. Update render to:
   <StrictMode>
     <RouterProvider router={router} />
   </StrictMode>
5. Keep: import of global.css
6. Match exact code from architecture document"
```

### Prompt 5.2 - Update App.tsx

```bash
gh copilot task prompt \
  "Implement Phase 5b of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 5).

Update: frontend/src/app/App.tsx

Changes:
1. Remove: useState for session (only keep theme)
2. Remove: useEffect for auth/logout (routes handle it)
3. Remove: LoginPage conditional render
4. Remove: logout() function
5. Keep: useState for theme
6. Keep: toggleTheme() function
7. Keep: useEffect for applyTheme()
8. Update render to:
   <> AppShell (no session prop needed, will use hook)
      ToastViewport
   </>
9. Remove props: session, onLogout
10. AppShell still gets theme prop for now
11. Match exact code from architecture document"
```

---

## Phase 6: Update Existing Components

### Prompt 6.1 - Update PM Record Pages

```bash
gh copilot task prompt \
  "Implement Phase 6a of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 5).

Update: frontend/src/modules/pm-record/pages/PmRecordListPage.tsx

Changes:
1. Remove: session prop from component signature
2. Add imports:
   - import { useAuth } from '../../../core/hooks/useAuth'
   - import { usePermissions } from '../../../core/hooks/usePermissions'
   - import { useAuditLog } from '../../../core/hooks/useAuditLog'
3. Inside component, add:
   - const { session } = useAuth()
   - const { canDelete } = usePermissions()
   - const { logAction } = useAuditLog()
4. Replace: All session prop usage with useAuth().session
5. Replace: Manual permission checks with usePermissions().canDelete()
6. Add: useAuditLog().logAction() in delete handler
7. Match exact pattern from architecture document"
```

### Prompt 6.2 - Update Work Order Pages

```bash
gh copilot task prompt \
  "Implement Phase 6b of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 5).

Update these files with same pattern as PM Record:

1. frontend/src/modules/work-order/pages/WorkOrderListPage.tsx
2. frontend/src/modules/work-order/pages/WorkOrderPlanFormPage.tsx
3. frontend/src/modules/work-order/pages/WorkOrderResultFormPage.tsx

Changes for each:
- Remove: session prop
- Add imports: useAuth, usePermissions, useAuditLog
- Add: const { session } = useAuth()
- Add: const { canDelete/canCreate/canUpdate } = usePermissions()
- Add: const { logAction } = useAuditLog()
- Replace: All session prop usage with hook
- Replace: Permission checks with hook methods
- Add: logAction() in handlers
- Match pattern from architecture document"
```

### Prompt 6.3 - Update Purchase & Inventory Pages

```bash
gh copilot task prompt \
  "Implement Phase 6c of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 5).

Update these files:

1. frontend/src/modules/purchase-order/pages/PurchaseOrderPage.tsx
2. frontend/src/modules/inventory/pages/InventoryTransactionPage.tsx
3. frontend/src/modules/inventory/pages/InventoryLedgerPage.tsx
4. frontend/src/modules/material/pages/MaterialListPage.tsx

Changes for each:
- Remove: session prop
- Add imports: useAuth, usePermissions, useAuditLog
- Add: const { session } = useAuth()
- Add: const { canCreate, canUpdate, canDelete } = usePermissions()
- Add: const { logAction } = useAuditLog()
- Replace: All session prop usage
- Replace: Permission checks
- Add: Audit logging
- Match pattern from architecture document"
```

### Prompt 6.4 - Update Approval & Board Pages

```bash
gh copilot task prompt \
  "Implement Phase 6d of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md section 5).

Update these files:

1. frontend/src/modules/approval/pages/ApprovalPage.tsx
2. frontend/src/modules/approval/pages/ApprovalFormPage.tsx
3. frontend/src/modules/approval/pages/ApprovalDetailPage.tsx
4. frontend/src/modules/board/pages/FreeBoardPage.tsx

Changes for each:
- Remove: session prop
- Add imports: useAuth, usePermissions, useAuditLog, useScope
- Add: const { session } = useAuth()
- Add: const { canCreate, canUpdate } = usePermissions()
- Add: const { logAction } = useAuditLog()
- Add: const { scope } = useScope() for data filtering
- Replace: All session prop usage
- Replace: Permission checks
- Add: Audit logging
- Match pattern from architecture document"
```

---

## Phase 7: Update AppShell

### Prompt 7.1 - Update AppShell Component

```bash
gh copilot task prompt \
  "Implement Phase 7 of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md).

Update: frontend/src/widgets/app-shell/AppShell.tsx

Changes:
1. Remove: session prop from AppShellProps interface
2. Remove: onLogout prop from AppShellProps interface
3. Add import: import { useAuth } from '../../core/hooks/useAuth'
4. Inside component, add:
   const { session } = useAuth()
5. Remove: onLogout prop from logout button click
6. Update logout button to call:
   - useAuthStore.getState().clearSession()
   - Navigate to /login
7. Keep: All existing UI and layout
8. Note: AppShell gets session from hook, not prop now
9. Child pages will use hooks directly
10. Match pattern from architecture document"
```

---

## Phase 8: Update Auth Pages

### Prompt 8.1 - Update LoginPage

```bash
gh copilot task prompt \
  "Implement Phase 8a of Advanced Login & Context Architecture (see docs/Advanced-Login-Context-Architecture.md).

Update: frontend/src/modules/auth/pages/LoginPage.tsx

Changes:
1. Remove: onLogin prop from component signature
2. Add imports:
   - import { useAuth } from '../../../core/hooks/useAuth'
   - import { useNavigate } from 'react-router-dom'
3. Inside component, add:
   - const { login, isLoading, error } = useAuth()
   - const navigate = useNavigate()
4. Update login handler:
   - Call: await login(email, password)
   - On success: navigate('/app')
   - On error: show error message from hook
5. Remove: setSession call (hook handles it)
6. Keep: All form validation and styling
7. Match pattern from architecture document"
```

### Prompt 8.2 - Create ForbiddenPage

```bash
gh copilot task prompt \
  "Create: frontend/src/modules/error/pages/ForbiddenPage.tsx

Requirements:
- Display: 'Access Denied'
- Show message: 'You do not have permission to access this page'
- Show user's role using: useAuth().session.roleId
- Button 1: 'Go Home' → navigate to /app/pm
- Button 2: 'Logout' → useAuth().logout() + navigate to /login
- Use existing app styling/theme
- Import: useAuth, useNavigate"
```

---

## Summary: All Commands in Order

```bash
# Phase 1
gh copilot task prompt "Implement Phase 1..."

# Phase 2
gh copilot task prompt "Implement Phase 2a..."
gh copilot task prompt "Implement Phase 2b..."
gh copilot task prompt "Implement Phase 2c..."
gh copilot task prompt "Implement Phase 2d..."

# Phase 3
gh copilot task prompt "Implement Phase 3a..."
gh copilot task prompt "Implement Phase 3b..."
gh copilot task prompt "Implement Phase 3c..."
gh copilot task prompt "Implement Phase 3d..."
gh copilot task prompt "Implement Phase 3e..."

# Phase 4
gh copilot task prompt "Implement Phase 4..."

# Phase 5
gh copilot task prompt "Implement Phase 5a..."
gh copilot task prompt "Implement Phase 5b..."

# Phase 6
gh copilot task prompt "Implement Phase 6a..."
gh copilot task prompt "Implement Phase 6b..."
gh copilot task prompt "Implement Phase 6c..."
gh copilot task prompt "Implement Phase 6d..."

# Phase 7
gh copilot task prompt "Implement Phase 7..."

# Phase 8
gh copilot task prompt "Implement Phase 8a..."
gh copilot task prompt "Implement Phase 8b..."
```

---

## Quick Reference

| Phase | File Count | Prompts | Focus |
|---|---|---|---|
| 1 | 3 | 1.1 | Zustand stores |
| 2 | 3 | 2.1-2.4 | API middleware |
| 3 | 4 | 3.1-3.5 | Hooks layer |
| 4 | 1 | 4.1 | React Router |
| 5 | 2 | 5.1-5.2 | Main app update |
| 6 | 8 | 6.1-6.4 | Component updates |
| 7 | 1 | 7.1 | AppShell |
| 8 | 2 | 8.1-8.2 | Auth pages |
| **Total** | **24** | **16 prompts** | **Complete refactor** |

---

## Tips

1. **One prompt at a time** - Don't run multiple prompts simultaneously
2. **Wait for PR** - Let each prompt complete before next
3. **Test after each phase** - Verify working before moving forward
4. **Review code** - Check generated code matches architecture document
5. **Track progress** - Use `gh copilot task list` to see status

---

## Integration Test After All Phases

```bash
# Test login flow
npm run dev
# Go to http://localhost:5173/login
# Login with credentials
# Verify: session persists on F5 refresh
# Verify: cannot access routes without login
# Verify: cannot access routes without permissions

# Test permissions
# Try to delete PM → should check permission
# Check audit log via network tab
# Verify: Authorization header in API calls

# Test token refresh
# Set token expiry to 5 seconds
# Wait 6 seconds
# Make API call → should auto-refresh
```
