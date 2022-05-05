<script lang="ts">
	import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
	import { nanoid } from 'nanoid';
	import { db } from '../utils/firebase';
	import type { IPaste } from '../utils/interfaces';
	import SendButton from './send-button.svelte';

	export let roomId: string;

	let text = '';
	let loading = false;
	const sendPaste = async () => {
		if (text === '') return;
		loading = true;
		try {
			const newPaste: IPaste = {
				createAt: Math.round(Date.now() / 1000),
				text: text,
				id: nanoid(),
			};
			const roomRef = doc(db, 'rooms', roomId);
			await updateDoc(roomRef, {
				pastes: arrayUnion(newPaste),
			});
			text = '';
		} catch (error) {
			console.log(error);
		}
		loading = false;
	};
</script>

<div class="form-container">
	<form on:submit|preventDefault={() => sendPaste()}>
		<textarea type="text" bind:value={text} placeholder="Text" />
		<SendButton type="submit" disabled={text == '' || loading} isBusy={loading} backgroundColor="#F5DEB3" />
	</form>
</div>

<style>
	.form-container {
		width: 100%;
		padding: 10px 20px;
	}
	.form-container form {
		display: flex;
		align-items: flex-end;
		gap: 10px;
	}
	.form-container textarea {
		border: none;
		width: 100%;
		padding: 5px 10px;
		border-radius: 10px;
		resize: none;
	}
</style>
