import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../../RoomSprite";
import RoomFigureItem from "../RoomFigureItem";
import AssetFetcher from "@Client/Assets/AssetFetcher";

export default class RoomFigureHealthSprite extends RoomSprite {
    private offset: MousePosition = {
        left: 0,
        top: 0
    };

    private image?: ImageBitmap;

    constructor(public readonly item: RoomFigureItem, public figureOffsets: MousePosition, public health: number) {
        super(item);

        AssetFetcher.fetchImage(`/assets/figure/sprites/health/number_${this.health}.png`).then((image) => {
            this.offset = {
                left: 64 - (Math.floor(image.width / 2)),
                top: -64 - image.height
            };

            this.image = image;
        });
    }

    render(context: OffscreenCanvasRenderingContext2D, left: number, top: number) {
        if(!this.image) {
            return;
        }

        context.drawImage(this.image, left + this.figureOffsets.left + this.offset.left, top + this.figureOffsets.top + this.offset.top);
    }

    mouseover() {
        return null;
    }
}
