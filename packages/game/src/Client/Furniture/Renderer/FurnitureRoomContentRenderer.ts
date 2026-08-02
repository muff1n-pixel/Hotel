import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { FurnitureRenderToCanvasOptions } from "@Client/Furniture/Furniture";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";

export default class FurnitureRoomContentRenderer extends FurnitureDefaultRenderer {
    public placement?: "wall" | "floor" | undefined;

    public frame: number = 0;
    
    private static cache: Map<string, OffscreenCanvas> = new Map();

    public async renderToCanvas(canvasOptions: FurnitureRenderToCanvasOptions | undefined, _data: FurnitureData, options: FurnitureRenderOptions): Promise<OffscreenCanvas> {
        if(FurnitureAssets.assetSprites.has(`${this.type}_${options.color}`)) {
            const offscreenCanvas = FurnitureRoomContentRenderer.cache.get(`${this.type}_${options.color}`);

            if(offscreenCanvas) {
                return offscreenCanvas;
            }
        }

        return new Promise((resolve) => {
            const image = new Image();

            image.onload = async () => {
                const canvas = new OffscreenCanvas(image.width, image.height);

                const context = canvas.getContext("2d");

                if(!context) {
                    throw new ContextNotAvailableError();
                }

                context.drawImage(image, 0, 0);

                FurnitureRoomContentRenderer.cache.set(`${this.type}_${options.color}`, canvas);

                resolve(canvas);
            }

            switch(this.type) {
                case "wallpaper":
                    image.src = `/assets/shop/walls/th_wall_${options.color}.png`; 
                    break;
                    
                case "floor":
                    image.src = `/assets/shop/floors/th_floor_${options.color}.png`; 
                    break;
                    
                case "landscape":
                    image.src = `/assets/shop/landscapes/th_landscape_${options.color.replace('.', '_')}_001.png`; 
                    break;
            }
        });
    }
}