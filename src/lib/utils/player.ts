import { convertFileSrc } from "@tauri-apps/api/tauri";
import { platform } from '@tauri-apps/api/os';
import { invoke } from "@tauri-apps/api";
// @ts-ignore
import { Howl, Howler } from 'howler';
import type { AudioMetadata } from "./metatada";
import { nowPlaying, queue } from "$lib/stores/player-store";

const convertFileSrc2 = async (path: string) => {
    return await invoke('convert_file_src_2', { path })
}

export let sound: Howl;


export async function playAudio(song: AudioMetadata) {
    const url = song.filePath;
    const platformName = await platform();
    let musicUrl = null;

    if (platformName === 'linux') {
        musicUrl = await convertFileSrc2(url);
    } else {
        musicUrl = convertFileSrc(url);
    }

    // Stop the currently playing audio if any
    if (sound && sound.playing()) {
        await stopAudio();
    }

    // Load the new audio source
    sound = new Howl({
        src: [musicUrl],
        html5: true,
        onplay: () => {
            // Update the nowPlaying state when the audio starts playing
            nowPlaying.set(song);
        },
    });

    // Play the new audio
    sound.play();
}

export async function stopAudio() {
    if (sound) {
        sound.stop();
        sound.unload();
    }
}

export async function pauseAudio() {
    if (sound && sound.playing()) {
        sound.pause();
    }
}

export async function resumeAudio() {
    if (sound && !sound.playing()) {
        sound.play();
    }
}

export const isPlaying = () => {
    let res = sound && sound.playing();
    return JSON.stringify(res)

};
