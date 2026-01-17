import ContextNotAvailableError from "../../Exceptions/ContextNotAvailableError";
import FurnitureAssets from "../../Assets/FurnitureAssets";
import { FurnitureData } from "../../Interfaces/Furniture/FurnitureData";
import { FurnitureIndex } from "@Client/Interfaces/Furniture/FurnitureIndex";
import { FurnitureVisualization } from "@Client/Interfaces/Furniture/FurnitureVisualization";
import { FurnitureRendererSprite } from "../Interfaces/FurnitureRendererSprite";

export default class FurnitureWorkerRenderer {
    public isAnimated: boolean = false;

    private data?: FurnitureData;
    private visualization?: FurnitureVisualization["visualizations"][0];

    constructor(public readonly type: string, public readonly size: number, public direction: number, public animation: number = 0, public color: number = 0, public frame: number = 0) {
    }

    public async render(assetName: string) {
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

        const assetData = this.data.assets.find((asset) => asset.name === assetName);

        if(!assetData) {
            console.warn("Failed to find asset data for " + assetName);

            FurnitureAssets.assetSprites.set(`${assetName}_${this.color}`, null);

            return;
        }

        const spriteData = this.data.sprites.find((sprite) => sprite.name === (assetData?.source ?? assetName));
        
        if(!spriteData) {
            //console.warn("Failed to find sprite data for " + assetName + " (source " + assetData.source + ")");
            FurnitureAssets.assetSprites.set(`${assetName}_${this.color}`, null);

            return;
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

        return assetSprite;
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
