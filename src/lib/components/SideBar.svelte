<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import {
		Heart,
		Home,
		LineChart,
		ListMusic,
		Moon,
		Music,
		Package,
		Settings,
		ShoppingCart,
		Sun,
		Users
	} from 'lucide-svelte';
	import Badge from './ui/badge/badge.svelte';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<div class="flex w-full items-center justify-between p-5">
	<h1 class="title font-bold">Alaura</h1>
	<div class="settings">
		<Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</div>
<Separator />

<!-- <div class="flex w-full gap-2">
	<div class="flex w-full items-center gap-2 py-3">
		<div class="icon"><Music /></div>
		<div class="text">Music</div>
	</div>
</div> -->
<nav class="grid items-start px-2 py-8 text-sm font-medium lg:px-4">
	<a
		href="##"
		class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
	>
		<Music class="h-4 w-4" />
		Music
	</a>
	<a
		href="##"
		class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
	>
		<ListMusic class="h-4 w-4" />
		Playlists
	</a>
	<a
		href="##"
		class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
	>
		<Heart class="h-4 w-4" />
		Favourites
	</a>
</nav>
