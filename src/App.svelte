<script lang="ts">
	import { Router, Route } from 'svelte-navigator';
	import { onAuthStateChanged } from 'firebase/auth';

	import Container from './components/container.svelte';
	import Home from './pages/home.svelte';
	import Paste from './pages/paste.svelte';
	import { auth } from './utils/firebase';
	import { authUser, userRoomId } from './stores/user-store';
	import verifyUserRoom from './utils/verify-user-room';

	onAuthStateChanged(auth, async (user) => {
		authUser.set(user);
		userRoomId.set(null);
		if (user) {
			// console.log('User Login');
			verifyUserRoom(user.uid);
			return;
		}
		// console.log('User Logout');
	});
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
