import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { findOne, insert, update } from "$lib/db";
import { redirect, error } from "@sveltejs/kit";

const COLUMNS: Array<string> = [
    'Title',
    'FilePath',
    'Secret'
];

export const load: PageServerLoad = async ({ url }) => {
    const id = Number(url.searchParams.get('id'));

    const EMPTY: any = {
        logo: {
            id: -1,
            title: '',
            filepath: '',
            secret: false
        },
        update: false
    }

    if(!id){
        return EMPTY;
    }

    const l = await findOne('logos', { LogoId: id });

    if(!l){
        return EMPTY;
    }

    return {
        logo: {
            id: l.LogoId,
            title: l.Title,
            filepath: l.FilePath,
            secret: l.Secret,
            url: '/media/l/' + l.LogoId
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
                    data[column] = v;
                }
            }
    
            await insert('logos', data);
        }
        catch(err: any){
            console.error(err);
            throw error(400, err);
        }

        throw redirect(302, '/manage');
    },

    update: async({request}) => {
        const formData = await request.formData();
        const data: any = { LogoId: formData.get('LogoId') }

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
    
            await update('logos', data, { LogoId: data.LogoId });
        }
        catch(err: any){
            console.error(err);
            throw error(400, err);
        }

        throw redirect(302, '/manage/l?id=' + data.LogoId);
    }
}