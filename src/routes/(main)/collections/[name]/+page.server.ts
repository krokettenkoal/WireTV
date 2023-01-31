import { find, findOne } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const collection = await findOne('v_collections', { Name: params.name });
    const movies = await find('v_moviesincollections', { CollName: params.name }, { orderBy: 'DateAdded' });

    return {
        collection: {
            id: collection.CollectionId,
            name: collection.Name,
            title: collection.Title,
            description: collection.Description,
            thumbnail: `/media/c/${collection.Name}/thumbnail`,
            hero: collection.Hero ? `/media/c/${collection.Name}/hero` : undefined,
            logo: collection.LogoId ? ('/media/l/' + collection.LogoId) : undefined,

        },
        movies: movies.map((m: any) => {
            return {
                id: m.MovieId,
                name: m.Name,
                title: m.Title,
                thumbnail: `/media/m/${m.Name}/thumbnail`,
                hero: m.Hero ? `/media/m/${m.Name}/hero` : undefined,
                details: '/movies/' + m.Name,
                watch: '/watch/m/' + m.Name
            }
        })
    };
};