import ContextNotAvailableError from "../Exceptions/ContextNotAvailableError.js";
import FurnitureAssets from "../Assets/FurnitureAssets.js";
import { FurnitureData } from "../Interfaces/Furniture/FurnitureData.js";

export type FurnitureRendererSprite = {
    image: OffscreenCanvas;
    x: number;
    y: number;

    zIndex: number;
}

export default class FurnitureRenderer {
    public isReady: boolean = false;

    constructor(private readonly type: string, public readonly size: number, public direction: number) {
    }

    public async render() {
        const data = await FurnitureAssets.getFurnitureData(this.type);

        const sprites: FurnitureRendererSprite[] = [];

        const visualization = data.visualization.visualizations.find((visualization) => visualization.size == this.size && visualization.directions.find((direction) => direction.id === this.direction));

        if(!visualization) {
            throw new Error("Visualization does not exist for size.");
        }

        for(let layer = 0; layer < visualization.layerCount; layer++) {
            const assetName = `${this.type}_${this.size}_${String.fromCharCode(97 + layer)}_${this.direction}_0`; // 0 = frame

            const assetData = data.assets.find((asset) => asset.name === assetName);

            if(!assetData) {
                throw new Error("Failed to find asset data for " + assetName);
            }

            const spriteData = data.sprites.find((sprite) => sprite.name === (assetData?.source ?? assetName));
            
            if(!spriteData) {
                throw new Error("Failed to find sprite data for " + assetName + " (source " + assetData.source + ")");
            }

            const sprite = await FurnitureAssets.getFurnitureSprite(this.type, {
                x: spriteData.x,
                y: spriteData.y,

                width: spriteData.width,
                height: spriteData.height,

                flipHorizontal: assetData.flipHorizontal,
                flipVertical: assetData.flipVertical
            });

            const layerData = visualization.layers.find((layerData) => layerData.id === layer);

            let x = assetData.x;

            if(assetData.flipHorizontal) {
                x = (assetData.x * -1) - spriteData.width;
            }

            sprites.push({
                image: sprite.image,
                
                x,
                y: assetData.y,

                zIndex: layerData?.zIndex ?? 0
            });
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
            context.drawImage(sprite.image, minimumX + sprite.x, minimumY + sprite.y);
        }

        return canvas;
    }
}
