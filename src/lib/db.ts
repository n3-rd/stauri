import Dexie, { type Table } from 'dexie';

export interface Song {
    id: string,
    title: string,
    artist: string,
    album: string,
    duration: number,
    path: string,
    artwork: string
}

export class MySubClassedDexie extends Dexie {
    songs!: Table<Song, string>; // The second generic parameter is the type of the primary key
    constructor() {
        super('songsDatabase');
        this.version(2).stores({
            songs: 'id, title, artist, album, duration, path, artwork' // Define the schema for the songs table
        });
    }
}

export const db = new MySubClassedDexie();