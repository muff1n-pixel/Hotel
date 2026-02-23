import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomItem from "../RoomItem";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import Figure from "@Client/Figure/Figure";
import RoomFigureSprite from "./RoomFigureSprite";
import RoomFigureEffectSprite from "@Client/Room/Items/Figure/RoomFigureEffectSprite";
import RoomRenderer from "@Client/Room/Renderer";
import RoomFigureTypingSprite from "@Client/Room/Items/Figure/RoomFigureTypingSprite";

export default class RoomFigureItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    public readonly id = Math.random();
    private currentFrame: number = 0;

    public typing: boolean = false;

    constructor(public roomRenderer: RoomRenderer, public readonly figureRenderer: Figure, position: RoomPosition | null) {
        super(roomRenderer, "figure");

        if(position) {
            this.setPosition(position);
        }

        this.render();
    }
    
    process(frame: number): void {
        this.render(frame);
    }

    render(frame: number = 0) {
        this.currentFrame = frame;

        this.figureRenderer.renderToCanvas(Figure.figureWorker, frame).then((result) => {
            if(frame !== this.currentFrame) {
                return;
            }
            
            this.sprites = [
                new RoomFigureSprite(this, result.figure),
                ...result.effects.map((effect) => new RoomFigureEffectSprite(this, effect))
            ];

            if(this.typing) {
                this.sprites.push(new RoomFigureTypingSprite(this, result.figure));
            }
        });
    }

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
