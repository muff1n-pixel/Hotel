import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import Furniture, { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";

export default class FurnitureRoomContentRenderer extends FurnitureDefaultRenderer {
    public placement?: "wall" | "floor" | undefined;

    public frame: number = 0;

    public async renderToCanvas(data: FurnitureData, direction: number | undefined, size: number, animation: number, color: number, frame: number): Promise<ImageBitmap> {
        if(FurnitureAssets.assetSprites.has(`${this.type}_${color}`)) {
            const assetSprite = FurnitureAssets.assetSprites.get(`${this.type}_${color}`);

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

                FurnitureAssets.assetSprites.set(`${this.type}_${color}`, sprite);

                resolve(sprite.image);
            }

            switch(this.type) {
                case "wallpaper":
                    image.src = `/assets/shop/walls/th_wall_${color}.png`; 
                    break;
                    
                case "floor":
                    image.src = `/assets/shop/floors/th_floor_${color}.png`; 
                    break;
            }
        });
    }
}