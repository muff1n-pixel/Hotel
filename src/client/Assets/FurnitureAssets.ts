import AssetFetcher, { AssetSpriteProperties } from "./AssetFetcher.js";

export default class FurnitureAssets {
    public static async getFurnitureData(furnitureName: string) {
        return AssetFetcher.fetchJson(`../assets/furniture/${furnitureName}/${furnitureName}.json`);
    }

    public static async getFurnitureSpritesheet(furnitureName: string) {
        return AssetFetcher.fetchImage(`../assets/furniture/${furnitureName}/${furnitureName}.png`);
    }

    public static async getFurnitureSprite(furnitureName: string, properties: AssetSpriteProperties) {
        return AssetFetcher.fetchImageSprite(`../assets/furniture/${furnitureName}/${furnitureName}.png`, properties);
    }
}
