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
	<title>Movies | WireTV</title>
	<meta name="description" content="WireTV Movies" />
</svelte:head>

<h1>Movies</h1>

<Hero data={selected} />


{#if data.continueWatching && data.continueWatching.length > 0}

<h2>
    Continue watching
</h2>


<div class="slider-container">

    <ul class="slider slider-x">
    
        
        {#each data.continueWatching as movie}
        <li>
            <Tile 
                url="/watch/m/{movie.name}?t={movie.timecode}" 
                thumbnail={movie.thumbnail} 
                title={movie.title} 
                onSelect={()=>showHero(movie)}
                progress={movie.progress} />
        </li>
        {/each}
        
    </ul>

</div>

{/if}

{#if data.watchAgain && data.watchAgain.length > 0}

<h2>
    Watch again
</h2>


<div class="slider-container">

    <ul class="slider slider-x">
    
        
        {#each data.watchAgain as movie}
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

{/if}


<h2>
    Recently added
</h2>

<div class="slider-container">
    <ul class="slider slider-x">
    
        {#each data.recentlyAdded as movie}
            <li>
                <Tile 
                    url="/movies/{movie.name}" 
                    thumbnail={movie.thumbnail} 
                    title={movie.title}
                    onSelect={()=>showHero(movie)} />
            </li>
        {/each}
    
    </ul>
</div>


<h2>Browse movies</h2>

<ul class="tile-grid">
    {#each data.movies as movie}
        <li>
            <Tile 
                url="/movies/{movie.name}"
                thumbnail={movie.thumbnail} 
                title={movie.title} 
                onSelect={()=>showHero(movie)} />
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