import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomItem from "../RoomItem";
import Figure from "@Client/Figure/Figure";
import RoomFigureSprite from "./RoomFigureSprite";
import RoomFigureEffectSprite from "@Client/Room/Items/Figure/RoomFigureEffectSprite";
import RoomRenderer from "@Client/Room/RoomRenderer";
import RoomFigureTypingSprite from "@Client/Room/Items/Figure/RoomFigureTypingSprite";
import RoomFigureIdlingSprite from "@Client/Room/Items/Figure/RoomFigureIdlingSprite";
import { defaultFigureWorkerClient } from "@Client/Figure/Worker/FigureWorkerClient";
import { RoomPositionData } from "@pixel63/events";

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

        this.figureRenderer.renderToCanvas(defaultFigureWorkerClient, this.frame).then((result) => {
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
