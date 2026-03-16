import { FurnitureRendererSprite, FurnitureRenderToCanvasOptions } from "@Client/Furniture/Furniture";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";

export type FurnitureRenderOptions = {
    direction: number | undefined;
    size: number;
    animation: number;
    color: number;
    frame: number;
    grayscaled: boolean;
    tags: string[] | undefined;
}

export default interface FurnitureRenderer {
    render(data: FurnitureData, options: FurnitureRenderOptions): Promise<FurnitureRendererSprite[]>;
    renderToCanvas(canvasSptions: FurnitureRenderToCanvasOptions | undefined, data: FurnitureData, options: FurnitureRenderOptions): Promise<ImageBitmap>;

    shouldRender(options: FurnitureRenderOptions): boolean;
}