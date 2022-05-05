<script lang="ts">
	import { nanoid } from 'nanoid';
	import { useNavigate, Link } from 'svelte-navigator';
	import { setDoc, doc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { db } from '../utils/firebase';
	import type { IRoom } from '../utils/interfaces';

	const navigate = useNavigate();
	let roomId = '';
	let loading = false;
	let error = '';

	const checkRoomExist = async (newRoomId: string): Promise<boolean> => {
		const roomDocRef = doc(db, 'rooms', newRoomId);
		const roomSnap = await getDoc(roomDocRef);
		return roomSnap.exists();
	};

	const createNewRoom = async () => {
		loading = true;
		const newRoomId = nanoid(6);
		const exist = await checkRoomExist(newRoomId);
		if (exist) {
			error = 'Failed to create new Room. Try Again!';
			loading = false;
			return;
		}
		const newRoom: IRoom = {
			pastes: [],
			userId: '',
		};
		const roomRef = doc(db, 'rooms', newRoomId);
		try {
			await setDoc(roomRef, newRoom);
			prevRooms.push(newRoomId);
			localStorage.setItem('rooms', JSON.stringify(prevRooms));
			error = '';
			loading = false;
			navigate(`/${newRoomId}`);
		} catch (error) {
			error = 'Failed to create new Room. Try Again!';
			loading = false;
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
		<button disabled={loading} type="submit">GO</button>
	</form>

	<div class="new">
		<button disabled={loading} class="new-button" on:click={() => createNewRoom()}>Create New Room</button>
		{#if loading}
			<p>Please wait...</p>
		{:else if error !== ''}
			<p>{error}</p>
		{/if}
	</div>
	<div class="prev-room">
		<div class="prev-title">Previous Room</div>
		<div class="prev-room-container">
			<ul>
				{#each prevRooms as room}
					<li>
						<Link to={`/${room}`}>{room}</Link>
					</li>
				{/each}
			</ul>
		</div>
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

	.prev-room {
		border: 1px solid;
		padding: 10px;
		min-width: 400px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.prev-title {
		font-size: large;
		font-weight: 500;
	}

	.new-button {
		background-color: rgb(7, 255, 7);
		padding: 10px 20px;
		border: none;
		box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.2);
		border-radius: 10px;
		font-size: medium;
		font-weight: 500;
	}

	.new {
		text-align: center;
	}
	.new-button:hover {
		cursor: pointer;
	}

	.new-button:active {
		box-shadow: none;
	}

	form {
		display: flex;
		gap: 10px;
	}

	form input {
		padding: 5px 10px;
		font-size: large;
		font-weight: 600;
		border-radius: 10px;
		text-align: center;
	}

	form button {
		padding: 5px 20px;
		background-color: orange;
		font-size: medium;
		font-weight: 500;
		border: none;
		border-radius: 10px;
		box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.2);
	}

	form button:hover {
		cursor: pointer;
	}

	form button:active {
		box-shadow: none;
	}
</style>
