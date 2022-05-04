<script lang="ts">
	import { onSnapshot, DocumentReference, doc, setDoc } from 'firebase/firestore';
	import { onDestroy } from 'svelte';
	import { nanoid } from 'nanoid';
	import moment from 'moment';
	import { db } from '../utils/firebase';
	import type { IRoom } from '../utils/interfaces';

	export let roomId: string;

	let myRoom: IRoom | null = null;
	const roomRef = doc(db, 'rooms', roomId) as DocumentReference<IRoom>;
	const roomUnSub = onSnapshot(roomRef, (doc) => {
		myRoom = doc.data();
	});

	onDestroy(() => {
		roomUnSub();
	});

	let text = '';

	const sendPaste = async () => {
		if (text === '') return;
		try {
			myRoom.pastes.push({
				createAt: Math.round(Date.now() / 1000),
				text: text,
				id: nanoid(),
			});
			await setDoc(roomRef, myRoom);
			text = '';
		} catch (error) {
			console.log(error);
		}
	};

	const copyText = (
		text: string,
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) => {
		const element = e.currentTarget;
		navigator.clipboard.writeText(text).then(
			() => {
				element.style.backgroundColor = '#00FF00';
				setTimeout(() => {
					element.style.backgroundColor = '#E5E5E5';
				}, 1000);
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
	<p class="room-title">Room Id: {roomId}</p>
	<div class="paste-container">
		{#if myRoom}
			{#if myRoom.pastes.length != 0}
				{#each myRoom.pastes as paste}
					<div class="paste">
						<div class="date">{moment.unix(paste.createAt).format('DD-MM-YYYY HH:mm:ss')}</div>
						<div class="text">{paste.text}</div>
						<button class="copy-button" on:click={(e) => copyText(paste.text, e)}>copy to clipboard</button>
					</div>
				{/each}
			{:else}
				<p>There is no data</p>
			{/if}
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
	<div class="form-container">
		<form on:submit|preventDefault={() => sendPaste()}>
			<textarea type="text" bind:value={text} placeholder="Text" />
			<button type="submit">send</button>
		</form>
	</div>
</div>

<style>
	.paste-room {
		width: 70%;
		height: 90vh;
		background-color: rgb(206, 206, 206);
		color: black;
		display: flex;
		flex-direction: column;
		border-radius: 10px;
	}

	.room-title {
		padding: 5px 10px;
	}

	.form-container {
		width: 100%;
		padding: 10px 20px;
	}
	.form-container form {
		display: flex;
		gap: 10px;
	}
	.form-container textarea {
		border: none;
		width: 100%;
		padding: 5px 10px;
		border-radius: 10px;
		resize: none;
	}

	button {
		padding: 5px 8px;
	}

	.paste-container {
		background-color: wheat;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 15px;
		overflow-y: scroll;
		overflow-x: hidden;
		padding-bottom: 10px;
		padding-top: 10px;
	}

	.paste {
		margin-right: 10px;
		margin-left: 10px;
		border-radius: 10px;
		padding: 5px 10px;
		background-color: white;
		box-shadow: 2px 3px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
	}

	.copy-button {
		margin-left: auto;
		padding: 2px 0;
		width: 150px;
		font-size: x-small;
		box-shadow: 2px 3px rgba(0, 0, 0, 0.2);
		border-radius: 5px;
		border: none;
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
	}

	.paste .text {
		font-size: small;
		overflow-wrap: break-word;
	}

	@media (max-width: 960px) {
		.paste-room {
			width: 100%;
		}
	}

	@media (max-width: 600px) {
		.paste-room {
			border-radius: 0;
		}
	}
</style>
