<script lang="ts">
    import Play from 'svelte-bootstrap-icons/lib/Play.svelte';
    import PlayFill from 'svelte-bootstrap-icons/lib/PlayFill.svelte';
    import ProgressBar from '$components/MiniProgressBar.svelte';
    
    export let url: string | undefined;
    export let timecode: number = 0;
    export let progress: number = 0;
    export let label: string | undefined = undefined;

    $: displayLabel = label ?? (timecode ? 'Continue watching' : 'Watch now');

    let focussed = false;

    const focus = () => focussed = true;
    const blur = () => focussed = false;
    const play = () => {
        if(!url)
            return;
        
        const target = new URL(url, window.location.href);
        if(timecode)
            target.searchParams.set('t', String(timecode));

        window.location.assign(target);
    }
</script>

{#if url}

<button 
    class="btn-play" 
    type="button"
    on:mouseenter={focus}
    on:focus={focus}
    on:mouseleave={blur}
    on:blur={blur}
    on:click={play}>

    <div>
        <span class="icon">
            {#if focussed}
                <PlayFill />
            {:else}
                <Play />
            {/if}
        </span>
    
        <span class="label">
            {displayLabel}
        </span>
    </div>

    {#if progress}
        <ProgressBar progress={progress} />
    {/if}

</button>

{/if}

<style>
    .btn-play {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
        background-color: var(--color-bg-0);
        color: var(--color-text);
        border-radius: .5rem;
        cursor: pointer;
        min-width: 200px;
        padding: 1rem 2.5rem;
        box-shadow: 0 0 15px rgba(0, 0, 0, .5);
        transition: all 200ms linear;
    }

    .btn-play:hover,
    .btn-play:active,
    .btn-play:focus {
        color: var(--color-theme-1);
        box-shadow: 2px 2px 10px rgba(0, 0, 0, .5);
    }

    .btn-play .label {
        margin-left: .3rem;
        font-weight: bold;
    }
</style>