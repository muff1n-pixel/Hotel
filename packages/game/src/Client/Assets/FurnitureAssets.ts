import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import AssetFetcher, { AssetSpriteProperties, AssetSpriteResult } from "./AssetFetcher";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import AudioFetcher from "@Client/Assets/AudioFetcher";

export default class FurnitureAssets {
    public static placeholder: Awaited<AssetSpriteResult["result"]>;
    public static placeholder32: Awaited<AssetSpriteResult["result"]>;
    
    public static async preloadAssets() {
        await AssetFetcher.fetchImageSprite(`/assets/furniture/placeholder/placeholder64.png`, {
            x: 0,
            y: 0,
            width: 68,
            height: 67
        }).then((result) => {
            FurnitureAssets.placeholder = result;
        });
        
        await AssetFetcher.fetchImageSprite(`/assets/furniture/placeholder/placeholder32.png`, {
            x: 0,
            y: 0,
            width: 35,
            height: 34
        }).then((result) => {
            FurnitureAssets.placeholder32 = result;
        });
    }

    public static async fetchFurnitureData(furnitureName: string) {
        return await AssetFetcher.fetchJson<FurnitureData>(`/assets/furniture/${furnitureName}/${furnitureName}.json`);
    }

    public static async fetchFurnitureSpritesheet(furnitureName: string) {
        return await AssetFetcher.fetchImage(`/assets/furniture/${furnitureName}/${furnitureName}.png`);
    }

    public static async fetchFurnitureSprite(furnitureName: string, properties: AssetSpriteProperties): AssetSpriteResult["result"] {
        return await AssetFetcher.fetchImageSprite(`/assets/furniture/${furnitureName}/${furnitureName}.png`, properties);
    }

    public static getFurnitureData(furnitureName: string) {
        return AssetFetcher.getJson<FurnitureData>(`/assets/furniture/${furnitureName}/${furnitureName}.json`);
    }

    public static getFurnitureSpritesheet(furnitureName: string) {
        return AssetFetcher.getImage(`/assets/furniture/${furnitureName}/${furnitureName}.png`);
    }

    public static getFurnitureSprite(furnitureName: string, properties: AssetSpriteProperties) {
        return AssetFetcher.getImageSprite(`/assets/furniture/${furnitureName}/${furnitureName}.png`, properties);
    }

    public static async fetchFurnitureAudioBuffer(context: AudioContext, furnitureName: string, soundFile: string) {
        return await AudioFetcher.getAudioBuffer(context, `/assets/furniture/${furnitureName}/sounds/${soundFile}`);
    }

    public static readonly assetSprites: Map<string, FurnitureRendererSprite | null> = new Map();
}
