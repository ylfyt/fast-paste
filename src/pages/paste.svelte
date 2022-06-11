<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import PasteRoom from '../components/paste-room.svelte';
	import { onMount } from 'svelte';
	import { useParams, navigate, Link } from 'svelte-navigator';
	import { getDoc, doc } from 'firebase/firestore';
	import { db } from '../utils/firebase';

	const params = useParams();
	let roomId: string | undefined = $params.id;
	let loading = true;

	if (!roomId) {
		navigate('/');
	}

	let errorMessage = '';

	const verifyPrevRoom = (shouldBeDeleted: boolean) => {
		const roomJson = localStorage.getItem('rooms');
		let prevRooms: string[] = [];
		if (roomJson) {
			prevRooms = JSON.parse(roomJson);
		}
		const roomExist = prevRooms.find((room) => room == roomId);
		if (!roomExist) {
			if (!shouldBeDeleted) {
				prevRooms.push(roomId);
				localStorage.setItem('rooms', JSON.stringify(prevRooms));
			}
			return;
		}

		if (shouldBeDeleted) {
			const newPrevRoom = prevRooms.filter((room) => room != roomId);
			localStorage.setItem('rooms', JSON.stringify(newPrevRoom));
		}
	};

	onMount(async () => {
		loading = true;
		try {
			const roomDocRef = doc(db, 'rooms', roomId);
			const roomSnap = await getDoc(roomDocRef);
			if (!roomSnap.exists()) {
				errorMessage = `Room "${roomId}" is Not Found!`;
				verifyPrevRoom(true);
			} else {
				verifyPrevRoom(false);
			}
		} catch (err) {
			if (err.message.includes('insufficient permissions')) {
				errorMessage = "You Don't Have Permissions To Open This Room";
				verifyPrevRoom(true);
			} else {
				errorMessage = 'Something Wrong!!';
				verifyPrevRoom(false);
			}
		}
		loading = false;
	});
</script>

<div class="room">
	{#if loading}
		<p class="loading-message">Loading...</p>
	{:else if errorMessage === ''}
		<PasteRoom {roomId} />
	{:else}
		<p class="error-message">{errorMessage}</p>
		<Link to="/">back to home</Link>
	{/if}
</div>
<SvelteToast />

<style>
	.room {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
		min-height: 100vh;
	}

	.loading-message {
		color: var(--color0);
	}
	.error-message {
		color: var(--color1);
		font-size: x-large;
		font-weight: 500;
		text-align: center;
	}

	@media (max-width: 600px) {
		.room {
			justify-content: start;
			min-height: 50vh;
		}

		.error-message {
			margin-top: auto;
		}
		.loading-message {
			margin-top: auto;
		}
	}
</style>
