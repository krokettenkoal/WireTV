import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { findOne, update } from '$lib/db';

export const GET: RequestHandler = async ({ params }) => {
    const match = {
        ProfileId: params.pid
    };
    const profile = await findOne('profiles', match);
    
    return json(profile);
};

export const POST: RequestHandler = async ({ request }) => {
    const { id, name, avatar } = await request.json();

    if(!id)
        throw error(400, new ReferenceError('Cannot update a profile without an id.'));

    const match: any = { ProfileId: id };
    const data: any = {};

    if(name)
        data.Name = name;

    if(avatar)
        data.Avatar = avatar;

    try {
        await update('profiles', data, match);
        
        return json(true);
    }
    catch(err: any){
        throw error(500, err);
    }
}