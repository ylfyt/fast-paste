<script lang="ts">
	import { Router, Route } from 'svelte-navigator';
	import { onAuthStateChanged, User } from 'firebase/auth';
	import { query, collection, where, getDocs } from 'firebase/firestore';

	import Container from './components/container.svelte';
	import Home from './pages/home.svelte';
	import Paste from './pages/paste.svelte';
	import { auth, db } from './utils/firebase';

	let authUser: User;
	let myRoomId: string | null = null;
	onAuthStateChanged(auth, async (user) => {
		authUser = user;
		if (user) {
			myRoomId = '';
			const roomId = await checkRoomExistByUserId(user.uid);
			// TODO: Create New Room if user room doesn't exist
			myRoomId = roomId === '' ? null : roomId;
		} else {
			myRoomId = null;
		}
	});

	const checkRoomExistByUserId = async (userId: string): Promise<string> => {
		try {
			const q = query(collection(db, 'rooms'), where('userId', '==', userId));
			const roomSnap = await getDocs(q);
			return roomSnap.empty ? '' : roomSnap.docs[0].id;
		} catch (error) {
			console.log(error.message);
			return '';
		}
	};
</script>

<Router>
	<main class="app">
		<Container>
			<Route path="/*" primary={false}>
				<Route path="/">
					<Home user={authUser} {myRoomId} />
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
