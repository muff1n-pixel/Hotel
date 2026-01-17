import { FiguremapData } from "@Client/Interfaces/Figure/FiguremapData";
import AssetFetcher, { AssetSpriteProperties } from "./AssetFetcher";
import { FigureData } from "@Client/Interfaces/Figure/FigureData";
import { FiguredataData } from "@Client/Interfaces/Figure/FiguredataData";
import { AvatarActionsData } from "@Client/Interfaces/Figure/Avataractions";
import { FigureRendererSprite } from "@Client/Figure/Worker/FigureWorkerRenderer";

export default class FigureAssets {
    public static figuremap: FiguremapData;
    public static figuredata: FiguredataData;
    public static avataractions: AvatarActionsData;

    public static async loadAssets() {
        FigureAssets.figuremap = await FigureAssets.getFiguremapData();
        FigureAssets.figuredata = await FigureAssets.getFiguredataData();
        FigureAssets.avataractions = await FigureAssets.getAvataractionsData();
    }
    
    public static async getFiguremapData() {
        return await AssetFetcher.fetchJson<FiguremapData>(`/assets/figure/figuremap.json`);
    }
    
    public static async getFiguredataData() {
        return await AssetFetcher.fetchJson<FiguredataData>(`/assets/figure/figuredata.json`);
    }
    
    public static async getAvataractionsData() {
        return await AssetFetcher.fetchJson<AvatarActionsData>(`/assets/figure/avataractions.json`);
    }

    public static async getFigureData(name: string) {
        return await AssetFetcher.fetchJson<FigureData>(`/assets/figure/${name}/${name}.json`);
    }

    public static async getFigureSpritesheet(name: string) {
        return await AssetFetcher.fetchImage(`/assets/figure/${name}/${name}.png`);
    }

    public static async getFigureSprite(name: string, properties: AssetSpriteProperties): Promise<{ image: ImageBitmap, imageData: ImageData }> {
        return await AssetFetcher.fetchImageSprite(`/assets/figure/${name}/${name}.png`, properties);
    }

    public static readonly assetSprites: Map<string, FigureRendererSprite | null> = new Map();
    public static readonly figureCollection: Map<string, Promise<FigureRendererSprite[]>> = new Map();
    public static readonly figureImage: Map<string, Promise<FigureRendererSprite>> = new Map();
}
