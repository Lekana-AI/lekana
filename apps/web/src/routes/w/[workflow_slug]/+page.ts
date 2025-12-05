import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const slug = params.workflow_slug;
	if (!slug) throw error(400, 'Missing workflow slug');

	return {
		slug
	};
};
