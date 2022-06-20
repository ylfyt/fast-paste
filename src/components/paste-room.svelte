<script lang="ts">
	import { onSnapshot, DocumentReference, doc } from 'firebase/firestore';
	import { Link } from 'svelte-navigator';
	import { onDestroy } from 'svelte';

	import { db } from '../utils/firebase';
	import type { IRoom } from '../utils/interfaces';
	import Input from './input.svelte';
	import PasteCard from './paste-card.svelte';

	export let roomId: string;

	let myRoom: IRoom | null = null;
	const roomRef = doc(db, 'rooms', roomId) as DocumentReference<IRoom>;
	const roomUnSub = onSnapshot(roomRef, (doc) => {
		myRoom = doc.data();
		myRoom.id = roomId;
	});

	onDestroy(() => {
		roomUnSub();
	});

	$: myRoom && updateScroll();

	let pasteContainerElement: HTMLDivElement;
	const updateScroll = () => {
		if (!pasteContainerElement) return;
		setTimeout(() => {
			pasteContainerElement.scrollTop = pasteContainerElement.scrollHeight;
		}, 0);
	};
</script>

<svelte:head>
	<title>Paste Room: {roomId}</title>
</svelte:head>
<div class="paste-room">
	<div class="room-title">
		<p>Room Id: {roomId}</p>
		<Link to="/">Home</Link>
	</div>
	<div bind:this={pasteContainerElement} class="paste-container">
		{#if myRoom}
			{#if myRoom.pastes.length != 0}
				{#each myRoom.pastes as paste}
					<PasteCard {paste} room={myRoom} />
				{/each}
			{:else}
				<p style="text-align: center;">There is no data</p>
			{/if}
		{:else}
			<p style="text-align: center;">Loading...</p>
		{/if}
	</div>
	<Input {roomId} />
</div>

<style>
	.paste-room {
		width: 70%;
		height: 90vh;
		background-color: var(--color4);
		color: var(--color0);
		display: flex;
		flex-direction: column;
		border-radius: 10px;
		box-shadow: 2px 3px 20px var(--darkShadow);
	}

	.room-title {
		padding: 5px 10px;
		display: flex;
		justify-content: space-between;
		text-decoration: none;
	}

	.paste-container {
		background-color: var(--color3);
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 15px;
		overflow-y: scroll;
		overflow-x: hidden;
		padding-bottom: 10px;
		padding-top: 10px;
		scroll-behavior: smooth;
	}

	.paste-container::-webkit-scrollbar {
		width: 3px;
	}
	.paste-container::-webkit-scrollbar-thumb {
		background-color: var(--color1);
	}
	.paste-container::-webkit-scrollbar-track {
		background-color: var(--color0);
	}

	@media (max-width: 960px) {
		.paste-room {
			width: 100%;
		}
	}

	@media (max-width: 600px) {
		.paste-room {
			border-radius: 0;
			height: 93vh;
		}
	}
</style>
