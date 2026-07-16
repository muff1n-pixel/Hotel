import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../../RoomSprite";
import RoomFurnitureItem from "./../RoomFurnitureItem";

export default class RoomFurnitureBackgroundSprite extends RoomSprite {
    constructor(public readonly item: RoomFurnitureItem, public readonly image: ImageBitmap, public readonly position?: { x: number; y: number; z: number; }) {
        const offset: MousePosition = { left: 0, top: 0 };

        if(item.furnitureRenderer.placement === "floor") {
            offset.left += 64;
            offset.top += 16;
        }
        else {
            if(item.furnitureRenderer.direction === 2) {
                offset.left += 96;
            }
            else {
                offset.left += 32;
            }

            offset.top -= 16;
        }

        if(position) {
            offset.left += position.x;
            offset.top += position.y;
        }

        super(
            item,
            offset,
            position?.z ?? 0,
            undefined,
            undefined,
            image
        );
    }

    mouseover() {
        return null;
    }
}
