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
			updateTextarea(true);
		} catch (error) {
			console.log(error);
		}
		loading = false;
	};

	$: text && updateTextarea();

	let textAreaElement: HTMLTextAreaElement;
	const updateTextarea = (reset: boolean = false) => {
		if (!textAreaElement) return;
		if (reset) {
			textAreaElement.style.height = '40px';
			return;
		}
		textAreaElement.style.height = 'inherit';
		textAreaElement.style.height = `${textAreaElement.scrollHeight}px`;
	};
</script>

<div class="form-container">
	<form on:submit|preventDefault={() => sendPaste()}>
		<textarea bind:this={textAreaElement} rows="1" type="text" bind:value={text} placeholder="Text" />
		<SendButton type="submit" disabled={text == '' || loading} isBusy={loading} />
	</form>
</div>

<style>
	.form-container {
		width: 100%;
		padding: 10px 20px;
		box-shadow: 2px 4px 20px var(--darkShadow);
	}
	.form-container form {
		display: flex;
		align-items: flex-end;
		gap: 10px;
	}
	.form-container textarea {
		border: none;
		width: 100%;
		padding: 10px 10px;
		border-radius: 10px;
		resize: none;
		max-height: 250px;
		outline: none;
		box-shadow: 2px 4px 20px var(--darkShadow);
		font-weight: 400;
		min-height: 40px;
		background-color: var(--color0);
		color: var(--blackColor);
	}

	textarea:focus {
		outline: 3px solid var(--color1);
	}
</style>
