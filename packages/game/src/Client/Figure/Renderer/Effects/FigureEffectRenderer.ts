import FigureRenderer, { FigureRendererSprite } from "@Client/Figure/Renderer/FigureRenderer";
import FigureBodyPartAction from "@Client/Figure/Renderer/Interfaces/FigureBodyPartAction";
import FigureEffectData from "@Client/Figure/Renderer/Interfaces/FigureEffectData";
import { AvatarActionData } from "@Client/Interfaces/Figure/Avataractions";
import { FurnitureAsset } from "@Client/Interfaces/Furniture/FurnitureAssets";
import { FurnitureSprite } from "@Client/Interfaces/Furniture/FurnitureSprites";
import { getGlobalCompositeModeFromInkNumber } from "@Client/Renderers/GlobalCompositeModes";
import { FigureLogger } from "@pixel63/shared/Logger/Logger";
import { FigureAssets } from "src/library";

export default class FigureEffectRenderer {
    constructor(private readonly figureRenderer: FigureRenderer) {

    }
    
    public async getEffectSprites(frame: number, actions: AvatarActionData[], actionsForBodyParts: FigureBodyPartAction[], effects: FigureEffectData[], direction: number): Promise<FigureRendererSprite[]> {
        const sprites: FigureRendererSprite[] = [];

        this.figureRenderer.avatarEffect = undefined;

        for(const effect of effects) {
            // TODO: add effects without animations
            if(!effect.data.animation) {
                continue;
            }

            const animationFrameIndex = this.figureRenderer.figureAnimations.getCurrentAnimationFrame(frame, effect.data.animation.frames);

            //console.log("Frame " + this.frame + " becomes " + frame + " (" + effect.data.animation.frames.length + ")");

            const animationFrame = effect.data.animation.frames?.[animationFrameIndex];

            const avatarBodypart = animationFrame?.effects?.find((bodyPart) => bodyPart.id === "avatar");

            if(avatarBodypart) {
                this.figureRenderer.avatarEffect = avatarBodypart;
            }

            function getIndexForAlignment(alignment: string) {
                switch(alignment) {
                    case "top":
                        return 1;

                    case "bottom":
                        return -1;

                    case "behind": {
                        if(direction > 1 && direction < 5) {
                            return -1;
                        }

                        return 0;
                    }
                }

                return 0;
            }

            let animationSprites =
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
                            destinationY: (this.figureRenderer.avatarEffect?.destinationY ?? 0)
                        }
                    })
                )
                .concat(
                    animationFrame?.bodyParts?.filter((bodypart) => bodypart.items && bodypart.items.length > 0).flatMap((bodypart) => {
                        return bodypart.items.map((item) => {
                            const id = item.base ?? item.id;

                            return {
                                id,
                                member: `std_${id}_1`, // TODO: what's the 1 for?
                                useDirections: true,
                                directions: Array(8).fill(null).map((_, index) => {
                                    return {
                                        id: index,
                                        destinationX: undefined,
                                        destinationY: undefined,
                                        destinationZ: getIndexForAlignment(item.align)
                                    };
                                }),
                                frame: bodypart.frame,
                                destinationY: (this.figureRenderer.avatarEffect?.destinationY ?? 0)
                            }
                        });
                    }) ?? []
                );

            if(effect.data.animation?.overrides) {
                const filteredOverrides = effect.data.animation.overrides.filter((override) => actions.some((action) => action.state === override.type));
                
                const sortedOverrides = filteredOverrides.sort((a, b) => {
                    const actionA = actions.find((action) => action.state === a.type);
                    const actionB = actions.find((action) => action.state === b.type);

                    return (actionA?.precedence ?? 0) - (actionB?.precedence ?? 0);
                });

                for(const override of sortedOverrides) {
                    const action = actions.find((action) => action.state === override.type);

                    if(!action) {
                        continue;
                    }

                    const animationFrameIndex = this.figureRenderer.figureAnimations.getCurrentAnimationFrame(frame, override.frames);

                    const overrideFrame = override.frames[animationFrameIndex];

                    if(overrideFrame) {
                        const results = overrideFrame?.bodyParts?.filter((bodypart) => bodypart.items && bodypart.items.length > 0).flatMap((bodypart) => {
                                return bodypart.items.map((item) => {
                                    const id = item.base ?? item.id;

                                    return {
                                        id,
                                        part: item.id,
                                        frame: bodypart.frame,
                                        member: `${action.assetPartDefinition}_${item.id}_${item.base}`, // TODO: what's the 1 for?
                                        useDirections: true,
                                        destinationY: bodypart.destinationY ?? (this.figureRenderer.avatarEffect?.destinationY ?? 0),
                                        directionOffset: bodypart.directionOffset
                                    }
                                });
                            }) ?? [];

                        animationSprites = animationSprites.filter((animationSprite) => !results.some((result) => result.part === animationSprite.part)).concat(results);

                        for(const overrideEffect of overrideFrame.effects) {
                            const overrideAnimationSprites = animationSprites.filter((animationSprite) => animationSprite.id === overrideEffect.id);

                            for(const overrideAnimationSprite of overrideAnimationSprites) {
                                overrideAnimationSprite.frame = overrideEffect.frame;
                                overrideAnimationSprite.destinationY = overrideEffect.destinationY;
                                overrideAnimationSprite.directionOffset = overrideEffect.directionOffset;
                            }
                        }
                    }

                    break;
                }
            }

            if(effect.data.animation.shadow) {
                // TODO: there's no shadow sprite provided?

                /*animationSprites.push({
                    id: effect.data.animation.shadow.id,
                    member: effect.data.animation.shadow.id,
                    useDirections: false
                });*/
            }

            this.figureRenderer.avatarEffect = animationFrame?.effects.find((effect) => effect.id === "avatar") ?? this.figureRenderer.avatarEffect;

            for(const sprite of animationSprites) {
                if(sprite.id === "avatar") {
                    continue;
                }

                let spriteEffect = effect;

                const effectLibrary = sprite.member.split('_').find((part) => part.startsWith("fx"));

                if(effectLibrary && effectLibrary !== `fx${effect.id}`) {
                    const libraryId = parseInt(effectLibrary.substring(2));

                    const library = this.figureRenderer.figureEffects.getEffectLibrary(libraryId);

                    if(!library) {
                        FigureLogger.error("Library does not exist", libraryId);
                        
                        continue;
                    }

                    spriteEffect = {
                        id: library.id,
                        library: library.library,
                        data: await FigureAssets.getEffectData(library.library)
                    };
                }

                const effectFrame = animationFrame?.effects.find((effect) => effect.id === sprite.id);

                const spriteDirectionData = sprite.directions?.find((_direction) => _direction.id === direction);

                const index = (spriteDirectionData)?(spriteDirectionData.destinationZ):(0);

                let flipHorizontal = false;
                let spriteDirection = direction;

                if(sprite.directionOffset !== undefined) {
                    spriteDirection += sprite.directionOffset;
                }

                if(effectFrame?.directionOffset !== undefined) {
                    spriteDirection += effectFrame.directionOffset;
                }

                while(spriteDirection < 0) {
                    spriteDirection += 8;
                }

                spriteDirection %= 8;
            
                let assetName = `h_${sprite.member}_${(sprite.useDirections)?(spriteDirection):(0)}_${sprite?.frame ?? effectFrame?.frame ?? 0}`;

                let assetData = spriteEffect.data.assets.find((asset) => asset.name === assetName);

                if(!assetData) {
                    assetName = `h_${sprite.member}_${(sprite.useDirections)?(spriteDirection):(0)}_${0}`;

                    assetData = spriteEffect.data.assets.find((asset) => asset.name === assetName);
                }

                if(!assetData && (spriteDirection > 3 && spriteDirection < 7)) {
                    spriteDirection = 6 - spriteDirection;

                    while(spriteDirection < 0){
                        spriteDirection += 8;
                    }

                    spriteDirection %= 8;

                    assetName = `h_${sprite.member}_${(sprite.useDirections)?(spriteDirection):(0)}_${sprite?.frame ?? effectFrame?.frame ?? 0}`;

                    assetData = spriteEffect.data.assets.find((asset) => asset.name === assetName);

                    flipHorizontal = true;

                    if(!assetData) {
                        assetName = `h_${sprite.member}_${(sprite.useDirections)?(spriteDirection):(0)}_${0}`;

                        assetData = spriteEffect.data.assets.find((asset) => asset.name === assetName);
                    }

                    if(!assetData) {
                        assetName = `h_std_${sprite.member.split('_').slice(1).join('_')}_${(sprite.useDirections)?(spriteDirection):(0)}_${0}`;

                        assetData = spriteEffect.data.assets.find((asset) => asset.name === assetName);
                    }
                }
                else {
                    if(!assetData) {
                        assetName = `h_std_${sprite.member.split('_').slice(1).join('_')}_${(sprite.useDirections)?(spriteDirection):(0)}_${0}`;

                        assetData = spriteEffect.data.assets.find((asset) => asset.name === assetName);
                    }
                }

                if(!assetData) {
                    //console.warn("Can't find asset data for " + assetName);
                    continue;
                }

                if(assetData.flipHorizontal === true) {
                    flipHorizontal = true;
                }

                let sourceAsset: FurnitureAsset = assetData;

                if(sourceAsset.source) {
                    sourceAsset = spriteEffect.data.assets.find((asset) => asset.name === assetData.source) ?? sourceAsset;
                }

                sourceAsset = spriteEffect.data.assets.find((asset) => asset.name === (assetData.source ?? sourceAsset.name)) ?? sourceAsset;

                const spriteData = spriteEffect.data.sprites.find((sprite) => sprite.name === sourceAsset.name);

                if(!spriteData) {
                    continue;
                }

                const destinationY = sourceAsset.y;

                const result = await this.getEffectSprite(spriteEffect.library, sourceAsset, spriteData, index, destinationY, sprite.ink, flipHorizontal);

                if(sprite.destinationY) {
                    result.y += sprite.destinationY;
                }

                if(effectFrame?.destinationX) {
                    result.x += effectFrame.destinationX;
                }

                if(effectFrame?.destinationY) {
                    result.y += effectFrame.destinationY;
                }

                if(spriteDirectionData?.destinationX) {
                    result.x += spriteDirectionData.destinationX;
                }

                if(spriteDirectionData?.destinationY) {
                    result.y += spriteDirectionData.destinationY;
                }

                if(result) {
                    sprites.push(result);
                }
            }
        }

        return sprites;
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
            image: sprite.image,
            
            x: x - 32,
            y: destinationY + 32,

            index,

            ink: (ink !== undefined)?(getGlobalCompositeModeFromInkNumber(ink)):(undefined)
        };
    }
}