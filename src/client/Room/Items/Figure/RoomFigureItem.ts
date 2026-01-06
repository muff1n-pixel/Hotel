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
}
