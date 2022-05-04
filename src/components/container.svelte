<div class="container">
	<slot />
</div>

<style>
	.container {
		width: 80%;
	}

	@media (max-width: 600px) {
		.container {
			width: 100%;
		}
	}
</style>
