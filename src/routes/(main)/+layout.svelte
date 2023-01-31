<script lang="ts">
    import Header from '$components/Header.svelte';
	import Github  from 'svelte-bootstrap-icons/lib/Github.svelte';
</script>

<div class="main">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p><a class="icon" href="https://github.com/krokettenkoal/WireTV" target="_blank"><Github /></a></p>
	</footer>
</div>

<style>
    	
	.main {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	main {
		width: 100%;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		padding: 1rem;
	}

	footer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	footer a.icon {
		color: var(--color-text);
		opacity: .7;
		transition: all 300ms ease;
	}

	footer a.icon:hover {
		opacity: 1;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>