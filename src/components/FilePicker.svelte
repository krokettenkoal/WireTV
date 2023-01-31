<script lang="ts">
	import { onMount } from "svelte";
    import XLg from 'svelte-bootstrap-icons/lib/XLg.svelte';
    import { clampFilename } from '$lib/utils';

    export let root: string = '/';
    export let active: boolean = false;
    export let field: string | undefined = undefined;
    export let onSubmit: Function | undefined = undefined;
    export let onCancel: Function | undefined = undefined;

    let data: any = {children: []};
    let selected: string = '';

    $: selName = selected.split(/[\/\\]/).pop();

    onMount(async () => {
        root = root;
    });

    $: fetch('http://localhost:5173/api/fs?dir=' + encodeURIComponent(root))
        .then(response => response.json())
        .then(d => {
            if(!d.skip)
                data = d;
        });
    
    export const hide = () => {
        active = false;
        field = undefined;

        if(onCancel)
            onCancel();
    }

    export const show = () => {
        active = true;
    }

    export const toggle = () => {
        active = !active;
    }

    const opendir = async (dir: string) => {
        root = dir;
    }

    const selectFile = (file: string) => {
        selected = file;
    }
    
    const confirm = () => {
        if(!selected)
            return;
        
        if(onSubmit)
            onSubmit({file: selected, field: field});
        
        hide();
    }

    const cancel = () => {
        selected = '';
        hide();
    }

</script>

<div class="filepicker" class:hidden="{!active}">

    <div class="bar titlebar">
        <div class="left">
            <span class="sm">
                Select {field}
            </span>
        </div>

        <div class="center">
            <h5 class="title">
                <input type="text" bind:value="{root}">
            </h5>
        </div>

        <div class="right">
            <div tabindex="0" class="icon" on:click={hide}>
                <XLg />
            </div>
        </div>
    </div>

    <ul class="children">
        <li on:click={() => opendir(data.parent)}>
            ..
        </li>
        {#each data.children as child}
        <li on:click={() => child.isFile ? selectFile(child.path) : opendir(child.path)} 
            title={child.path}>
            {clampFilename(child.name)}
        </li>
        {/each}
    </ul>

    <div class="bar footerbar">
        <div class="left">
        </div>

        <div class="center">

            {#if selected}
            <span class="selected">
                Selected file: {selName}
            </span>
            {/if}

        </div>

        <div class="right">

            <button on:click={cancel}>
                Cancel
            </button>

            <button on:click={confirm} 
                disabled={!selected}>
                Confirm
            </button>

        </div>
    </div>
</div>

<style>
    .filepicker {
        position: fixed;
        top: 15vh;
        left: 10vw;
        min-height: 40vh;
        width: 80vw;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        background-color: var(--color-bg-0);
        border-radius: .7rem;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        z-index: 999;
        transition: all 300ms ease;
    }

    .filepicker.hidden {
        display: none;
    }

    .filepicker .bar {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }
    
    .filepicker .bar.titlebar {
        background-color: var(--color-bg-2);
        border-radius: .7rem .7rem 0 0;
    }

    .filepicker .bar .icon {
        cursor: pointer;
        opacity: .5;
        transition: all 200ms linear;
    }

    .filepicker .bar .icon:hover,
    .filepicker .bar .icon:focus,
    .filepicker .bar .icon:active {
        opacity: 1;
        transform: scale(1.05);
    }

    .filepicker .bar button {
        padding: 1rem 3rem;
        font-weight: bold;
    }

    .filepicker .title {
        margin: 0;
    }

    .filepicker .titlebar .sm {
        font-size: .7rem;
    }

    .filepicker .children {
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-start;
        align-items: flex-start;
        max-height: 55vh;
        padding: 2rem;
        list-style: none;
        margin: 0;
        overflow-x: auto;
    }

    .filepicker .children li {
        font-size: .8rem;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        margin-right: 2rem;
        transition: all 200ms ease;
    }

    .filepicker .children li:hover {
        border-bottom: 2px solid var(--color-theme-1);
    }

    .selected {
        font-style: italic;
    }

    @media screen and (max-width: 600px) {
        .filepicker {
            width: 98vw;
            left: 1vw;
        }
    }
</style>