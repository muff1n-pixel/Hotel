import { FiguremapData } from "@Client/Interfaces/Figure/FiguremapData";
import AssetFetcher, { AssetSpriteProperties, AssetSpriteResult } from "./AssetFetcher";
import { FigureData } from "@Client/Interfaces/Figure/FigureData";
import { FiguredataData } from "@Client/Interfaces/Figure/FiguredataData";
import { AvatarActionsData } from "@Client/Interfaces/Figure/Avataractions";
import { FigureRendererResult, FigureRendererSprite } from "@Client/Figure/Renderer/FigureRenderer";
import { FigureAvatarAnimationData } from "@Client/Interfaces/Figure/FigureAvatarAnimationData";

export default class FigureAssets {
    public static figuremap: FiguremapData;
    public static figuredata: FiguredataData;
    public static avataractions: AvatarActionsData;
    public static avatarAnimations: FigureAvatarAnimationData;
    public static effectmap: { id: number; library: string; }[];

    private static loaded = false;

    public static async loadAssets() {
        if(FigureAssets.loaded) {
            return;
        }

        FigureAssets.figuremap = await FigureAssets.getFiguremapData();
        FigureAssets.figuredata = await FigureAssets.getFiguredataData();
        FigureAssets.avataractions = await FigureAssets.getAvataractionsData();
        FigureAssets.effectmap = await FigureAssets.getEffectMapData();
        FigureAssets.avatarAnimations = await AssetFetcher.fetchJson<FigureAvatarAnimationData>(`/assets/figure/AvatarAnimations.json`);

        FigureAssets.loaded = true;
    }
    
    public static async getEffectMapData() {
        return await AssetFetcher.fetchJson<{ id: number; library: string; }[]>(`/assets/figure/effectmap.json`);
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
        return await AssetFetcher.fetchJson<FigureData>(`/assets/figure/clothing/${name}/${name}.json`);
    }

    public static async getEffectData(name: string) {
        return await AssetFetcher.fetchJson<FigureData>(`/assets/figure/effects/${name}/${name}.json`);
    }

    public static async getFigureSpritesheet(name: string) {
        return await AssetFetcher.fetchImage(`/assets/figure/clothing/${name}/${name}.png`);
    }

    public static async getFigureSprite(name: string, properties: AssetSpriteProperties): AssetSpriteResult["result"] {
        return await AssetFetcher.fetchImageSprite(`/assets/figure/clothing/${name}/${name}.png`, properties);
    }

    public static async getEffectSprite(name: string, properties: AssetSpriteProperties): AssetSpriteResult["result"] {
        return await AssetFetcher.fetchImageSprite(`/assets/figure/effects/${name}/${name}.png`, properties);
    }

    public static readonly assetSprites: Map<string, FigureRendererSprite | null> = new Map();
    public static readonly figureCollection: Map<string, Promise<FigureRendererSprite[]>> = new Map();
    public static readonly figureImage: Map<string, Promise<FigureRendererResult>> = new Map();
}
