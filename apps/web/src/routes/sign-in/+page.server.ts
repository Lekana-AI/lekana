import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const { isAuthenticated } = await locals.auth();
    if (isAuthenticated) {
        throw redirect(302, '/dashboard');
    }
};
