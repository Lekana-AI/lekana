// +page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { clerkClient } from 'svelte-clerk/server';

export const load: PageServerLoad = async ({ locals, params, fetch }) => {
    // auth
    const { userId } = locals.auth();
    if (!userId) {
        throw redirect(307, '/login');
    }

    const slug = params.workflow_slug;
    if (!slug) {
        throw error(400, 'Missing workflow slug');
    }

    const user = await clerkClient.users.getUser(userId);

    const res = await fetch(`/api/workflows/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        throw error(400, 'Workflow not found');
    }

    const workflow = await res.json();


    return {
        user: JSON.parse(JSON.stringify(user)),
        workflow
    };
};
