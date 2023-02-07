<script lang="ts">
	import { doc, updateDoc } from 'firebase/firestore';

	import { showToast } from '../utils/show-toast';
	import { db, storage } from '../utils/firebase';
	import type { IPaste, IRoom } from '../utils/interfaces';
	import { deleteObject, ref } from 'firebase/storage';
	import { authUser, userRoomId } from '../stores/user-store';

	export let paste: IPaste;
	export let room: IRoom;

	let copied = false;
	const copyText = () => {
		navigator.clipboard.writeText(paste.text).then(
			() => {
				copied = true;
			},
			() => {
				alert('Failed to copy');
			}
		);
	};

	const deleteFile = () => {
		const refPath = `${$userRoomId === room.id ? 'auth' : 'anonymous'}/${$userRoomId === room.id ? $authUser.uid : room.id}/${paste.filename}`;
		const fileRef = ref(storage, refPath);
		deleteObject(fileRef)
			.then(() => {
				deletePaste();
			})
			.catch(() => {
				showToast('Failed to delete paste', false);
			});
	};

	const deletePaste = async () => {
		try {
			const newPaste = room.pastes.filter((pas) => pas.id !== paste.id);
			const roomRef = doc(db, 'rooms', room.id);
			await updateDoc(roomRef, {
				pastes: newPaste,
			});
			showToast('Paste deleted successfully', true);
		} catch (error) {
			showToast('Failed to delete paste', false);
		}
	};
</script>

<div class="paste">
	<div style="display: flex; align-items: flex-start; justify-content: space-between;">
		<div class="date">{new Date(paste.createAt * 1000).toLocaleString('en-US')}</div>
		<button
			on:click={() => {
				const yes = confirm('Are you sure you want to remove this paste?');
				if (!yes) return;
				if (paste.isFile) return deleteFile();
				deletePaste();
			}}
			style="height: 15px; font-weight: bold; width: 15px;user-select: none;cursor: pointer; background-color: transparent; border: none; display: flex; align-items: center; justify-content: center; "
		>
			&#x2715;
		</button>
	</div>
	<div class="text">
		{#if !paste.isFile}
			{paste.text}
		{:else}
			<div style="display: flex; gap: 5px;">
				<p>File:</p>
				<a href={paste.text} target="_blank" rel="noreferrer">{paste.originalFilename}</a>
			</div>
		{/if}
	</div>
	<div class="copy-text">
		{#if copied}
			<p class="copy-message">Copied</p>
		{/if}
		<button class="copy-button" on:click={() => copyText()}>copy {paste.isFile ? 'URL' : 'text'}</button>
	</div>
</div>

<style>
	button {
		padding: 5px 8px;
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
		display: block;
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
		cursor: pointer;
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
</style>
