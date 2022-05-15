<script lang="ts">
	import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';

	import { auth } from '../utils/firebase';

	export let user: User;
	export let myRoomId: string | null;
	export let openMyRoom: () => void;

	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				console.log('Login Success');
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const logout = async () => {
		await auth.signOut();
	};
</script>

<div class="auth">
	{#if user}
		<button on:click={() => logout()}>Logout</button>
		<button
			on:click={() => {
				openMyRoom();
			}}
		>
			{#if myRoomId === null}
				Create My Room
			{:else if myRoomId === ''}
				Please Wait...
			{:else}
				Open My Room ({myRoomId})
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
