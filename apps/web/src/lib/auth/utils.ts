/**
 * Clerk utility functions for API authentication
 */

/**
 * Helper function to make authenticated API requests with Clerk token
 * Usage:
 *   import { fetchWithAuth } from '$lib/auth';
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

export function getUser(): string | null {
    const Clerk = (window as any).Clerk;
    return Clerk?.user || null;
}