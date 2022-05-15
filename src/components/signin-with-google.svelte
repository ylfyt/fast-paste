<script lang="ts">
	import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

	import { auth } from '../utils/firebase';
	import { userRoomId, authUser } from '../stores/user-store';
	import { useNavigate } from 'svelte-navigator';
	import createRoom from '../utils/create-room';

	const navigate = useNavigate();

	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then(() => {})
			.catch((error) => {
				console.log(error);
			});
	};

	const logout = async () => {
		auth.currentUser && (await auth.signOut());
	};

	const roomAction = async () => {
		if (!$authUser) return;
		if (!$userRoomId) {
			userRoomId.set('');
			const { roomId } = await createRoom($authUser.uid);
			userRoomId.set(roomId !== '' ? roomId : null);
			return;
		}

		if ($userRoomId != '') return navigate(`/${$userRoomId}`);
	};
</script>

<div class="auth">
	{#if $authUser}
		<button class="logout" on:click={() => logout()}>Logout</button>
		<button on:click={() => roomAction()} disabled={$userRoomId === ''}>
			{#if $userRoomId === null}
				Create My Room
			{:else if $userRoomId === ''}
				Please Wait...
			{:else}
				Open My Room ({$userRoomId})
			{/if}
		</button>
	{:else}
		<button on:click={() => loginWithGoogle()}>Login</button>
	{/if}
</div>

<style>
	.auth {
		display: flex;
		gap: 20px;
		justify-content: center;
		align-items: center;
	}
	button {
		padding: 5px 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		border: none;
		box-shadow: 2px 4px 20px var(--darkShadow);
		min-height: 40px;
		background-color: var(--color1);
		font-size: medium;
		font-weight: 500;
	}

	button:enabled:hover {
		background-color: var(--color2);
		cursor: pointer;
	}

	button:enabled:active {
		box-shadow: none;
	}

	button:disabled {
		cursor: default;
	}

	.logout {
		background-color: var(--color0);
	}

	.logout:enabled:hover {
		background-color: wheat;
	}
</style>
