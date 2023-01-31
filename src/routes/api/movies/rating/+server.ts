import { type RequestHandler, json, error } from "@sveltejs/kit";
import { find, findOne, insert, update } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
    const column = String(url.searchParams.get('c') ?? 'MovieId');
    const value = url.searchParams.get('v');
    const match: any = {};

    if(value){
        match[column] = value;
    }

    const results = await find('movieratings', match);
    const count = results.length;
    const avg = results.length > 0 ? results.map((r: any) => r.Rating).reduce((prev: number, curr: number) => prev + curr) / count : 0;

    return json({
        avg: avg,
        count: count
    });
}

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
    const { movieId, rating } = await request.json();
    const profileId: number | null | undefined = locals.profile?.id ?? Number(cookies.get('profile'));

    if(!profileId || profileId < 0 || !movieId || !rating)
        throw error(400, new ReferenceError('Incomplete request!'));

    const data = {
        ProfileId: profileId,
        MovieId: movieId,
        Rating: rating
    };

    const match = {
        ProfileId: profileId,
        MovieId: movieId
    };

    try {

        let result: any;
        const existing = await findOne('movieratings', match);

        if(existing)
            result = await update('movieratings', {Rating: rating}, match);
        
        else
            result = await insert('movieratings', data);
        
        return json(result);
    }
    catch(err: any){
        throw error(500, err);
    }
}