import { BaseDirectory, writeBinaryFile } from '@tauri-apps/api/fs';
import { appDataDir, join } from '@tauri-apps/api/path';
import { convertFileSrc, invoke } from '@tauri-apps/api/tauri';
import pLimit from 'p-limit';

export type AudioMetadata = {
    artist: string,
    album: string,
    title: string,
    duration: number,
    year: number,
    artwork: string,
    filePath: string
};

export let getAudioMetadata = async (file: any) => {
    let metadata: AudioMetadata = await invoke('get_audio_metadata', { filePath: file });
    return {
        artist: metadata.artist,
        album: metadata.album,
        title: metadata.title,
        duration: metadata.duration,
        year: metadata.year,
        artwork: metadata.picture,
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

export let savePicture = async (
    name: string,
    path: any
) => {
    // Write a binary file to the `$APPDATA/avatar.png` path
    // await writeBinaryFile(`${name}.png`, new Uint8Array([]), { dir: BaseDirectory.AppData });
    await writeBinaryFile(`${name}.png`, path, { dir: BaseDirectory.AppData });
};

export let sanitizeFileName = (str: string) => {
    // Replace any characters that are not alphanumeric, dashes, or underscores with underscores
    if (str) {
        return str.replace(/[^a-zA-Z0-9-_]/g, '_');

    }
};

export const loadImage = async (e: string) => {
    const appDataDirPath = await appDataDir();
    console.log('appdatadir', appDataDirPath);
    let sanitizedName = sanitizeFileName(e);
    console.log('sanitizedName', sanitizedName);
    const filePath = await join(appDataDirPath, `${sanitizedName}.png`);
    console.log('filePath', filePath);
    const assetUrl = convertFileSrc(filePath);
    console.log('assetUrl', assetUrl);
    return assetUrl;
};