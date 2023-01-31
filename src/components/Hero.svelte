<script lang="ts">
    import PlayButton from '$components/PlayButton.svelte';
    import ArrowsCollapse from 'svelte-bootstrap-icons/lib/ArrowsCollapse.svelte';
    import { clampText } from '$lib/utils';

    export let data: any | undefined = undefined;

    const collapse = (): void => data = undefined;
</script>

<div class="hero" class:collapsed={!data}>
    <div class="bg" style="background-image:url({data?.thumbnail ?? '/img/tile.png'})"></div>
    <div class="details">
        <h2 class="title">{data?.title}</h2>
        <p class="description">{clampText(data?.description ?? '')}</p>
    </div>
    <div class="playBtn">
        <PlayButton url={data?.watch} timecode={data?.timecode} progress={data?.progress} />
    </div>

    <div class="collapseBtn" on:click={collapse} title="Hide">
        <ArrowsCollapse width={24} height={24} />
    </div>
</div>

<style>
    .hero {
        position: sticky;
        top: 0;
        height: 40vh;
        width: 100%;
        background-color: var(--color-bg-2);
        padding-left: 2rem;
        overflow: hidden;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        transition: height 300ms ease;
        z-index: 5;
    }

    .hero.collapsed {
        height: 0;
    }
    
    .hero .bg {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        mask-image: linear-gradient(90deg, transparent 30%, black 100%);
        -webkit-mask-image: linear-gradient(90deg, transparent 30%, black 100%);
    }
    
    .hero .details {
        width: 50%;
        font-size: .9rem;
    }
    
    .hero .title {
        font-weight: bold;
        font-size: 2rem;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    .hero .description {
        width: 70%;
    }

    .hero .playBtn {
        z-index: 10;
        margin-right: 10%;
    }

    .hero .collapseBtn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 10;
        padding: 1rem;
        cursor: pointer;
        transition: transform 200ms linear;
    }

    .hero .collapseBtn:hover {
        transform: scale(.8);
    }
</style>