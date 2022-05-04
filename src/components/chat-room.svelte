<script lang="ts">
	import { collection, where, query, addDoc, orderBy, onSnapshot, CollectionReference } from 'firebase/firestore';
	import { db } from '../utils/firebase';
	import moment from 'moment';
	import type { Paste } from '../utils/interfaces';

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

	let text = '';

	const updatePastes = (data: Paste[]) => {
		pastes = [...data];
	};

	const sendPaste = async () => {
		if (text === '') return;
		try {
			const docRef = await addDoc(pasteRef, {
				roomId: roomId,
				text: text,
				createAt: Math.round(Date.now() / 1000),
			});
			text = '';
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class="chat-room">
	<p>Room Id: {roomId}</p>
	<div class="paste-container">
		{#if pastes.length !== 0}
			{#each pastes as paste}
				<div class="paste">
					<div class="date">{moment.unix(paste.createAt).format('DD-MM-YYYY HH:mm:ss')}</div>
					<div class="text">{paste.text}</div>
				</div>
			{/each}
		{:else}
			<p>There is no data</p>
		{/if}
	</div>
	<div class="form-container">
		<form on:submit|preventDefault={() => sendPaste()}>
			<input type="text" bind:value={text} placeholder="Text" />
			<button type="submit">send</button>
		</form>
	</div>
</div>

<style>
	#dummy {
		background-color: red;
		width: 100px;
		height: 100px;
	}
	.chat-room {
		width: 400px;
		height: 600px;
		background-color: white;
		margin-top: 50px;
		color: black;
		display: flex;
		flex-direction: column;
	}

	.form-container {
		width: 100%;
		padding: 10px 20px;
		background-color: gray;
	}
	.form-container form {
		display: flex;
		gap: 10px;
	}
	.form-container input {
		border: none;
		width: 100%;
		padding: 5px 10px;
		border-radius: 10px;
	}

	button {
		padding: 5px 8px;
	}

	.paste-container {
		background-color: rgb(236, 236, 236);
		height: 100%;
		text-align: end;
		display: flex;
		flex-direction: column;
		gap: 5px;
		overflow-y: scroll;
		padding-bottom: 10px;
		padding-top: 10px;
	}

	.paste {
		margin-right: 5px;
		margin-left: 5px;
		border-radius: 10px;
		padding: 5px 10px;
		box-shadow: 2px 3px rgba(0, 0, 0, 0.2);
	}

	.paste .date {
		text-align: start;
		font-size: x-small;
	}

	.paste .text {
		font-size: small;
	}
</style>
