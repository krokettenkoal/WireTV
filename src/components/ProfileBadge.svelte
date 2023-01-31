<script lang="ts">
    import Avatar from '$lib/images/profile.png';
	import PlusLg from 'svelte-bootstrap-icons/lib/PlusLg.svelte';
    import { createCookie } from '$lib/cookies';
    
    export let profile: any = {id: -1, name: 'New'};
    export let direction: string = 'column';
    export let size: number = 100;

    const selectProfile = async (): Promise<void> => {
        if(profile.id < 0){
            window.location.assign('/profile/create');
            return;
        }

        const cookie = createCookie('profile', profile.id, 1);

        document.cookie = cookie;
        window.location.assign('/');
    }
</script>

<div class="badge" style="flex-flow:{direction}" tabindex="0" on:click={selectProfile}>
    {#if profile.id < 0}
        <div class="avatar" style="width:{size}px">
            <PlusLg style="width:{size*.5};height:{size}" />
        </div>
    {:else}
        <img class="avatar" src={profile.avatar ?? Avatar} width={size} alt={profile.name} />
    {/if}
    <p>{profile.name}</p>
</div>

<style>
    .badge {
        cursor: pointer;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .badge .avatar {
        border-radius: 100%;
        outline: 2px solid transparent;
        text-align: center;
        transition: all 200ms linear;
    }

    .badge:hover .avatar,
    .badge:focus .avatar,
    .badge:active .avatar {
        outline: 2px solid var(--color-theme-1);
    }
</style>