<script lang="ts">
    import type { PageData } from './$types';
    import ProfileBadge from '$components/ProfileBadge.svelte';

    export let data: PageData;
</script>

<svelte:head>
	<title>Select profile | WireTV</title>
	<meta name="description" content="WireTV Profiles" />
</svelte:head>

<h1>Who is watching?</h1>

<ul class="profiles">
    {#each data.profiles as p}
        <li>
            <ProfileBadge profile={p} />
        </li>   
    {/each}

    <li>
        <ProfileBadge />
    </li>
</ul>

<style>
    .profiles {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: center;
        padding: 0;
    }

    .profiles > li {
        list-style: none;
        margin: 0 2rem;
    }
</style>