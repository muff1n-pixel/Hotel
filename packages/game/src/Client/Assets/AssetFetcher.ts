import ContextNotAvailableError from "../Exceptions/ContextNotAvailableError";
import ImageDataWorkerInterface from "@Client/Figure/Worker/Interfaces/ImageDataWorkerInterface";
import ImageDataWorkerMainThreadClient from "@Client/Figure/Worker/ImageDataWorkerMainThreadClient";
import { hexToRgb } from "@Client/Utilities/ColorUtilities";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";

export type AssetSpriteGrayscaledProperties = {
    ink?: number;
    background: string;
    foreground: string;
    alpha?: number;
}

export type AssetSpriteProperties = {
    id?: number;

    x: number;
    y: number;

    width?: number;
    height?: number;

    flipHorizontal?: boolean;

    rotate?: number;

    grayscaled?: AssetSpriteGrayscaledProperties;

    source?: string;
    color?: string | string[];

    destinationWidth?: number;
    destinationHeight?: number;

    ignoreImageData?: boolean;
    ignoreExistingImageData?: boolean;

    requireImageData?: boolean;
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
    private static spritesCache: Map<string, Map<string, AssetSpriteResult>> = new Map<string, Map<string, AssetSpriteResult>>();
    private static imageDataCache: Map<string, Map<string, AssetSpriteResult>> = new Map<string, Map<string, AssetSpriteResult>>();

    public static imageDataClient: ImageDataWorkerInterface = new ImageDataWorkerMainThreadClient();

    public static clearMemory() {
        this.spritesCache.clear();
        this.imageDataCache.clear();

        FurnitureDefaultRenderer.renderMap.clear();
    }

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

    private static createSpriteKey(properties: AssetSpriteProperties): string {
        return [
            properties.x,
            properties.y,
            properties.width,
            properties.height,
            properties.rotate ?? 0,
            properties.flipHorizontal ? 1 : 0,
            properties.color ?? "",
            properties.destinationWidth ?? "",
            properties.destinationHeight ?? "",
            (properties.grayscaled)?(`${properties.grayscaled.background},${properties.grayscaled.foreground},${properties.grayscaled.ink},${properties.grayscaled.alpha}`):(""),
            properties.requireImageData ? 1 : 0
        ].join("|");
    }

    private static createImageDataKey(properties: AssetSpriteProperties): string {
        return [
            properties.x,
            properties.y,
            properties.width,
            properties.height,
            properties.flipHorizontal ? 1 : 0,
            properties.destinationWidth ?? "",
            properties.destinationHeight ?? ""
        ].join("|");
    }

    public static async fetchImageSprite(url: string, properties: AssetSpriteProperties): AssetSpriteResult["result"] {
        if(!this.spritesCache.has(url)) {
            this.spritesCache.set(url, new Map<string, AssetSpriteResult>());
        }

        const urlSprites = this.spritesCache.get(url)!;

        const spriteKey = this.createSpriteKey(properties);

        if(urlSprites.has(spriteKey)) {
            const existingSprite = urlSprites.get(spriteKey)!;

            const output = await existingSprite.result;

            return {
                image: output.image,
                imageData: existingSprite.imageData
            };
        }

        //console.log("Creating non-existant sprite", url);

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

            urlSprites.set(spriteKey, result);

            let output = await result.result;

            const imageDataKey = this.createImageDataKey(properties);

            if(!this.imageDataCache.has(url)) {
                this.imageDataCache.set(url, new Map<string, AssetSpriteResult>());
            }

            const imageDataUrl = this.imageDataCache.get(url)!;

            const existingSpriteWithImageData = imageDataUrl.get(imageDataKey);

            if(existingSpriteWithImageData?.imageData) {
                result.imageData = existingSpriteWithImageData.imageData;
                output.imageData = existingSpriteWithImageData.imageData;

                if(properties.grayscaled) {
                    output = this.drawGrayscaledImage(existingSpriteWithImageData.imageData, properties.grayscaled);
                    result.result = Promise.resolve(output);
                }
            }
            else {
                const promise = AssetFetcher.imageDataClient.getImageData(output.image).then((imageData) => {
                    result.imageData = imageData;
                    output.imageData = imageData;

                    if(properties.grayscaled) {
                        output = this.drawGrayscaledImage(imageData, properties.grayscaled);
                        result.result = Promise.resolve(output);
                    }

                    imageDataUrl.set(imageDataKey, result);
                });

                if(properties.requireImageData) {
                    await promise;
                }
            }

            return output;
        })();
    }

    private static drawGrayscaledImage(imageData: ImageData, grayscaled: AssetSpriteGrayscaledProperties): Awaited<AssetSpriteResult["result"]> {
        const mutatedImageData = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
        const canvas = new OffscreenCanvas(mutatedImageData.width, mutatedImageData.height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        const background = hexToRgb(grayscaled.background);
        const foreground = hexToRgb(grayscaled.foreground);

        if(grayscaled.ink === 8) {
            for(let index = 0; index < mutatedImageData.data.length; index += 4) {
                const red = mutatedImageData.data[index];
                const green = mutatedImageData.data[index + 1];
                const blue = mutatedImageData.data[index + 2];
                const alpha = mutatedImageData.data[index + 3];

                if(alpha === 0) {
                    continue;
                }

                if(red < 32 && green < 32 && blue < 32) {
                    mutatedImageData.data[index] *= background.red / 255;
                    mutatedImageData.data[index + 1] *= background.green / 255;
                    mutatedImageData.data[index + 2] *= background.blue / 255;
                }
                else {
                    mutatedImageData.data[index] *= foreground.red / 255;
                    mutatedImageData.data[index + 1] *= foreground.green / 255;
                    mutatedImageData.data[index + 2] *= foreground.blue / 255;
                }
            }
        }
        else {
            for(let index = 0; index < mutatedImageData.data.length; index += 4) {
                const red = mutatedImageData.data[index];
                const green = mutatedImageData.data[index + 1];
                const blue = mutatedImageData.data[index + 2];
                const alpha = mutatedImageData.data[index + 3];

                if(alpha === 0) {
                    continue;
                }

                if(red < 20 && green < 20 && blue < 20) {
                    mutatedImageData.data[index] = background.red;
                    mutatedImageData.data[index + 1] = background.green;
                    mutatedImageData.data[index + 2] = background.blue;
                }
                else {
                    if(grayscaled.alpha === undefined) {
                        mutatedImageData.data[index] = foreground.red;
                        mutatedImageData.data[index + 1] = foreground.green;
                        mutatedImageData.data[index + 2] = foreground.blue;
                    }
                    else {
                        mutatedImageData.data[index] = (mutatedImageData.data[index] * (1 - grayscaled.alpha)) + (foreground.red * grayscaled.alpha);
                        mutatedImageData.data[index + 1] = (mutatedImageData.data[index + 1] * (1 - grayscaled.alpha)) + (foreground.green * grayscaled.alpha);
                        mutatedImageData.data[index + 2] = (mutatedImageData.data[index + 2] * (1 - grayscaled.alpha)) + (foreground.blue * grayscaled.alpha);
                    }
                }
            }
        }

        context.putImageData(mutatedImageData, 0, 0);

        return {
            image: canvas.transferToImageBitmap(),
            imageData
        };
    }

    private static async drawSprite(url: string, properties: AssetSpriteProperties): AssetSpriteResult["result"] {
        try {
            const image = await this.fetchImage(url);

            const destinationWidth = properties.destinationWidth ?? properties.width ?? image.width;
            const destinationHeight = properties.destinationHeight ?? properties.height ?? image.height;

            const imageWidth = properties.width ?? image.width;
            const imageHeight = properties.height ?? image.height;

            let canvas = new OffscreenCanvas(destinationWidth, destinationHeight);
            const context = canvas.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            if(properties.flipHorizontal) {
                context.translate(canvas.width, 0);

                context.scale(-1, 1);
            }

            context.drawImage(image, properties.x, properties.y, destinationWidth, destinationHeight, 0, 0, imageWidth, imageHeight);

            if(properties.color) {
                const colorCanvas = new OffscreenCanvas(destinationWidth, destinationHeight);
                const colorContext = colorCanvas.getContext("2d");

                if(!colorContext) {
                    throw new ContextNotAvailableError();
                }

                colorContext.drawImage(image, properties.x, properties.y, imageWidth, imageHeight, 0, 0, destinationWidth, destinationHeight);

                const colors = (Array.isArray(properties.color))?(properties.color):([properties.color]);

                for(const color of colors) {
                    colorContext.globalCompositeOperation = "multiply";
                    colorContext.fillStyle = (color[0] === '#')?(color):('#' + color);
                    colorContext.fillRect(0, 0, canvas.width, canvas.height);
                }

                context.globalCompositeOperation = "source-in";
                context.drawImage(colorCanvas, 0, 0);
            }

            if(properties.rotate) {
                canvas = this.rotateCanvas(canvas, properties.rotate);
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

    private static rotateCanvas(sourceCanvas: OffscreenCanvas, degrees: number) {
        const radians = degrees * Math.PI / 180;

        const sourceWidth = sourceCanvas.width;
        const sourceHeight = sourceCanvas.height;

        const cos = Math.abs(Math.cos(radians));
        const sin = Math.abs(Math.sin(radians));

        const destinationWidth = Math.floor(sourceWidth * cos + sourceHeight * sin);
        const destinationHeight = Math.floor(sourceWidth * sin + sourceHeight * cos);

        const canvas = new OffscreenCanvas(destinationWidth, destinationHeight);
        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.translate(destinationWidth / 2, destinationHeight / 2);

        context.rotate(radians);

        context.drawImage(sourceCanvas, -sourceWidth / 2, -sourceHeight / 2);

        return canvas;
    }
}
