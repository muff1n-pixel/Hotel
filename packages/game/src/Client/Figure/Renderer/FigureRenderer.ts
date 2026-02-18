import FigureAssets from "../../Assets/FigureAssets";
import ContextNotAvailableError from "../../Exceptions/ContextNotAvailableError";
import { FiguredataData } from "@Client/Interfaces/Figure/FiguredataData";
import { figureRenderPriority } from "./Geometry/FigureRenderPriority";
import { FigureData } from "@Client/Interfaces/Figure/FigureData";
import { FigureConfiguration, FigurePartKeyAbbreviation } from "@Shared/Interfaces/Figure/FigureConfiguration";
import { FigureAnimationFrameEffectData } from "@Client/Interfaces/Figure/FigureAnimationData";
import { figureGeometryTypes } from "@Client/Figure/Renderer/Geometry/FigureGeometry";
import { figurePartSets } from "@Client/Figure/Renderer/Geometry/FigurePartSets";
import { FurnitureSprite } from "@Client/Interfaces/Furniture/FurnitureSprites";
import { FurnitureAsset } from "@Client/Interfaces/Furniture/FurnitureAssets";
import { getGlobalCompositeModeFromInkNumber } from "@Client/Renderers/GlobalCompositeModes";

export type FigureRendererResult = {
    figure: FigureRendererSprite;
    effects: FigureRendererSprite[];
};

export type FigureRendererSprite = {
    image: ImageBitmap;
    imageData: ImageData;

    x: number;
    y: number;

    index: number;

    ink?: GlobalCompositeOperation;
}

type SpriteConfiguration = {
    id: string;
    type: FigurePartKeyAbbreviation;

    index: number;
    
    colorable: boolean;
    colors: number[];
    colorIndex: number;
    colorPaletteId: number;

    assetId: string;
};

type BodyPartAction = {
    actionId: string;
    geometry: {
        bodyparts: {
            id: string;
            parts: string[];
        }[];
    };
    bodyParts: string[];
    assetPartDefinition: string;
    y?: number;
};

type EffectData = {
    id: number;
    library: string,
    data: FigureData
};

export default class FigureRenderer {
    constructor(public readonly configuration: FigureConfiguration, public direction: number, public readonly actions: string[], public readonly frame: number, public readonly headOnly: boolean = false) {

    }

    private getSettypeForPartAndSet(part: FigurePartKeyAbbreviation) {
        return FigureAssets.figuredata!.settypes.find((settype) => settype.type === part);
    }

    private getSetFromSettype(settype: FiguredataData["settypes"][0], setId: string) {
        return settype.sets.find((set) => set.id === setId);
    }

    private getAssetForSetPart(assetId: string, assetType: FigurePartKeyAbbreviation) {
        for(let index = FigureAssets.figuremap!.length - 1; index >= 0; index--) {
            if(FigureAssets.figuremap![index].id.startsWith("hh_human_50")) {
                continue;
            }

            if(FigureAssets.figuremap![index].parts.some((part) => part.id === assetId && part.type === assetType.substring(0, 2))) {
                return FigureAssets.figuremap![index];
            }
        }

        return null;
    }

    public static getSpriteFrameFromSequence(frame: number) {
        const frameSequence = 4;
        const frameRepeat = 2;
        const spriteFrame = Math.floor((frame % (frameSequence * frameRepeat)) / frameRepeat);

        return spriteFrame;
    }

    private getEffectBodyParts(effect: EffectData) {
        if(!effect?.data.animation) {
            return null;
        }

        const frame = this.getCurrentAnimationFrame(effect);

        if(!effect.data.animation.frames[frame]) {
            return null;
        }

        return effect.data.animation.frames[frame].bodyParts;
    }

    private getAvatarActions() {
        let avatarActionsData = FigureAssets.avataractions.filter((action) => this.actions.some((id) => id.split('.')[0] === action.id)).sort((a, b) => a.precedence - b.precedence);
        
        avatarActionsData = avatarActionsData.filter((action) => {
            return !avatarActionsData.some((secondAction) => secondAction.precedence > action.precedence && secondAction.prevents?.includes(action.id))
        });

        return avatarActionsData;
    }

