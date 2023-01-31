import type { PageServerLoad } from './$types';
import { find } from '$lib/db';

export const load: PageServerLoad = async ({ url }) => {
    const secret = url.searchParams.has('secret') ? 1 : 0;

    const match = {Secret: secret};

    const movies = await find('movies', match, { orderBy: 'DateAdded', desc: true });
    const logos = await find('logos', match, { orderBy: 'Title' });
    const collections = await find('collections', match, { orderBy: 'DateAdded', desc: true });

    return {
        movies: movies.map((m: any) => {
            return {
                id: m.MovieId,
                name: m.Name,
                title: m.Title,
                logo: m.LogoId,
                thumbnail: `/media/m/${m.Name}/thumbnail`,
                edit: '/manage/m?id=' + m.MovieId,
                details: '/movies/' + m.Name
            }
        }),
        logos: logos.map((l: any) => {
            return {
                id: l.LogoId,
                title: l.Title,
                url: '/media/l/' + l.LogoId,
                edit: '/manage/l?id=' + l.LogoId,
            }
        }),
        collections: collections.map((c: any) => {
            return {
                id: c.CollectionId,
                name: c.Name,
                title: c.Title,
                description: c.Description,
                logo: c.LogoId ? `/media/l/${c.LogoId}` : undefined,
                thumbnail: `/media/c/${c.Name}/thumbnail`,
                edit: '/manage/c?id=' + c.CollectionId,
                details: '/collections/' + c.Name
            }
        })
    };
};