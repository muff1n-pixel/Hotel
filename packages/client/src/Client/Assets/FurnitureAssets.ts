import { FurnitureRendererSprite } from "@/Furniture/FurnitureRenderer.js";
import AssetFetcher, { AssetSpriteProperties } from "./AssetFetcher.js";
import { FurnitureData } from "@/Interfaces/Furniture/FurnitureData.js";

export default class FurnitureAssets {
    public static async getFurnitureData(furnitureName: string) {
        return await AssetFetcher.fetchJson<FurnitureData>(`/assets/furniture/${furnitureName}/${furnitureName}.json`);
    }

    public static async getFurnitureSpritesheet(furnitureName: string) {
        return await AssetFetcher.fetchImage(`/assets/furniture/${furnitureName}/${furnitureName}.png`);
    }

    public static async getFurnitureSprite(furnitureName: string, properties: AssetSpriteProperties): Promise<{ image: OffscreenCanvas, imageData: ImageData }> {
        return await AssetFetcher.fetchImageSprite(`/assets/furniture/${furnitureName}/${furnitureName}.png`, properties);
    }

    public static readonly assetSprites: Map<string, FurnitureRendererSprite | null> = new Map();
}
