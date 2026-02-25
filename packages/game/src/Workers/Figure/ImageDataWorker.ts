import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";

export type ImageDataWorkerRequestEvent = {
    image: ImageBitmap;
};

onmessage = async (event: MessageEvent<ImageDataWorkerRequestEvent>) => {
    try {
        const port = event.ports[0];

        const canvas = new OffscreenCanvas(event.data.image.width, event.data.image.height);
        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.drawImage(event.data.image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        port.postMessage(imageData);

        port.close();
    }
    catch(error) {
        console.error(error);
    }
};
