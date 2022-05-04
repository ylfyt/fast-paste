<script lang="ts">
	import Container from './components/container.svelte';
	import Home from './pages/home.svelte';
	import { collection, where, query, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
	import { collectionData } from 'rxfire/firestore';
	import { db } from './utils/firebase';
	import { startWith } from 'rxjs';
	import { onMount } from 'svelte';
	import { nanoid } from 'nanoid/async';

	const pasteRef = query(collection(db, 'pastes'), where('roomId', '==', '1'));
	const pastes = collectionData(pasteRef, { idField: 'id' }).pipe(startWith([]));

	const updateData = (pasteId: string) => {
		updateDoc(doc(db, 'pastes', pasteId), {
			text: 'Updated',
		});
	};

	onMount(async () => {
		const id = await nanoid(6);
		console.log(id);
	});
</script>

<main class="app">
	<Container>
		<Home />
	</Container>

	<ul>
		{#each $pastes as paste}
			<li>
				<p>{paste.text}</p>
				<button on:click={() => updateData(paste.id)}>Edit</button>
			</li>
		{/each}
	</ul>
</main>

<style>
	:global(:root) {
		--accent-color: rgba(204, 0, 0);
	}

	.app {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		text-align: center;
	}
</style>
