import { clientInstance } from "..";

export default class SoundsManager {
    public static readonly SOUND_CATALOGUE_CASH = "/assets/sounds/sound_catalogue_cash.mp3";

    public static async playSound(url: string) {
        const audio = new Audio(url);
        
        audio.loop = false;
        audio.currentTime = 0;
        audio.volume = (clientInstance.settings.value.systemAudioVolume ?? 50) / 100;

        await audio.play();
    }
}
