import { FurnitureRenderResult } from "@Client/Furniture/Furniture";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import AssetFetcher from "@Client/Assets/AssetFetcher";

export default class FurnitureExternalImageRenderer extends FurnitureDefaultRenderer {
    public placement?: "wall" | "floor" | undefined;

    public frame: number = 0;

    public shouldCacheResults: boolean = false;

    public shouldRender(options: FurnitureRenderOptions): boolean {
        if(options.externalImage !== this.options?.externalImage) {
            return true;
        }

        return super.shouldRender(options);
    }

    public render(data: FurnitureData, options: FurnitureRenderOptions): FurnitureRenderResult {
        const result = super.render(data, options);

        const thumbnailImageSprite = result.sprites.find((sprite) => sprite.tag === "THUMBNAIL");

        if(thumbnailImageSprite && options.externalImage && this.externalImage) {            
            const canvas = new OffscreenCanvas(thumbnailImageSprite.image.width, thumbnailImageSprite.image.height);
            const context = canvas.getContext("2d");

            if(!context) {
                return result;
            }

            context.drawImage(thumbnailImageSprite.image, 0, 0);

            if(options.direction === 2) {
                context.setTransform(1, -.5, 0, 1, 0, 0);
            
                context.drawImage(this.externalImage, 0, 0, this.externalImage.width, this.externalImage.height, 1, Math.ceil(canvas.height * 0.3) + 1, Math.floor(canvas.height * 0.65) - 2, Math.floor(canvas.height * 0.7) - 1);
            }
            else {
                context.setTransform(1, .5, 0, 1, 0, 0);
            
                context.drawImage(this.externalImage, 0, 0, this.externalImage.width, this.externalImage.height, 1, 0, Math.floor(canvas.height * 0.65) - 2, Math.floor(canvas.height * 0.7) - 1);
            }

            thumbnailImageSprite.image = canvas.transferToImageBitmap();

            if(this.hasImageData) {
                this.hasImageData = Boolean(thumbnailImageSprite.imageData);
            }
        }

        return result;
    }

    private externalImage?: HTMLImageElement;

    public shouldLoadAssets(options: FurnitureRenderOptions): boolean {
        console.log("should?");
        
        if(options.externalImage !== this.options?.externalImage) {
            return true;
        }

        if(options.externalImage && !this.externalImage) {
            return true;
        }

        return false;
    }

    public async loadAssets(options: FurnitureRenderOptions) {
        if(options.externalImage) {
            console.log("load external image");
            this.externalImage = await AssetFetcher.fetchImage(options.externalImage);
        }
    }
}