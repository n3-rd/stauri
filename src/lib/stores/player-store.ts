import type { AudioMetadata } from '$lib/utils/metatada';
import { playAudio } from '$lib/utils/player';
import { writable } from 'svelte/store';

export interface Track {
	title: string;
	artist: string;
	album: string;
	duration: number;
	cover: string;
}

export const nowPlaying = writable<AudioMetadata | null>(null);
export const queue = writable([]);
export const playing = writable(false);
