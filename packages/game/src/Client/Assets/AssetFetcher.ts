import { defaultImageDataWorker } from "@Client/Figure/Worker/ImageDataWorkerClient";
import ContextNotAvailableError from "../Exceptions/ContextNotAvailableError";

export type AssetSpriteProperties = {
    id?: number;

    x: number;
    y: number;

    width?: number;
    height?: number;

    flipHorizontal?: boolean;

    grayscaled?: boolean;

    source?: string;
    color?: string | string[];

    destinationWidth?: number;
    destinationHeight?: number;

    ignoreImageData?: boolean;
    ignoreExistingImageData?: boolean;
};

export type AssetSpriteResult = {
    imageData: ImageData | null;

    result: Promise<{
        image: ImageBitmap;
        imageData: ImageData | null;
    }>;
};

export default class AssetFetcher {
    private static json: Map<string, Promise<unknown>> = new Map();
    private static images: Map<string, Promise<ImageBitmap>> = new Map();
    private static sprites: Record<string, (AssetSpriteProperties & AssetSpriteResult)[]> = {};

    public static async fetchJson<T>(url: string): Promise<T> {
        if(this.json.has(url)) {
            return await this.json.get(url)! as T;
        }

        const result = (async () => {
            const response = await fetch(url, {
                method: "GET"
            });

            if(!response.ok) {
                throw new Error("Response is not ok.");
            }

            if(response.status !== 200) {
                throw new Error("Response is not ok.");
            }

            const result = await response.json();

            return result;
        })();

        this.json.set(url, result);

        return result;
    }

    public static async fetchImage(url: string) {
        if(this.images.has(url)) {
            return await this.images.get(url)!;
        }

        const result = (async () => {
            const response = await fetch(url, {
                method: "GET"
            });

            if(!response.ok) {
                throw new Error("Response is not ok.")
            }

            if(response.status !== 200) {
                throw new Error("Response is not ok.")
            }

            const blob = await response.blob();

            const image = await createImageBitmap(blob);

            return image;
        })();

        this.images.set(url, result);

        return result;
    }

    public static async fetchImageSprite(url: string, properties: AssetSpriteProperties): AssetSpriteResult["result"] {
        if(!this.sprites[url]) {
            this.sprites[url] = [];
        }

        const existingSprite = this.sprites[url].find(({ x, y, width, height, flipHorizontal, color, destinationWidth, destinationHeight, grayscaled }) => properties.x === x && properties.y === y && properties.width === width && properties.height === height && properties.flipHorizontal === flipHorizontal && properties.color === color && properties.destinationWidth === destinationWidth && properties.destinationHeight === destinationHeight && properties.grayscaled === grayscaled);

        if(existingSprite) {
            const output = await existingSprite.result;

            return {
                image: output.image,
                imageData: existingSprite.imageData
            };
        }

        /*if(properties.flipHorizontal && !properties.ignoreImageData) {
            const existingNonFlippedSprite = this.sprites[url].find(({ x, y, width, height, flipHorizontal, color, destinationWidth, destinationHeight, ignoreImageData }) => properties.x === x && properties.y === y && properties.width === width && properties.height === height && !flipHorizontal && properties.color === color && properties.destinationWidth === destinationWidth && properties.destinationHeight === destinationHeight && !ignoreImageData);

            if(existingNonFlippedSprite && existingNonFlippedSprite.color?.length) {
                const sprite = await existingNonFlippedSprite.sprite;

                console.log("Existing non-flipped sprite", existingNonFlippedSprite.color, properties.color);

                const newImageData = new ImageData(new Uint8ClampedArray(sprite.imageData.data), sprite.imageData.width, sprite.imageData.height);

                for (let y = 0; y < newImageData.height; y++) {
                    for (let x = 0; x < newImageData.width / 2; x++) {
                        const left = (y * newImageData.width + x) * 4;
                        const right = (y * newImageData.width + (newImageData.width - x - 1)) * 4;

                        for (let i = 0; i < 4; i++) {
                            const temp = newImageData.data[left + i];
                            newImageData.data[left + i] = newImageData.data[right + i];
                            newImageData.data[right + i] = temp;
                        }
                    }
                }

                const canvas = new OffscreenCanvas(newImageData.width, newImageData.height);
                const context = canvas.getContext("2d");

                if(!context) {
                    throw new ContextNotAvailableError();
                }

                context.translate(canvas.width, 0);

                context.scale(-1, 1);

                context.drawImage(sprite.image, 0, 0);

                const result: AssetSpriteProperties & { sprite: Promise<{ image: ImageBitmap, imageData: ImageData }> } = {
                    sprite: Promise.resolve({
                        image: await createImageBitmap(canvas),
                        imageData: newImageData
                    }),
                    ...properties
                };

                this.sprites[url].push(result);

                return await result.sprite;
            }
        }*/

        return (async () => {
            properties.id ??= Math.random();

            const result: AssetSpriteProperties & AssetSpriteResult = {
                result: this.drawSprite(url, properties),
                imageData: null,
                ...properties
            };

            this.sprites[url].push(result);

            let output = await result.result;

            const existingSpriteWithImageData = this.sprites[url].find(({ id, x, y, width, height, flipHorizontal, destinationWidth, destinationHeight, ignoreImageData }) => properties.id !== id && properties.x === x && properties.y === y && properties.width === width && properties.height === height && properties.flipHorizontal === flipHorizontal && properties.destinationWidth === destinationWidth && properties.destinationHeight === destinationHeight && !ignoreImageData);

            if(existingSpriteWithImageData?.imageData) {
                result.imageData = existingSpriteWithImageData.imageData;
                output.imageData = existingSpriteWithImageData.imageData;

                if(properties.grayscaled) {
                    const promise = this.drawGrayscaledImage(existingSpriteWithImageData.imageData);
                    result.result = promise;
                    output = await promise;
                }
            }
            else {
                defaultImageDataWorker.getImageData(output.image).then((imageData) => {
                    result.imageData = imageData;
                    output.imageData = imageData;

                    if(properties.grayscaled) {
                        result.result = this.drawGrayscaledImage(imageData);
                    }
                });
            }

            return output;
        })();
    }

