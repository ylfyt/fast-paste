<script lang="ts">
	import moment from 'moment';
	import type { IPaste } from 'src/utils/interfaces';

	export let paste: IPaste;

	let copied = false;
	const copyText = () => {
		navigator.clipboard.writeText(paste.text).then(
			() => {
				copied = true;
			},
			() => {
				alert('Failed to copy');
			}
		);
	};
</script>

<div class="paste">
	<div class="date">{moment.unix(paste.createAt).format('LLL')}</div>
	<div class="text">
		{#if !paste.isFile}
			{paste.text}
		{:else}
			<div style="display: flex; gap: 5px;">
				<p>File:</p>
				<a href={paste.text} target="_blank">{paste.originalFilename}</a>
			</div>
		{/if}
	</div>
	<div class="copy-text">
		{#if copied}
			<p class="copy-message">Copied</p>
		{/if}
		<button class="copy-button" on:click={() => copyText()}>copy {paste.isFile ? 'URL' : 'text'}</button>
	</div>
</div>

<style>
	button {
		padding: 5px 8px;
	}

	.paste {
		margin-right: 10px;
		margin-left: 10px;
		border-radius: 10px;
		padding: 5px 10px;
		background-color: var(--color2);
		box-shadow: 2px 3px 10px var(--darkShadow);
		display: flex;
		flex-direction: column;
	}

	.copy-message {
		font-size: x-small;
		color: #0f0;
		display: block;
	}

	.copy-text {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
	}

	.copy-button {
		padding: 2px 0;
		width: 150px;
		font-size: x-small;
		box-shadow: 2px 3px 20px var(--darkShadow);
		border-radius: 5px;
		border: none;
		background-color: var(--color4);
		color: var(--color0);
	}
	.copy-button:focus {
		border: none;
	}
	.copy-button:active {
		box-shadow: none;
	}

	.paste .date {
		text-align: start;
		font-size: x-small;
		color: var(--whiteColor);
	}

	.paste .text {
		font-size: small;
		overflow-wrap: break-word;
		white-space: pre-wrap;
	}
</style>
