<script lang="ts">
	import type { PageData } from './$types';
    import Film from 'svelte-bootstrap-icons/lib/Film.svelte';
    import Image from 'svelte-bootstrap-icons/lib/Image.svelte';
    import FilePicker from '$components/FilePicker.svelte';
	import LogoPicker from '$components/LogoPicker.svelte';
	import BackButton from '$components/BackButton.svelte';
    import { formatName } from '$lib/utils';

    export let data: PageData;

    $: name = formatName(data.movie.title);

    let fp_field: string | undefined;
    let lp_active: boolean = false;

    const fp_submit = ({file, field}: any): void => {
        if(file && field)
            data.movie[field] = file;

        fp_field = undefined;
    }

    const fp_cancel = (): void => {
        fp_field = undefined;
    }

    const lp_submit = ({logo}: any): void => {
        if(logo?.LogoId)
            data.movie.logo = logo.LogoId;

        lp_active = false;
    }

    const lp_cancel = (): void => {
        lp_active = false
    };

    const clearLogo = (): void => {
        data.movie.logo = null;
    }

</script>

<svelte:head>
    <title>{data.movie.title || 'New movie'} | WireTV</title>
</svelte:head>

<BackButton position="sticky" target="/manage" />

<h1>
    {data.movie.title || 'New movie'}
</h1>

<form method="POST" action="?/{data.update ? 'update' : 'add'}">
    <input type="hidden" id="id" name="MovieId" value={data.movie.id}>
    <input type="hidden" id="name" name="Name" value={name}>
    <input type="hidden" id="logo" name="LogoId" value={data.movie.logo}>

    <fieldset>
        <legend>General</legend>

        <div class="input-group">
            <label for="title" data-required>Title</label>
            <input type="text" id="title" name="Title" bind:value={data.movie.title} placeholder="Asterix der Gallier, Django Unchained, ..." required>
        </div>
        <div class="input-group">
            <label for="description">Description</label>
            <textarea rows="7" id="description" name="Description" contenteditable="true" placeholder="Ganz Gallien ist von Cäsar besetzt... Ganz Gallien? Nein, ein kleines Dorf leistet nach wie vor den Römern heftigen Widerstand...">{data.movie.description}</textarea>
        </div>
        <div class="input-group">
            <label for="year">Release year</label>
            <input type="number" id="year" name="Year" value={data.movie.year} placeholder="e.g. 1969">
        </div>
        <div class="input-group">
            <label for="duration" data-tooltip="hh:mm">Length</label>
            <input type="time" id="duration" name="Duration" value={data.movie.duration.locale} placeholder="hh:mm">
        </div>
        <div class="input-group">
            <label for="logo">Logo</label>
            {#if data.movie.logo}
            <div class="logo"
                title="Remove logo"
                on:click={clearLogo}>
                <img src="/media/l/{data.movie.logo}"
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
            <input class="toggle" type="checkbox" id="secret" name="Secret" bind:checked={data.movie.secret}>
            <label for="secret">Secret</label>
        </div>
        

    </fieldset>

    <fieldset>
        <legend>Files</legend>

        <div class="input-group">
            <label for="stream" data-tooltip="*.mp4, *.m4v" data-required>Movie</label>
            <input type="text" 
                id="stream" 
                name="Stream" 
                class="filepicker"
                value={data.movie.stream} 
                on:focus="{() => fp_field = 'stream'}"
                required>
        </div>
        <div class="input-group">
            <label for="thumbnail" data-tooltip="Image file" data-required>Cover</label>
            <input type="text" 
                id="thumbnail" 
                name="Thumbnail" 
                class="filepicker"
                value={data.movie.thumbnail} 
                on:focus="{() => fp_field = 'thumbnail'}"
                required>
        </div>
        <div class="input-group">
            <label for="hero" data-tooltip="Image file">Hero</label>
            <input type="text" 
                id="hero" 
                name="Hero" 
                class="filepicker"
                value={data.movie.hero} 
                on:focus="{() => fp_field = 'hero'}">
        </div>
        <div class="input-group">
            <label for="captions" data-tooltip="*.vtt">Subtitles</label>
            <input type="text" 
                id="captions" 
                name="Captions" 
                class="filepicker"
                value={data.movie.captions} 
                on:focus="{() => fp_field = 'captions'}">
        </div>

    </fieldset>

    <button type="submit">
        <span class="icon">
            <Film />
        </span>
        Save
    </button>

</form>

<FilePicker root={'//mediakoal/mediakoal'} 
    field={fp_field}
    active={!!fp_field}
    onSubmit={fp_submit}
    onCancel={fp_cancel} />

<LogoPicker
    field={'LogoId'}
    active={lp_active}
    onSubmit={lp_submit}
    onCancel={lp_cancel} />

<style>
    form {
        min-width: 600px;
        max-width: 95%;
    }

    input.filepicker {
        cursor: pointer;
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
</style>