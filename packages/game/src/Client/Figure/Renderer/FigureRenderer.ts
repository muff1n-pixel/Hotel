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
import FigureEffectData from "@Client/Figure/Renderer/Interfaces/FigureEffectData";
import { AvatarActionData } from "@Client/Interfaces/Figure/Avataractions";
import { BLEND_MODES } from "pixi.js";
import FigureBodyPartAction from "./Interfaces/FigureBodyPartAction";

export type FigureCanvasRender = {
    figure: {
        image: OffscreenCanvas;
        imageData?: Uint8Array;

        x: number;
        y: number;

        index: number;

        alpha?: number;

        ink?: BLEND_MODES;
    };
    effects: (Omit<FigureRendererSpriteResult, "imageData"> & { imageData?: ImageData | null; })[];
}

export type FigureRendererResult = {
    figure: FigureRendererSpriteResult;
    effects: (Omit<FigureRendererSpriteResult, "imageData"> & { imageData?: ImageData | null; })[];
};

export type FigureRendererSpriteResult = Omit<FigureRendererSprite, "imageData"> & {
    imageData?: Uint8Array;
};

export type FigureRendererSprite = {
    image: ImageBitmap | OffscreenCanvas;
    imageData?: ImageData | null;

    x: number;
    y: number;

    index: number;

    alpha?: number;

    ink?: BLEND_MODES;
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

    public previousFrames?: string;
    public previousEffects?: string;
    private previousOptions?: FigureRendererOptions;

    private rendering: boolean = false;

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
            const figureData = await FigureAssets.fetchFigureData(assetId);

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
                    await FigureAssets.fetchFigureSprite(assetId, {
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

    public render(options: FigureRendererOptions, useConfigurationEffect: boolean = false, ignoreBodyparts: string[] = [], headOnly?: boolean) {
        this.previousOptions = {...options};
        
        this.rendering = true;

        const mutatedActions = this.getMutatedActions(options, useConfigurationEffect);

        const actions = this.figureActions.getAvatarActions(options, mutatedActions);

        const effects = this.figureEffects.getEffects(mutatedActions, actions);

        const direction = this.figureEffects.getDirectionFromEffect(options.direction, effects);

        const actionsForBodyParts = this.figureActions.getActionsForBodyParts(options.frame, actions, effects, ignoreBodyparts);

        // TODO: already here filter out parts that will not be rendered to minimize the overhead

        const spritesFromConfiguration = this.getSpritesFromConfiguration(options, mutatedActions, actionsForBodyParts);

        const effectAvatar = effects.find((effect) => effect.data.animation?.avatar);

        const grayscaled: AssetSpriteGrayscaledProperties | undefined = (effectAvatar?.data.animation?.avatar)?({
            ink: effectAvatar.data.animation.avatar.ink,
            background: effectAvatar.data.animation.avatar.background,
            foreground: effectAvatar.data.animation.avatar.foreground,
        }):(undefined);

        const sprites = this.figureSpriteRenderer.getFigureSprites(mutatedActions, options.frame, spritesFromConfiguration, actionsForBodyParts, direction, grayscaled, headOnly);

        const effectSprites: FigureRendererSprite[] = this.figureEffectRenderer.getEffectSprites(options.frame, actions, effects, direction);

        this.rendering = false;

        return {
            sprites,
            effectSprites
        };
    }

    private getSpritesFromConfiguration(options: FigureRendererOptions, mutatedActions: string[], actionsForBodyParts: FigureBodyPartAction[]) {
        const spritesFromConfiguration = this.figureSpriteBuilder.getSpritesFromConfiguration(options);

        const carryItemAction = actionsForBodyParts.find((action) => action.actionId === "CarryItem");

        if(carryItemAction) {
            const carryItemActionId = this.figureActions.getActionParamId(mutatedActions, carryItemAction.actionId);

            if(carryItemActionId) {
                spritesFromConfiguration.push({
                    id: carryItemActionId.toString(),
                    assetId: "hh_human_item",
                    colorable: false,
                    colorIndex: 0,
                    colorPaletteId: 0,
                    type: "ri",
                    index: 0,
                    colors: []
                });
            }
        }

        const signId = this.figureActions.getActionId(mutatedActions, "Sign");

        if(signId) {
            spritesFromConfiguration.push({
                id: signId.toString(),
                assetId: "hh_human_item",
                colorable: false,
                colorIndex: 0,
                colorPaletteId: 0,
                type: "li",
                index: 0,
                colors: []
            });
        }

        return spritesFromConfiguration;
    }

    public renderToCanvas(options: FigureRendererOptions, cropped: boolean = false, drawEffects: boolean = false, useConfigurationEffect: boolean = false, ignoreBodyparts: string[] = [], headOnly?: boolean) {
        return this.figureCanvasRenderer.renderToCanvas(options, cropped, drawEffects, useConfigurationEffect, ignoreBodyparts, headOnly);
    }

    private configurationAsString?: string;

    public getConfigurationAsString(options?:FigureRendererOptions): string {
        if(options?.figureConfigurationChanged || !this.configurationAsString) {
            this.configurationAsString = this.configuration.parts.map((section) => [section.type, section.setId, ...section.colors].filter(Boolean).join('-')).join('.');
        }

        return this.configurationAsString;
    }

    private readonly geometryPartLookup = new WeakMap<
        FigureBodyPartAction["geometry"],
        Map<string, string>
    >();

    private getFramesKey(
        options: FigureRendererOptions,
        actions: AvatarActionData[],
        effects: FigureEffectData[]
    ): string {
        const actionsForBodyParts =
            this.figureActions.getActionsForBodyParts(
                options.frame,
                actions,
                effects,
                []
            );

        const sprites =
            this.figureSpriteBuilder.getSpritesFromConfiguration(options);

        // Map every body part to its action once.
        const actionByBodyPart = new Map<string, FigureBodyPartAction>();

        for (const action of actionsForBodyParts) {
            for (const bodyPart of action.bodyParts) {
                if (!actionByBodyPart.has(bodyPart)) {
                    actionByBodyPart.set(bodyPart, action);
                }
            }
        }

        const frameSections: string[] = [];

        for (const sprite of sprites) {
            const action = actionByBodyPart.get(sprite.type);

            if (!action) {
                continue;
            }

            let direction = options.direction;

            if (action.directionOffset !== undefined) {
                direction += action.directionOffset;
            }

            direction = (direction + 8) & 7;

            const geometryPartLookup =
                this.getGeometryPartLookup(action.geometry);

            const geometryId =
                geometryPartLookup.get(sprite.type);

            const animation =
                this.figureAnimations.getAvatarAnimation(
                    action.actionId,
                    geometryId,
                    sprite.type,
                    direction,
                    options.frame
                );

            const spriteFrame =
                action.frame ?? animation?.spriteFrame ?? 0;

            frameSections.push(
                `${sprite.id}-${sprite.type}-${spriteFrame}`
            );
        }

        return frameSections.join("_");
    }

    private getGeometryPartLookup(
        geometry: FigureBodyPartAction["geometry"]
    ): Map<string, string> {
        let lookup = this.geometryPartLookup.get(geometry);

        if (lookup) {
            return lookup;
        }

        lookup = new Map<string, string>();

        for (const bodypart of geometry.bodyparts) {
            for (const part of bodypart.parts) {
                if (!lookup.has(part)) {
                    lookup.set(part, bodypart.id);
                }
            }
        }

        this.geometryPartLookup.set(geometry, lookup);

        return lookup;
    }

    private getMutatedActions(options: FigureRendererOptions, useConfigurationEffect?: boolean) {
        const mutatedActions = [...options.actions];

        const shouldAddConfigurationEffect = useConfigurationEffect && this.configuration.effect && !mutatedActions.some((actionId) => actionId.startsWith("AvatarEffect"));

        if(shouldAddConfigurationEffect) {
            mutatedActions.push(`AvatarEffect.${this.configuration.effect}`);
        }

        return mutatedActions;
    }

    private getEffectsFramesKey(options: FigureRendererOptions, useConfigurationEffect?: boolean) {
        const mutatedActions = this.getMutatedActions(options, useConfigurationEffect);

        const actions = this.figureActions.getAvatarActions(options, mutatedActions);

        const effects = this.figureEffects.getEffects(mutatedActions, actions);

        const direction = this.figureEffects.getDirectionFromEffect(options.direction, effects);

        const result: string[] = [];

        for(const effect of effects) {
            if(!effect.data.animation) {
                continue;
            }

            const animationSprites = this.figureEffects.getFigureEffectAnimationSprites(actions, effect, direction, options.frame);

            const animationFrameIndex = this.figureAnimations.getCurrentAnimationFrame(options.frame, effect.data.animation.frames);

            const animationFrame = effect.data.animation.frames?.[animationFrameIndex];

            for(const animationSprite of animationSprites) {
                let spriteEffect = effect;

                const effectLibrary = animationSprite.member?.split('_').find((part) => part.startsWith("fx"));

                if(effectLibrary && effectLibrary !== `fx${effect.id}`) {
                    const libraryId = parseInt(effectLibrary.substring(2));

                    const library = this.figureEffects.getEffectLibrary(libraryId);

                    if(!library) {
                        continue;
                    }

                    spriteEffect = this.figureEffects.effects[library.id];

                    if(!spriteEffect) {
                        continue;
                    }
                }

                const effectFrame = animationFrame?.effects.find((effect) => effect.id === animationSprite.id);

                let spriteDirection = direction;

                if(animationSprite.directionOffset !== undefined) {
                    spriteDirection += animationSprite.directionOffset;
                }

                if(effectFrame?.directionOffset !== undefined) {
                    spriteDirection += effectFrame.directionOffset;
                }

                while(spriteDirection < 0) {
                    spriteDirection += 8;
                }

                spriteDirection %= 8;
            
                result.push(`${animationSprite.id}-${animationSprite?.frame ?? effectFrame?.frame ?? 0}-${animationSprite.member}-${(animationSprite.useDirections)?(spriteDirection):(0)}-${animationSprite.destinationY}`);
            }
        }

        return result.join('_');
    }

    public shouldRender(options: FigureRendererOptions) {
        if(this.rendering) {
            return false;
        }

        if(!FigureAssets.loaded) {
            return false;
        }

        const mutatedActions = this.getMutatedActions(options);

        const actions = this.figureActions.getAvatarActions(options, mutatedActions);

        const effects = this.figureEffects.getEffects(mutatedActions, actions);
        
        const framesKey = this.getFramesKey(options, actions, effects);

        const effectsFramesKey = this.getEffectsFramesKey(options);

        if(this.previousFrames !== framesKey || this.previousEffects !== effectsFramesKey) {
            this.previousFrames = framesKey;
            this.previousEffects = effectsFramesKey;

            return true;
        }

        if(!this.previousOptions) {
            return true;
        }

        if(options.actions.join('_') !== this.previousOptions.actions.join('_')) {
            return true;
        }

        if(options.direction !== this.previousOptions.direction) {
            return true;
        }

        return false;
    }

    public shouldLoadAssets(options: FigureRendererOptions) {
        const mutatedActions = this.getMutatedActions(options);

        if(options.actionsChanged) {
            return true;
        }

        const actions = this.figureActions.getAvatarActions(options, mutatedActions);

        const effects = this.figureEffects.getEffects(mutatedActions, actions);

        const actionsForBodyParts = this.figureActions.getActionsForBodyParts(options.frame, actions, effects, []);

        const spritesFromConfiguration = this.getSpritesFromConfiguration(options, mutatedActions, actionsForBodyParts);

        for(const spriteConfiguration of spritesFromConfiguration) {
            if(!FigureAssets.getFigureData(spriteConfiguration.assetId)) {
                return true;
            }

            if(!FigureAssets.getFigureImage(spriteConfiguration.assetId)) {
                return true;
            }
        }
    }

    public async loadAssets(options: FigureRendererOptions) {
        const mutatedActions = this.getMutatedActions(options);

        if(options.actionsChanged) {
            const actions = this.figureActions.getAvatarActions(options, mutatedActions);
            
            await this.figureEffects.loadEffects(options, mutatedActions, actions);
        }

        const actions = this.figureActions.getAvatarActions(options, mutatedActions);

        const effects = this.figureEffects.getEffects(mutatedActions, actions);

        const actionsForBodyParts = this.figureActions.getActionsForBodyParts(options.frame, actions, effects, []);

        const spritesFromConfiguration = this.getSpritesFromConfiguration(options, mutatedActions, actionsForBodyParts);

        for(const spriteConfiguration of spritesFromConfiguration) {
            if(!FigureAssets.getFigureData(spriteConfiguration.assetId)) {
                await FigureAssets.fetchFigureData(spriteConfiguration.assetId);
            }

            if(!FigureAssets.getFigureImage(spriteConfiguration.assetId)) {
                await FigureAssets.fetchFigureImage(spriteConfiguration.assetId);
            }
        }
    }
}
