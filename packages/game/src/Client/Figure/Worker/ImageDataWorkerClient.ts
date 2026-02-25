import { ImageDataWorkerRequestEvent } from "../../../Workers/Figure/ImageDataWorker";

export default class ImageDataWorkerClient {
    public static default = new ImageDataWorkerClient();
    
    private worker = new Worker(new URL("/src/Workers/Figure/ImageDataWorker.ts", import.meta.url), {
        type: "module"
    })

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