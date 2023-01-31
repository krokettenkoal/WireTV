import type { RequestHandler } from '@sveltejs/kit'
import { json } from "@sveltejs/kit";
import { find } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
    const column = String(url.searchParams.get('c') ?? 'Name');
    const value = url.searchParams.get('v');
    const match: any = {};

    if(value){
        match[column] = value;
    }

    const results = await find('collections', match);
    
    return json({
        collections: results
    });
}