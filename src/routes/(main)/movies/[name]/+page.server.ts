import type { PageServerLoad } from './$types';
import { find, findOne } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { TimeSpan } from '$lib/timespan';

export const load: PageServerLoad = async ({ params, locals }) => {
    const name = params.name;
    const profileId = locals.profile.id;

    if(profileId == null)
        throw redirect(302, '/profile');

    let m: any = await findOne('v_moviehistory', {
        Name: name,
        ProfileId: profileId
    });

    if(!m){
        m = await findOne('v_movies', {
            Name: name
        });
    }

    if(!m)
        throw redirect(301, '/movies');

    const r = await rating(m.MovieId);

    const mediaBaseUrl = `/media/m/${m.Name}/`;

    return {
        id: m.MovieId,
        name: m.Name,
        title: m.Title,
        description: m.Description,
        year: m.Year,
        duration: TimeSpan.fromSeconds(m.Duration).json,
        rating: r,
        timecode: m.Timecode,
        progress: m.Timecode / m.Duration,
        logo: m.LogoId,
        thumbnail: mediaBaseUrl + 'thumbnail',
        hero: m.Hero ? (mediaBaseUrl + 'hero') : undefined,
        stream: mediaBaseUrl + 'stream',
        captions: mediaBaseUrl + 'captions',
        watch: `/watch/m/${m.Name}`
    };
};

let rating = async (id: number) => {
    const ratings = await find('movieratings', { MovieId: id });
    
    if(ratings.length == 0)
        return {
            avg: 0,
            count: 0
        };
    
    return {
        avg: ratings.map((r: any) => r.Rating)
            .reduce((prev: number, curr: number) => prev + curr) 
            / ratings.length,
        count: ratings.length
    }
}