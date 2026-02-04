// +page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const userId = params.userId;
    if (!userId) {
        throw redirect(302, '/');
    }
    try {
        const res = await fetch(`/enterprise/api/users/${userId}`);
        if (res.ok) {
            const data = await res.json();
            // console.log(data);
            let submitted = (data.createdAt == data.updatedAt ? false : true);

            return {
                userId,
                user: data,
                submitted
            };
        }

        console.error('Failed to fetch enterprise', await res.text());
    } catch (err) {
        console.error('Error loading enterprise', err);
    }

    throw error(404, 'Page not found');

};