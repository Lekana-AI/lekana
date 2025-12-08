# Authentication Utilities

This directory contains authentication-related utilities for Lekana AI frontend.

## Structure

- **`utils.ts`** - Core authentication functions for Clerk integration
- **`index.ts`** - Exports all utilities for easy imports

## Usage

```typescript
import { fetchWithAuth, getUserId, getUserEmail, hasRole } from '$lib/auth';

// Make authenticated API requests
const response = await fetchWithAuth('https://api.example.com/endpoint', {
  method: 'POST',
  body: JSON.stringify(data)
});

// Get current user information
const userId = getUserId();
const email = getUserEmail();
const isDeveloper = hasRole('developer');
```

## Functions

### `fetchWithAuth(url: string, options?: RequestInit): Promise<Response>`
Makes authenticated HTTP requests with Clerk token automatically attached to headers.

### `getUserId(): string | null`
Returns the current user's Clerk ID.

### `getUserEmail(): string | null`
Returns the current user's primary email address.

### `hasRole(role: string): boolean`
Checks if the current user has a specific role. Currently defaults to 'developer' for all users.
