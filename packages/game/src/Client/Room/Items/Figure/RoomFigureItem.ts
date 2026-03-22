import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomItem from "../RoomItem";
import Figure from "@Client/Figure/Figure";
import RoomFigureSprite from "./RoomFigureSprite";
import RoomFigureEffectSprite from "@Client/Room/Items/Figure/Sprites/RoomFigureEffectSprite";
import RoomRenderer from "@Client/Room/RoomRenderer";
import RoomFigureTypingSprite from "@Client/Room/Items/Figure/Sprites/RoomFigureTypingSprite";
import RoomFigureIdlingSprite from "@Client/Room/Items/Figure/Sprites/RoomFigureIdlingSprite";
import { defaultFigureWorkerClient } from "@Client/Figure/Worker/FigureWorkerClient";
import { RoomPositionData } from "@pixel63/events";
import RoomFigureHealthSprite from "@Client/Room/Items/Figure/Sprites/RoomFigureHealthSprite";

export default class RoomFigureItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    private typingSprite: RoomFigureTypingSprite | null = null;
    private idlingSprite: RoomFigureIdlingSprite | null = null;
    private healthSprite: RoomFigureHealthSprite | null = null;

    public readonly id = Math.random();
    private frame: number = 0;

    public typing: boolean = false;
    public idling: boolean = false;
    public health: number | null = null;

    constructor(public roomRenderer: RoomRenderer, public readonly figureRenderer: Figure, position: RoomPositionData | undefined) {
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
        this.frame++;

        const frame = this.frame;

        this.figureRenderer.renderToCanvas(defaultFigureWorkerClient, this.frame).then((result) => {
            if(frame !== this.frame) {
                return;
            }

            this.sprites = [
                new RoomFigureSprite(this, result.figure),
                ...result.effects.map((effect) => new RoomFigureEffectSprite(this, effect))
            ];

            if(this.health !== null) {
                if(!this.healthSprite || this.healthSprite.health !== this.health) {
                    this.healthSprite = new RoomFigureHealthSprite(this, {
                        left: result.figure.x,
                        top: result.figure.y,
                    }, this.health);
                }
                else {
                    this.healthSprite.figureOffsets = {
                        left: result.figure.x,
                        top: result.figure.y,
                    };
                }

                this.sprites.push(this.healthSprite);
            }

            if(this.typing) {
                if(!this.typingSprite) {
                    this.typingSprite = new RoomFigureTypingSprite(this, {
                        left: result.figure.x,
                        top: result.figure.y,
                    });
                }
                else {
                    this.typingSprite.figureOffsets = {
                        left: result.figure.x,
                        top: result.figure.y,
                    };
                }

                this.sprites.push(this.typingSprite);
            }
            else if(this.idling) {
                if(!this.idlingSprite) {
                    this.idlingSprite = new RoomFigureIdlingSprite(this, {
                        left: result.figure.x,
                        top: result.figure.y,
                    });
                }
                else {
                    this.idlingSprite.figureOffsets = {
                        left: result.figure.x,
                        top: result.figure.y,
                    };

                    this.idlingSprite.process();
                }

                this.sprites.push(this.idlingSprite);
            }
        });
    }

    public setPositionPath(fromPosition: RoomPositionData, toPosition: RoomPositionData, delay: number = 0, useAction: boolean = true): void {
        super.setPositionPath(fromPosition, toPosition, 500 - delay);

        if(useAction) {
            this.figureRenderer.addAction("Move");
            this.figureRenderer.removeAction("Sit");
        }
    }

    public finishPositionPath(): void {
        super.finishPositionPath();

        this.figureRenderer.removeAction("Move");
    }
}
