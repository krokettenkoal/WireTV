<script lang="ts">
    import type { PageData } from './$types';
    import Rating from '$components/Rating.svelte';
    import PlayButton from '$components/PlayButton.svelte';
    import BackButton from '$components/BackButton.svelte';
    import { invalidate } from '$app/navigation';
    
    export let data: PageData;

    let r = Number(data.rating.avg);

    const r_saved = (): void => {
        invalidate(window.location.pathname);
    }
</script>

<svelte:head>
	<title>{data.title} | WireTV</title>
	<meta name="description" content="WireTV Movies" />
</svelte:head>

<div class="hero">
    
    <div class="details">
        <BackButton position="sticky" target="/movies" />
        
        {#if data.logo}
        <img class="logo" 
            src="/media/l/{data.logo}"
            height="80"
            alt="{data.title} Logo" />
        {/if}

        <h1>
        {data.title}
        </h1>
        
        <ul class="infobar">
            {#if data.year}
            <li>
                <strong>Year:</strong> 
                {data.year}
            </li>
            {/if}
            
            {#if data.duration && data.duration.totalMinutes > 0}
            <li>
                <strong>Length:</strong> 
                {Math.floor(data.duration.totalMinutes)} minutes
            </li>
            {/if}
        
            <li>
                <strong>Rating:</strong> 
                <Rating rating={data.rating.avg} 
                count={data.rating.count}
                movie={data.id}
                onSubmit={r_saved} />
            </li>
            
        </ul>
        
        {#if data.description}
            <p class="description">
                {data.description}
            </p>
        {/if}

        <div class="buttons">
            <PlayButton url={data.watch} timecode={data.timecode} progress={data.progress} />
        </div>
            
    </div>

    <div class="bg" style="background-image: url({data.hero ?? data.thumbnail})"></div>

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
        justify-content: flex-end;
        align-items: flex-start;
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

    .infobar {
        display: flex;
        flex-flow: row wrap;
        list-style: none;
        justify-content: center;
        align-items: flex-start;
        padding-bottom: .5rem;
    }

    .infobar > * {
        font-size: .9rem;
        font-style: italic;
        opacity: .7;
        margin-right: 2rem;
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

</style>