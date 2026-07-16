import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFigureItem from "./RoomFigureItem";
import { FigureRendererSpriteResult } from "@Client/Figure/Renderer/FigureRenderer";
import { RoomPositionWithDirectionData } from "@pixel63/events";

export default class RoomFigureSprite extends RoomSprite {
    constructor(public readonly item: RoomFigureItem, public readonly furnitureSprite: FigureRendererSpriteResult) {
        super(
            item,
            {
                left: furnitureSprite.x - 64,
                top: furnitureSprite.y - 144
            },
            furnitureSprite.index,
            undefined,
            undefined,
            furnitureSprite.image
        );
    }

    render(context: OffscreenCanvasRenderingContext2D, left: number, top: number) {
        context.drawImage(this.furnitureSprite.image, left + this.offset.left, top + this.offset.top);
    }

    mouseover(position: MousePosition) {
        if(!this.furnitureSprite.imageData) {
            return null;
        }
        
        const relativePosition: MousePosition = {
            left: ((position.left) - (this.offset.left)),
            top: ((position.top) - (this.offset.top))
        };

        if(relativePosition.left < 0 || relativePosition.top < 0) {
            return null;
        }

        if(relativePosition.left >= this.furnitureSprite.image.width || relativePosition.top >= this.furnitureSprite.image.height) {
            return null;
        }

        const pixel = ((relativePosition.left + relativePosition.top * this.furnitureSprite.image.width) * 4) + 3;

        if(this.furnitureSprite.imageData[pixel] < 50) {
            return null;
        }

        return RoomPositionWithDirectionData.create({
            row: this.item.position!.row,
            column: this.item.position!.column,
            depth: this.item.position!.depth
        });
    }
}
