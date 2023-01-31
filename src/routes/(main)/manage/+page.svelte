<script lang="ts">
    import type { PageData } from './$types';
	import { goto } from '$app/navigation';
    import Plus from 'svelte-bootstrap-icons/lib/Plus.svelte';
    import Tile from '$components/Tile.svelte';
    import CollapseButton from '$components/CollapseButton.svelte';

    export let data: PageData;

    const collapsed: any = {
        collections: false,
        movies: false,
        logos: false,
    };

    const goTo = (path: string) => {
        goto('/manage/' + path);
    }

    const c_toggled = ({ target, state }: any) => {
        collapsed[target] = state;
    }
</script>

<svelte:head>
    <title>Media manager | WireTV</title>
</svelte:head>

<h1>Media manager</h1>


<h2>
    Collections
    
    <span class="btn-collapse">
        <CollapseButton target="collections"
            onToggle={c_toggled} />
    </span>
</h2>

<button class="btn-add" on:click={()=>goTo('c')}>
    <span class="icon">
        <Plus width={24} height={24} />
    </span>
    Add collection
</button>

<ul class:collapsed={collapsed.collections}
class="collapsible">
    {#each data.collections as collection}
        <li>
            <Tile title={collection.title} 
                url={collection.edit} 
                thumbnail={collection.thumbnail}
                logo={collection.logo} />
        </li>
    {/each}
</ul>

<hr>


<h2>
    Movies
    
    <span class="btn-collapse">
        <CollapseButton target="movies"
            onToggle={c_toggled} />
    </span>
</h2>

<button class="btn-add" on:click={()=>goTo('m')}>
    <span class="icon">
        <Plus width={24} height={24} />
    </span>
    Add movie
</button>

<ul class:collapsed={collapsed.movies}
class="collapsible">
    {#each data.movies as movie}
        <li>
            <Tile title={movie.title} 
                url={movie.edit} 
                thumbnail={movie.thumbnail} />
        </li>
    {/each}
</ul>

<hr>


<h2>
    Logos

    <span class="btn-collapse">
        <CollapseButton target="logos"
            onToggle={c_toggled} />
    </span>
</h2>

<button class="btn-add" on:click={()=>goTo('l')}>
    <span class="icon">
        <Plus width={24} height={24} />
    </span>
    Add logo
</button>

<div class="slider-container" class:collapsed={collapsed.logos}>
    <ul class="slider slider-x">
        {#each data.logos as logo}
            <li>
                <Tile 
                    title={logo.title} 
                    url={logo.edit} 
                    logo={logo.url} 
                    bgSize="contain" 
                    bgpos="center center" />
            </li>
        {/each}
    </ul>
</div>


<style>
    h2 {
        text-align: center;
        margin-bottom: 2rem;
    }

    .btn-add {
        padding: 1.5rem 3rem;
        font-size: 1.3rem;
        font-weight: bold;
    }

    ul {
        width: 100%;
        list-style: none;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 2rem;
    }

    ul > li {
        margin: 1rem;
    }

    .btn-collapse {
        margin-left: .5rem;
    }

</style>