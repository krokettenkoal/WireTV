<script lang="ts">
    import ArrowsCollapse from "svelte-bootstrap-icons/lib/ArrowsCollapse.svelte";
    import ArrowsExpand from "svelte-bootstrap-icons/lib/ArrowsExpand.svelte";
    
    export let target: string;
    export let onToggle: Function;

    let toggled: boolean = false;

    const toggle = (): void => {
        toggled = !toggled;
        onToggle({ target, state: toggled })
    }
</script>

<div class="collapse" 
    title={toggled ? 'Expand' : 'Collapse'}
    class:toggled={toggled}
    on:click={toggle}
    tabindex="0">
    {#if toggled}
    <ArrowsExpand />
    {:else}
    <ArrowsCollapse />
    {/if}
</div>

<style>
    .collapse {
        display: inline-block;
        cursor: pointer;
        transition: transform 200ms ease, opacity 200ms linear;
    }

    .collapse:hover {
        opacity: .8;
        transform: scale(.9);
    }

    .collapse.toggled {
        transform: rotate(180deg);
    }
</style>