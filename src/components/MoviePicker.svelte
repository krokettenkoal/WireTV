<script lang="ts">
    import XLg from 'svelte-bootstrap-icons/lib/XLg.svelte';
	import { onMount } from 'svelte';

    export let active: boolean = false;
    export let field: string | undefined = undefined;
    export let onSubmit: Function | undefined = undefined;
    export let onCancel: Function | undefined = undefined;
    export let secret: boolean = false;
    export let exclude: Array<any> = new Array<any>();

    let movies: Array<any> = new Array<any>();
    let selected: any | undefined = undefined;

    onMount(async () => {
        const response = await fetch('http://localhost:5173/api/movies?orderby=Title' + (secret ? '&secret=true' : ''));
        if(!response.ok)
            return;

        const data = await response.json();
        movies = data.movies.filter((m: any) => exclude.findIndex(e => e.MovieId == m.MovieId) < 0);
    });
    
    export const hide = () => {
        field = undefined;

        if(onCancel)
            onCancel();
        else
            active = false;
    }

    export const show = () => {
        active = true;
    }

    export const toggle = () => {
        active = !active;
    }

    const selectMovie = (movie: any) => {
        selected = movie;
    }
    
    const confirm = () => {
        if(!selected)
            return;
        
        if(onSubmit)
            onSubmit({movie: selected, field: field});
        
        hide();
    }

    const cancel = () => {
        selected = undefined;
        hide();
    }

</script>

<div class="moviepicker" class:hidden="{!active}">

    <div class="bar titlebar">
        <div class="left">
            
        </div>

        <div class="center">
            <h5 class="title">
                Select movie
            </h5>
        </div>

        <div class="right">
            <div tabindex="0" class="icon" on:click={hide}>
                <XLg />
            </div>
        </div>
    </div>

    <ul class="movies">
        {#if movies.length == 0}
            <p class="label">No movies found!</p>
        {:else}
        {#each movies as movie}
        <li on:click={() => selectMovie(movie)} 
            title={movie.Title}>

            <img src="/media/m/{movie.Name}/thumbnail" 
                alt={movie.Title}
                width="200" />
        </li>
        {/each}
        {/if}
    </ul>

    <div class="bar footerbar">
        <div class="left">
        </div>

        <div class="center">

            {#if selected}
            <span class="selected">
                Selected movie: {selected.Title}
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
    .moviepicker {
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

    .moviepicker.hidden {
        display: none;
    }

    .moviepicker .bar {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }
    
    .moviepicker .bar.titlebar {
        background-color: var(--color-bg-2);
        border-radius: .7rem .7rem 0 0;
    }

    .moviepicker .bar .icon {
        cursor: pointer;
        opacity: .5;
        transition: all 200ms linear;
    }

    .moviepicker .bar .icon:hover,
    .moviepicker .bar .icon:focus,
    .moviepicker .bar .icon:active {
        opacity: 1;
        transform: scale(1.05);
    }

    .moviepicker .bar button {
        padding: 1rem 3rem;
        font-weight: bold;
    }

    .moviepicker .title {
        margin: 0;
    }

    .moviepicker .movies {
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

    .moviepicker .movies li {
        font-size: .8rem;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        margin-right: 2rem;
        transition: all 200ms ease;
    }

    .moviepicker .movies li:hover {
        border-bottom: 2px solid var(--color-theme-1);
    }

    .selected {
        font-style: italic;
    }

    @media screen and (max-width: 600px) {
        .moviepicker {
            width: 98vw;
            left: 1vw;
        }
    }
</style>