import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { readFile, stat } from 'fs/promises';
import { findOne } from '$lib/db';

export const GET: RequestHandler = async ({ params }) => {
    const mediaType = params.media[0].toUpperCase() + params.media.substring(1);

    const c = await findOne('collections', {
        Name: params.name
    });

    if(!c || !c[mediaType]){
        throw error(404, 'Collection/media not found!');
    }

    try {
        await stat(c[mediaType]);
    }
    catch(err: any){
        throw error(404, `File ${c[mediaType]} not found!`);
    }

    //  Load whole file and return contents
    const buffer = await readFile(c[mediaType]);
    return new Response(buffer);
    
};