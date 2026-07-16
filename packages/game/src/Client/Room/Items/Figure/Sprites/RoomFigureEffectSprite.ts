import RoomSprite from "../../RoomSprite";
import RoomFigureItem from "../RoomFigureItem";
import { FigureRendererSprite } from "@Client/Figure/Renderer/FigureRenderer";

export default class RoomFigureEffectSprite extends RoomSprite {
    constructor(public readonly item: RoomFigureItem, private readonly furnitureSprite: FigureRendererSprite) {
        super(
            item,
            {
                left: furnitureSprite.x + 64,
                top: furnitureSprite.y - 16 + ((item.figureRenderer.actions.includes("Sit"))?(16):(0))
            },
            furnitureSprite.index,
            undefined,
            furnitureSprite.ink,
            furnitureSprite.image,
            furnitureSprite.imageData ?? undefined
        );

        console.log(furnitureSprite, furnitureSprite.ink);
    }

    render(context: OffscreenCanvasRenderingContext2D, left: number, top: number) {
        context.drawImage(this.furnitureSprite.image, left + this.offset.left, top + this.offset.top);
    }

    mouseover() {
        return null;
    }
}
