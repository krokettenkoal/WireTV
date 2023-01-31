import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    if(!locals.profile || locals.profile.id < 0)
        throw redirect(302, '/profile');

    return {
        profile: locals.profile
    };
};