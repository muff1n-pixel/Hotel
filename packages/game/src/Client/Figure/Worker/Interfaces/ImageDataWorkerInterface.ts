export default interface ImageDataWorkerInterface {
    getImageData(image: ImageBitmap): Promise<ImageData>;
}
