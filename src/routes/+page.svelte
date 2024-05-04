<script lang="ts">
	import MiniPlayer from '$lib/components/MiniPlayer.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import * as Table from '$lib/components/ui/table';
	import { db } from '$lib/db';
	import { queue } from '$lib/stores/player-store';
	import { listAllSongs, readAllFiles } from '$lib/utils/getSongs';
	import { playAudio } from '$lib/utils/player';
	import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';

	let songs = [];
	liveQuery(() => db.songs.toArray()).subscribe((value) => {
		songs = value;
	});

	const playSong = async (filePath: string, song: any) => {
		await playAudio(filePath);
	};

	onMount(async () => {
		await readAllFiles();
	});
</script>

<div class="flex min-h-[90vh] min-w-full">
	<div class="w-[15%]">
		<SideBar />
	</div>
	<div class="max-h-[90vh] w-full overflow-auto">
		<Table.Root>
			<Table.Header>
				<Table.Row class="sticky top-0 z-10 bg-white">
					<Table.Head class="">Title</Table.Head>
					<Table.Head class="">Artist</Table.Head>
					<Table.Head class="">Album</Table.Head>
					<Table.Head class="">Duration</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each songs as song}
					<Table.Row class="cursor-pointer" on:click={async () => playSong(song)}>
						<Table.Cell class="line-clamp-1 font-medium">{song.title}</Table.Cell>
						<Table.Cell class="">{song.artist}</Table.Cell>
						<Table.Cell class="">{song.album}</Table.Cell>
						<Table.Cell class="">{song.duration}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<MiniPlayer />
