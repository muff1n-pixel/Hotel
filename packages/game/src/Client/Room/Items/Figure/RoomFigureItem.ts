import RoomItem from "../RoomItem";
import Figure from "@Client/Figure/Figure";
import RoomFigureSprite from "./RoomFigureSprite";
import RoomFigureEffectSprite from "@Client/Room/Items/Figure/Sprites/RoomFigureEffectSprite";
import RoomRenderer from "@Client/Room/RoomRenderer";
import RoomFigureTypingSprite from "@Client/Room/Items/Figure/Sprites/RoomFigureTypingSprite";
import RoomFigureIdlingSprite from "@Client/Room/Items/Figure/Sprites/RoomFigureIdlingSprite";
import { RoomPositionData } from "@pixel63/events";
import RoomFigureHealthSprite from "@Client/Room/Items/Figure/Sprites/RoomFigureHealthSprite";
import { FigureRendererSpriteResult } from "@Client/Figure/Renderer/FigureRenderer";
import RoomSprite from "@Client/Room/Items/RoomSprite";

export default class RoomFigureItem extends RoomItem {
    private typingSprite: RoomFigureTypingSprite | null = null;
    private idlingSprite: RoomFigureIdlingSprite | null = null;
    private healthSprite: RoomFigureHealthSprite | null = null;

    public readonly id = Math.random();
    public frame: number = 0;

    public typing: boolean = false;
    public idling: boolean = false;
    public health: number | null = null;

    private figureSprite?: FigureRendererSpriteResult;

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

        if(this.figureRenderer.shouldRender(this.frame)) {
            this.figureRenderer.renderToCanvas(this.frame, false, false, true).then((result) => {
                this.figureSprite = result.figure;

                this.setSprites([
                    new RoomFigureSprite(this, result.figure),
                    ...result.effects.map((effect) => new RoomFigureEffectSprite(this, effect))
                ]);

                this.updateFigureSprites();
            });
        }
        else {
            this.updateFigureSprites();
        }
    }

    public setSprites(sprites: RoomSprite[]): void {
        super.setSprites(sprites);

        this.healthSprite = null;
        this.typingSprite = null;
        this.idlingSprite = null;
    }

    private updateFigureSprites() {
        if(!this.figureSprite) {
            return;
        }

        if(this.health !== null) {
            if(!this.healthSprite || this.healthSprite.health !== this.health) {
                this.healthSprite = new RoomFigureHealthSprite(this, {
                    left: this.figureSprite.x,
                    top: this.figureSprite.y,
                }, this.health);
            }
            else {
                this.healthSprite.figureOffsets = {
                    left: this.figureSprite.x,
                    top: this.figureSprite.y,
                };
            }

            this.sprites.push(this.healthSprite);
        }

        if(this.typing) {
            if(!this.typingSprite) {
                this.typingSprite = new RoomFigureTypingSprite(this, {
                    left: this.figureSprite.x,
                    top: this.figureSprite.y,
                });
            }
            else {
                this.typingSprite.figureOffsets = {
                    left: this.figureSprite.x,
                    top: this.figureSprite.y,
                };
            }

            this.sprites.push(this.typingSprite);
        }
        else if(this.idling) {
            if(!this.idlingSprite) {
                this.idlingSprite = new RoomFigureIdlingSprite(this, {
                    left: this.figureSprite.x,
                    top: this.figureSprite.y,
                });
            }
            else {
                this.idlingSprite.figureOffsets = {
                    left: this.figureSprite.x,
                    top: this.figureSprite.y,
                };

                this.idlingSprite.process();
            }

            this.sprites.push(this.idlingSprite);
        }
    }

    public setPositionPath(fromPosition: RoomPositionData, toPosition: RoomPositionData | RoomPositionData[], delay: number = 0, useAction: boolean = true): void {
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