    private static async drawGrayscaledImage(imageData: ImageData): AssetSpriteResult["result"] {
        const canvas = new OffscreenCanvas(imageData.width, imageData.height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        for(let index = 0; index < imageData.data.length; index += 4) {
            const red = imageData.data[index];
            const green = imageData.data[index + 1];
            const blue = imageData.data[index + 2];
            const alpha = imageData.data[index + 3];

            if(alpha === 0) {
                continue;
            }

            if(red < 20 && green < 20 && blue < 20) {
                imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = 255;
            }
            else {
                imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = 153;
            }
        }

        context.putImageData(imageData, 0, 0);

        return {
            image: canvas.transferToImageBitmap(),
            imageData
        };
    }

    private static async drawSprite(url: string, properties: AssetSpriteProperties): AssetSpriteResult["result"] {
        try {
            const image = await this.fetchImage(url);

            const canvas = new OffscreenCanvas(properties.destinationWidth ?? properties.width ?? image.width, properties.destinationHeight ?? properties.height ?? image.height);
            const context = canvas.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            if(properties.flipHorizontal) {
                context.translate(canvas.width, 0);

                context.scale(-1, 1);
            }

            context.drawImage(image, properties.x, properties.y, properties.destinationWidth ?? properties.width ?? image.width, properties.destinationHeight ?? properties.height ?? image.height, 0, 0, properties.width ?? image.width, properties.height ?? image.height);

            if(properties.color) {
                const colorCanvas = new OffscreenCanvas(properties.destinationWidth ?? properties.width ?? image.width, properties.destinationHeight ?? properties.height ?? image.height);
                const colorContext = colorCanvas.getContext("2d");

                if(!colorContext) {
                    throw new ContextNotAvailableError();
                }

                colorContext.drawImage(image, properties.x, properties.y, properties.width ?? image.width, properties.height ?? image.height, 0, 0, properties.destinationWidth ?? properties.width ?? image.width, properties.destinationHeight ?? properties.height ?? image.height);

                const colors = (Array.isArray(properties.color))?(properties.color):([properties.color]);

                for(const color of colors) {
                    colorContext.globalCompositeOperation = "multiply";
                    colorContext.fillStyle = '#' + color;
                    colorContext.fillRect(0, 0, canvas.width, canvas.height);
                }

                context.globalCompositeOperation = "source-in";
                context.drawImage(colorCanvas, 0, 0);
            }

            const imageData: ImageData | null = null;

            /*if(!properties.ignoreImageData) {
                const existingSpriteWithImageData = this.sprites[url].find(({ id, x, y, width, height, flipHorizontal, destinationWidth, destinationHeight, ignoreImageData }) => properties.id !== id && properties.x === x && properties.y === y && properties.width === width && properties.height === height && properties.flipHorizontal === flipHorizontal && properties.destinationWidth === destinationWidth && properties.destinationHeight === destinationHeight && !ignoreImageData);

                if(existingSpriteWithImageData && !properties.ignoreExistingImageData) {
                    imageData = (await existingSpriteWithImageData.result).imageData;
                }
                else if(!properties.ignoreExistingImageData) {
                    const existingNonFlippedSpriteWithImageData = this.sprites[url].find(({ id, x, y, width, height, flipHorizontal, destinationWidth, destinationHeight, ignoreImageData }) => properties.id !== id && properties.x === x && properties.y === y && properties.width === width && properties.height === height && !flipHorizontal && properties.destinationWidth === destinationWidth && properties.destinationHeight === destinationHeight && !ignoreImageData);
                    
                    if(existingNonFlippedSpriteWithImageData) {
                        console.log("Flip image data");

                        const sprite = await existingNonFlippedSpriteWithImageData.result;
                        const newImageData = new ImageData(new Uint8ClampedArray(sprite.imageData.data), sprite.imageData.width, sprite.imageData.height);

                        for (let y = 0; y < newImageData.height; y++) {
                            for (let x = 0; x < newImageData.width / 2; x++) {
                                const left = (y * newImageData.width + x) * 4;
                                const right = (y * newImageData.width + (newImageData.width - x - 1)) * 4;

                                for (let i = 0; i < 4; i++) {
                                    const temp = newImageData.data[left + i];
                                    newImageData.data[left + i] = newImageData.data[right + i];
                                    newImageData.data[right + i] = temp;
                                }
                            }
                        }

                        imageData = newImageData;
                    }
                    else {
                        console.log("New image data");

                        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    }
                }
                else {
                    console.log("New image data");

                    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                }
            }
            else {
                imageData = new ImageData(canvas.width, canvas.height);
            }*/

            return {
                image: canvas.transferToImageBitmap(),
                imageData
            };
        }
        catch(error) {
            if(error) {
                console.log(error);
            }

            throw error;
        }
    }
}
