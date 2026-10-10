import type { PageServerLoad } from './$types';
import apiDocs from '$lib/data/api-docs.json';

export const load: PageServerLoad = async () => {
    return {
        apiDocs
    };
};
