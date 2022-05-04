<script lang="ts">
	import { nanoid } from 'nanoid';
	import { useNavigate } from 'svelte-navigator';
	import { setDoc, doc } from 'firebase/firestore';
	import { db } from '../utils/firebase';
	import { onMount } from 'svelte';

	const navigate = useNavigate();
	let roomId = '';

	const createNewRoom = async () => {
		const newRoomId = nanoid(6);
		const roomRef = doc(db, 'rooms', newRoomId);
		try {
			await setDoc(roomRef, {
				userId: '',
			});
			prevRooms.push(newRoomId);
			localStorage.setItem('rooms', JSON.stringify(prevRooms));
			navigate(`/${newRoomId}`);
		} catch (error) {
			console.log(error);
		}
	};

	let prevRooms: string[] = [];

	onMount(() => {
		const rooms = localStorage.getItem('rooms');
		if (!rooms) {
			return;
		}
		prevRooms = JSON.parse(rooms);
	});
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

	<div class="prev-room-container">
		{#each prevRooms as room}
			<button
				on:click={() => {
					navigate(`/${room}`);
				}}>go to: {room}</button
			>
		{/each}
	</div>
</div>

<style>
	.home {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		margin-top: 100px;
		gap: 40px;
	}

	.prev-room-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
