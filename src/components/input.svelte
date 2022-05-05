<script lang="ts">
	import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
	import { nanoid } from 'nanoid';
	import { db } from '../utils/firebase';
	import type { IPaste } from '../utils/interfaces';

	export let roomId: string;

	let text = '';
	const sendPaste = async () => {
		if (text === '') return;
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
	};
</script>

<div class="form-container">
	<form on:submit|preventDefault={() => sendPaste()}>
		<textarea type="text" bind:value={text} placeholder="Text" />
		<button type="submit">send</button>
	</form>
</div>

<style>
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
</style>
