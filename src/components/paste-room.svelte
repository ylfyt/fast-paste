<script lang="ts">
	import { onSnapshot, DocumentReference, doc } from 'firebase/firestore';
	import { Link } from 'svelte-navigator';
	import { onDestroy } from 'svelte';
	import moment from 'moment';

	import { db } from '../utils/firebase';
	import type { IRoom } from '../utils/interfaces';
	import Input from './input.svelte';

	export let roomId: string;

	let myRoom: IRoom | null = null;
	const roomRef = doc(db, 'rooms', roomId) as DocumentReference<IRoom>;
	const roomUnSub = onSnapshot(roomRef, (doc) => {
		myRoom = doc.data();
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

	const copyText = (text: string, idx: number) => {
		navigator.clipboard.writeText(text).then(
			() => {
				const message = document.getElementById(`copy-message-${idx}`);
				if (message) {
					message.style.display = 'block';
				}
			},
			() => {
				alert('Failed to copy');
			}
		);
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
				{#each myRoom.pastes as paste, idx}
					<div class="paste">
						<div class="date">{moment.unix(paste.createAt).format('DD-MM-YYYY HH:mm:ss')}</div>
						<div class="text">
							{#if !paste.isFile}
								{paste.text}
							{:else}
								<div style="display: flex; gap: 5px;">
									<p>File:</p>
									<a href={paste.text} target="_blank">{paste.originalFilename}</a>
								</div>
							{/if}
						</div>
						<div class="copy-text">
							<p class="copy-message" id={`copy-message-${idx}`}>Copied</p>
							<button class="copy-button" on:click={(e) => copyText(paste.text, idx)}>copy {paste.isFile ? 'URL' : 'text'}</button>
						</div>
					</div>
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

	button {
		padding: 5px 8px;
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

	.paste {
		margin-right: 10px;
		margin-left: 10px;
		border-radius: 10px;
		padding: 5px 10px;
		background-color: var(--color2);
		box-shadow: 2px 3px 10px var(--darkShadow);
		display: flex;
		flex-direction: column;
	}

	.copy-message {
		font-size: x-small;
		color: #0f0;
		display: none;
	}

	.copy-text {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
	}

	.copy-button {
		padding: 2px 0;
		width: 150px;
		font-size: x-small;
		box-shadow: 2px 3px 20px var(--darkShadow);
		border-radius: 5px;
		border: none;
		background-color: var(--color4);
		color: var(--color0);
	}
	.copy-button:focus {
		border: none;
	}
	.copy-button:active {
		box-shadow: none;
	}

	.paste .date {
		text-align: start;
		font-size: x-small;
		color: var(--whiteColor);
	}

	.paste .text {
		font-size: small;
		overflow-wrap: break-word;
		white-space: pre-wrap;
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
