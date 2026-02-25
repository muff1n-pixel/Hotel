import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFurnitureItem from "./RoomFurnitureItem";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";

export default class RoomFurniturePlaceholderSprite extends RoomSprite {
    private readonly offset: MousePosition = {
        left: 0,
        top: 0
    };

    constructor(public readonly item: RoomFurnitureItem) {
        super(item);

        this.offset.left += 32;
        this.offset.top -= 32;

        this.offset.left *= this.item.roomRenderer.getSizeScale();
        this.offset.top *= this.item.roomRenderer.getSizeScale();
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        const placeholder = (this.item.roomRenderer.size === 64)?(FurnitureAssets.placeholder):(FurnitureAssets.placeholder32);

        if(!placeholder) {
            console.warn("Furniture placeholder is not loaded.");

            return;
        }

        if(placeholder.image) {
            context.drawImage(placeholder.image, this.offset.left, this.offset.top);
        }
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

        return {
            row: this.item.position.row,
            column: this.item.position.column,
            depth: this.item.position.depth
        };
    }
}
