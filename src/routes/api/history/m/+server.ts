import { find, findOne, insert, update } from '$lib/db';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ( {url} ) => {
    const match: any = {};

    if(url.searchParams.has('id'))
        match.HistoryId = Number(url.searchParams.get('id'));

    if(url.searchParams.has('movie'))
        match.MovieId = Number(url.searchParams.get('movie'));
    
    if(url.searchParams.has('profile'))
        match.ProfileId = Number(url.searchParams.get('profile'));


    const results = await find('v_moviehistory', match);
    return json(results);
};

export const POST: RequestHandler = async ({request, locals}) => {
    const profileId = locals.profile?.id;

    if(profileId == null)
        throw error(400, 'Cannot save history without a selected profile!');

    const { movieId, timecode } = await request.json();

    if(movieId == null || timecode == null)
        throw error(400, 'Cannot save history without a movie id or timecode!');

    const match = {
        ProfileId: profileId,
        MovieId: movieId
    };

    let result: any;
    let data: any;

    try {
        const existing = await findOne('moviehistory', match);
    
        if(existing){
            data = {
                Timecode: timecode
            };
    
            result = await update('moviehistory', data, { HistoryId: existing.HistoryId });
        }
        else {
            data = {
                ProfileId: profileId,
                MovieId: movieId,
                Timecode: timecode
            };
        
            result = await insert('moviehistory', data);
        }
    
        return json(result);
    }
    catch(err: any){
        console.error('Could not save movie history!');
        console.error(err);
        throw error(500, err);
    }
}