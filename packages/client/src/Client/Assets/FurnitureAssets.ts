import { FurnitureRendererSprite } from "@Client/Furniture/FurnitureRenderer";
import AssetFetcher, { AssetSpriteProperties } from "./AssetFetcher";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";

export default class FurnitureAssets {
    public static async getFurnitureData(furnitureName: string) {
        return await AssetFetcher.fetchJson<FurnitureData>(`/assets/furniture/${furnitureName}/${furnitureName}.json`);
    }

    public static async getFurnitureSpritesheet(furnitureName: string) {
        return await AssetFetcher.fetchImage(`/assets/furniture/${furnitureName}/${furnitureName}.png`);
    }

    public static async getFurnitureSprite(furnitureName: string, properties: AssetSpriteProperties): Promise<{ image: ImageBitmap, imageData: ImageData }> {
        return await AssetFetcher.fetchImageSprite(`/assets/furniture/${furnitureName}/${furnitureName}.png`, properties);
    }

    public static readonly assetSprites: Map<string, FurnitureRendererSprite | null> = new Map();
}
