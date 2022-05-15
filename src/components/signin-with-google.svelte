<script lang="ts">
	import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

	import { auth } from '../utils/firebase';
	import { userRoomId, authUser } from '../stores/user-store';

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
</script>

<div class="auth">
	{#if $authUser}
		<button on:click={() => logout()}>Logout</button>
		<button on:click={() => {}}>
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
</style>
