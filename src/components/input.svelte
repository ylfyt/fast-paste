<script lang="ts">
	import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import { nanoid } from 'nanoid';
	import { authUser } from '../stores/user-store';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { db, storage } from '../utils/firebase';
	import type { IPaste } from '../utils/interfaces';
	import SendButton from './send-button.svelte';
	import ClipIcon from './svg-icons/clip-icon.svelte';
	import Spinner from './spinner.svelte';
	import { showToast } from '../utils/show-toast';

	export let roomId: string;

	let text = '';
	let loading = false;
	let loadingFile = false;

	const sendToFirestore = async (data: IPaste): Promise<boolean> => {
		try {
			const roomRef = doc(db, 'rooms', roomId);
			await updateDoc(roomRef, {
				pastes: arrayUnion(data),
			});

			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	};

	const sendPaste = async () => {
		if (text === '') return;

		const newPaste: IPaste = {
			createAt: Math.round(Date.now() / 1000),
			text: text,
			id: nanoid(),
			isFile: false,
			filename: null,
		};
		loading = true;
		const succes = await sendToFirestore(newPaste);
		loading = false;
		if (!succes) {
			showToast('Failed to send paste', false);
			return;
		}
		text = '';
		updateTextarea(true);
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

	const sendFile = async (file: File, ext: string): Promise<boolean> => {
		const refPath = `${$authUser ? 'auth' : 'anonymous'}/${$authUser ? $authUser.uid : roomId}/${nanoid()}${ext}`;
		const storageRef = ref(storage, refPath);

		try {
			const resFile = await uploadBytes(storageRef, file);
			if (!resFile) {
				return false;
			}
			const downloadUrl = await getDownloadURL(resFile.ref);
			const newPaste: IPaste = {
				createAt: Math.round(Date.now() / 1000),
				text: downloadUrl,
				id: nanoid(),
				isFile: true,
				filename: resFile.ref.name,
				originalFilename: file.name,
			};
			return await sendToFirestore(newPaste);
		} catch (error) {
			console.log(error);
			return false;
		}
	};
	const SIZE_LIMIT = 5 * 1024 * 1024;
	let files: FileList;
	const handleSubmitFile = async (data: FileList) => {
		if (!data) return;
		loadingFile = true;
		for (let i = 0; i < data.length; i++) {
			const file = data[i];
			if (file.size > SIZE_LIMIT) {
				showToast(`File size should be < 5MB<br>${file.name}`, false);
				continue;
			}
			const ext = file.name.match(/\.[0-9a-z]+$/i)[0];
			const succes = await sendFile(file, ext);

			if (!succes) {
				showToast(`Failed to upload file<br>${file.name}`, false);
			} else {
				showToast(`File uploaded<br>${file.name}`, true);
			}
		}
		loadingFile = false;
	};

	$: files && handleSubmitFile(files);

	onMount(() => {
		textAreaElement.focus();
	});
</script>

<div class="form-container">
	<form on:submit|preventDefault={() => sendPaste()}>
		<label class="custom-file-upload">
			<input multiple type="file" bind:files />
			<ClipIcon />
		</label>
		<textarea bind:this={textAreaElement} rows="1" type="text" bind:value={text} placeholder="Text" />
		<SendButton type="submit" disabled={text == '' || loading} isBusy={loading} />
	</form>
	{#if loadingFile}
		<div class="loader" transition:scale><Spinner /></div>
	{/if}
</div>

<style>
	input[type='file'] {
		display: none;
	}

	.custom-file-upload {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		fill: black;
		height: 40px;
		width: 40px;
		border-radius: 10px;
		background-color: var(--color1);
	}
	.form-container {
		width: 100%;
		padding: 10px 20px;
		box-shadow: 2px 4px 20px var(--darkShadow);
		position: relative;
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
		font-weight: 500;
		min-height: 40px;
		background-color: var(--color0);
		color: var(--blackColor);
	}

	.loader {
		position: absolute;
		left: 0;
		top: 0;
		background-color: rgba(255, 255, 255, 0.7);
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 20;
		border-radius: 10px;
	}

	textarea:focus {
		outline: 3px solid var(--color1);
	}
</style>
