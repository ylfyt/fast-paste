<div class="lds-dual-ring" />

<style>
	.lds-dual-ring {
		display: flex;
		width: 50px;
		height: 50px;
		align-items: center;
		justify-content: center;
	}
	.lds-dual-ring:after {
		content: ' ';
		display: block;
		width: 32px;
		height: 32px;
		/* margin: 8px; */
		border-radius: 50%;
		border: 6px solid #fff;
		border-color: var(--color1) transparent var(--color1) transparent;
		animation: lds-dual-ring 1.2s linear infinite;
	}
	@keyframes lds-dual-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
