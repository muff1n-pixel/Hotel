import { AssetSpriteGrayscaledProperties } from "@Client/Assets/AssetFetcher";
import FigureRenderer, { FigureRendererSprite, SpriteConfiguration } from "@Client/Figure/Renderer/FigureRenderer";
import { figureRenderPriority } from "@Client/Figure/Renderer/Geometry/FigureRenderPriority";
import FigureBodyPartAction from "@Client/Figure/Renderer/Interfaces/FigureBodyPartAction";
import { FurnitureAsset } from "@Client/Interfaces/Furniture/FurnitureAssets";
import { FurnitureSprite } from "@Client/Interfaces/Furniture/FurnitureSprites";
import { FigureLogger } from "@pixel63/shared/Logger/Logger";
import { FigureAssets } from "src/library";

export default class FigureSpriteRenderer {
    constructor(private readonly figureRenderer: FigureRenderer) {

    }
    
    public async getFigureSprites(spritesFromConfiguration: SpriteConfiguration[], actionsForBodyParts: FigureBodyPartAction[], direction: number, grayscaled: AssetSpriteGrayscaledProperties | undefined): Promise<FigureRendererSprite[]> {
        const actionForSit = this.figureRenderer.actions.some((action) => action === "Sit");

        const sprites = await Promise.all(spritesFromConfiguration.map(async (spriteConfiguration) => {
            const actionForSprite = actionsForBodyParts.find((action) => action.bodyParts.includes(spriteConfiguration.type));
        
            if(!actionForSprite) {
                //console.warn("Sprite " + spriteConfiguration.type + " has no action requesting it.");

                return null;
            }

            let spriteDirection = direction;

            if(actionForSprite.directionOffset !== undefined) {
                spriteDirection += actionForSprite.directionOffset;
            }

            while(spriteDirection < 0) {
                spriteDirection += 8;
            }

            spriteDirection %= 8;

            const flipHorizontal = (spriteDirection > 3 && spriteDirection < 7);
            const flippedDirection = (flipHorizontal)?(6 - spriteDirection):(spriteDirection);

            const figureData = await FigureAssets.getFigureData(spriteConfiguration.assetId);

            if(!figureData) {
                //console.error("Figure data does not exist for " + spriteConfiguration.assetId);

                return null
            }

            const geometryPart = actionForSprite.geometry.bodyparts.find((bodypart) => bodypart.parts.includes(spriteConfiguration.type));

            if(this.figureRenderer.headOnly && geometryPart?.id !== "head") {
                return null
            }

            const avatarAnimation = this.figureRenderer.figureAnimations.getAvatarAnimation(actionForSprite.actionId, geometryPart?.id, spriteConfiguration.type, spriteDirection, this.figureRenderer.frame);

            const frame = actionForSprite.frame ?? avatarAnimation?.spriteFrame ?? 0;

            if(spriteConfiguration.type === "sd") {
                spriteDirection = 0;
            }

            let assetFlipped = false;
            let assetDirection = spriteDirection;
            let assetType = spriteConfiguration.type;

            const spriteConfigurationId = this.figureRenderer.figureActions.effectTypeRemaps.get(spriteConfiguration.type) ?? spriteConfiguration.id;

            let assetName = `h_${avatarAnimation?.assetPartDefinition ?? actionForSprite.assetPartDefinition ?? "std"}_${assetType}_${spriteConfigurationId}_${assetDirection}_${frame}`;

            let asset = figureData.assets.find((asset) => asset.name === assetName);

            if(!asset && flipHorizontal) {
                //console.warn("Can't find asset for " + assetName + ", trying with flipped direction");

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

                assetName = `h_${avatarAnimation?.assetPartDefinition ?? actionForSprite.assetPartDefinition ?? "std"}_${assetType}_${spriteConfigurationId}_${assetDirection}_${frame}`;

                asset = figureData.assets.find((asset) => asset.name === assetName);
            }

            if(!asset) {
                //console.warn("Can't find asset for " + assetName + ", trying with standing part definition.");
                
                assetName = `h_std_${assetType}_${spriteConfigurationId}_${assetDirection}_${frame}`;

                asset = figureData.assets.find((asset) => asset.name === assetName);
            }

            if(!asset) {
                //console.warn("Can't find asset for " + assetName + ", trying with standing part definition.");
                
                assetName = `h_std_${assetType}_${spriteConfigurationId}_${assetDirection}_${0}`;

                asset = figureData.assets.find((asset) => asset.name === assetName);
            }

            if(!asset) {
                //console.error("Can't find asset for " + assetName);

                return null
            }

            const sourceAssetName = asset.source ?? asset.name;

            const sprite = figureData.sprites.find((sprite) => sprite.name === sourceAssetName);

            if(!sprite) {
                FigureLogger.error("Can't find sprite for source asset " + sourceAssetName);

                return null
            }

            const palette = FigureAssets.figuredata.palettes.find((palette) => palette.id === spriteConfiguration.colorPaletteId);
            const paletteColor = palette?.colors.find((color) => color.id === spriteConfiguration.colors[spriteConfiguration.colorIndex - 1]);

            const result = await this.getFigureSprite(assetType, spriteConfiguration, sprite, asset, paletteColor?.color, assetDirection, assetFlipped, grayscaled);

            if(result) {
                if(spriteConfiguration.type === "sd") {
                    result.alpha = 0.15;
                }

                if(actionForSprite.destinationX) {
                    result.x += actionForSprite.destinationX;
                }

                if(actionForSprite.destinationY) {
                    result.y += actionForSprite.destinationY;
                }

                if(actionForSit && spriteConfiguration.type !== "sd") {
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
    
    private async getFigureSprite(type: string, spriteConfiguration: SpriteConfiguration, spriteData: FurnitureSprite, assetData: FurnitureAsset, color: string | undefined, direction: number, flipHorizontal: boolean, grayscaled: AssetSpriteGrayscaledProperties | undefined): Promise<FigureRendererSprite | null> {
        const sprite = await FigureAssets.getFigureSprite(spriteConfiguration.assetId, {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            grayscaled,

            flipHorizontal: (flipHorizontal)?(!assetData.flipHorizontal):(assetData.flipHorizontal),

            color: (spriteConfiguration.colorable && spriteConfiguration.colors[spriteConfiguration.colorIndex - 1] && type !== "ey")?(color):(undefined),

            ignoreImageData: false,
            requireImageData: (grayscaled !== undefined)
        });

        const priorityTypes: Partial<Record<string, string>> = {
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
            image: sprite.image,
            imageData: sprite.imageData,
            
            x: x - 32,
            y: y + 32,

            index: (partPriority * 10)
        } satisfies FigureRendererSprite;
    }
}