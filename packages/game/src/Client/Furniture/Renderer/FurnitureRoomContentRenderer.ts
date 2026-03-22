import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import { FurnitureRendererSprite, FurnitureRenderToCanvasOptions } from "@Client/Furniture/Furniture";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";

export default class FurnitureRoomContentRenderer extends FurnitureDefaultRenderer {
    public placement?: "wall" | "floor" | undefined;

    public frame: number = 0;

    public async renderToCanvas(canvasOptions: FurnitureRenderToCanvasOptions | undefined, _data: FurnitureData, options: FurnitureRenderOptions): Promise<ImageBitmap> {
        if(FurnitureAssets.assetSprites.has(`${this.type}_${options.color}`)) {
            const assetSprite = FurnitureAssets.assetSprites.get(`${this.type}_${options.color}`);

            if(assetSprite) {
                return assetSprite.image;
            }
        }

        return new Promise((resolve) => {
            const image = new Image();

            image.onload = async () => {
                const sprite: FurnitureRendererSprite = {
                    x: 0,
                    y: 0,
                    image: await createImageBitmap(image),
                    imageData: new ImageData(1, 1),
                    zIndex: 0
                };

                FurnitureAssets.assetSprites.set(`${this.type}_${options.color}`, sprite);

                resolve(sprite.image);
            }

            switch(this.type) {
                case "wallpaper":
                    image.src = `/assets/shop/walls/th_wall_${options.color}.png`; 
                    break;
                    
                case "floor":
                    image.src = `/assets/shop/floors/th_floor_${options.color}.png`; 
                    break;
            }
        });
    }
}