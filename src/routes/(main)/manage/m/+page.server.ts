import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { findOne, insert, update } from "$lib/db";
import { redirect, error } from "@sveltejs/kit";
import { TimeSpan } from "$lib/timespan";

const COLUMNS: Array<string> = [
    'Title',
    'Name',
    'Description',
    'Year',
    'Duration',
    'Stream',
    'Thumbnail',
    'Hero',
    'Captions',
    'LogoId',
    'Secret',
];

export const load: PageServerLoad = async ({ url }) => {
    const id = Number(url.searchParams.get('id'));

    const EMPTY: any = {
        movie: {
            id: -1,
            title: '',
            name: '',
            description: '',
            year: 0,
            duration: TimeSpan.zero.json,
            stream: '',
            thumbnail: '',
            hero: '',
            captions: '',
            logo: null,
            secret: false
        },
        update: false
    }

    if(!id){
        return EMPTY;
    }

    const m = await findOne('v_movies', { MovieId: id });

    if(!m){
        return EMPTY;
    }

    return {
        movie: {
            id: m.MovieId,
            title: m.Title,
            name: m.Name,
            description: m.Description,
            year: m.Year,
            duration: TimeSpan.fromSeconds(m.Duration).json,
            stream: m.Stream,
            thumbnail: m.Thumbnail,
            hero: m.Hero,
            captions: m.Captions,
            logo: m.LogoId,
            secret: m.Secret
        },
        update: true
    }

}

export const actions: Actions = {
    
    add: async ({ request }) => {
        const formData = await request.formData();
        const data: any = {}

        try {

            for(const column of COLUMNS){
                if(column == 'Secret'){
                    data[column] = formData.get(column) == 'on' ? 1 : 0;
                }
                else {
                    const v = formData.get(column) || null;
    
                    if(column.toLowerCase() == 'duration' && !!v && v.constructor == String)
                        data[column] = TimeSpan.fromLocale(v).totalSeconds;
                    else
                        data[column] = v;
                }
            }
    
            await insert('movies', data);
        }
        catch(err: any){
            console.error(err);
            throw error(400, err);
        }

        throw redirect(302, '/movies/' + data.Name);
    },

    update: async({request}) => {
        const formData = await request.formData();
        const data: any = { MovieId: formData.get('MovieId') }

        try {

            for(const column of COLUMNS){
                if(column == 'Secret'){
                    data[column] = formData.get(column) == 'on' ? 1 : 0;
                }
                else {
                    const v = formData.get(column) || null;
    
                    if(column.toLowerCase() == 'duration' && !!v && v.constructor == String)
                        data[column] = TimeSpan.fromLocale(v).totalSeconds;
                    else
                        data[column] = v;
                }
            }
    
            await update('movies', data, { MovieId: data.MovieId });
        }
        catch(err: any){
            console.error(err);
            throw error(400, err);
        }

        throw redirect(302, '/manage/m?id=' + data.MovieId);
    }
}