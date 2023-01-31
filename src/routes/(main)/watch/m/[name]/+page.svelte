<script lang="ts">
    import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import BackButton from '$components/BackButton.svelte';

    export let data: PageData;

    let video : HTMLVideoElement | null;

    const URL_API = '/api/history/m';
    let apiUrl: URL | undefined;

    const backToDetails = () => {
        window.location.assign(data.details);
    }

    onMount(() => {
        apiUrl ??= new URL(URL_API, window.location.href);

        if(!data.startTime)
            return;

        video = document.querySelector('video');
        if(video){
            video.currentTime = data.startTime;
        }
    });

    beforeNavigate(async () => {
        await saveHistory();
    });

    const saveHistory = async (): Promise<Response> => {
        if(!apiUrl)
            throw new ReferenceError("History API url not found.");
        
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                movieId: data.id,
                timecode: video?.currentTime ?? 0
            })
        });
    }

</script>

<svelte:head>
	<title>{data.title} | WireTV</title>
	<meta name="description" content="Watch {data.title} on WireTV" />
</svelte:head>

<BackButton target={data.details} />

<h1>
    {data.title}
</h1>

<video controls autoplay poster={data.thumbnail} bind:this={video}>
    <source src={data.stream} type="video/mp4">
    <track kind="captions" src={data.captions} srclang="de" label="Deutsch">

    <a href={data.download} title="Download '{data.title}'">
        Download '{data.title}'
    </a>
</video>

<style>
    video {
        width: 100vw;
        max-height: 62.5vh;
    }
</style>