import Dexie, { type Table } from 'dexie';

export interface Song {
    id: string,
    title: string,
    artist: string,
    album: string,
    duration: number,
    path: string,
}

export class MySubClassedDexie extends Dexie {
    songs!: Table<Song, string>; // The second generic parameter is the type of the primary key
    constructor() {
        super('songsDatabase');
        this.version(1).stores({
            songs: 'id, title, artist, album, duration, path' // Define the schema for the songs table
        });
    }
}

export const db = new MySubClassedDexie();