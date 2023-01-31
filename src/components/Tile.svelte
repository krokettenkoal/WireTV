<script lang="ts">
    import PlayCircle from 'svelte-bootstrap-icons/lib/PlayCircleFill.svelte';
    import ProgressBar from '$components/MiniProgressBar.svelte';

    export let url: string;
    export let title: string;
    export let thumbnail: string | undefined = undefined;
    export let logo: string | undefined = undefined;
    export let bgpos: string = 'top center';
    export let onSelect: Function | undefined = undefined;
    export let onBlur: Function | undefined = undefined;
    export let progress: number = 0;
    export let bgSize: string = 'cover';

    $: thumb = thumbnail ? `url(${thumbnail})` : 'none';
    $: logoUrl = logo ? `url(${logo})` : 'none';

    const focussed = () => {
        if(onSelect)
            onSelect();
    }

    const blurred = () => {
        if(onBlur)
            onBlur();
    }

    const cssVariables = (node: HTMLElement, variables: any) => {
		setCssVariables(node, variables);
		
		return {
			update(variables: any) {
				setCssVariables(node, variables);
			}
		}
	}

	const setCssVariables = (node: HTMLElement, variables: any) => {
		for (const name in variables) {
			node.style.setProperty(`--${name}`, variables[name]);
		}
	}

</script>

<a use:cssVariables={{bgSize, thumb, bgpos}}
    class="tile" 
    href={url} 
    title={title}
    on:focus={focussed}
    on:blur={blurred}>

    {#if logo}
    <div class="logo" use:cssVariables={{logoUrl}}></div>
    {/if}

    {#if progress}
    <div class="resume">
        <div class="play">
            <PlayCircle width={30} height={30} />
            <span class="label">Resume</span>
        </div>
        <ProgressBar progress={progress} height={7} />
    </div>
    {/if}
</a>

<style>
    
    .tile {
        position: relative;
        color: var(--color-text);
        text-decoration: none;
        width: 350px;
        height: 220px;
        background-color: var(--color-bg-0);
        display: flex;
        flex-flow: column;
        justify-content: flex-end;
        align-items: stretch;
        border-radius: .7rem;
        cursor: pointer;
        filter: brightness(.8);
        user-select: none;
        outline: none;
        background-image: var(--thumb);
        background-size: var(--bgSize);
        background-position: var(--bgpos);
        background-repeat: no-repeat;
        transition: all 300ms ease;
        z-index: 1;
    }

    .tile::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border-radius: .7rem;
        background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%);;
        transition: opacity 300ms linear;
    }

    .tile:hover::after,
    .tile:focus::after {
        opacity: 0;
    }

    .tile:focus,
    .tile:hover {
        filter: brightness(1);
        transform: scale(1.02);
    }

    .tile:focus {
        outline: 2px solid var(--color-theme-1);
        box-shadow: 0 0 20px var(--color-bg-0);
    }

    .tile > * {
        font-size: 2rem;
        text-shadow: 2px 2px 8px black;
        text-align: center;
    }

    .tile .logo {
        width: 60%;
        height: 100%;
        align-self: center;
        background-image: var(--logoUrl);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }

    .resume {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-end;
        align-items: stretch;
        padding: 1rem;
        height: 30%;
        color: var(--color-text);
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.4) 90%);;

     }
    
    .resume * {
        text-shadow: 2px 2px 10px black;
    }

    .resume .play {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }

    .resume .play .label {
        margin-left: .7rem;
        font-size: 1.2rem;
        font-weight: bold;
    }

    @media screen and (max-width: 600px) and (orientation: portrait) {
        .tile {
            width: 84vw;
        }
    }
</style>