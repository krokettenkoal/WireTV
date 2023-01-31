import type { RequestHandler } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { open, readFile, stat } from 'fs/promises';
import { findOne } from '$lib/db';
import type {ReadStream} from 'fs';

const knownMedia = [
    'thumbnail',
    'hero',
    'stream',
    'captions',
    'download',
    'logo'
];

const CHUNK_SIZE = 10 ** 6; //  Chunk size: 10^6 bytes == 1MB

const readable = async (reader: ReadStream): Promise<{}> => {
    return new Promise(resolve => reader.on('readable', resolve));
}

const readBytes = async (reader: ReadStream, num: number = -1): Promise<Buffer> => {
    let buffer = num < 0 ? reader.read() : reader.read(num);
        
    if (buffer) 
        return new Promise<Buffer>(resolve => resolve(buffer));
    
    else {
        return new Promise<Buffer>(async resolve => {
            await readable(reader);
            const bytes = await readBytes(reader, num);
            resolve(bytes);
        });
    }
}

export const GET: RequestHandler = async ({ params, request }) => {
    if(!knownMedia.includes(params.media.toLowerCase()))
        throw error(403, 'Unknown media type: ' + params.media);
    
    const name = params.name;
    let mediaType = params.media[0].toUpperCase() + params.media.substring(1);
    
    const m = await findOne('v_movies', {
        Name: name
    });

    if(!m || !m[mediaType]){
        if(mediaType.toLowerCase() == 'captions'){
            throw redirect(302, '/captions.vtt');
        }

        throw error(404, 'Movie/media not found!');
    }

    if(mediaType.toLowerCase() == 'stream'){
        const range = request.headers.get('range');

        if(!range)
            throw error(400, "Stream requires Range header");

        const mediaStat = await stat(m[mediaType]);
        const mediaSize = mediaStat.size;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, mediaSize - 1);
        const contentLength = end - start + 1;
        const file = await open(m[mediaType]);
        const stream = file.createReadStream({
            start: start,
            end: end
        });

        let data: Buffer = await readBytes(stream, contentLength);
        stream.close();
        
        const headers: any = {
            "Content-Range": `bytes ${start}-${end}/${mediaSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4"
        };

        return new Response(data, {
            status: 206,
            headers: headers
        });
    }
    else {
        if(mediaType.toLowerCase() == 'download')
            mediaType = 'Stream';
        
        //  Load whole file and return contents
        const buffer = await readFile(m[mediaType]);
        return new Response(buffer);
    }
};