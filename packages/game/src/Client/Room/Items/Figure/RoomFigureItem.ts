import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomItem from "../RoomItem";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import Figure from "@Client/Figure/Figure";
import RoomFigureSprite from "./RoomFigureSprite";
import { clientInstance } from "../../../..";
import RoomFigureEffectSprite from "@Client/Room/Items/Figure/RoomFigureEffectSprite";
import RoomRenderer from "@Client/Room/Renderer";

export default class RoomFigureItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    public readonly id = Math.random();

    constructor(public roomRenderer: RoomRenderer, public readonly figureRenderer: Figure, position: RoomPosition) {
        super(roomRenderer, "figure");

        this.setPosition(position);

        this.render();
    }
    
    process(frame: number): void {
        this.render(frame);
    }

    render(frame: number = 0) {
            /*this.figureRenderer.render(frame).then((sprites) => {
                this.sprites = sprites.map((sprite) => new RoomFigureSprite(this, sprite));
                //this.sprites = [new RoomFigureSprite(this, sprites[0])];
            });*/
            
            this.figureRenderer.renderToCanvas(Figure.figureWorker, frame).then((result) => {
                //this.sprites = sprites.map((sprite) => new RoomFigureSprite(this, sprite));
                this.sprites = [
                    new RoomFigureSprite(this, result.figure),
                    ...result.effects.map((effect) => new RoomFigureEffectSprite(this, effect))
                ];
            });
    }

    /*public setPosition(position: RoomPosition, index?: number): void {
        if(Number.isInteger(position.row) && Number.isInteger(position.column)) {
            if(clientInstance.roomInstance.value?.roomRenderer.items.includes(this)) {
                const furniture = clientInstance.roomInstance.value.getFurnitureAtUpmostPosition(position);

                if(furniture?.data.furniture.flags.sitable) {
                    this.figureRenderer.addAction("Sit");
                    this.figureRenderer.direction = furniture.data.direction;

                    position.depth = furniture.data.position.depth + furniture.data.furniture.dimensions.depth - 0.5;
                }
            }
        }

        super.setPosition(position, index);
    }*/

    public setPositionPath(fromPosition: RoomPosition, toPosition: RoomPosition, delay: number = 0, useAction: boolean = true): void {
        super.setPositionPath(fromPosition, toPosition, 500 - delay);

        const relativePosition: RoomPosition = {
            row: toPosition.row - fromPosition.row,
            column: toPosition.column - fromPosition.column,
            depth: toPosition.depth - fromPosition.depth
        };

        if(useAction) {
            this.figureRenderer.direction = this.getDirectionFromRelativePosition(relativePosition);
            this.figureRenderer.addAction("Move");
            this.figureRenderer.removeAction("Sit");
        }
    }

    public finishPositionPath(): void {
        super.finishPositionPath();

        this.figureRenderer.removeAction("Move");
    }

    private getDirectionFromRelativePosition(relativePosition: RoomPosition): number {
        if(relativePosition.row > 0) {
            relativePosition.row = 1;
        }

        if(relativePosition.row < 0) {
            relativePosition.row = -1;
        }

        if(relativePosition.column > 0) {
            relativePosition.column = 1;
        }

        if(relativePosition.column < 0) {
            relativePosition.column = -1;
        }

        switch(`${relativePosition.row}x${relativePosition.column}`) {
            case "-1x0":
                return 0;

            case "-1x1":
                return 1;

            case "0x1":
                return 2;

            case "1x1":
                return 3;

            case "1x0":
                return 4;

            case "1x-1":
                return 5;

            case "0x-1":
                return 6;

            case "-1x-1":
                return 7;
        }

        return 0;
    }
}
