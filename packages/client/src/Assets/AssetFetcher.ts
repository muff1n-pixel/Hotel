import ContextNotAvailableError from "../Exceptions/ContextNotAvailableError.js";
import { FurnitureData } from "../Interfaces/Furniture/FurnitureData.js";

export type AssetSpriteProperties = {
    x: number;
    y: number;

    width: number;
    height: number;

    flipHorizontal?: boolean;

    source?: string;
    color?: string | string[];

    destinationHeight?: number;
    ignoreImageData?: boolean;
};

export default class AssetFetcher {
    private static json: Map<string, Promise<unknown>> = new Map();
    private static images: Map<string, Promise<HTMLImageElement>> = new Map();
    private static sprites: Record<string, (AssetSpriteProperties & { sprite: Promise<{ image: OffscreenCanvas, imageData: ImageData }> })[]> = {};

    public static async fetchJson<T>(url: string): Promise<T> {
        if(this.json.has(url)) {
            return await this.json.get(url)! as T;
        }

        const result = new Promise<T>(async (resolve, reject) => {
            const response = await fetch(url, {
                method: "GET"
            });

            if(!response.ok) {
                return reject();
            }

            if(response.status !== 200) {
                return reject();
            }

            const result = await response.json();

            resolve(result);
        });

        this.json.set(url, result);

        return result;
    }

    public static async fetchImage(url: string) {
        if(this.images.has(url)) {
            return await this.images.get(url)!;
        }

        const result = new Promise<HTMLImageElement>(async (resolve, reject) => {
            const image = new Image();

            image.onload = () => {
                resolve(image);
            };

            image.onerror = () => {
                reject();
            };

            image.src = url;
        });

        this.images.set(url, result);

        return result;
    }

    public static async fetchImageSprite(url: string, properties: AssetSpriteProperties): Promise<{ image: OffscreenCanvas, imageData: ImageData }> {
        if(!this.sprites[url]) {
            this.sprites[url] = [];
        }

        const existingSprite = this.sprites[url].find(({ x, y, width, height, flipHorizontal, color }) => properties.x === x && properties.y === y && properties.width === width && properties.height === height && properties.flipHorizontal === flipHorizontal && properties.color === color);

        if(existingSprite) {
            return await existingSprite.sprite;
        }

        return new Promise(async (resolve) => {
            const result: AssetSpriteProperties & { sprite: Promise<{ image: OffscreenCanvas, imageData: ImageData }> } = {
                sprite: this.drawSprite(url, properties),
                ...properties
            };

            this.sprites[url].push(result);

            resolve(await result.sprite);
        });
    }

    private static async drawSprite(url: string, properties: AssetSpriteProperties) {
        const image = await this.fetchImage(url);

        const canvas = new OffscreenCanvas(properties.width, properties.destinationHeight ?? properties.height);
        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        if(properties.flipHorizontal) {
            context.translate(canvas.width, 0);

            context.scale(-1, 1);
        }

        context.drawImage(image, properties.x, properties.y, properties.width, properties.destinationHeight ?? properties.height, 0, 0, properties.width, properties.height);

        if(properties.color) {
            const colorCanvas = new OffscreenCanvas(properties.width, properties.destinationHeight ?? properties.height);
            const colorContext = colorCanvas.getContext("2d");

            if(!colorContext) {
                throw new ContextNotAvailableError();
            }

            colorContext.drawImage(image, properties.x, properties.y, properties.width, properties.height, 0, 0, properties.width, properties.destinationHeight ?? properties.height);

            const colors = (typeof properties.color === "string")?([properties.color]):(properties.color);

            for(let color of colors) {
                colorContext.globalCompositeOperation = "multiply";
                colorContext.fillStyle = '#' + color;
                colorContext.fillRect(0, 0, canvas.width, canvas.height);
            }

            context.globalCompositeOperation = "source-in";
            context.drawImage(colorCanvas, 0, 0);
        }

        return {
            image: canvas,
            imageData: (!properties.ignoreImageData)?(context.getImageData(0, 0, canvas.width, canvas.height)):(new ImageData(canvas.width, canvas.height))
        };
    }
}
