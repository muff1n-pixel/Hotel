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
        if(!FurnitureAssets.placeholder) {
            console.warn("Furniture placeholder is not loaded.");

            return;
        }
        
        const scale = this.item.roomRenderer.getSizeScale();

        context.scale(scale, scale);
        context.drawImage(FurnitureAssets.placeholder.image, this.offset.left, this.offset.top);
    }

    mouseover(position: MousePosition) {
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

        if(relativePosition.left > FurnitureAssets.placeholder.image.width || relativePosition.top > FurnitureAssets.placeholder.image.height) {
            return null;
        }

        const pixel = ((relativePosition.left + relativePosition.top * FurnitureAssets.placeholder.imageData.width) * 4) + 3;

        if(FurnitureAssets.placeholder.imageData.data[pixel] < 50) {
            return null;
        }

        return {
            row: this.item.position.row,
            column: this.item.position.column,
            depth: this.item.position.depth
        };
    }
}
