import type { PageServerLoad } from './$types';
import { find } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
    if(!locals.profile)
        throw redirect(302, '/profile');

    const secret = url.searchParams.has('secret') ? 1 : 0;
    
    const collections: any = await find('v_collections', {Secret: secret}, {limit: 10, orderBy: 'DateAdded', desc: true});
    for(const c of collections){
        c.movies = await find('v_moviesincollections', { CollectionId: c.CollectionId }, {orderBy: 'DateAdded'});
    }

    return {
        collections: collections.map((c: any) => {
            return {
                id: c.CollectionId,
                name: c.Name,
                title: c.Title,
                description: c.Description,
                thumbnail: `/media/c/${c.Name}/thumbnail`,
                cover: c.Cover ? `/media/c/${c.Name}/cover` : undefined,
                hero: c.Hero ? `/media/c/${c.Name}/hero` : undefined,
                secret: c.Secret,
                logo: c.LogoId ? `/media/l/${c.LogoId}` : undefined,
                movies: c.movies.map((m: any) => {
                    return {
                        id: m.MovieId,
                        name: m.Name,
                        title: m.Title,
                        description: m.Description,
                        thumbnail: `/media/m/${m.Name}/thumbnail`,
                        watch: '/watch/m/' + m.Name
                    }
                })
            }
        })
    };
};