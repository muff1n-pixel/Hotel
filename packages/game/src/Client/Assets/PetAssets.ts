import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import AssetFetcher, { AssetSpriteProperties, AssetSpriteResult } from "./AssetFetcher";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";

export default class PetAssets {
    public static async getData(assetName: string) {
        return await AssetFetcher.fetchJson<FurnitureData>(`/assets/pets/${assetName}/${assetName}.json`);
    }

    public static async getPaletteData(assetName: string, source: string) {
        return await AssetFetcher.fetchJson<string[]>(`/assets/pets/${assetName}/palettes/${source}.json`);
    }

    public static async getSpritesheet(assetName: string) {
        return await AssetFetcher.fetchImage(`/assets/pets/${assetName}/${assetName}.png`);
    }

    public static async getSprite(assetName: string, properties: AssetSpriteProperties): AssetSpriteResult["result"] {
        return await AssetFetcher.fetchImageSprite(`/assets/pets/${assetName}/${assetName}.png`, properties);
    }

    public static readonly assetSprites: Map<string, FurnitureRendererSprite | null> = new Map();
}
