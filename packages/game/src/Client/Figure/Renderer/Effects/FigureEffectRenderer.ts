import FigureRenderer, { FigureRendererSprite } from "@Client/Figure/Renderer/FigureRenderer";
import FigureEffectData from "@Client/Figure/Renderer/Interfaces/FigureEffectData";
import { AvatarActionData } from "@Client/Interfaces/Figure/Avataractions";
import { FurnitureAsset } from "@Client/Interfaces/Furniture/FurnitureAssets";
import { FurnitureSprite } from "@Client/Interfaces/Furniture/FurnitureSprites";
import { getGlobalCompositeModeFromInkNumber } from "@Client/Renderers/GlobalCompositeModes";
import { FigureLogger } from "@pixel63/shared/Logger/Logger";
import { FigureAssets } from "@Game/library";

export default class FigureEffectRenderer {
    constructor(private readonly figureRenderer: FigureRenderer) {

    }
    
    public getEffectSprites(frame: number, actions: AvatarActionData[], effects: FigureEffectData[], direction: number): FigureRendererSprite[] {
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

            const animationSprites = this.figureRenderer.figureEffects.getFigureEffectAnimationSprites(actions, effect, direction, frame);

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

                    const data = FigureAssets.getEffectData(library.library);

                    if(!data) {
                        FigureLogger.error("Effect data is not loaded.");

                        continue;
                    }

                    spriteEffect = {
                        id: library.id,
                        library: library.library,
                        data
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

                const result = this.getEffectSprite(spriteEffect.library, sourceAsset, spriteData, index, destinationY, sprite.ink, flipHorizontal);

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

    private getEffectSprite(library: string, assetData: FurnitureAsset, spriteData: FurnitureSprite, index: number, destinationY: number, ink: number | undefined, flipHorizontal: boolean) {
        const sprite = FigureAssets.getEffectSprite(library, {
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