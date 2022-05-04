<script lang="ts">
	import { Router, Link, Route, useFocus } from 'svelte-navigator';

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
		--accent-color: rgba(204, 0, 0);
	}

	.app {
		min-height: 100vh;
		display: flex;
		justify-content: center;
	}
</style>
