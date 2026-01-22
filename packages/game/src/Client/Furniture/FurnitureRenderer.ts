import ContextNotAvailableError from "../Exceptions/ContextNotAvailableError";
import FurnitureAssets from "../Assets/FurnitureAssets";
import { FurnitureData } from "../Interfaces/Furniture/FurnitureData";
import { FurnitureVisualization } from "@Client/Interfaces/Furniture/FurnitureVisualization";

export type FurnitureRendererSprite = {
    image: ImageBitmap;
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

    public placement?: "wall" | "floor";

    private frame: number = 0;

    constructor(public readonly type: string, public readonly size: number, public direction: number | undefined = undefined, public animation: number = 0, public color: number = 0) {
        /*if(this.type.includes('*')) {
            const [type, color] = this.type.split('*');

            this.type = type;
            this.color = parseInt(color);
        }*/
    }

    public async getData() {
        if(!this.data) {
            this.data = await FurnitureAssets.getFurnitureData(this.type);
        }

        return this.data;
    }

    public async render(frame: number = 0) {
        this.frame++;

        if(!this.data) {
            this.data = await FurnitureAssets.getFurnitureData(this.type);
        }

        this.placement = this.data.visualization.placement;

        const sprites: FurnitureRendererSprite[] = [];

        if(!this.visualization) {
            this.visualization = this.data.visualization.visualizations.find((visualization) => visualization.size == this.size);
        }

        if(this.direction === undefined) {
            const directionPriority = [4, 2];

            this.direction = this.data.visualization.defaultDirection ?? this.visualization?.directions.toSorted((a, b) => directionPriority.indexOf(b.id) - directionPriority.indexOf(a.id))?.[0].id ?? 0;
        }

        if(!this.visualization) {
            throw new Error("Visualization for " + this.type + " does not exist for size: " + this.size + ".");
        }

        const animation = this.visualization.animations?.find((animation) => animation.id === this.animation);

        this.isAnimated = Boolean(animation);

        const directionData = this.visualization.directions.find((direction) => direction.id === this.direction);

        for(let layer = 0; layer < this.visualization.layerCount; layer++) {
            const animationLayer = animation?.layers?.find((animationLayer) => animationLayer.id === layer);

            let spriteFrame = 0;

            if(animationLayer?.frameSequence?.length) {

                let frameSequenceIndex = this.frame % animationLayer.frameSequence.length;

                if(animationLayer.frameRepeat && animationLayer.frameRepeat > 1) {
                    frameSequenceIndex = Math.floor((this.frame % (animationLayer.frameSequence.length * animationLayer.frameRepeat)) / animationLayer.frameRepeat);
                    /*console.log({
                        frame,
                        frameSequenceLength: animationLayer.frameSequence.length,
                        frameRepeat: animationLayer.frameRepeat
                    });*/
                }

                if(!animationLayer?.frameSequence[frameSequenceIndex]) {
                    console.warn("Animation layer does not exist for " + this.type + ", frame index " + frameSequenceIndex);                    
                }
                else {
                    spriteFrame = animationLayer?.frameSequence[frameSequenceIndex].id;
                }
            }

            let assetName = `${this.type}_${this.size}_${String.fromCharCode(97 + layer)}_${this.direction}_${spriteFrame}`;

            if(this.size === 1) {
                assetName = `${this.type}_icon_${String.fromCharCode(97 + layer)}`;
            }

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
            const directionLayerData = directionData?.layers.find((layerData) => layerData.id === layer);

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

                zIndex: directionLayerData?.zIndex ?? layerData?.zIndex ?? 0,
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

        //context.fillStyle = "red";
        //context.fillRect(0, 0, canvas.width, canvas.height);

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

        return createImageBitmap(canvas);
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

            case "scrn":
                return "screen";

            default:
                console.warn(`Furniture ink mode ${ink} is not recognized.`);

                return undefined;
        }
    }

    getDimensions(raw: boolean = false) {
        let result = { row: 0, column: 0, depth: 0 };

        if(!this.data) {
            return result;
        }
        
        result = {
            row: this.data.logic.model.dimensions.x,
            column: this.data.logic.model.dimensions.y,
            depth: this.data.logic.model.dimensions.z
        };

        if(!raw && (this.direction === 0 || this.direction === 4)) {
            result = {
                row: this.data.logic.model.dimensions.y,
                column: this.data.logic.model.dimensions.x,
                depth: this.data.logic.model.dimensions.z
            };
        }

        return result;
    };

    public getNextAnimation() {
        if(!this.visualization) {
            return 0;
        }

        const currentAnimationIndex = this.visualization.animations.findIndex((animation) => animation.id === this.animation);

        if(currentAnimationIndex === -1) {
            return this.visualization.animations[0]?.id ?? 0;
        }

        if(!this.visualization.animations[currentAnimationIndex + 1]) {
            return 0;
        }

        return this.visualization.animations[currentAnimationIndex + 1].id;
    }

    public getNextDirection() {
        if(!this.visualization) {
            return 0;
        }

        if(this.placement === "wall") {
            return this.direction;
        }

        const currentIndex = this.visualization.directions.findIndex((direction) => direction.id === this.direction);

        if(currentIndex === -1) {
            return this.direction;
        }

        if(!this.visualization.directions[currentIndex + 1]) {
            return this.visualization.directions[0].id;
        }

        return this.visualization.directions[currentIndex + 1].id;
    }
}
