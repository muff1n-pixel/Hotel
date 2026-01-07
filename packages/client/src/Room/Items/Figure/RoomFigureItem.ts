import RoomItemSpriteInterface from "@/Room/Interfaces/RoomItemSpriteInterface";
import RoomItem from "../RoomItem.js";
import { RoomPosition } from "@/Interfaces/RoomPosition.js";
import FigureRenderer from "@/Figure/FigureRenderer.js";
import RoomFigureSprite from "./RoomFigureSprite.js";

export default class RoomFigureItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    constructor(public readonly figureRenderer: FigureRenderer, position: RoomPosition) {
        super("figure");

        this.setPosition(position);

        this.render();
    }
    
    process(frame: number): void {
        super.process(frame);
        
        this.render(frame);
    }

    render(frame: number = 0) {
            /*this.figureRenderer.render(frame).then((sprites) => {
                this.sprites = sprites.map((sprite) => new RoomFigureSprite(this, sprite));
                //this.sprites = [new RoomFigureSprite(this, sprites[0])];
            });*/
            
            this.figureRenderer.renderToCanvas(frame).then((sprite) => {
                //this.sprites = sprites.map((sprite) => new RoomFigureSprite(this, sprite));
                this.sprites = [new RoomFigureSprite(this, sprite)];
            });
    }

    public setPositionPath(fromPosition: RoomPosition, toPosition: RoomPosition): void {
        super.setPositionPath(fromPosition, toPosition);

        const relativePosition: RoomPosition = {
            row: toPosition.row - fromPosition.row,
            column: toPosition.column - fromPosition.column,
            depth: toPosition.depth - fromPosition.depth
        };

        this.figureRenderer.direction = this.getDirectionFromRelativePosition(relativePosition);
        this.figureRenderer.addAction("Move");
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
