import Furniture, { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { MousePosition } from "@Client/Interfaces/MousePosition";

export default class RoomFurnitureOffsets {
    public static getDefaultOffsetPosition(furniture: Furniture, sprite: FurnitureRendererSprite, scale: number) {
        const offset: MousePosition = {
            left: 0,
            top: 0
        };

        if(furniture.placement === "floor") {
            offset.left += 64;
            offset.top += 16;
        }
        else {
            if(furniture.direction === 2) {
                offset.left += 96;
            }
            else {
                offset.left += 32;
            }

            offset.top -= 16;
        }

        if(furniture.type !== "tile_cursor") {
            offset.left *= scale;
            offset.top *= scale;
        }

        offset.left += sprite.x;
        offset.top += sprite.y;

        return offset;
    }
}