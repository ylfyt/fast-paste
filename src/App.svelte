<script lang="ts">
	import { Router, Route } from 'svelte-navigator';

	import Container from './components/container.svelte';
	import Home from './pages/home.svelte';
	import Paste from './pages/paste.svelte';
</script>

<Router>
	<main class="app">
		<Container>
			<Route path="/*" primary={false}>
				<Route path="/">
					<Home />
				</Route>
				<Route path=":id">
					<Paste />
				</Route>
			</Route>
		</Container>
	</main>
</Router>

<style>
	:global(:root) {
		--color0: #ffead0;
		--color1: #f76f8e;
		--color2: #96616b;
		--color3: #37505c;
		--color4: #113537;
		--blackColor: #000000;
		--whiteColor: #ffffff;
		--darkShadow: #00000033;
		--lightShadow: #ffffff33;
	}

	.app {
		min-height: 100vh;
		display: flex;
		justify-content: center;
	}

	:global(body) {
		background-color: var(--color4);
	}

	@media (max-width: 600px) {
		.app {
			min-height: 50vh;
		}
	}
</style>
