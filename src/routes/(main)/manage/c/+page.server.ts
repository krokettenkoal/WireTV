import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { find, findOne, insert, remove, update } from "$lib/db";
import { redirect, error } from "@sveltejs/kit";

const COLUMNS: Array<string> = [
    'Name',
    'Title',
    'Description',
    'Thumbnail',
    'Hero',
    'Secret',
    'LogoId'
];

export const load: PageServerLoad = async ({ url }) => {
    const id = Number(url.searchParams.get('id'));

    const EMPTY: any = {
        collection: {
            id: -1,
            name: '',
            title: '',
            description: '',
            thumbnail: '',
            hero: '',
            logo: null
        },
        entries: [],
        update: false
    }

    if(!id){
        return EMPTY;
    }

    const c = await findOne('collections', { CollectionId: id });

    if(!c){
        return EMPTY;
    }

    const entries = await find('v_moviesincollections', { CollectionId: id });

    return {
        collection: {
            id: c.CollectionId,
            name: c.Name,
            title: c.Title,
            description: c.Description,
            thumbnail: c.Thumbnail,
            hero: c.Hero,
            secret: c.Secret,
            logo: c.LogoId
        },
        entries: (entries ?? []).map((e: any) => {
            return {
                MovieId: e.MovieId,
                Title: e.Title,
                Name: e.Name,
            }
        }),
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
                    data[column] = v;
                }
            }
    
            const coll = await insert('collections', data);

            let proms: Array<Promise<void>> = new Array<Promise<void>>(); 
            const entries: Array<number> = String(formData.get('Entries')).split(',').map(s => Number(s));
            for(const entry of entries){
                if(!entry)
                    continue;
                
                const data = {
                    CollectionId: coll.insertId,
                    MovieId: entry
                };

                proms.push(insert('moviesincollections', data));
                
            }

            await Promise.all(proms);
            
        }
        catch(err: any){
            console.error(err);
            throw error(400, err);
        }
        
        throw redirect(302, '/manage');
    },

    update: async({request}) => {
        const formData = await request.formData();
        const collId: number = Number(formData.get('CollectionId'));
        const data: any = {}

        try {

            await remove('moviesincollections', { CollectionId: collId });
            
            let proms: Array<Promise<void>> = new Array<Promise<void>>(); 
            const entries: Array<number> = String(formData.get('Entries')).split(',').map(s => Number(s));
            for(const entry of entries){
                if(!entry)
                    continue;
                
                const data = {
                    CollectionId: collId,
                    MovieId: entry
                };

                proms.push(insert('moviesincollections', data));
            }

            for(const column of COLUMNS){
                if(column == 'Secret'){
                    data[column] = formData.get(column) == 'on' ? 1 : 0;
                }
                else {
                    const v = formData.get(column) || null;
                    data[column] = v;
                }
            }
    
            proms.push(update('collections', data, { CollectionId: collId }));
            await Promise.all(proms);
            
        }
        catch(err: any){
            console.error('Could not update collection ' + collId);
            console.error(err);
            throw error(400, err);
        }
        
        throw redirect(302, '/manage/c?id=' + collId);
    }
}