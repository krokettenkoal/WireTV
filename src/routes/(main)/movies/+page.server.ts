import type { PageServerLoad } from './$types';
import { find } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
    if(!locals.profile)
        throw redirect(302, '/profile');

    const secret = url.searchParams.has('secret') ? 1 : 0;
    
    const movies = await find('movies', {Secret: secret}, {limit: 50});
    const recentlyWatched = await find('v_moviehistory', { ProfileId: locals.profile.id, Secret: secret }, {
        orderBy: 'DateWatched',
        desc: true
    });
    const recentlyAdded = await find('movies', {Secret: secret}, {
        limit: 10,
        orderBy: "DateAdded",
        desc: true
    });

    const continueWatching = recentlyWatched.filter((m: any) => m.Timecode < m.Duration * .9);
    const watchAgain = recentlyWatched.filter((m: any) => m.Timecode >= m.Duration * .9);
    
    return {
        watchAgain: watchAgain.map((m: any) => {
            return {
                id: m.MovieId,
                name: m.Name,
                title: m.Title,
                description: m.Description,
                thumbnail: `/media/m/${m.Name}/thumbnail`,
                watch: '/watch/m/' + m.Name,
                timecode: m.Timecode,
                progress: m.Timecode / m.Duration
            }
        }),
        recentlyAdded: recentlyAdded.map((m: any) => {
            return {
                id: m.MovieId,
                name: m.Name,
                title: m.Title,
                description: m.Description,
                thumbnail: `/media/m/${m.Name}/thumbnail`,
                watch: '/watch/m/' + m.Name
            }
        }),
        continueWatching: continueWatching.map((m: any) => {
            return {
                id: m.MovieId,
                name: m.Name,
                title: m.Title,
                description: m.Description,
                thumbnail: `/media/m/${m.Name}/thumbnail`,
                watch: '/watch/m/' + m.Name,
                timecode: m.Timecode,
                progress: m.Timecode / m.Duration
            }
        }),
        movies: movies.map((m: any) => {
            return {
                id: m.MovieId,
                name: m.Name,
                title: m.Title,
                description: m.Description,
                thumbnail: `/media/m/${m.Name}/thumbnail`,
                watch: '/watch/m/' + m.Name
            }
        })
    };
};