<script lang="ts">
	import { nanoid } from 'nanoid';
	import { useNavigate } from 'svelte-navigator';
	import { setDoc, doc } from 'firebase/firestore';
	import { db } from '../utils/firebase';

	const navigate = useNavigate();
	let roomId = '';

	const createNewRoom = async () => {
		const newRoomId = nanoid(6);
		const roomRef = doc(db, 'rooms', newRoomId);
		try {
			await setDoc(roomRef, {
				userId: '',
			});
			navigate(`/${newRoomId}`);
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class="home">
	<form
		on:submit|preventDefault={() => {
			if (roomId === '') return;

			navigate(`/${roomId}`);
		}}
	>
		<input type="text" placeholder="room id" bind:value={roomId} />
		<button type="submit">GO</button>
	</form>

	<div class="new">
		<button on:click={() => createNewRoom()}>Get New Room</button>
	</div>
</div>

<style>
	.home {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		margin-top: 100px;
	}

	.new {
		margin-top: 40px;
	}
</style>
