<script lang="ts">
	import { collection, where, query, addDoc, orderBy, onSnapshot, CollectionReference } from 'firebase/firestore';
	import { db } from '../utils/firebase';
	import moment from 'moment';
	import type { Paste } from '../utils/interfaces';

	const roomId = '1';
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
				userId: '',
				createAt: Math.round(Date.now() / 1000),
			});
			text = '';
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class="room">
	<div class="paste-container">
		<ul>
			{#if pastes.length !== 0}
				{#each pastes as paste}
					<li>
						<div>{moment.unix(paste.createAt).format('DD-MM-YYYY HH:mm:ss')}</div>
						<div>{paste.text}</div>
					</li>
				{/each}
			{:else}
				<p>There is no data</p>
			{/if}
		</ul>
	</div>
	<div class="form-container">
		<form on:submit|preventDefault={() => sendPaste()}>
			<input type="text" bind:value={text} placeholder="Text" />
			<button type="submit">send</button>
		</form>
	</div>
</div>

<style>
	.room {
		width: 300px;
		height: 400px;
		background-color: gray;
		position: relative;
	}

	.form-container {
		width: 100%;
		position: absolute;
		bottom: 0;
	}
	.form-container form {
		display: flex;
	}
	.form-container input {
		width: 100%;
	}

	ul {
		list-style: none;
	}
</style>
