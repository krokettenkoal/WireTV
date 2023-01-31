<script lang="ts">
    export let progress: number;
    export let height: number = 2;
</script>

<div class="progress" style="height:{height}px">
    <div class="bar" style="width:{progress * 100}%"></div>
</div>

<style>
    .progress {
        position: relative;
        height: 2px;
        width: 100%;
        margin-top: .5rem;
        background-color: var(--color-text);
        border-radius: .5rem;
    }

    .progress .bar {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        content: '';
        background-color: gold;
        border-radius: .5rem;
        transition: width 300ms ease;
    }
</style>