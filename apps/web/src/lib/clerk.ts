/**
 * Clerk utility functions for API authentication
 */

/**
 * Helper function to make authenticated API requests with Clerk token
 * Usage:
 *   import { fetchWithAuth } from '$lib/clerk';
 *   const response = await fetchWithAuth('http://localhost:4001/validate', { method: 'POST', body: ... });
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    // Import Clerk's useAuth to get the token
    // Note: In svelte-clerk, we use the Clerk object from window
    const Clerk = (window as any).Clerk;

    if (!Clerk) {
        console.warn('Clerk not initialized');
        return fetch(url, options);
    }

    try {
        const token = await Clerk.session?.getToken();

        const headers = new Headers(options.headers);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return fetch(url, {
            ...options,
            headers
        });
    } catch (err) {
        console.error('Error getting Clerk token:', err);
        return fetch(url, options);
    }
}

/**
 * Get the current user's ID from Clerk
 */
export function getUserId(): string | null {
    const Clerk = (window as any).Clerk;
    return Clerk?.user?.id || null;
}

/**
 * Get the current user's email from Clerk
 */
export function getUserEmail(): string | null {
    const Clerk = (window as any).Clerk;
    return Clerk?.user?.primaryEmailAddress?.emailAddress || null;
}

/**
 * Check if user has a specific role (for future role-based access)
 * Default: all users are 'developer'
 */
export function hasRole(role: string): boolean {
    // For now, all users are developers
    // In the future, you can add role metadata in Clerk Dashboard
    return role === 'developer';
}