    private async getActionsForBodyParts(effect?: EffectData) {
        const result: BodyPartAction[] = [];

        if(effect) {
            const effectBodyParts = this.getEffectBodyParts(effect);

            // effect says bodypart id rightarm (geometry bodypart) is used for action CarryItem
            // CarryItem says handRight is used for activePartSet

            if(effectBodyParts) {
                for(const effectBodyPart of effectBodyParts) {
                    const action = FigureAssets.avataractions.find((avatarAction) => avatarAction.id === effectBodyPart.action);

                    if(!action) {
                        console.warn("Action is not found for effect " + effectBodyPart.id + ", " + effectBodyPart.action + ".");

                        continue;
                    }

                    const geometry = figureGeometryTypes.find((geometry) => geometry.id === action.geometryType);

                    if(!geometry) {
                        throw new Error("Action does not have a geometry type.");
                    }

                    const geometryBodyparts = geometry.bodyparts.find((bodypart) => bodypart.id === effectBodyPart.id);

                    if(!geometryBodyparts) {
                        throw new Error("Action does not have a geometry bodyparts.");
                    }

                    result.push({
                        actionId: action.id,
                        geometry,
                        assetPartDefinition: action.assetPartDefinition,
                        bodyParts: geometryBodyparts.parts,
                    });

                    // now we know handRight is occupied by CarryItem to use `crr`
                    // handRight consists of figurePartSets->handRight->[ "rh", "rhs", "rs", "rc", "ri" ]
                }
            }
        }

        const actions = this.getAvatarActions();

        for(const action of actions) {
            if(action.id === "AvatarEffect") {
                continue;
            }

            const geometry = figureGeometryTypes.find((geometry) => geometry.id === action.geometryType);
            
            if(!geometry) {
                throw new Error("Geometry is not found for action.");
            }
            
            const figurePartSet = figurePartSets.find((figurePartSet) => figurePartSet.id === action.activePartSet);

            if(!figurePartSet) {
                throw new Error("Action does not have a figure part set in geometry.");
            }

            result.push({
                actionId: action.id,
                geometry,
                assetPartDefinition: action.assetPartDefinition,
                bodyParts: figurePartSet.parts,
                y: (action.assetPartDefinition === "sit")?(16):(0)
            });

            // now we know walk is occupied by Move to use `wlk`
            // walk consists of figurePartSets->walk->["bd", ...]

            // now we know figure is occupied by Default to use `std`
            // figure consists of figurePartSets->figure->[...]
        }

        return result;
    }

    private getAvatarAnimation(actionId: string, geometryBodyPart: string | undefined, setType: string, direction: number, frame: number) {
        const actionAnimation = FigureAssets.avatarAnimations.actions.find((actionAnimation) => actionAnimation.id === actionId);

        if(!actionAnimation) {
            return null;
        }

        const actionAnimationSettype = actionAnimation.parts.find((part) => part.setType === setType);

        if(!actionAnimationSettype) {
            return null;
        }

        const totalFrames = actionAnimationSettype.frames.reduce((previousValue, currentValue) => {
            return previousValue + (currentValue.repeats ?? 1);
        }, 0);


        const actualFrame = Math.floor((frame / 2) % totalFrames);

        let temporaryFrame = 0;
        let spriteFrame = 0;
        let assetPartDefinition: string | null = null;

        for(let index = 0; index < actionAnimationSettype.frames.length; index++) {
            //console.log({ actualFrame, temporaryFrame, maxFrame: (temporaryFrame + (actionAnimationSettype.frames[index].repeats ?? 0)) });

            if(actualFrame >= temporaryFrame && actualFrame <= (temporaryFrame + (actionAnimationSettype.frames[index].repeats ?? 0))) {
                spriteFrame = actionAnimationSettype.frames[index].number;
                assetPartDefinition = actionAnimationSettype.frames[index].assetPartDefinition;
                
                //console.log("break", spriteFrame);

                break;
            }

            temporaryFrame += 1;
            temporaryFrame += actionAnimationSettype.frames[index].repeats ?? 0;
        }

        const offset = actionAnimation.offsets.find((offset) => offset.frame === spriteFrame);
        const offsetDirection = offset?.directions.find((offsetDirection) => offsetDirection.id === direction);
        const useOffsetDirectionBodypart = offsetDirection?.bodypart.id === geometryBodyPart;

        return {
            spriteFrame,
            assetPartDefinition,
            destinationX: (useOffsetDirectionBodypart)?(offsetDirection?.bodypart.destinationX):(undefined),
            destinationY: (useOffsetDirectionBodypart)?(offsetDirection?.bodypart.destinationY):(undefined)
        };
    }

