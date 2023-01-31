<script lang="ts">
    import BackButton from '$components/BackButton.svelte';
import { createCookie } from '$lib/cookies';

    let name: string = "";

    const createProfile = async () => {
        if(!name)
            return;

        const response = await fetch('/api/profiles', {
            method: 'POST',
            body: JSON.stringify({
                name: name
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok){
            console.error('Server responded with status', response.status);
            return;
        }

        const data = await response.json();
        const cookie = createCookie('profile', data.ProfileId, 1);

        document.cookie = cookie;
        window.location.assign('/profile');
    }
</script>

<BackButton />

<div class="form-create">
    <h1>New profile</h1>
    <input type="text" name="name" id="name" placeholder="Enter profile name.." bind:value={name}>
    <button id="create" type="button" on:click={createProfile} disabled={!name}>Create</button>
</div>

<style>
    .form-create {
        min-width: 60%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: stretch;
    }

    input#name {
        width: 100%;
        padding: 1rem .2rem;
        background-color: var(--color-bg-2);
        border: none;
        border-radius: .5rem;
        color: var(--text-color);
    }

    button#create {
        margin-top: 2rem;
        font-size: 1.5rem;
        padding: .5rem;
        opacity: .8;
        transition: all 300ms ease;
    }

    button:not(:disabled){
        cursor: pointer;
    }

    button#create:hover:not(:disabled),
    button#create:focus:not(:disabled),
    button#create:active:not(:disabled) {
        opacity: 1;
        transform: scale(1.02);
    }
</style>