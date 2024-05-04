<script lang="ts">
	import { pauseAudio, resumeAudio, sound } from '$lib/utils/player';
	import { Film, MonitorPlay, Pause, Play, Search, SkipBack, SkipForward } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { nowPlaying, playing } from '$lib/stores/player-store';
	import Artwork from './miniplayer/Artwork.svelte';

	let soundInfo;
	let isAudioPlaying: Boolean;

	$: {
		isAudioPlaying = $playing;
		soundInfo = sound;
		console.log('playing', soundInfo);
	}
</script>

<div
	class="absolute inset-x-0 bottom-0 h-16 min-w-full border-t border-gray-500 bg-white/30 backdrop-blur-sm"
>
	<div class="flex h-full items-center justify-between px-4">
		<div class="flex items-center space-x-4">
			<Artwork />
			<div class="flex flex-col">
				<div class="text-sm font-semibold text-white">{$nowPlaying?.title}</div>
				<div class="text-xs text-gray-400">{$nowPlaying?.artist}</div>
			</div>
		</div>
		<div class="progress-bar w-1/2" />
		<nav class="flex gap-6 text-xl font-semibold lg:gap-3">
			<Button variant="outline" size="icon">
				<SkipBack />
			</Button>
			{#if isAudioPlaying}
				<Button
					variant="outline"
					size="icon"
					on:click={async () => {
						await pauseAudio();
					}}
				>
					<Pause />
				</Button>
			{:else}
				<Button
					variant="outline"
					size="icon"
					on:click={async () => {
						await resumeAudio();
					}}
				>
					<Play />
				</Button>
			{/if}
			<Button variant="outline" size="icon">
				<SkipForward />
			</Button>
		</nav>
	</div>
</div>
