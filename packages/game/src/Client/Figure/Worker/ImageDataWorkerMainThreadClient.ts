import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import ImageDataWorkerInterface from "@Client/Figure/Worker/Interfaces/ImageDataWorkerInterface";

export default class ImageDataWorkerMainThreadClient implements ImageDataWorkerInterface {
    public async getImageData(image: ImageBitmap): Promise<ImageData> {
        const canvas = new OffscreenCanvas(image.width, image.height);
        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        return imageData;
    }
}
