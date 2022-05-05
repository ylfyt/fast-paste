<script lang="ts">
	import LoadingIcon from './svg-icons/loading-icon.svelte';
	import SendIcon from './svg-icons/send-icon.svelte';

	export let backgroundColor: string;
	export let type: string;
	export let isBusy: boolean;
	export let disabled: boolean;
</script>

<button {type} disabled={isBusy || disabled} style={`background-color: ${backgroundColor};`}>
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
		box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.2);
		min-height: 40px;
	}

	button:hover {
		color: aqua;
		cursor: pointer;
	}

	button:enabled:active {
		box-shadow: none;
	}

	button:disabled {
		cursor: default;
	}
</style>
