<script lang="ts">
    import type { PageData } from './$types';
    import BackButton from '$components/BackButton.svelte';
    import Tile from '$components/Tile.svelte';
    import PlayButton from '$components/PlayButton.svelte';
    import Hero from '$components/Hero.svelte';
    
    export let data: PageData;

    let selected: any | undefined;

    const showHero = (movie: any | undefined): void => {
        selected = movie;
    }
</script>

<svelte:head>
	<title>{data.collection.title} | WireTV</title>
	<meta name="description" content="WireTV Collections" />
</svelte:head>

<div class="hero">
    
    <div class="details">
        <BackButton position="sticky" target="/collections" />
        
        {#if data.collection.logo}
        <img class="logo" 
            src={data.collection.logo}
            height="80"
            alt="{data.collection.title} Logo" />
        {/if}

        <h1>
        {data.collection.title}
        </h1>
        
        {#if data.collection.description}
            <p class="description">
                {data.collection.description}
            </p>
        {/if}
   
        <div class="buttons">
            <PlayButton 
            url={data.movies[0].watch}
            label="Start watching" />
        </div>
    </div>

    
    <Hero data={selected} />

    <div class="movies">
        <h2>Movies</h2>
    
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
    </div>


    <div class="bg" style="background-image: url({data.collection.hero ?? data.collection.thumbnail})"></div>

</div>



<style>
    .hero {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: stretch;
        padding: 2rem;
    }

    .hero .bg {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-attachment: scroll;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: left center;
        opacity: 1;
        border-radius: .7rem;
        mask-image: linear-gradient(15deg, transparent 30%, black 90%);
        -webkit-mask-image: linear-gradient(15deg, transparent 30%, black 90%);
        z-index: -1;
    }

    .details {
        max-width: 64rem;
        padding: 2rem;
        margin-top: 4em;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        -moz-backdrop-filter: blur(20px);
        border-radius: .7rem;
        box-shadow: 10px 10px 30px rgba(0, 0, 0, .7);
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }

    .details h1 {
        margin-bottom: 0;
        text-shadow: 2px 2px 10px black;
    }

    .description {
        font-size: .9rem;
        text-shadow: 0 0 20px black;
        font-style: italic;
        max-width: 35rem;
    }

    .buttons {
        margin-top: 2rem;
    }

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