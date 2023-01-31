<script lang="ts">
	import type { PageData } from './$types';
	import logo from '$lib/images/wiretv-logo@0.1x.png';

	export let data: PageData;
</script>

<svelte:head>
	<title>WireTV</title>
	<meta name="description" content="WireTV Home" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<img src={logo} height="128" alt="WireTV" />
			</picture>
		</span>
	</h1>

	<h1>
		Hello, {data.profile.name}!
	</h1>

	<h2>
		Movies
	</h2>
	<div>

	</div>

	<h2>
		Series
	</h2>

	<h2>
		Collections
	</h2>

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
