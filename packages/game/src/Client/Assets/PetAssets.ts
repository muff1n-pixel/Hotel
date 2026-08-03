import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import AssetFetcher, { AssetSpriteProperties, AssetSpriteResult } from "./AssetFetcher";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";

export default class PetAssets {
    public static async fetchData(assetName: string) {
        return await AssetFetcher.fetchJson<FurnitureData>(`/assets/pets/${assetName}/${assetName}.json`);
    }
    
    public static getData(assetName: string) {
        return AssetFetcher.getJson<FurnitureData>(`/assets/pets/${assetName}/${assetName}.json`);
    }

    public static async fetchPaletteData(assetName: string, source: string) {
        return await AssetFetcher.fetchJson<string[]>(`/assets/pets/${assetName}/palettes/${source}.json`);
    }

    public static getPaletteData(assetName: string, source: string) {
        return AssetFetcher.getJson<string[]>(`/assets/pets/${assetName}/palettes/${source}.json`);
    }

    public static async getSpritesheet(assetName: string) {
        return await AssetFetcher.fetchImage(`/assets/pets/${assetName}/${assetName}.png`);
    }

    public static async fetchSprite(assetName: string, properties: AssetSpriteProperties): AssetSpriteResult["result"] {
        return await AssetFetcher.fetchImageSprite(`/assets/pets/${assetName}/${assetName}.png`, properties);
    }

    public static async fetchImage(assetName: string) {
        return await AssetFetcher.fetchImage(`/assets/pets/${assetName}/${assetName}.png`);
    }
    
    public static getSprite(assetName: string, properties: AssetSpriteProperties) {
        return AssetFetcher.getImageSprite(`/assets/pets/${assetName}/${assetName}.png`, properties);
    }

    public static readonly assetSprites: Map<string, FurnitureRendererSprite | null> = new Map();
}
