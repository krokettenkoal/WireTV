import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { findOne } from '$lib/db';

export const GET: RequestHandler = async ({ params, request }) => {
    const l = await findOne('logos', {
        LogoId: params.id
    });

    if(!l){
        throw error(404, 'Logo not found!');
    }

    //  Load whole file and return contents
    const buffer = await readFile(l.FilePath);
    return new Response(buffer);
    
};