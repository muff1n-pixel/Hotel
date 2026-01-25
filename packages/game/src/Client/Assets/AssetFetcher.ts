import ContextNotAvailableError from "../Exceptions/ContextNotAvailableError";
import { FurnitureData } from "../Interfaces/Furniture/FurnitureData";

export type AssetSpriteProperties = {
    x: number;
    y: number;

    width: number;
    height: number;

    flipHorizontal?: boolean;

    source?: string;
    color?: string | string[];

    destinationWidth?: number;
    destinationHeight?: number;

    ignoreImageData?: boolean;
};

export default class AssetFetcher {
    private static json: Map<string, Promise<unknown>> = new Map();
    private static images: Map<string, Promise<ImageBitmap>> = new Map();
    private static sprites: Record<string, (AssetSpriteProperties & { sprite: Promise<{ image: ImageBitmap, imageData: ImageData }> })[]> = {};

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

        const result = new Promise<ImageBitmap>(async (resolve, reject) => {
            const response = await fetch(url, {
                method: "GET"
            });

            if(!response.ok) {
                return reject();
            }

            if(response.status !== 200) {
                return reject();
            }

            const blob = await response.blob();

            const image = await createImageBitmap(blob);

            resolve(image);
        });

        this.images.set(url, result);

        return result;
    }

    public static async fetchImageSprite(url: string, properties: AssetSpriteProperties): Promise<{ image: ImageBitmap, imageData: ImageData }> {
        if(!this.sprites[url]) {
            this.sprites[url] = [];
        }

        const existingSprite = this.sprites[url].find(({ x, y, width, height, flipHorizontal, color, destinationWidth, destinationHeight }) => properties.x === x && properties.y === y && properties.width === width && properties.height === height && properties.flipHorizontal === flipHorizontal && properties.color === color && properties.destinationWidth === destinationHeight && properties.destinationHeight);

        if(existingSprite) {
            return await existingSprite.sprite;
        }

        return new Promise(async (resolve) => {
            const result: AssetSpriteProperties & { sprite: Promise<{ image: ImageBitmap, imageData: ImageData }> } = {
                sprite: this.drawSprite(url, properties),
                ...properties
            };

            this.sprites[url].push(result);

            resolve(await result.sprite);
        });
    }

    private static async drawSprite(url: string, properties: AssetSpriteProperties) {
        const image = await this.fetchImage(url);

        const canvas = new OffscreenCanvas(properties.destinationWidth ?? properties.width, properties.destinationHeight ?? properties.height);
        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        if(properties.flipHorizontal) {
            context.translate(canvas.width, 0);

            context.scale(-1, 1);
        }

        context.drawImage(image, properties.x, properties.y, properties.destinationWidth ?? properties.width, properties.destinationHeight ?? properties.height, 0, 0, properties.width, properties.height);

        if(properties.color) {
            const colorCanvas = new OffscreenCanvas(properties.destinationWidth ?? properties.width, properties.destinationHeight ?? properties.height);
            const colorContext = colorCanvas.getContext("2d");

            if(!colorContext) {
                throw new ContextNotAvailableError();
            }

            colorContext.drawImage(image, properties.x, properties.y, properties.width, properties.height, 0, 0, properties.destinationWidth ?? properties.width, properties.destinationHeight ?? properties.height);

            const colors = (Array.isArray(properties.color))?(properties.color):([properties.color]);

            for(let color of colors) {
                colorContext.globalCompositeOperation = "multiply";
                colorContext.fillStyle = '#' + color;
                colorContext.fillRect(0, 0, canvas.width, canvas.height);
            }

            context.globalCompositeOperation = "source-in";
            context.drawImage(colorCanvas, 0, 0);
        }

        return {
            image: await createImageBitmap(canvas),
            imageData: (!properties.ignoreImageData)?(context.getImageData(0, 0, canvas.width, canvas.height)):(new ImageData(canvas.width, canvas.height))
        };
    }
}
