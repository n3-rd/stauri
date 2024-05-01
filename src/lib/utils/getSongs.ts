import { audioDir } from '@tauri-apps/api/path';
import { readDir, BaseDirectory } from '@tauri-apps/api/fs';
import { db } from '$lib/db';
import { getAudioMetadata } from './metatada';

export const readAllFiles = async () => {
    const audioDirPath = await audioDir();
    const entries = await readDir(audioDirPath, { dir: BaseDirectory.AppData, recursive: true });

    const songEntries = entries.filter(entry => {
        const fileExtension = entry.path.split('.').pop();
        return ['mp3', 'wav', 'flac'].includes(fileExtension);
    });

    await Promise.all(songEntries.map(songEntry => addFiles(songEntry.path)));
}

export let sanitizeFileName = (str: string) => {
    return str.replace(/[^a-zA-Z0-9-_]/g, '_');
};

export const listAllSongs = async () => {
    let songs = await db.songs.toArray();
    console.log(songs);
};

export const formatArtist = (artist: string) => {
    return artist.replace(/\0/g, ', ');
};

export const addFiles = async (file: any) => {
    // Check if the song already exists in the database
    const existingSong = await db.songs.get(file);

    // If the song doesn't exist, get its metadata and add it to the database
    if (!existingSong) {
        let metaData = await getAudioMetadata(file);
        let fileName = file.toString().split('\\').pop().split('/').pop();
        let artist = metaData.artist;
        let album = metaData.album;
        let title = metaData.title;
        let duration = metaData.duration;
        let year = metaData.year;
        let picture = metaData.picture;
        let filePath = file;

        const pushSong = async () => {
            try {
                const id = await db.songs.add({
                    id: file,
                    album: album,
                    artist: artist,
                    title: title,
                    fileName: fileName,
                    duration: duration,
                    year: year,
                    filePath: filePath
                });

                const sanitizedFileName = sanitizeFileName(title + artist);
            } catch (err) {
                console.log(err);
            }
        };

        await pushSong();
    }
};