import { MousePosition } from "@/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite.js";
import RoomFigureItem from "./RoomFigureItem.js";
import { FigureRendererSprite } from "@/Figure/FigureRenderer.js";

export default class RoomFigureSprite2 extends RoomSprite {
    constructor(public readonly item: RoomFigureItem, private readonly image: OffscreenCanvas) {
        super(item);
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        context.drawImage(this.image, -128 + 32, -128 + 16);
    }

    mouseover(position: MousePosition) {
        return null;
    }
}
