import { FurnitureRendererSprite } from "@Client/Furniture/FurnitureRenderer";
import AssetFetcher, { AssetSpriteProperties } from "./AssetFetcher";
import { RoomData } from "@Client/Interfaces/Room/RoomData";

export default class RoomAssets {
    public static async getRoomData(assetName: string) {
        return await AssetFetcher.fetchJson<RoomData>(`/assets/room/${assetName}/${assetName}.json`);
    }

    public static async getRoomSpritesheet(assetName: string) {
        return await AssetFetcher.fetchImage(`/assets/room/${assetName}/${assetName}.png`);
    }

    public static async getRoomSprite(assetName: string, properties: AssetSpriteProperties): Promise<{ image: ImageBitmap, imageData: ImageData }> {
        return await AssetFetcher.fetchImageSprite(`/assets/room/${assetName}/${assetName}.png`, properties);
    }

    //public static readonly assetSprites: Map<string, FurnitureRendererSprite | null> = new Map();
}
