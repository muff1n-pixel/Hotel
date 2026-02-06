import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFigureItem from "./RoomFigureItem";
import { FigureRendererSprite } from "@Client/Figure/Renderer/FigureRenderer";

export default class RoomFigureEffectSprite extends RoomSprite {
    private offset: MousePosition;

    constructor(public readonly item: RoomFigureItem, private readonly sprite: FigureRendererSprite) {
        super(item);

        this.priority = this.sprite.index;

        this.offset = {
            left: this.sprite.x + 64,
            top: this.sprite.y - 16
        };

        if(this.item.figureRenderer.actions.includes("Sit")) {
            this.offset.top += 16;   
        }
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        const scale = this.item.roomRenderer.getSizeScale();

        context.scale(scale, scale);
        
        if(this.sprite.ink) {
            context.globalCompositeOperation = this.sprite.ink;
        }
        
        context.drawImage(this.sprite.image, this.offset.left, this.offset.top);
    }

    mouseover() {
        return null;
    }
}
