import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFigureItem from "./RoomFigureItem";
import { FigureRendererSpriteResult } from "@Client/Figure/Renderer/FigureRenderer";

export default class RoomFigureSprite extends RoomSprite {
    public offset: MousePosition;

    constructor(public readonly item: RoomFigureItem, public readonly sprite: FigureRendererSpriteResult) {
        super(item);

        this.priority = this.sprite.index;

        this.offset = {
            left: this.sprite.x + 64,
            top: this.sprite.y - 16
        };
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        const scale = this.item.roomRenderer.getSizeScale();

        context.scale(scale, scale);

        context.drawImage(this.sprite.image, this.offset.left, this.offset.top);
    }

    mouseover(position: MousePosition) {
        if(!this.sprite.imageData) {
            return null;
        }
        
        const scale = this.item.roomRenderer.getSizeScale();

        const relativePosition: MousePosition = {
            left: ((position.left * (1 / scale)) - (this.offset.left)),
            top: ((position.top * (1 / scale)) - (this.offset.top))
        };

        if(relativePosition.left < 0 || relativePosition.top < 0) {
            return null;
        }

        if(relativePosition.left > this.sprite.image.width || relativePosition.top > this.sprite.image.height) {
            return null;
        }

        const pixel = ((relativePosition.left + relativePosition.top * this.sprite.image.width) * 4) + 3;

        if(this.sprite.imageData[pixel] < 50) {
            return null;
        }

        return {
            row: this.item.position!.row,
            column: this.item.position!.column,
            depth: this.item.position!.depth
        };
    }
}