    private getSpritesFromConfiguration() {
        const result: SpriteConfiguration[] = [];
        const hiddenPartTypes: FigurePartKeyAbbreviation[] = [];

        for(const configurationPart of this.configuration.parts) {
            const settypeData = this.getSettypeForPartAndSet(configurationPart.type);

            if(!settypeData) {
                console.warn("Settype does not exist for part and set.");

                continue;
            }

            const setData = this.getSetFromSettype(settypeData, configurationPart.setId);

            if(!setData) {
                console.warn("Set does not exist for set type.");

                continue;
            }

            if(setData.hiddenPartTypes) {
                hiddenPartTypes.push(...setData.hiddenPartTypes);
            }

            for(const setPartData of setData.parts) {
                if(!setPartData) {
                    console.error("???");

                    continue;
                }
                
                const setPartAssetData = this.getAssetForSetPart(setPartData.id, setPartData.type);

                if(!setPartAssetData) {
                    console.log("Set part asset data does not exist for set part id " + setPartData.id + ", type " + setPartData.type + ".");

                    continue;
                }

                result.push({
                    colorable: setPartData.colorable,
                    colors: configurationPart.colors,
                    colorIndex: setPartData.colorIndex,
                    colorPaletteId: settypeData.paletteId,
                    
                    index: setPartData.index,

                    id: setPartData.id,
                    type: setPartData.type,

                    assetId: setPartAssetData.id
                });
            }
        }

        const filteredResult = result.filter((result) => !hiddenPartTypes.includes(result.type));

        return filteredResult;
    }

    private getDirectionFromEffect(effect?: EffectData) {
        let direction = this.direction;

        if(effect?.data.animation?.direction) {
            direction += effect.data.animation.direction.offset;
        
            direction %= 8;
        }

        return direction;
    }

    public async render() {
        const effect = await this.getEffect();

        const direction = this.getDirectionFromEffect(effect);

        const actionsForBodyParts = await this.getActionsForBodyParts(effect);

        // TODO: already here filter out parts that will not be rendered to minimize the overhead
        const spritesFromConfiguration = this.getSpritesFromConfiguration();

        const carryItemAction = actionsForBodyParts.find((action) => action.actionId === "CarryItem");

        if(carryItemAction) {
            spritesFromConfiguration.push({
                id: this.getActionParamId(carryItemAction.actionId)?.toString() ?? "0",
                assetId: "hh_human_item",
                colorable: false,
                colorIndex: 0,
                colorPaletteId: 0,
                type: "ri",
                index: 0,
                colors: []
            });
        }

        const avatarEffect = await this.getEffectForAvatar();

        const sprites = await this.getFigureSprites(spritesFromConfiguration, actionsForBodyParts, direction);

        const effectSprites = await this.getEffectSprites(effect, avatarEffect);

        return {
            sprites,
            effectSprites
        };
    }

