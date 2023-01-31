<script lang="ts">
    import XLg from 'svelte-bootstrap-icons/lib/XLg.svelte';
	import { onMount } from 'svelte';

    export let active: boolean = false;
    export let field: string | undefined = undefined;
    export let secret: boolean = false;
    export let onSubmit: Function | undefined = undefined;
    export let onCancel: Function | undefined = undefined;

    let logos: Array<any> = new Array<any>();
    let selected: any | undefined = undefined;

    onMount(async () => {
        const response = await fetch('http://localhost:5173/api/logos?orderby=Title' + (secret ? '&secret=true' : ''));
        if(!response.ok)
            return;

        const data = await response.json();
        logos = data;
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

    const selectLogo = (logo: any) => {
        selected = logo;
    }
    
    const confirm = () => {
        if(!selected)
            return;
        
        if(onSubmit)
            onSubmit({logo: selected, field: field});
        
        hide();
    }

    const cancel = () => {
        selected = undefined;
        hide();
    }

</script>

<div class="logopicker" class:hidden="{!active}">

    <div class="bar titlebar">
        <div class="left">
            
        </div>

        <div class="center">
            <h5 class="title">
                Select logo
            </h5>
        </div>

        <div class="right">
            <div tabindex="0" class="icon" on:click={hide}>
                <XLg />
            </div>
        </div>
    </div>

    <ul class="logos">
        {#each logos as logo}
        <li on:click={() => selectLogo(logo)} 
            title={logo.Title}>

            <img src="/media/l/{logo.LogoId}" 
                alt={logo.Title}
                width="200" />
        </li>
        {/each}
    </ul>

    <div class="bar footerbar">
        <div class="left">
        </div>

        <div class="center">

            {#if selected}
            <span class="selected">
                Selected logo: {selected.Title}
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
    .logopicker {
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

    .logopicker.hidden {
        display: none;
    }

    .logopicker .bar {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }
    
    .logopicker .bar.titlebar {
        background-color: var(--color-bg-2);
        border-radius: .7rem .7rem 0 0;
    }

    .logopicker .bar .icon {
        cursor: pointer;
        opacity: .5;
        transition: all 200ms linear;
    }

    .logopicker .bar .icon:hover,
    .logopicker .bar .icon:focus,
    .logopicker .bar .icon:active {
        opacity: 1;
        transform: scale(1.05);
    }

    .logopicker .bar button {
        padding: 1rem 3rem;
        font-weight: bold;
    }

    .logopicker .title {
        margin: 0;
    }

    .logopicker .logos {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
        align-items: center;
        max-height: 55vh;
        padding: 2rem;
        list-style: none;
        margin: 0;
        overflow-y: auto;
    }

    .logopicker .logos li {
        font-size: .8rem;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        margin-right: 2rem;
        transition: all 200ms ease;
    }

    .logopicker .logos li:hover {
        border-bottom: 2px solid var(--color-theme-1);
    }

    .selected {
        font-style: italic;
    }

    @media screen and (max-width: 600px) {
        .logopicker {
            width: 98vw;
            left: 1vw;
        }
    }
</style>