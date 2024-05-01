import { convertFileSrc } from "@tauri-apps/api/tauri";
import { platform } from '@tauri-apps/api/os';
import { invoke } from "@tauri-apps/api";
import { Howl, Howler } from 'howler';

const convertFileSrc2 = async (path) => {
    return await invoke('convert_file_src_2', { path })
}
export async function playAudio(url) {
    const platformName = await platform()
    console.log(await convertFileSrc2(url))
    console.log(convertFileSrc(url))

    let musicUrl = null;
    if (platformName === 'linux') {
        musicUrl = await convertFileSrc2(url)
    } else {
        musicUrl = convertFileSrc(url)
    }
    Howler.unload();

    var sound = new Howl({
        src: [musicUrl],
        html5: true
    });

    // stop sound first
    sound.play();
    // let audio = new Audio(musicUrl);
    // audio.play();
}