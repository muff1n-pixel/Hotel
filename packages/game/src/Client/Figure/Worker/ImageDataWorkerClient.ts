import ImageDataWorkerInterface from "@Client/Figure/Worker/Interfaces/ImageDataWorkerInterface";
import { ImageDataWorkerRequestEvent } from "../../../Workers/Figure/ImageDataWorker";
import ImageDataWorkerMainThreadClient from "@Client/Figure/Worker/ImageDataWorkerMainThreadClient";

export default class ImageDataWorkerClient implements ImageDataWorkerInterface {
    private readonly worker: Worker;

    constructor() {
        this.worker = new Worker(new URL("/src/Workers/Figure/ImageDataWorker.ts", import.meta.url), {
            type: "module"
        });
    }

    public async getImageData(image: ImageBitmap) {
        const channel = new MessageChannel();
        
        const img = await createImageBitmap(image);

        return new Promise<ImageData>((resolve, reject) => {
            channel.port2.onmessage = (event) => {
                resolve(event.data);
            };

            channel.port2.onmessageerror = () => {
                reject();
            }

            this.worker.postMessage({
                image: img
            } satisfies ImageDataWorkerRequestEvent, [channel.port1, img]);
        });
    }
}

export function createImageDataWorkerClient() {
    if(typeof (Worker) !== "undefined") {
        return new ImageDataWorkerClient();
    }

    return new ImageDataWorkerMainThreadClient();
}

export const defaultImageDataWorker = createImageDataWorkerClient();