    private async getEffectSprites(effect: EffectData | undefined, avatarEffect: FigureAnimationFrameEffectData | null): Promise<FigureRendererSprite[]> {
        if(!effect) {
            return [];
        }

        // TODO: add effects without animations
        if(!effect.data.animation) {
            return [];
        }

        const frame = this.getCurrentAnimationFrame(effect);

        console.log("Frame " + this.frame + " becomes " + frame);

        const animationFrame = effect.data.animation.frames[frame];

        const sprites: FigureRendererSprite[] = [];

        function getIndexForAlignment(alignment: string) {
            switch(alignment) {
                case "top":
                    return 1;

                case "bottom":
                    return -1;
            }

            return 0;
        }

        const animationSprites =
            effect.data.animation.sprites
            .concat(
                effect.data.animation.add.map((add) => {
                    const id = add.base ?? add.id;

                    return {
                        id,
                        member: `std_${id}_1`, // TODO: what's the 1 for?
                        useDirections: true,
                        directions: Array(8).fill(null).map((_, index) => {
                            return {
                                id: index,
                                destinationX: undefined,
                                destinationY: undefined,
                                destinationZ: getIndexForAlignment(add.align)
                            };
                        }),
                        destinationY: (avatarEffect?.destinationY ?? 0)
                    }
                })
            );

        if(effect.data.animation.shadow) {
            // TODO: there's no shadow sprite provided?

            /*animationSprites.push({
                id: effect.data.animation.shadow.id,
                member: effect.data.animation.shadow.id,
                useDirections: false
            });*/
        }
        
        for(const sprite of animationSprites) {
            if(sprite.id === "avatar") {
                continue;
            }

            const effectFrame = animationFrame?.effects.find((effect) => effect.id === sprite.id);

            const direction = sprite.directions?.find((direction) => direction.id === this.direction);

            if(sprite.useDirections && !direction) {
                console.warn("Effect has no direction specified for " + this.direction);

                continue;
            }

            const index = (direction)?(direction.destinationZ):(0);

            const flipHorizontal = false;

            const assetName = `h_${sprite.member}_${(sprite.useDirections)?(this.direction):(0)}_${effectFrame?.frame ?? 0}`;

            const assetData = effect.data.assets.find((asset) => asset.name === assetName);

            /*if(!assetData && (this.direction > 3 && this.direction < 7)) {
                assetName = `h_${sprite.member}_${(sprite.useDirections)?(6 - this.direction):(0)}_${effectFrame?.frame ?? 0}`;

                assetData = effect.data.assets.find((asset) => asset.name === assetName);

                flipHorizontal = true;
            }*/

            if(!assetData) {
                console.error("Can't find asset for " + assetName);

                continue;
            }

            const sourceAssetName = assetData.source ?? assetData.name;

            const spriteData = effect.data.sprites.find((sprite) => sprite.name === sourceAssetName);

            if(!spriteData) {
                console.error("Can't find sprite for source asset " + sourceAssetName);

                continue;
            }

            const destinationY = (sprite.destinationY ?? 0) + (effectFrame?.destinationY ?? 0);

            const result = await this.getEffectSprite(effect.library, assetData, spriteData, index, destinationY, sprite.ink, flipHorizontal);

            if(direction?.destinationX) {
                result.x += direction.destinationX;
            }

            if(direction?.destinationY) {
                result.y += direction.destinationY;
            }

            if(result) {
                sprites.push(result);
            }
        }

        return sprites;
    }

