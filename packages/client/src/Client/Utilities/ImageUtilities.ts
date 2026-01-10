export function getImageAsync(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () => reject();

        image.src = url;
    });
}
