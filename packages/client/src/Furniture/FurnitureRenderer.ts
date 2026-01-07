import ContextNotAvailableError from "../Exceptions/ContextNotAvailableError.js";
import FurnitureAssets from "../Assets/FurnitureAssets.js";
import { FurnitureData } from "../Interfaces/Furniture/FurnitureData.js";
import { FurnitureIndex } from "@/Interfaces/Furniture/FurnitureIndex.js";
import { FurnitureVisualization } from "@/Interfaces/Furniture/FurnitureVisualization.js";

export type FurnitureRendererSprite = {
    image: OffscreenCanvas;
    imageData: ImageData;

    x: number;
    y: number;

    ink?: GlobalCompositeOperation;

    zIndex: number;
    alpha?: number;
    ignoreMouse?: boolean;
}

export default class FurnitureRenderer {
    public isReady: boolean = false;

    public isAnimated: boolean = false;

    private data?: FurnitureData;
    private visualization?: FurnitureVisualization["visualizations"][0];

    constructor(public readonly type: string, public readonly size: number, public direction: number, public animation: number = 0, public color: number = 0) {
    }

    public async render(frame: number = 0) {
        if(!this.data) {
            this.data = await FurnitureAssets.getFurnitureData(this.type);
        }

        const sprites: FurnitureRendererSprite[] = [];

        if(!this.visualization) {
            this.visualization = this.data.visualization.visualizations.find((visualization) => visualization.size == this.size && visualization.directions.find((direction) => direction.id === this.direction));
        }

        if(!this.visualization) {
            throw new Error("Visualization does not exist for size.");
        }

        const animation = this.visualization.animations?.find((animation) => animation.id === this.animation);

        this.isAnimated = Boolean(animation);

        for(let layer = 0; layer < this.visualization.layerCount; layer++) {
            const animationLayer = animation?.layers?.find((animationLayer) => animationLayer.id === layer);

            let spriteFrame = 0;

            if(animationLayer) {
                let frameSequenceIndex = frame % animationLayer.frameSequence.length;

                if(animationLayer.frameRepeat && animationLayer.frameRepeat > 1) {
                    frameSequenceIndex = Math.floor((frame % (animationLayer.frameSequence.length * animationLayer.frameRepeat)) / animationLayer.frameRepeat);
                    /*console.log({
                        frame,
                        frameSequenceLength: animationLayer.frameSequence.length,
                        frameRepeat: animationLayer.frameRepeat
                    });*/
                }

                spriteFrame = animationLayer?.frameSequence[frameSequenceIndex].id;
            }

            const assetName = `${this.type}_${this.size}_${String.fromCharCode(97 + layer)}_${this.direction}_${spriteFrame}`;

            if(FurnitureAssets.assetSprites.has(`${assetName}_${this.color}`)) {
                const assetSprite = FurnitureAssets.assetSprites.get(`${assetName}_${this.color}`);

                if(assetSprite) {
                    sprites.push(assetSprite);
                }

                continue;
            }

            const assetData = this.data.assets.find((asset) => asset.name === assetName);

            if(!assetData) {
                console.warn("Failed to find asset data for " + assetName);
    
                FurnitureAssets.assetSprites.set(`${assetName}_${this.color}`, null);

                continue;
            }

            const spriteData = this.data.sprites.find((sprite) => sprite.name === (assetData?.source ?? assetName));
            
            if(!spriteData) {
                //console.warn("Failed to find sprite data for " + assetName + " (source " + assetData.source + ")");
                FurnitureAssets.assetSprites.set(`${assetName}_${this.color}`, null);

                continue;
            }

            const colorData = this.visualization.colors?.find((color) => color.id === this.color);

            const { image, imageData } = await FurnitureAssets.getFurnitureSprite(this.type, {
                x: spriteData.x,
                y: spriteData.y,

                width: spriteData.width,
                height: spriteData.height,

                flipHorizontal: assetData.flipHorizontal,

                color: colorData?.layers?.find((colorLayer) => colorLayer.id === layer)?.color
            });

            const layerData = this.visualization.layers.find((layerData) => layerData.id === layer);

            let x = assetData.x;

            if(assetData.flipHorizontal) {
                x = (assetData.x * -1) - spriteData.width;
            }

            const assetSprite: FurnitureRendererSprite = {
                image,
                imageData,
                
                x,
                y: assetData.y,

                ink: this.getGlobalCompositeModeFromInk(layerData?.ink),

                zIndex: layerData?.zIndex ?? 0,
                alpha: layerData?.alpha,
                ignoreMouse: layerData?.ignoreMouse
            };

            FurnitureAssets.assetSprites.set(`${assetName}_${this.color}`, assetSprite);

            sprites.push(assetSprite);
        }

        return sprites;
    }

    public async renderToCanvas() {
        const sprites = await this.render();

        let minimumX = 0, minimumY = 0, maximumWidth = 0, maximumHeight = 0;
       
        for(let sprite of sprites) {
            if(minimumX < Math.abs(sprite.x)) {
                minimumX = Math.abs(sprite.x);
            }
            
            if(minimumY < (sprite.y * -1)) {
                minimumY = sprite.y * -1;
            }

            if(sprite.x + sprite.image.width > maximumWidth) {
                maximumWidth = sprite.x + sprite.image.width;
            }

            if(sprite.y + sprite.image.height > maximumHeight) {
                maximumHeight = sprite.y + sprite.image.height;
            }
        }

        const canvas = new OffscreenCanvas(minimumX + maximumWidth, minimumY + maximumHeight);
        const context = canvas.getContext("2d")!;

        context.fillStyle = "red";
        context.fillRect(0, 0, canvas.width, canvas.height);

        if(!context) {
            throw new ContextNotAvailableError();
        }

        for(let sprite of sprites.sort((a, b) => a.zIndex - b.zIndex)) {
            context.save();

            if(sprite.ink) {
                context.globalCompositeOperation = sprite.ink;
            }

            if(sprite.alpha) {
                context.globalAlpha = sprite.alpha / 255;
            }

            context.drawImage(sprite.image, minimumX + sprite.x, minimumY + sprite.y);
        }

        return canvas;
    }

    private getGlobalCompositeModeFromInk(ink?: string): GlobalCompositeOperation | undefined {
        switch(ink) {
            case "ADD":
                return "lighter";

            case "SUBTRACT":
                return "luminosity";

            case "COPY":
                return "source-over";

            case undefined:
                return undefined;

            default:
                console.warn(`Furniture ink mode ${ink} is not recognized.`);

                return undefined;
        }
    }
}
