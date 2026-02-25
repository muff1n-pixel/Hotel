import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomItem from "../RoomItem";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import Figure from "@Client/Figure/Figure";
import RoomFigureSprite from "./RoomFigureSprite";
import RoomFigureEffectSprite from "@Client/Room/Items/Figure/RoomFigureEffectSprite";
import RoomRenderer from "@Client/Room/Renderer";
import RoomFigureTypingSprite from "@Client/Room/Items/Figure/RoomFigureTypingSprite";
import RoomFigureIdlingSprite from "@Client/Room/Items/Figure/RoomFigureIdlingSprite";

export default class RoomFigureItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    private typingSprite: RoomFigureTypingSprite | null = null;
    private idlingSprite: RoomFigureIdlingSprite | null = null;

    public readonly id = Math.random();
    private frame: number = 0;
    private renderedFrame: number = 0;

    public typing: boolean = false;
    public idling: boolean = false;

    private preloaded = false;
    private preloading = false;

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

    render(_frame: number = 0) {
        /*if(!this.preloaded) {
            if(!this.preloading) {
                this.preloading = true;

                this.figureRenderer.preload(Figure.figureWorker).then(() => {
                    this.preloaded = true;
                });
            }
        }*/
        
        this.frame++;

        const frame = this.frame;

        this.figureRenderer.renderToCanvas(Figure.figureWorker, this.frame).then((result) => {
            if(frame !== this.frame) {
                return;
            }

            this.renderedFrame = frame;

            this.sprites = [
                new RoomFigureSprite(this, result.figure),
                ...result.effects.map((effect) => new RoomFigureEffectSprite(this, effect))
            ];

            if(this.typing) {
                if(!this.typingSprite) {
                    this.typingSprite = new RoomFigureTypingSprite(this, result.figure);
                }

                this.sprites.push(this.typingSprite);
            }

            if(this.idling) {
                if(!this.idlingSprite) {
                    this.idlingSprite = new RoomFigureIdlingSprite(this, result.figure);
                }
                else {
                    this.idlingSprite.process();
                }

                this.sprites.push(this.idlingSprite);
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