    private async getFigureSprites(spritesFromConfiguration: SpriteConfiguration[], actionsForBodyParts: BodyPartAction[], direction: number): Promise<FigureRendererSprite[]> {
        const flipHorizontal = (direction > 3 && direction < 7);
        const flippedDirection = (flipHorizontal)?(6 - direction):(direction);

        const sprites = await Promise.all(spritesFromConfiguration.map(async (spriteConfiguration) => {
            const actionForSprite = actionsForBodyParts.find((action) => action.bodyParts.includes(spriteConfiguration.type));
        
            if(!actionForSprite) {
                console.warn("Sprite has no action requesting it.");

                return null
            }

            const figureData = await FigureAssets.getFigureData(spriteConfiguration.assetId);

            if(!figureData) {
                console.error("Figure data does not exist for " + spriteConfiguration.assetId);

                return null
            }

            const geometryPart = actionForSprite.geometry.bodyparts.find((bodypart) => bodypart.parts.includes(spriteConfiguration.type));

            if(this.headOnly && geometryPart?.id !== "head") {
                return null
            }

            const avatarAnimation = this.getAvatarAnimation(actionForSprite.actionId, geometryPart?.id, spriteConfiguration.type, direction, this.frame);

            let assetFlipped = false;
            let assetDirection = direction;
            let assetType = spriteConfiguration.type;

            let assetName = `h_${avatarAnimation?.assetPartDefinition ?? actionForSprite.assetPartDefinition ?? "std"}_${assetType}_${spriteConfiguration.id}_${assetDirection}_${avatarAnimation?.spriteFrame ?? 0}`;

            let asset = figureData.assets.find((asset) => asset.name === assetName);

            if(!asset && flipHorizontal) {
                console.warn("Can't find asset for " + assetName + ", trying with flipped direction");

                if(assetType[1] !== 'g') {
                    if(assetType[0] == 'l') {
                        assetType = 'r' + assetType.substring(1);
                    }
                    else if(assetType[0] == 'r') {
                        assetType = 'l' + assetType.substring(1);

                    }
                }

                assetFlipped = flipHorizontal;
                assetDirection = flippedDirection;

                assetName = `h_${avatarAnimation?.assetPartDefinition ?? actionForSprite.assetPartDefinition ?? "std"}_${assetType}_${spriteConfiguration.id}_${assetDirection}_${avatarAnimation?.spriteFrame ?? 0}`;

                asset = figureData.assets.find((asset) => asset.name === assetName);
            }

            if(!asset) {
                console.warn("Can't find asset for " + assetName + ", trying with standing part definition.");
                
                assetName = `h_std_${assetType}_${spriteConfiguration.id}_${assetDirection}_${avatarAnimation?.spriteFrame ?? 0}`;

                asset = figureData.assets.find((asset) => asset.name === assetName);
            }

            if(!asset) {
                console.error("Can't find asset for " + assetName);

                return null
            }

            const sourceAssetName = asset.source ?? asset.name;

            const sprite = figureData.sprites.find((sprite) => sprite.name === sourceAssetName);

            if(!sprite) {
                console.error("Can't find sprite for source asset " + sourceAssetName);

                return null
            }

            const palette = FigureAssets.figuredata.palettes.find((palette) => palette.id === spriteConfiguration.colorPaletteId);
            const paletteColor = palette?.colors.find((color) => color.id === spriteConfiguration.colors[spriteConfiguration.colorIndex - 1]);

            const result = await this.getFigureSprite(assetType, spriteConfiguration, sprite, asset, paletteColor?.color, assetDirection, assetFlipped);

            if(result) {
                const actionForSit = this.actions.some((action) => action === "Sit");

                if(actionForSit) {
                    result.y += 16;
                }

                if(avatarAnimation?.destinationX) {
                    result.x += avatarAnimation.destinationX;
                }
                
                if(avatarAnimation?.destinationY) {
                    result.y += avatarAnimation.destinationY;
                }

                return result;
            }

            return null;
        }));

        return sprites.filter((sprite) => sprite !== null);
    }

    private async getEffectSprite(library: string, assetData: FurnitureAsset, spriteData: FurnitureSprite, index: number, destinationY: number, ink: number | undefined, flipHorizontal: boolean) {
        const sprite = await FigureAssets.getEffectSprite(library, {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            flipHorizontal,

            ignoreImageData: true
        });

        let x = assetData.x;

        if(flipHorizontal) {
            x = 64 + (assetData.x * -1) - spriteData.width;
        }

        return {
            image: await createImageBitmap(sprite.image),
            imageData: sprite.imageData,
            
            x: x - 32,
            y: destinationY + assetData.y + 32,

            index,

            ink: (ink !== undefined)?(getGlobalCompositeModeFromInkNumber(ink)):(undefined)
        };
    }

    private async getFigureSprite(type: string, spriteConfiguration: SpriteConfiguration, spriteData: FurnitureSprite, assetData: FurnitureAsset, color: string | undefined, direction: number, flipHorizontal: boolean) {
        const sprite = await FigureAssets.getFigureSprite(spriteConfiguration.assetId, {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            flipHorizontal: (flipHorizontal)?(!assetData.flipHorizontal):(assetData.flipHorizontal),

            color: (spriteConfiguration.colorable && spriteConfiguration.colors[spriteConfiguration.colorIndex - 1] && type !== "ey")?(color):(undefined),

            ignoreImageData: true
        });

        const priorityTypes: Partial<Record<string, FigurePartKeyAbbreviation>> = {
            "cp": "ch",
            "cc": "ch",
            "lc": "ls",
            "rc": "rs"
        };

        const partPriority = figureRenderPriority["std"][direction.toString()].indexOf(priorityTypes[type] ?? type);

        if(partPriority === -1) {
            return null;
        }

        let x = assetData.x;
        const y = assetData.y;

        if(flipHorizontal) {
            x = 64 + (assetData.x * -1) - spriteData.width;
        }

        return {
            image: await createImageBitmap(sprite.image),
            imageData: sprite.imageData,
            
            x: x - 32,
            y: y + 32,

            index: (partPriority * 10) 
        };
    }

