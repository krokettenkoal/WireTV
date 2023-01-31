import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { find } from '$lib/db';

export const load: PageServerLoad = async () => {
    const profiles = await find('profiles');

    if(profiles.length == 0)
        throw redirect(302, '/profile/create');

    return {
        profiles: profiles.map((p: any) => {
            return {
                id: p.ProfileId,
                name: p.Name,
                avatar: p.Avatar
            }
        })
    };
};