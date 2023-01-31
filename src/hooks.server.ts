import { findOne } from '$lib/db';
import type { Handle } from '@sveltejs/kit';
import cookie from 'cookie';
import { connection } from '$lib/db';

export const handle: Handle = async ({event, resolve}) => {
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    const pid = Number(cookies['profile']);

    if(!event.locals.db){
        try {
            const db = await connection;
            event.locals.db = db;
        }
        catch(err: any){
            console.error('Could not connect to database!');
            console.error(err);
        }
    }

    try {
        if(pid && pid >= 0){
            const profile = await findOne('profiles', {
                ProfileId: pid
            });
    
            if(profile){
                event.locals.profile = {
                    id: profile.ProfileId,
                    name: profile.Name,
                    avatar: profile.Avatar
                };
            }   
        }
    }
    catch(err: any){
        console.error('Loading profile failed!')
        console.error(err);
    }

    const response = await resolve(event);
    return response;
}