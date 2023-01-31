<script lang="ts">
    import type { PageData } from './$types';
    import Tile from '$components/Tile.svelte';
    import Hero from '$components/Hero.svelte';

    export let data: PageData;

    let selected: any | undefined;

    const showHero = (movie: any | undefined): void => {
        selected = movie;
    }

</script>

<svelte:head>
	<title>Collections | WireTV</title>
	<meta name="description" content="WireTV Movies" />
</svelte:head>

<h1>Collections</h1>

<Hero data={selected} />

{#each data.collections as collection}

<h2>
    {collection.title}
</h2>


<div class="slider-container">

    <ul class="slider slider-x">
    
        
        {#each collection.movies as movie}
        <li>
            <Tile 
                url="/watch/m/{movie.name}" 
                thumbnail={movie.thumbnail} 
                title={movie.title} 
                onSelect={()=>showHero(movie)} />
        </li>
        {/each}
        
    </ul>

</div>

{/each}


<h2>Browse collections</h2>

<ul class="tile-grid">
    {#each data.collections as collection}
        <li>
            <Tile 
                url="/collections/{collection.name}"
                thumbnail={collection.thumbnail} 
                title={collection.title}
                logo={collection.logo} />
        </li>
    {/each}
</ul>



<style>
    .tile-grid {
        width: 100%;
        list-style: none;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 2rem;
    }

    .tile-grid > li {
        margin: 1rem;
    }
</style>