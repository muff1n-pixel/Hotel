export default class AudioFetcher {
    public static async getAudioBuffer(context: AudioContext, url: string) {
        const response = await fetch(url, {
            method: "GET"
        });

        if(!response.ok) {
            throw new Error("Response is not ok.");
        }

        if(response.status !== 200) {
            throw new Error("Response is not ok.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);

        return audioBuffer;
    }
}

/*

const source = context.createBufferSource();
source.buffer = audioBuffer;
source.connect(context.destination);

*/