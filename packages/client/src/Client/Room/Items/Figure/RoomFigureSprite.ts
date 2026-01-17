import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFigureItem from "./RoomFigureItem";
import { FigureRendererSprite } from "@Client/Figure/Worker/FigureWorkerRenderer";

export default class RoomFigureSprite extends RoomSprite {
    constructor(public readonly item: RoomFigureItem, private readonly sprite: FigureRendererSprite) {
        super(item);

        this.priority = this.sprite.index;
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        context.drawImage(this.sprite.image, this.sprite.x + 64, this.sprite.y - 16);
    }

    mouseover(position: MousePosition) {
        const relativePosition: MousePosition = {
            left: position.left - (this.sprite.x + 64),
            top: position.top - (this.sprite.y - 16)
        };

        if(relativePosition.left < 0 || relativePosition.top < 0) {
            return null;
        }

        if(relativePosition.left > this.sprite.image.width || relativePosition.top > this.sprite.image.height) {
            return null;
        }

        const pixel = ((relativePosition.left + relativePosition.top * this.sprite.imageData.width) * 4) + 3;

        if(this.sprite.imageData.data[pixel] < 50) {
            return null;
        }

        return {
            row: this.item.position!.row,
            column: this.item.position!.column,
            depth: this.item.position!.depth
        };
    }
}
