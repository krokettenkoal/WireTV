import { find } from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({url}) => {
    const opts: any = {};

    if(url.searchParams.has('orderby')){
        opts.orderBy = url.searchParams.get('orderby')
    }

    const secret = url.searchParams.has('secret') ? 1 : 0;

    const logos = await find('logos', { Secret: secret }, opts);
    return json(logos);
};