import { invoke } from '@tauri-apps/api/tauri';
import pLimit from 'p-limit';

export type AudioMetadata = {
    artist: string,
    album: string,
    title: string,
    duration: number,
    year: number,
    picture: string,
    filePath: string
};

export let getAudioMetadata = async (file: any) => {
    let metadata: AudioMetadata = await invoke('get_audio_metadata', { filePath: file });
    console.log(metadata);
    return {
        artist: metadata.artist,
        album: metadata.album,
        title: metadata.title,
        duration: metadata.duration,
        year: metadata.year,
        picture: metadata.picture,
        filePath: file
    };
};

// Create a queue with a concurrency limit
const limit = pLimit(10);

export const processFiles = async (files: any[]) => {
    // Map over the files array and create a new promise for each file
    const results = await Promise.all(files.map(file => {
        // Use the limit function to add the promise to the queue
        return limit(() => getAudioMetadata(file));
    }));

    return results;
};