    private getCurrentAnimationFrame(effectData: EffectData) {
        if(!effectData.data.animation) {
            return 0;
        }

        const frameSequence = effectData.data.animation.frames.length;
        const frameRepeat = 2;
        const spriteFrame = Math.floor((this.frame % (frameSequence * frameRepeat)) / frameRepeat);

        return spriteFrame;
    }

    private async getEffectForAvatar() {
        const effectData = await this.getEffect();

        if(!effectData?.data.animation) {
            return null;
        }

        const frame = this.getCurrentAnimationFrame(effectData);

        if(!effectData.data.animation.frames[frame]) {
            return null;
        }

        const avatarEffect = effectData.data.animation.frames[frame].effects.find((effect) => effect.id === "avatar");

        if(!avatarEffect) {
            return null;
        }

        return avatarEffect;
    }

    public async renderToCanvas(cropped: boolean = false) {
        return await (async () => {
            const { sprites, effectSprites } = await this.render();

            let minimumX = 128, minimumY = 128, maximumWidth = 128, maximumHeight = 128;
        
            if(cropped) {
                if(effectSprites.length) {
                    console.warn("Figure render is cropped but contains effect sprites. Effect will not be applied.");
                }

                minimumX = 0;
                minimumY = 0;
                maximumWidth = 0;
                maximumHeight = 0;

                for(const sprite of sprites) {
                    if(minimumX < sprite.x * -1) {
                        minimumX = sprite.x * -1;
                    }
                    
                    if(minimumY < sprite.y * -1) {
                        minimumY = sprite.y * -1;
                    }

                    if(sprite.x + sprite.image.width > maximumWidth) {
                        maximumWidth = sprite.x + sprite.image.width;
                    }

                    if(sprite.y + sprite.image.height > maximumHeight) {
                        maximumHeight = sprite.y + sprite.image.height;
                    }
                }
            }

            const canvas = new OffscreenCanvas(minimumX + maximumWidth, minimumY + maximumHeight);

            if(!sprites.length) {
                throw new Error("No sprites to render.");
            }

            const context = canvas.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            sprites.sort((a, b) => a.index - b.index);

            for(const sprite of sprites) {
                context.save();

                if(sprite.ink) {
                    context.globalCompositeOperation = sprite.ink;
                }

                context.drawImage(sprite.image, minimumX + sprite.x, minimumY + sprite.y);

                context.restore();
            }

            // TODO: rewrite this to not require an asynchronous action to determine
            const avatarEffect = await this.getEffectForAvatar();

            if(avatarEffect?.destinationY) {
                minimumY -= avatarEffect.destinationY;
            }

            return {
                figure: {
                    image: await createImageBitmap(canvas),
                    imageData: context.getImageData(0, 0, canvas.width, canvas.height),

                    x: -minimumX,
                    y: -minimumY,

                    index: 0
                },
                effects: effectSprites
            };
        })();
    }

    public getConfigurationAsString(): string {
        return this.configuration.parts.map((section) => [section.type, section.setId, ...section.colors].filter(Boolean).join('-')).join('.');
    }
    
    private async getEffect() {
        const action = this.actions.find((action) => action.split('.')[0] === "AvatarEffect");

        if(!action) {
            return;
        }
        
        const id = parseInt(action.split('.')[1]);

        const library = this.getEffectLibrary(id);

        if(!library) {
            return;
        }

        return {
            id: library.id,
            library: library.library,
            data: await FigureAssets.getEffectData(library.library)
        };
    }

    private getActionParamId(actionId: string) {
        const actionName = this.actions.find((action) => action.split('.')[0] === actionId);

        if(!actionName) {
            return null;
        }

        const action = FigureAssets.avataractions.find((action) => action.id === actionId);

        if(!action?.params.length) {
            return null;
        }

        const param = action.params.find((param) => param.id === actionName.split('.')[1]);

        if(!param) {
            return null;
        }

        return param.value;
    }

    private getEffectLibrary(id: number) {
        return FigureAssets.effectmap.find((effect) => effect.id === id);
    }
}
