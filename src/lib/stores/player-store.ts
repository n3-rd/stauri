import type { AudioMetadata } from "$lib/utils/metatada";
import { playAudio } from "$lib/utils/player";
import { writable } from "svelte/store";

export interface Track {
    title: string;
    artist: string;
    album: string;
    duration: number;
    cover: string;
}

export const nowPlaying = writable<AudioMetadata | null>(null);
export const queue = writable([]);

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Helper function to add a song to the queue
export function addToQueue(song) {
    queue.update(q => [...q, song]);
}

// Helper function to remove a song from the queue
export function removeFromQueue(index) {
    queue.update(q => {
        if (index >= 0 && index < q.length) {
            return q.slice(0, index).concat(q.slice(index + 1));
        }
        return q;
    });
}

// Helper function to play the next song in the queue
// Helper function to play the next song in the queue
// Helper function to play the next song in the queue
export function playNext() {
    let nextIndex;
    queue.update(q => {
        if (q.length === 0) {
            return q;
        }

        nextIndex = (nextIndex + 1) % q.length;
        return shuffleArray(q);
    });
    // Check if the song is defined before trying to play it
    if (queue[nextIndex]) {
        // Play the next song
        playAudio(queue[nextIndex].filePath);
    }
    return nextIndex;
}

// Helper function to play the previous song in the queue
export function playPrevious() {
    let prevIndex;
    queue.update(q => {
        if (q.length === 0) {
            return q;
        }

        prevIndex = (prevIndex - 1 + q.length) % q.length;
        return shuffleArray(q);
    });
    // Check if the song is defined before trying to play it
    if (queue[prevIndex]) {
        // Play the previous song
        playAudio(queue[prevIndex].filePath);
    }
    return prevIndex;
}