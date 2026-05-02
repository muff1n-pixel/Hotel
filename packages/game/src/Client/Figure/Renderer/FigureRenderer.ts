import FigureAssets from "../../Assets/FigureAssets";
import { FigureAnimationFrameEffectData } from "@Client/Interfaces/Figure/FigureAnimationData";
import { FigureConfigurationData } from "@pixel63/events";
import { AssetSpriteGrayscaledProperties } from "@Client/Assets/AssetFetcher";
import FigureActions from "@Client/Figure/Renderer/Actions/FigureActions";
import FigureEffects from "@Client/Figure/Renderer/Effects/FigureEffects";
import FigureSpriteBuilder from "@Client/Figure/Renderer/Sprites/FigureSpriteBuilder";
import FigureAnimations from "@Client/Figure/Renderer/Animations/FigureAnimations";
import FigureSpriteRenderer from "@Client/Figure/Renderer/Sprites/FigureSpriteRenderer";
import FigureEffectRenderer from "@Client/Figure/Renderer/Effects/FigureEffectRenderer";
import FigureCanvasRenderer from "@Client/Figure/Renderer/FigureCanvasRenderer";
import { FigureRendererOptions } from "@Client/Figure/Renderer/Interfaces/FigureRendererOptions";

export type FigureRendererResult = {
    figure: FigureRendererSpriteResult;
    effects: (Omit<FigureRendererSpriteResult, "imageData"> & { imageData?: ImageData | null; })[];
};

export type FigureRendererSpriteResult = Omit<FigureRendererSprite, "imageData"> & {
    imageData?: Uint8Array;
};

export type FigureRendererSprite = {
    image: ImageBitmap;
    imageData?: ImageData | null;

    x: number;
    y: number;

    index: number;

    alpha?: number;

    ink?: GlobalCompositeOperation;
}

export type SpriteConfiguration = {
    id: string;
    type: string;

    index: number;
    
    colorable: boolean;
    colors: number[];
    colorIndex: number;
    colorPaletteId: number;

    assetId: string;
};

export default class FigureRenderer {
    public avatarEffect?: FigureAnimationFrameEffectData;

    public readonly figureActions = new FigureActions(this);
    public readonly figureAnimations = new FigureAnimations(this);

    public readonly figureEffects = new FigureEffects(this);
    public readonly figureEffectRenderer = new FigureEffectRenderer(this);

    public readonly figureSpriteBuilder = new FigureSpriteBuilder(this);
    public readonly figureSpriteRenderer = new FigureSpriteRenderer(this);

    public readonly figureCanvasRenderer = new FigureCanvasRenderer(this);

    constructor(public configuration: FigureConfigurationData) {
        
    }

    public async heavilyPreloadFigureSprites() {
        const assets: {
            assetId: string;
            partId: string;
            partType: string;
        }[] = [];

        for(const configurationPart of this.configuration.parts) {
            const settypeData = this.figureSpriteBuilder.getSettypeForPartAndSet(configurationPart.type);

            if(!settypeData) {
                continue;
            }

            const setData = this.figureSpriteBuilder.getSetFromSettype(settypeData, configurationPart.setId);

            if(!setData) {
                continue;
            }

            for(const setPartData of setData.parts) {
                if(!setPartData) {
                    continue;
                }
                
                const setPartAssetData = this.figureSpriteBuilder.getAssetForSetPart(setPartData.id, setPartData.type);

                if(!setPartAssetData) {
                    continue;
                }

                assets.push({
                    assetId: setPartAssetData.id,
                    partId: setPartData.id,
                    partType: setPartData.type
                });
            }
        }

        console.time("Prepare");

        await Promise.allSettled(assets.map(async ({ assetId, partId, partType}) => {
            const figureData = await FigureAssets.getFigureData(assetId);

            if(figureData) {
                await Promise.allSettled(figureData.sprites.filter((sprite) => {
                    if(!sprite.name.includes(`${partType}_${partId}`)) {
                        return false;
                    }

                    const action = sprite.name.split('_')[1];

                    if(!["std", "wlk", "wav", "crr", "sit"].includes(action)) {
                        return false;
                    }

                    return true;
                }).map(async (sprite) => {
                    await FigureAssets.getFigureSprite(assetId, {
                        x: sprite.x,
                        y: sprite.y,

                        width: sprite.width,
                        height: sprite.height,

                        ignoreImageData: false,
                        ignoreExistingImageData: true
                    });
                }));
            }
        }));

        console.timeEnd("Prepare");
    }

    public async render(options: FigureRendererOptions, useConfigurationEffect: boolean = false, ignoreBodyparts: string[] = [], headOnly?: boolean) {
        const mutatedActions = [...options.actions];

        const shouldAddConfigurationEffect = useConfigurationEffect && this.configuration.effect && !mutatedActions.some((actionId) => actionId.startsWith("AvatarEffect"));

        if(shouldAddConfigurationEffect) {
            mutatedActions.push(`AvatarEffect.${this.configuration.effect}`);
        }

        const actions = this.figureActions.getAvatarActions(mutatedActions);

        const effects = await this.figureEffects.getEffects(mutatedActions, actions);

        const direction = this.figureEffects.getDirectionFromEffect(options.direction, effects);

        const actionsForBodyParts = await this.figureActions.getActionsForBodyParts(options.frame, actions, effects, ignoreBodyparts);

        // TODO: already here filter out parts that will not be rendered to minimize the overhead
        const spritesFromConfiguration = this.figureSpriteBuilder.getSpritesFromConfiguration();

        const carryItemAction = actionsForBodyParts.find((action) => action.actionId === "CarryItem");

        if(carryItemAction) {
            spritesFromConfiguration.push({
                id: this.figureActions.getActionParamId(mutatedActions, carryItemAction.actionId)?.toString() ?? "0",
                assetId: "hh_human_item",
                colorable: false,
                colorIndex: 0,
                colorPaletteId: 0,
                type: "ri",
                index: 0,
                colors: []
            });
        }

        const effectAvatar = effects.find((effect) => effect.data.animation?.avatar);

        const grayscaled: AssetSpriteGrayscaledProperties | undefined = (effectAvatar?.data.animation?.avatar)?({
            ink: effectAvatar.data.animation.avatar.ink,
            background: effectAvatar.data.animation.avatar.background,
            foreground: effectAvatar.data.animation.avatar.foreground,
        }):(undefined);

        const sprites = await this.figureSpriteRenderer.getFigureSprites(mutatedActions, options.frame, spritesFromConfiguration, actionsForBodyParts, direction, grayscaled, headOnly);

        const effectSprites = await this.figureEffectRenderer.getEffectSprites(options.frame, actions, actionsForBodyParts, effects, direction);

        return {
            sprites,
            effectSprites
        };
    }

    public async renderToCanvas(options: FigureRendererOptions, cropped: boolean = false, drawEffects: boolean = false, useConfigurationEffect: boolean = false, ignoreBodyparts: string[] = [], headOnly?: boolean) {
        return this.figureCanvasRenderer.renderToCanvas(options, cropped, drawEffects, useConfigurationEffect, ignoreBodyparts, headOnly);
    }

    public getConfigurationAsString(): string {
        return this.configuration.parts.map((section) => [section.type, section.setId, ...section.colors].filter(Boolean).join('-')).join('.');
    }
}
