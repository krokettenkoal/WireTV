<script lang="ts">
	import type { PageData } from './$types';
    import { formatName } from '$lib/utils';
    import PlusLg from 'svelte-bootstrap-icons/lib/PlusLg.svelte';
    import CollectionFill from 'svelte-bootstrap-icons/lib/CollectionFill.svelte';
    import Image from 'svelte-bootstrap-icons/lib/Image.svelte';
    import FilePicker from '$components/FilePicker.svelte';
    import BackButton from '$components/BackButton.svelte';
	import MoviePicker from '$components/MoviePicker.svelte';
    import LogoPicker from '$components/LogoPicker.svelte';

    export let data: PageData;
    
    $: name = formatName(data.collection.title);
    $: s_entries = serializeEntries(data.entries);

    let fp_field: string | undefined;
    let mp_active: boolean = false;
    let lp_active: boolean = false;

    const fp_submit = ({file, field}: any): void => {
        if(file && field)
            data.collection[field] = file;

        fp_field = undefined;
    }

    const fp_cancel = (): void => {
        fp_field = undefined;
    }

    const mp_submit = ({movie}: any): void => {
        addEntry(movie);
        mp_active = false;
    }

    const mp_cancel = (): void => {
        mp_active = false;
    }

    const serializeEntries = (entries: any): string => {
        return entries.map((e: any) => String(e.MovieId)).join(',');
    }

    const addEntry = (entry: any): void => {
        const idx = data.entries.findIndex((e: any) => e.MovieId == entry.MovieId);
        if(idx < 0){
            data.entries = [...data.entries, entry];
        }
    }

    const removeEntry = (entry: any): void => {
        const idx = data.entries.findIndex((e: any) => e.MovieId == entry.MovieId);
        if(idx >= 0){
            data.entries.splice(idx, 1);
            data.entries = data.entries;
        }
    }

    const lp_submit = ({logo}: any): void => {
        if(logo?.LogoId)
            data.collection.logo = logo.LogoId;

        lp_active = false;
    }

    const lp_cancel = (): void => {
        lp_active = false
    };

    const clearLogo = (): void => {
        data.collection.logo = null;
    }

</script>

<svelte:head>
    <title>{data.collection.title || 'New collection'} | WireTV</title>
</svelte:head>

<BackButton position="sticky" target="/manage" />

<h1>
    {data.collection.title || 'New collection'}
</h1>

