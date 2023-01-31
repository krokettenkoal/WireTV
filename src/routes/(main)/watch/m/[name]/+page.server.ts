import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { findOne } from '$lib/db';

export const load: PageServerLoad = async ({ params, url }) => {
    if(!params.name)
        throw error(400, "Movie name not specified");

    const match = { Name: params.name };
    const movie = await findOne('movies', match);
    const mediaUrl = `/media/m/${movie.Name}`
    const stream = `${mediaUrl}/stream`;
    const captions = `${mediaUrl}/captions`;
    const thumbnail = `${mediaUrl}/thumbnail`;
    const download = `${mediaUrl}/download`;
    const details = `/movies/${movie.Name}`;

    return {
        id: movie.MovieId,
        name: movie.Name,
        title: movie.Title,
        stream: stream,
        captions: captions,
        thumbnail: thumbnail,
        download: download,
        details: details,
        startTime: Number(url.searchParams.get('t')) ?? 0
    };
};