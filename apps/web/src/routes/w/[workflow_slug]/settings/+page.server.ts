import { redirect } from '@sveltejs/kit';
import { clerkClient } from 'svelte-clerk/server';

export const load = async ({ locals }) => {
    const { userId } = locals.auth();

    // Protect the route by checking if the user is signed in
    if (!userId) {
        return redirect(307, '/login');
    }

    // Get the user's full `Backend User` object
    const user = await clerkClient.users.getUser(userId);

    return {
        user: JSON.parse(JSON.stringify(user))
    };
};