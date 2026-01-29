import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";

export default interface FurnitureRenderer {
    render(data: FurnitureData, direction: number | undefined, size: number, animation: number, color: number, frame: number): Promise<FurnitureRendererSprite[]>;
    renderToCanvas(data: FurnitureData, direction: number | undefined, size: number, animation: number, color: number, frame: number): Promise<ImageBitmap>;
}