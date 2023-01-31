<script lang="ts">
    import Star from 'svelte-bootstrap-icons/lib/Star.svelte';
    import StarHalf from 'svelte-bootstrap-icons/lib/StarHalf.svelte';
    import StarFill from 'svelte-bootstrap-icons/lib/StarFill.svelte';
    export let rating: number;
    export let count: number;
    export let movie: number;
    export let max: number = 5;
    export let onSubmit: Function | undefined = undefined;

    let selected: number = 0;

    let select = (i: number) => selected = i+1;
    let deselect = () => selected = 0;
    let saveRating = async () => {
        const response = await fetch('/api/movies/rating', {
            method: 'POST',
            body: JSON.stringify({
                movieId: movie,
                rating: selected
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok){
            //console.log("Rating saved.");

            if(onSubmit)
                onSubmit();
        }
        else {
            console.error("Rating could not be saved!");
        }

    }
</script>

<span class="rating" data-rating={rating}>

        {#each Array(max) as _, i}
        <span 
            class="star {i < selected ? 'selected' : ''}" 
            on:mouseenter={() => select(i)}
            on:focus={() => select(i)}
            on:blur={deselect}
            on:mouseleave={deselect}
            on:click={saveRating}>
            
            {#if selected > 0}
                {#if i < selected}
                    <StarFill />
                {:else}
                    <Star />
                {/if}
            {:else}
                {#if i+1 <= rating}
                    <StarFill />
                {:else if i + 1 - rating < .5}
                    <StarHalf />
                {:else}
                    <Star />
                {/if}
            {/if}
        </span>

        {/each}

    {rating} ({count})
</span>

<style>
    .star {
        cursor: pointer;
    }
    .star.selected {
        color: gold;
    }
</style>