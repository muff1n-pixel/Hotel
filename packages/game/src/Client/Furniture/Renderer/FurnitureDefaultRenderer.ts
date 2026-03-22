import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { FurnitureRendererSprite, FurnitureRenderToCanvasOptions } from "@Client/Furniture/Furniture";
import FurnitureRenderer, { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import { FurnitureSprite } from "@Client/Interfaces/Furniture/FurnitureSprites";
import { FurnitureAnimationLayerFrameOffset, FurnitureVisualization } from "@Client/Interfaces/Furniture/FurnitureVisualization";
import { getGlobalCompositeModeFromInk } from "@Client/Renderers/GlobalCompositeModes";
import { FigureLogger } from "@pixel63/shared/Logger/Logger";

export default class FurnitureDefaultRenderer implements FurnitureRenderer {
    private animated: boolean = false;
    private previousLayerFrames: string = "";
    private hasImageData: boolean = false;

    private visualization?: FurnitureVisualization["visualizations"][0];

    constructor(public readonly type: string | undefined) {

    }

    private options?: FurnitureRenderOptions;

    public shouldRender(options: FurnitureRenderOptions) {
        if(!this.options) {
            return true;
        }

        if(!this.hasImageData) {
            return true;
        }

        if(this.animated) {
            const layerFrames = this.getLayerFrames(options).map((frame) => frame.animationLayerId + '-' + frame.spriteFrame).join('_');

            if(this.previousLayerFrames !== layerFrames) {
                return true;
            }
        }

        if(this.options.animation !== options.animation) {
            return true;
        }

        if(this.options.direction !== options.direction) {
            return true;
        }

        if(this.options.color !== options.color) {
            return true;
        }

        if(this.options.grayscaled !== options.grayscaled) {
            return true;
        }

        if(this.options.size !== options.size) {
            return true;
        }

        if(this.options.tags?.join('-') !== options.tags?.join('-')) {
            return true;
        }

        return false;
    }

    private getLayerFrames(options: FurnitureRenderOptions) {
        if(!this.visualization) {
            return [];
        }

        const animationData = this.visualization.animations?.find((animationData) => animationData.id === options!.animation);

        const result: { animationLayerId: number, frameSequenceIndex: number, left?: number, top?: number, animationFrameOffset: FurnitureAnimationLayerFrameOffset | undefined, spriteFrame: number }[] = [];

        for(let layer = 0; layer < this.visualization.layerCount; layer++) {
            const animationLayer = animationData?.layers?.find((animationLayer) => animationLayer.id === layer);

            if(animationLayer?.frameSequence?.length) {
                let frameSequenceIndex = options.frame % animationLayer.frameSequence.length;
                const loopCount = (animationLayer.loopCount === undefined)?(1):(animationLayer.loopCount);

                if(animationLayer.frameRepeat && animationLayer.frameRepeat > 1) {
                    const maxFrames = (animationLayer.frameSequence.length * animationLayer.frameRepeat) * loopCount;

                    if(options.frame >= maxFrames && loopCount !== 0) {
                        frameSequenceIndex = animationLayer.frameSequence.length - 1;
                    }
                    else {
                        frameSequenceIndex = Math.floor((options.frame % (animationLayer.frameSequence.length * animationLayer.frameRepeat)) / animationLayer.frameRepeat);
                    }
                }
                else {
                    const maxFrames = animationLayer.frameSequence.length * loopCount;

                    if(options.frame >= maxFrames && loopCount !== 0) {
                        frameSequenceIndex = animationLayer.frameSequence.length - 1;
                    }
                }

                if(!animationLayer?.frameSequence[frameSequenceIndex]) {
                    FigureLogger.warn("Animation layer does not exist for " + this.type + ", frame index " + frameSequenceIndex);                    
                }
                else {
                    result.push({
                        animationLayerId: animationLayer.id,
                        frameSequenceIndex,
                        left: animationLayer?.frameSequence[frameSequenceIndex].left,
                        top: animationLayer?.frameSequence[frameSequenceIndex].top,
                        animationFrameOffset: animationLayer?.frameSequence[frameSequenceIndex].offsets?.find((offset) => offset.direction === options!.direction),
                        spriteFrame: animationLayer?.frameSequence[frameSequenceIndex].id
                    });
                }
            }
        }

        return result;
    }

    public async render(data: FurnitureData, options: FurnitureRenderOptions) {
        this.options = options;

        if(!this.type) {
            throw new Error();
        }
        
        const sprites: FurnitureRendererSprite[] = [];

        this.visualization = data.visualization.visualizations.find((visualization) => visualization.size == options.size);

        if(!this.visualization) {
            throw new Error("Visualization for " + this.type + " does not exist for size: " + options.size + ".");
        }

        const directionData = this.visualization.directions.find((visualizationDirection) => visualizationDirection.id === options.direction);

        this.animated = false;

        const animationFrames = this.getLayerFrames(options);

        this.previousLayerFrames = animationFrames.map((frame) => frame.animationLayerId + '-' + frame.frameSequenceIndex).join('_');

        for(let layer = 0; layer < this.visualization.layerCount; layer++) {
            const animationFrame = animationFrames.find((frame) => frame.animationLayerId === layer);

            if(animationFrame) {
                this.animated = true;
            }

            let assetName = `${this.type}_${options.size}_${String.fromCharCode(97 + layer)}_${options.direction}_${animationFrame?.spriteFrame ?? 0}`;

            if(options.size === 1) {
                assetName = `${this.type}_icon_${String.fromCharCode(97 + layer)}`;
            }

            /*if(FurnitureAssets.assetSprites.has(`${assetName}_${color}_${grayscaled}`)) {
                const assetSprite = FurnitureAssets.assetSprites.get(`${assetName}_${color}_${grayscaled}`);

                if(assetSprite) {
                    sprites.push(assetSprite);
                }

                continue;
            }*/

            const assetData = data.assets.find((asset) => asset.name === assetName);

            if(!assetData) {
                //console.warn("Failed to find asset data for " + assetName);
    
                FurnitureAssets.assetSprites.set(`${assetName}_${options.color}_${options.grayscaled}`, null);

                continue;
            }

            const spriteData = data.sprites.find((sprite) => sprite.name === (assetData?.source ?? assetName));
            
            if(!spriteData) {
                FigureLogger.warn("Failed to find sprite data for " + assetName + " (source " + assetData.source + ")");
                
                FurnitureAssets.assetSprites.set(`${assetName}_${options.color}_${options.grayscaled}`, null);

                continue;
            }

            const colorData = this.visualization.colors?.find((visualizationColor) => visualizationColor.id === options.color);

            const layerData = this.visualization.layers.find((layerData) => layerData.id === layer);

            if(options.tags && (layerData?.tag && !options.tags.includes(layerData?.tag))) {
                continue;
            }

            const { image, imageData } = await this.getFurnitureSprite(data, this.type, spriteData, assetData.flipHorizontal ?? false, colorData?.layers?.find((colorLayer) => colorLayer.id === layer)?.color, options.grayscaled, layerData?.tag, assetData.usesPalette);

            const directionLayerData = directionData?.layers.find((layerData) => layerData.id === layer);

            let x = assetData.x;
            let y = assetData.y;

            if(assetData.flipHorizontal) {
                x = (assetData.x * -1) - spriteData.width;
            }

            if(directionLayerData?.x !== undefined) {
                x += directionLayerData.x;
            }
            
            if(directionLayerData?.y !== undefined) {
                y += directionLayerData.y;
            }

            if(animationFrame?.animationFrameOffset?.left !== undefined) {
                x += animationFrame.animationFrameOffset?.left;
            }

            if(animationFrame?.animationFrameOffset?.top !== undefined) {
                y += animationFrame.animationFrameOffset?.top;
            }

            if(animationFrame?.left !== undefined) {
                x += animationFrame.left;
            }

            if(animationFrame?.top !== undefined) {
                y += animationFrame.top;
            }

            const assetSprite: FurnitureRendererSprite = {
                image,
                imageData,
                
                x,
                y,

                ink: getGlobalCompositeModeFromInk(layerData?.ink),
                tag: layerData?.tag,

                zIndex: directionLayerData?.zIndex ?? layerData?.zIndex ?? layer,
                alpha: layerData?.alpha,
                ignoreMouse: layerData?.ignoreMouse
            };

            if(imageData) {
                FurnitureAssets.assetSprites.set(`${assetName}_${options.color}_${options.grayscaled}`, assetSprite);
            }

            sprites.push(assetSprite);
        }

        if(!this.hasImageData) {
            this.hasImageData = sprites.every((sprite) => !sprite.ignoreMouse && sprite.imageData);
        }

        return sprites;
    }

    public async getFurnitureSprite(_data: FurnitureData, type: string, spriteData: FurnitureSprite, flipHorizontal: boolean, color: string | undefined, grayscaled: boolean, _tag: string | undefined, _usesPalette: boolean) {
        const { image, imageData } = await FurnitureAssets.getFurnitureSprite(type, {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            flipHorizontal: flipHorizontal,

            grayscaled: (grayscaled)?({
                foreground: "#999999",
                background: "#FFFFFF"
            }):(undefined),

            color
        });

        return { image, imageData };
    }
    
    public async renderToCanvas(canvasOptions: FurnitureRenderToCanvasOptions | undefined, data: FurnitureData, options: FurnitureRenderOptions) {
        const immutableSprites = await this.render(data, options);

        const sprites = immutableSprites.map((sprite) => {
            return {...sprite}
        });
        
        let minimumX = Infinity, minimumY = Infinity, maximumWidth = -Infinity, maximumHeight = -Infinity;

        if(sprites.length === 1) {
            minimumX = 0;
            minimumY = 0;

            maximumWidth = sprites[0].image.width;
            maximumHeight = sprites[0].image.height;

            sprites[0].x = 0;
            sprites[0].y = 0;
        }
        else {
            for(const sprite of sprites) {
                if(sprite.x < minimumX) {
                    minimumX = sprite.x;
                }
                
                if(sprite.y < minimumY) {
                    minimumY = sprite.y;
                }

                if(sprite.x + sprite.image.width > maximumWidth) {
                    maximumWidth = sprite.x + sprite.image.width;
                }

                if(sprite.y + sprite.image.height > maximumHeight) {
                    maximumHeight = sprite.y + sprite.image.height;
                }
            }
        }

        const canvas = new OffscreenCanvas(maximumWidth - minimumX, maximumHeight - minimumY);
        const context = canvas.getContext("2d")!;

        //context.fillStyle = "red";
        //context.fillRect(0, 0, canvas.width, canvas.height);

        if(!context) {
            throw new ContextNotAvailableError();
        }

        for(const sprite of sprites.sort((a, b) => a.zIndex - b.zIndex)) {
            context.save();

            if(sprite.ink) {
                context.globalCompositeOperation = sprite.ink;
            }

            if(sprite.alpha) {
                context.globalAlpha = sprite.alpha / 255;
            }

            context.drawImage(sprite.image, sprite.x - minimumX, sprite.y - minimumY);

            context.restore();
        }

        if(canvasOptions?.spritesWithoutInkModes) {
            const spritesWithoutInkModes = sprites.filter((sprite) => !sprite.ink || ![ "multiply", "color-burn", "darken", "overlay", "hard-light" ].includes(sprite.ink));

            if(spritesWithoutInkModes.length > 0 && spritesWithoutInkModes.length !== sprites.length) {
                const maskCanvas = new OffscreenCanvas(canvas.width, canvas.height);
                const maskContext = maskCanvas.getContext("2d");

                if(!maskContext) {
                    throw new ContextNotAvailableError();
                }

                for(const sprite of spritesWithoutInkModes) {
                    maskContext.drawImage(sprite.image, minimumX + sprite.x, minimumY + sprite.y);
                }

                context.globalCompositeOperation = "destination-in";
                context.drawImage(maskCanvas, 0, 0);
            }
        }

        return canvas.transferToImageBitmap();
    }
}