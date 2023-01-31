<script lang="ts">
    import ArrowLeft from 'svelte-bootstrap-icons/lib/ArrowLeft.svelte';
    import { goto } from '$app/navigation';

    export let target: string | undefined = undefined;
    export let onClick: Function | undefined = undefined;
    export let position: string = 'fixed';

    const goBack = (): void => {
        if(onClick)
            onClick();

        if(target)
            goto(target);
        else if(document.referrer)
            goto(document.referrer, { replaceState: true });
        else {
            const u = new URL(window.location.href + '/..');
            goto(u.toString())
        }
    }
</script>

<div 
    class="btn-back" 
    on:click={goBack} 
    title="Go back"
    style="position:{position}">
    <ArrowLeft width={28} height={28} />
</div>

<style>
    .btn-back {
        position: fixed;
        top: 1rem;
        left: 1rem;
        align-self: flex-start;
        cursor: pointer;
        transition: all 300ms ease;
        z-index: 90;
    }

    .btn-back:hover,
    .btn-back:active,
    .btn-back:focus {
        color: var(--theme-color-1);
        transform: scale(1.1);
    }
</style>