import { FurnitureRendererSprite, FurnitureRenderToCanvasOptions } from "@Client/Furniture/Furniture";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";

export default interface FurnitureRenderer {
    render(data: FurnitureData, direction: number | undefined, size: number, animation: number, color: number, frame: number, grayscaled: boolean): Promise<FurnitureRendererSprite[]>;
    renderToCanvas(options: FurnitureRenderToCanvasOptions | undefined, data: FurnitureData, direction: number | undefined, size: number, animation: number, color: number, frame: number): Promise<ImageBitmap>;
}