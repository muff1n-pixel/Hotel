import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFigureItem from "./RoomFigureItem";
import AssetFetcher from "@Client/Assets/AssetFetcher";

export default class RoomFigureTypingSprite extends RoomSprite {
    private offset: MousePosition;
    private image?: ImageBitmap;

    constructor(public readonly item: RoomFigureItem, public figureOffsets: MousePosition) {
        super(item);

        this.offset = {
            left: 128 + 64 + 16,
            top: 64
        };

        AssetFetcher.fetchImage("/assets/figure/sprites/typing.png").then((image) => this.image = image);
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        if(!this.image) {
            return;
        }

        const scale = this.item.roomRenderer.getSizeScale();

        context.scale(scale, scale);
        
        context.drawImage(this.image, this.figureOffsets.left + this.offset.left, this.figureOffsets.top + this.offset.top);
    }

    mouseover() {
        return null;
    }
}
