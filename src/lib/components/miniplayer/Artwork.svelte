<script lang="ts">
	import { nowPlaying } from '$lib/stores/player-store';
	import { loadImage, sanitizeFileName } from '$lib/utils/metatada';

	let image: string | undefined;
	$: {
		image = sanitizeFileName($nowPlaying?.title + $nowPlaying?.artist);
	}
</script>

{#await loadImage(image) then artworkUrl}
	<div class="h-12 w-12 rounded-lg">
		<img
			src={artworkUrl}
			class="h-full w-full rounded-lg object-cover object-center"
			alt="artwork"
		/>
	</div>
{/await}
