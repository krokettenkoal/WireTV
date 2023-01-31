import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { find, insert } from '$lib/db';

export const GET: RequestHandler = async () => {
    const profiles = await find('profiles');
    
    return json({
        profiles: profiles
    });
};

export const POST: RequestHandler = async ({ request }) => {
    const { name, avatar } = await request.json();

    if(!name)
        throw error(400, new ReferenceError('Cannot create a profile without a name.'));

    const data: any = {
        Name: name
    };

    if(avatar)
        data.Avatar = avatar;

    try {
        const result = await insert('profiles', data);
        data.ProfileId = result.insertId;

        return json(data);
    }
    catch(err: any){
        throw error(500, err);
    }
}