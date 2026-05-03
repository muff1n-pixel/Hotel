import { AssetSpriteGrayscaledProperties } from "@Client/Assets/AssetFetcher";
import { FurnitureRendererSprite, FurnitureRenderToCanvasOptions } from "@Client/Furniture/Furniture";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import { FigureConfigurationData, UserFurnitureAnimationTag } from "@pixel63/events";

export type FurnitureRenderOptions = {
    direction: number | undefined;
    size: number;
    animation: number;
    animationTags?: UserFurnitureAnimationTag[] | undefined;
    color: number;
    frame: number;
    grayscaled?: AssetSpriteGrayscaledProperties | undefined;
    tags: string[] | undefined;
    figureConfiguration?: FigureConfigurationData;
    externalImage?: string;
}

export default interface FurnitureRenderer {
    animationTransitioned?: number;
    animationTransitionedTo?: number;

    render(data: FurnitureData, options: FurnitureRenderOptions): Promise<FurnitureRendererSprite[]>;
    renderToCanvas(canvasSptions: FurnitureRenderToCanvasOptions | undefined, data: FurnitureData, options: FurnitureRenderOptions): Promise<ImageBitmap>;

    shouldRender(options: FurnitureRenderOptions): boolean;
}