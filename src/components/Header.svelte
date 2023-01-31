<script>
	import { page } from '$app/stores';
	import icon_w from '$lib/images/w-icon@0.1x.png';
	import GearFill from 'svelte-bootstrap-icons/lib/GearFill.svelte';
	import PersonCircle from 'svelte-bootstrap-icons/lib/PersonCircle.svelte';
	import CollectionFill from 'svelte-bootstrap-icons/lib/CollectionFill.svelte';
</script>

<header>
	<div class="corner logo">
		<a href="/">
			<img src={icon_w} alt="WireTV" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class:active={$page.url.pathname === '/'}>
				<a href="/">Home</a>
			</li>
			<li class:active={$page.url.pathname.startsWith('/collections')}>
				<a href="/collections">Collections</a>
			</li>
			<li class:active={$page.url.pathname.startsWith('/movies')}>
				<a href="/movies">Movies</a>
			</li>
			<li class:active={$page.url.pathname.startsWith('/series')}>
				<a href="/series" disabled>Series</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner right">
		<a href="/manage" class="icon" title="Media manager" class:active={$page.url.pathname.startsWith('/manage')}>
			<CollectionFill />
		</a>
		<a href="/profile" class="icon" title="Change profile">
			<PersonCircle />
		</a>
		<a href="/settings" class="icon" title="Settings">
			<GearFill />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		z-index: 99;
		padding: 1rem;
		background-image: linear-gradient(180deg, black 0%, transparent 100%);
	}

	.corner {
		height: 3em;
	}

	.corner.right {
		display: flex;
		flex-flow: row nowrap;
	}

	.corner.right > * {
		margin-right: 1rem;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: transparent;
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
		margin: .7rem;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a.icon {
		color: var(--color-text);
		transition: color 300ms ease;
	}

	a:hover {
		color: var(--color-theme-1);
	}

	.corner > a.active,
	nav li.active,
	nav li.active a {
		color: var(--color-theme-1);
	}

	@media screen and (max-width: 600px) and (orientation: portrait) {
		.corner.logo {
			display: none;
		}

		li {
			margin: .1rem;
		}

		nav a {
			font-size: .7rem;
		}
	}
</style>
