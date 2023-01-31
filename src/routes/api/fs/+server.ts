import type { RequestHandler } from './$types';
import { readdir, stat } from 'fs/promises';
import { json, error } from '@sveltejs/kit';
import { normalize, join, resolve } from 'path';

export const GET: RequestHandler = async ({ url }) => {
    const dir = String(url.searchParams.get('dir') ?? '/');

    try {
        const stats = await stat(dir);

        if(!stats.isDirectory())
            throw error(400, dir + ' is not a folder!');
        
        const children = await readdir(dir, { withFileTypes: true });
        const cdata = children.map(c => {
            const p = normalize(join(dir, c.name));
            return {
                name: c.name,
                path: p,
                isFile: c.isFile()
            }
        });
    
        return json({
            directory: dir,
            parent: resolve(join(dir, '..')),
            children: cdata
        });
    }
    catch(err){
        //  Path does not exist
        return json({
            skip: true
        })
    }

};