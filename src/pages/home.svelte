<script lang="ts">
	import { navigate, Link } from 'svelte-navigator';
	import { onMount } from 'svelte';

	import SendButton from '../components/send-button.svelte';
	import SigninWithGoogle from '../components/signin-with-google.svelte';
	import createRoom from '../utils/create-room';

	let roomId = '';
	let loading = false;
	let errorMessage = '';

	const createNewRoom = async () => {
		loading = true;
		const { error, roomId } = await createRoom();
		loading = false;
		errorMessage = error;
		if (roomId !== '') {
			navigate(`/${roomId}`);
		}
	};

	let roomIdInput: HTMLInputElement;
	let prevRooms: string[] = [];
	onMount(() => {
		roomIdInput && roomIdInput.focus();
		const rooms = localStorage.getItem('rooms');
		if (!rooms) {
			return;
		}
		prevRooms = JSON.parse(rooms);
	});
</script>

<svelte:head>
	<title>Easy Paste</title>
</svelte:head>
<div class="home">
	<form
		on:submit|preventDefault={() => {
			if (roomId === '') return;
			navigate(`/${roomId}`);
		}}
	>
		<input bind:this={roomIdInput} type="text" placeholder="Room Id" bind:value={roomId} />
		<SendButton type="submit" isBusy={loading} disabled={loading || roomId === ''} />
	</form>
	<div class="new">
		<div class="or-text">or</div>
		<button disabled={loading} class="new-button" on:click={() => createNewRoom()}>Create New Room</button>
		{#if loading}
			<p class="loading-message">Please wait...</p>
		{:else if errorMessage !== ''}
			<p>{errorMessage}</p>
		{/if}
	</div>
	<div class="auth-container">
		<div class="or-text">or</div>
		<SigninWithGoogle />
	</div>
	<div class="prev-room">
		<div class="prev-title" style="width: 100%; text-align: center;">Previous Room</div>
		<div class="prev-room-container" style="width: 100%;">
			<ul style="width: 100%;">
				{#each prevRooms as _, idx}
					<li style="width: 100%; display: flex; justify-content: space-evenly;">
						<div style="width: 20%;" />
						<div style="flex: 1;text-align: center;">
							<Link to={`/${prevRooms[prevRooms.length - idx - 1]}`}>{prevRooms[prevRooms.length - idx - 1]}</Link>
						</div>
						<div
							on:click={() => {
								prevRooms = prevRooms.filter((_, i) => i !== prevRooms.length - idx - 1);
								localStorage.setItem('rooms', JSON.stringify(prevRooms));
							}}
							style="width: 20%; color: var(--color1);cursor: pointer;user-select: none;"
						>
							&#x2715;
						</div>
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
	.auth-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.or-text {
		margin-bottom: 10px;
		color: var(--color0);
	}
	.prev-room-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
		color: var(--color0);
	}

	.prev-room-container ul {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	:global(a) {
		color: var(--color0);
	}

	.prev-room {
		border: 1px solid;
		padding: 10px;
		min-width: 400px;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--color1);
	}

	.loading-message {
		color: var(--color0);
	}

	.prev-title {
		font-size: large;
		font-weight: 500;
	}

	.new-button {
		background-color: var(--color1);
		padding: 10px 20px;
		border: none;
		box-shadow: 2px 4px 20px var(--darkShadow);
		border-radius: 10px;
		font-size: medium;
		font-weight: 500;
	}

	.new-button:enabled:hover {
		background-color: var(--color2);
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
		border: none;
		background-color: var(--color0);
		box-shadow: 2px 4px 20px var(--darkShadow);
		outline: 2px solid var(--color1);
	}

	form input:focus {
		outline: 3px solid var(--color1);
	}
</style>
