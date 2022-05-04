<script lang="ts">
	import { collection, where, query, addDoc, orderBy, onSnapshot, CollectionReference } from 'firebase/firestore';
	import { db } from '../utils/firebase';
	import moment from 'moment';
	import type { Paste } from '../utils/interfaces';
	import { onDestroy } from 'svelte';

	export let roomId: string;

	const pasteRef = collection(db, 'pastes') as CollectionReference<Paste>;
	const pasteQuery = query(pasteRef, orderBy('createAt'), where('roomId', '==', roomId));

	let pastes: Paste[] = [];
	const unSub = onSnapshot(pasteQuery, (snap) => {
		let data = [];
		snap.forEach((doc) => {
			data.push({
				...doc.data(),
				id: doc.id,
			});
		});
		updatePastes(data);
	});

	onDestroy(() => {
		unSub();
	});

	let text = '';

	const updatePastes = (data: Paste[]) => {
		pastes = [...data];
	};

	const sendPaste = async () => {
		if (text === '') return;
		try {
			await addDoc(pasteRef, {
				roomId: roomId,
				text: text,
				createAt: Math.round(Date.now() / 1000),
			});
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
		navigator.clipboard.writeText(text);
		const element = e.currentTarget;
		element.style.backgroundColor = '#00FF00';
		setTimeout(() => {
			element.style.backgroundColor = '#E5E5E5';
		}, 1000);
	};
</script>

<svelte:head>
	<title>Paste Room: {roomId}</title>
</svelte:head>
<div class="chat-room">
	<p>Room Id: {roomId}</p>
	<div class="paste-container">
		{#if pastes.length !== 0}
			{#each pastes as paste}
				<div class="paste">
					<div class="date">{moment.unix(paste.createAt).format('DD-MM-YYYY HH:mm:ss')}</div>
					<div class="text">{paste.text}</div>
					<button class="copy-button" on:click={(e) => copyText(paste.text, e)}>copy to clipboard</button>
				</div>
			{/each}
		{:else}
			<p>There is no data</p>
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
	.chat-room {
		width: 500px;
		height: 90vh;
		background-color: rgb(206, 206, 206);
		margin-top: 50px;
		color: black;
		display: flex;
		flex-direction: column;
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
</style>
