<script lang="ts">
	import type { PageData } from './$types';
    import Image from 'svelte-bootstrap-icons/lib/Image.svelte';
    import FilePicker from '$components/FilePicker.svelte';
    import BackButton from '$components/BackButton.svelte';

    export let data: PageData;

    $: title = data.logo.title;

    let fp_field: string | undefined;

    const fp_submit = ({file, field}: any): void => {
        if(file && field)
            data.logo[field] = file;

        fp_field = undefined;
    }

    const fp_cancel = (): void => {
        fp_field = undefined;
    }

</script>

<svelte:head>
    <title>{data.logo.title || 'New logo'} | WireTV</title>
</svelte:head>

<BackButton position="sticky" target="/manage" />

<h1>
    {title || 'New logo'}
</h1>

{#if data.logo.url}
    <div 
        style="background-image:url({data.logo.url})" 
        class="logo"
        title={data.title}></div>
{/if}

<form method="POST" action="?/{data.update ? 'update' : 'add'}">
    <input type="hidden" id="id" name="LogoId" value={data.logo.id}>

    <fieldset>
        <legend>General</legend>

        <div class="input-group">
            <label for="title" data-required>Title</label>
            <input type="text" id="title" name="Title" bind:value={data.logo.title} placeholder="Asterix, Star Wars, Marvel, .." required>
        </div>
        
        <div class="input-group">
            <p class="label">Secret</p>
            <input class="toggle" type="checkbox" id="secret" name="Secret" bind:checked={data.logo.secret}>
            <label for="secret">Secret</label>
        </div>

    </fieldset>

    <fieldset>
        <legend>Files</legend>

        <div class="input-group">
            <label for="filepath" data-tooltip="Image file" data-required>Logo</label>
            <input type="text" 
                id="filepath" 
                name="FilePath" 
                class="filepicker"
                value={data.logo.filepath} 
                on:focus="{() => fp_field = 'filepath'}"
                required>
        </div>

    </fieldset>

    <button type="submit">
        <span class="icon">
            <Image />
        </span>
        Save
    </button>

</form>

<FilePicker root={'//mediakoal/mediakoal'} 
    field={fp_field}
    active={!!fp_field}
    onSubmit={fp_submit}
    onCancel={fp_cancel} />

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

    @media screen and (max-width: 600px) {
        .logo {
            width: 90vw;
        }
    }
</style>