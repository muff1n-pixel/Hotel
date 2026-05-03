import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import { FigureConfigurationData } from "@pixel63/events";
import FigureConfigurationHelper from "@pixel63/shared/Figure/FigureConfigurationHelper";
import { Figure } from "@Game/library";
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

    public async render(data: FurnitureData, options: FurnitureRenderOptions): Promise<FurnitureRendererSprite[]> {
        const result = await super.render(data, options);

        const thumbnailImageSprite = result.find((sprite) => sprite.tag === "THUMBNAIL");

        if(thumbnailImageSprite && options.externalImage) {
            const externalImage = await AssetFetcher.fetchImage(options.externalImage);

            const canvas = new OffscreenCanvas(thumbnailImageSprite.image.width, thumbnailImageSprite.image.height);
            const context = canvas.getContext("2d");

            if(!context) {
                return result;
            }

            context.drawImage(thumbnailImageSprite.image, 0, 0);

            if(options.direction === 2) {
                context.setTransform(1, -.5, 0, 1, 0, 0);
            
                context.drawImage(externalImage, 0, 0, externalImage.width, externalImage.height, 1, Math.ceil(canvas.height * 0.3) + 1, Math.floor(canvas.height * 0.65) - 2, Math.floor(canvas.height * 0.7) - 1);
            }
            else {
                context.setTransform(1, .5, 0, 1, 0, 0);
            
                context.drawImage(externalImage, 0, 0, externalImage.width, externalImage.height, 1, 0, Math.floor(canvas.height * 0.65) - 2, Math.floor(canvas.height * 0.7) - 1);
            }


            thumbnailImageSprite.image = canvas.transferToImageBitmap();
            thumbnailImageSprite.ignoreMouse = true;
        }

        return result;
    }
}