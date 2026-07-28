import ContextNotAvailableError from "../Exceptions/ContextNotAvailableError";
import ImageDataWorkerInterface from "@Client/Figure/Worker/Interfaces/ImageDataWorkerInterface";
import ImageDataWorkerMainThreadClient from "@Client/Figure/Worker/ImageDataWorkerMainThreadClient";
import { hexToRgb } from "@Client/Utilities/ColorUtilities";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import DataStats from "@Client/DataStats";

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
    private static imageDataCache: Map<string, Map<string, ImageData>> = new Map<string, Map<string, ImageData>>();

    public static imageDataClient: ImageDataWorkerInterface = new ImageDataWorkerMainThreadClient();

    public static clearMemory() {
        for(const [url, urlCache] of this.spritesCache.entries()) {
            if(url.includes("placeholder")) {
                continue;
            }

            for(const cachedSprite of urlCache.values()) {
                cachedSprite.result.then((result) => {
                    if(url.startsWith('/assets/furniture')) {
                        DataStats.furnitureImageBitmapsClosed++;
                    }
                    else if(url.startsWith('/assets/figure')) {
                        DataStats.figureImageBitmapsClosed++;
                    }

                    result.image.close();
                });
            }
        }

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

        return (async () => {
            properties.id ??= Math.random();

            const result: AssetSpriteProperties & AssetSpriteResult = {
                result: this.drawSprite(url, properties),
                imageData: null,
                ...properties
            };

            if(!properties.requireImageData) {
                urlSprites.set(spriteKey, result);
            }

            let output = await result.result;

            const imageDataKey = this.createImageDataKey(properties);

            if(!this.imageDataCache.has(url)) {
                this.imageDataCache.set(url, new Map<string, ImageData>());
            }

            const imageDataUrl = this.imageDataCache.get(url)!;

            const existingSpriteWithImageData = imageDataUrl.get(imageDataKey);

            if(existingSpriteWithImageData) {
                result.imageData = existingSpriteWithImageData;
                output.imageData = existingSpriteWithImageData;

                if(properties.grayscaled) {
                    output = this.drawGrayscaledImage(url, existingSpriteWithImageData, properties.grayscaled);
                    result.result = Promise.resolve(output);
                }

                return output;
            }
                
            const imageDataPromise = AssetFetcher.imageDataClient.getImageData(output.image).then((imageData) => {
                result.imageData = imageData;
                output.imageData = imageData;

                if(properties.grayscaled) {
                    output = this.drawGrayscaledImage(url, imageData, properties.grayscaled);
                    result.result = Promise.resolve(output);
                }

                imageDataUrl.set(imageDataKey, imageData);
                urlSprites.set(spriteKey, result);

                return imageData;
            });

            if(properties.requireImageData) {
                await imageDataPromise;
            }

            return output;
        })();
    }

    private static drawGrayscaledImage(url: string, imageData: ImageData, grayscaled: AssetSpriteGrayscaledProperties): Awaited<AssetSpriteResult["result"]> {
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

        const imageBitmap = canvas.transferToImageBitmap();

        if(url.startsWith('/assets/furniture')) {
            DataStats.furnitureImageBitmapsOpened++;
        }
        else if(url.startsWith('/assets/figure')) {
            DataStats.figureImageBitmapsOpened++;
        }

        return {
            image: imageBitmap,
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

            const imageBitmap = canvas.transferToImageBitmap();

            if(url.startsWith('/assets/furniture')) {
                DataStats.furnitureImageBitmapsOpened++;
            }
            else if(url.startsWith('/assets/figure')) {
                DataStats.figureImageBitmapsOpened++;
            }

            return {
                image: imageBitmap,
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
