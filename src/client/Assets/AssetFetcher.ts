import ContextNotAvailableError from "../Exceptions/ContextNotAvailableError.js";
import { FurnitureData } from "../Interfaces/Furniture/FurnitureData.js";

export type AssetSpriteProperties = {
    x: number;
    y: number;

    width: number;
    height: number;

    flipHorizontal?: boolean;

    source?: string;
};

export default class AssetFetcher {
    private static json: Map<string, Promise<FurnitureData>> = new Map();
    private static images: Map<string, Promise<HTMLImageElement>> = new Map();
    private static sprites: Record<string, (AssetSpriteProperties & { image: OffscreenCanvas })[]> = {};

    public static async fetchJson(url: string): Promise<FurnitureData> {
        if(this.json.has(url)) {
            return await this.json.get(url)!;
        }

        const result = new Promise<FurnitureData>(async (resolve) => {
            const response = await fetch(url, {
                method: "GET"
            });

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

        const result = new Promise<HTMLImageElement>(async (resolve) => {
            const image = new Image();

            image.onload = () => {
                resolve(image);
            };

            image.src = url;
        });

        this.images.set(url, result);

        return result;
    }

    public static async fetchImageSprite(url: string, properties: AssetSpriteProperties) {
        if(!this.sprites[url]) {
            this.sprites[url] = [];
        }

        const existingSprite = this.sprites[url].find(({ x, y, width, height, flipHorizontal }) => properties.x === x && properties.y === y && properties.width === width && properties.height === height && properties.flipHorizontal === flipHorizontal);

        if(existingSprite) {
            return existingSprite;
        }
        
        const image = await this.drawSprite(url, properties);

        const result: AssetSpriteProperties & { image: OffscreenCanvas } = {
            image,
            ...properties
        };

        this.sprites[url].push(result);

        return result;
    }

    private static async drawSprite(url: string, properties: AssetSpriteProperties) {
        const image = await this.fetchImage(url);

        const canvas = new OffscreenCanvas(properties.width, properties.height);
        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        if(properties.flipHorizontal) {
            context.translate(canvas.width, 0);

            context.scale(-1, 1);
        }

        context.drawImage(image, properties.x, properties.y, properties.width, properties.height, 0, 0, properties.width, properties.height);

        return canvas;
    }
}
