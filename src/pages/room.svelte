<script lang="ts">
	import ChatRoom from '../components/chat-room.svelte';
	import { onMount } from 'svelte';
	import { useParams, useNavigate, Link } from 'svelte-navigator';
	import { getDoc, doc } from 'firebase/firestore';
	import { db } from '../utils/firebase';

	const params = useParams();
	const navigate = useNavigate();
	let roomId: string | undefined = $params.id;
	let loading = true;

	if (!roomId) {
		navigate('/');
	}

	let error = '';

	onMount(async () => {
		loading = true;
		const roomDocRef = doc(db, 'rooms', roomId);
		const roomSnap = await getDoc(roomDocRef);
		if (!roomSnap.exists()) {
			error = 'No room ' + roomId;
		}
		loading = false;
	});
</script>

<div class="room">
	{#if loading}
		<p>Loading...</p>
	{:else if error === ''}
		<ChatRoom {roomId} />
	{:else}
		<p>{error}</p>
		<Link to="/">back to home</Link>
	{/if}
</div>

<style>
	.room {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
		color: white;
	}
</style>
