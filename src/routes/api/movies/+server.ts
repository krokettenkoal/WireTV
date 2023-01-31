import type { RequestHandler } from '@sveltejs/kit'
import { json } from "@sveltejs/kit";
import { find } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
    const secret = url.searchParams.has('secret') ? 1 : 0;
    const column = String(url.searchParams.get('c') ?? 'Name');
    const value = url.searchParams.get('v');
    const match: any = {Secret: secret};

    if(value){
        match[column] = value;
    }

    const results = await find('movies', match);
    
    return json({
        movies: results
    });
}