{#if data.collection.url}
    <div 
        style="background-image:url({data.collection.url})" 
        class="logo"
        title={data.title}></div>
{/if}

<form method="POST" action="?/{data.update ? 'update' : 'add'}">
    <input type="hidden" id="id" name="CollectionId" value={data.collection.id}>
    <input type="hidden" id="name" name="Name" value={name}>
    <input type="hidden" id="entries" name="Entries" bind:value={s_entries}>
    <input type="hidden" id="logo" name="LogoId" value={data.collection.logo}>

    <fieldset>
        <legend>General</legend>

        <div class="input-group">
            <label for="title" data-required>Title</label>
            <input type="text" id="title" name="Title" bind:value={data.collection.title} placeholder="Asterix, Star Wars, Marvel, .." required>
        </div>
        <div class="input-group">
            <label for="description">Description</label>
            <textarea 
            rows="7" 
            id="description" 
            name="Description" 
            contenteditable="true" 
            placeholder="Ganz Gallien ist von Cäsar besetzt... Ganz Gallien? Nein, ein kleines Dorf leistet nach wie vor den Römern heftigen Widerstand...">{data.collection.description}</textarea>
        </div>
        <div class="input-group">
            <label for="logo">Logo</label>
            {#if data.collection.logo}
            <div class="logo"
                title="Remove logo"
                on:click={clearLogo}>
                <img src="/media/l/{data.collection.logo}"
                    alt="Remove logo"
                    width="200" />
            </div>
            {:else}
                <button type="button"
                    class="btn-logo"
                    on:click={() => lp_active = true}>
                    
                    <span class="icon">
                        <Image />
                    </span>
                    Select logo
                </button>
            {/if}
        </div>
        <div class="input-group">
            <p class="label">Secret</p>
            <input class="toggle" type="checkbox" id="secret" name="Secret" bind:checked={data.collection.secret}>
            <label for="secret">Secret</label>
        </div>

    </fieldset>

    <fieldset>
        <legend>Files</legend>

        <div class="input-group">
            <label for="thumbnail" data-tooltip="Image file" data-required>Thumbnail</label>
            <input type="text" 
                id="thumbnail" 
                name="Thumbnail" 
                class="filepicker"
                value={data.collection.thumbnail} 
                on:focus="{() => fp_field = 'thumbnail'}"
                required>
        </div>
        <div class="input-group">
            <label for="hero" data-tooltip="Image file">Hero</label>
            <input type="text" 
                id="hero" 
                name="Hero" 
                class="filepicker"
                value={data.collection.hero} 
                on:focus="{() => fp_field = 'hero'}"
                required>
        </div>

    </fieldset>

    <fieldset>
        <legend>Entries</legend>

        <button type="button"
            on:click={() => mp_active = true}>
            <span class="icon">
                <PlusLg />
            </span>
            Add movie/series
        </button>

        {#if data.entries.length == 0}
            <p class="label">Collection is empty!</p>
        {:else}
            <ul class="entries">
                {#each data.entries as entry}
                    <li title="Remove from collection"
                    on:click={()=>removeEntry(entry)}>
                        <div class="thumb"
                        style="background-image:url(/media/m/{entry.Name}/thumbnail)" 
                        alt="{entry.Title}"
                        height="150"></div>
                        <p>
                            {entry.Title}
                        </p>
                    </li>
                {/each}
            </ul>
        {/if}

    </fieldset>

    <button type="submit">
        <span class="icon">
            <CollectionFill />
        </span>
        Save
    </button>

</form>

<FilePicker root={'//mediakoal/mediakoal'} 
    field={fp_field}
    active={!!fp_field}
    onSubmit={fp_submit}
    onCancel={fp_cancel} />

<MoviePicker field="movies"
    active={mp_active}
    onSubmit={mp_submit}
    onCancel={mp_cancel}
    secret={data.collection.secret}
    exclude={data.entries} />

<LogoPicker
    field={'LogoId'}
    active={lp_active}
    onSubmit={lp_submit}
    onCancel={lp_cancel}
    secret={data.collection.secret} />

<style>
    form {
        min-width: 600px;
        max-width: 95%;
    }

    input.filepicker {
        cursor: pointer;
    }

    .logo {
        width: 400px;
        height: 100px;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
    }

    button[type="button"] {
        padding: 1rem 3rem;
        font-weight: bold;
    }

    .entries {
        list-style: none;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .entries li {
        position: relative;
        cursor: pointer;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        margin-right: 2rem;
    }

    .entries li .thumb {
        width: 16rem;
        height: 9rem;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        border-radius: .5rem;
        transition: transform 300ms ease;
    }

    .entries li:hover .thumb {
        position: relative;
        transform: scale(.95);
    }

    .entries li .thumb::after {
        content: '';
        opacity: 0;
        top: calc(50% - .9rem);
        left: 0;
        right: 0;
        text-shadow: 2px 2px 10px black;
        font-size: 1.5rem;
        transform: scale(0);
        transition: opacity 200ms linear, transform 300ms ease;
    }

    .entries li:hover .thumb::after {
        content: '✖';
        position: absolute;
        text-align: center;
        opacity: 1;
        transform: scale(1);
    }

    .entries li p {
        font-size: .8rem;
    }

    .logo {
        position: relative;
        align-self: center;
        cursor: pointer;
    }
    
    .logo img {
        transition: all 300ms ease;
    }

    .logo:hover img {
        transform: scale(.9);
        filter: brightness(.6);
    }

    .logo::after {
        content: '';
        opacity: 0;
        transform: scale(0);
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        text-shadow: 2px 2px 10px black;
        transition: opacity 300ms linear, transform 200ms ease;
    }

    .logo:hover::after {
        content: '✖';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        font-size: 2rem;
        opacity: 1;
        transform: scale(1);
    }

    .btn-logo {
        padding: 1rem;
    }


    @media screen and (max-width: 600px) {
        .logo {
            width: 90vw;
        }
    }
</style>