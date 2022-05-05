<script lang="ts">
	import LoadingIcon from './svg-icons/loading-icon.svelte';
	import SendIcon from './svg-icons/send-icon.svelte';

	export let type: string;
	export let isBusy: boolean;
	export let disabled: boolean;
</script>

<button {type} disabled={isBusy || disabled}>
	{#if isBusy}
		<LoadingIcon />
	{:else}
		<SendIcon />
	{/if}
</button>

<style>
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
