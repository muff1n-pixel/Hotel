import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFurnitureItem from "./RoomFurnitureItem";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import { RoomPositionWithDirectionData } from "@pixel63/events";
import { RoomLogger } from "@pixel63/shared/Logger/Logger";

export default class RoomFurniturePlaceholderSprite extends RoomSprite {
    constructor(public readonly item: RoomFurnitureItem) {
        super(
            item,
            {
                left: 32,
                top: -32
            },
            undefined,
            undefined,
            undefined,
            FurnitureAssets.placeholder.image
        );
    }

    mouseover(position: MousePosition) {
        const placeholder = (this.item.roomRenderer.size === 64)?(FurnitureAssets.placeholder):(FurnitureAssets.placeholder32);

        if(!placeholder?.imageData) {
            return null;
        }

        if(!this.item.position) {
            return null;
        }

        const relativePosition: MousePosition = {
            left: position.left - (this.offset.left),
            top: position.top - (this.offset.top)
        };

        if(relativePosition.left < 0 || relativePosition.top < 0) {
            return null;
        }

        if(relativePosition.left > placeholder.image.width || relativePosition.top > placeholder.image.height) {
            return null;
        }

        const pixel = ((relativePosition.left + relativePosition.top * placeholder.imageData.width) * 4) + 3;

        if(placeholder.imageData.data[pixel] < 50) {
            return null;
        }

        return RoomPositionWithDirectionData.create({
            row: this.item.position.row,
            column: this.item.position.column,
            depth: this.item.position.depth
        });
    }
}
